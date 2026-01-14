/**
 * Booking Availability Logic
 * Real-time availability checking for properties
 * 
 * STEP 2.1 - Booking Checkout Flow
 * STEP 2.3 - Enhanced with iCal sync validation
 */

import { db } from '@/db';
import { bookings, properties, seasonalPricing } from '@/db/schema';
import { eq, and, or, gte, lte, ne } from 'drizzle-orm';
import { syncPropertyICalFeed, hasICalConflict } from './ical-sync';

export interface AvailabilityCheckInput {
  propertyId: number;
  checkInDate: string; // ISO format: YYYY-MM-DD
  checkOutDate: string; // ISO format: YYYY-MM-DD
  excludeBookingId?: number; // For checking when updating existing booking
}

export interface AvailabilityCheckResult {
  available: boolean;
  reason?: string;
  conflictingBookings?: Array<{
    id: number;
    checkInDate: string;
    checkOutDate: string;
    status: string;
  }>;
}

/**
 * Check if a property is available for the given date range
 * 
 * Business Rules:
 * - Check-in and check-out dates cannot overlap with existing bookings
 * - Only confirmed and pending bookings block availability
 * - Cancelled and completed bookings don't block availability
 * - Same-day turnaround not allowed (check-out date = next check-in date is blocked)
 */
export async function checkAvailability(
  input: AvailabilityCheckInput
): Promise<AvailabilityCheckResult> {
  const { propertyId, checkInDate, checkOutDate, excludeBookingId } = input;

  // Validate dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Check if dates are valid
  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return {
      available: false,
      reason: 'Invalid date format. Use YYYY-MM-DD.',
    };
  }

  // Check if check-in is in the past
  if (checkIn < today) {
    return {
      available: false,
      reason: 'Check-in date cannot be in the past.',
    };
  }

  // Check if check-out is after check-in
  if (checkOut <= checkIn) {
    return {
      available: false,
      reason: 'Check-out date must be after check-in date.',
    };
  }

  // Calculate number of nights
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  // Check minimum stay (1 night)
  if (nights < 1) {
    return {
      available: false,
      reason: 'Minimum stay is 1 night.',
    };
  }

  // Check if property exists
  const property = await db
    .select()
    .from(properties)
    .where(eq(properties.id, propertyId))
    .limit(1);

  if (property.length === 0) {
    return {
      available: false,
      reason: 'Property not found.',
    };
  }

  // Check for conflicting bookings
  // A booking conflicts if:
  // 1. It overlaps with the requested dates
  // 2. It has status 'pending' or 'confirmed' (not cancelled/completed)
  // 3. It's not the booking being updated (if excludeBookingId is provided)

  const conditions = [
    eq(bookings.propertyId, propertyId),
    // Status must be pending or confirmed
    or(
      eq(bookings.bookingStatus, 'pending'),
      eq(bookings.bookingStatus, 'confirmed')
    ),
    // Date overlap check:
    // Overlap occurs if: checkIn < existing.checkOut AND checkOut > existing.checkIn
    or(
      // Case 1: New booking starts during existing booking
      and(
        gte(bookings.checkInDate, checkInDate),
        lte(bookings.checkInDate, checkOutDate)
      ),
      // Case 2: New booking ends during existing booking
      and(
        gte(bookings.checkOutDate, checkInDate),
        lte(bookings.checkOutDate, checkOutDate)
      ),
      // Case 3: New booking encompasses existing booking
      and(
        lte(bookings.checkInDate, checkInDate),
        gte(bookings.checkOutDate, checkOutDate)
      ),
      // Case 4: Existing booking encompasses new booking
      and(
        gte(bookings.checkInDate, checkInDate),
        lte(bookings.checkOutDate, checkOutDate)
      )
    ),
  ];

  // Exclude current booking if updating
  if (excludeBookingId) {
    conditions.push(ne(bookings.id, excludeBookingId));
  }

  const conflictingBookings = await db
    .select({
      id: bookings.id,
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      status: bookings.bookingStatus,
    })
    .from(bookings)
    .where(and(...conditions));

  if (conflictingBookings.length > 0) {
    return {
      available: false,
      reason: `Property is not available for the selected dates. ${conflictingBookings.length} conflicting booking(s) found.`,
      conflictingBookings,
    };
  }

  // Check iCal blocked dates (external calendar sync)
  try {
    const icalSync = await syncPropertyICalFeed(propertyId);
    
    if (icalSync.success && icalSync.blockedDates.length > 0) {
      const hasConflict = hasICalConflict(
        checkInDate,
        checkOutDate,
        icalSync.blockedDates
      );
      
      if (hasConflict) {
        return {
          available: false,
          reason: 'Property is blocked on external calendar (Airbnb, VRBO, etc.). Please choose different dates.',
        };
      }
    }
  } catch (icalError) {
    console.error('iCal validation error:', icalError);
    // Continue with booking if iCal fails - don't block bookings due to sync issues
    // Owners should be notified separately about sync failures
  }

  // If we get here, the property is available
  return {
    available: true,
  };
}

/**
 * Get blocked dates for a property (for calendar UI)
 * Returns array of date ranges that are blocked
 * Includes both database bookings and iCal synced dates
 */
export async function getBlockedDates(propertyId: number): Promise<Array<{
  checkInDate: string;
  checkOutDate: string;
  status: string;
  source?: string;
}>> {
  // Get database bookings
  const blockedBookings = await db
    .select({
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
      status: bookings.bookingStatus,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.propertyId, propertyId),
        or(
          eq(bookings.bookingStatus, 'pending'),
          eq(bookings.bookingStatus, 'confirmed')
        )
      )
    );

  const result = blockedBookings.map(b => ({
    checkInDate: b.checkInDate,
    checkOutDate: b.checkOutDate,
    status: b.status,
    source: 'database',
  }));

  // Add iCal blocked dates
  try {
    const icalSync = await syncPropertyICalFeed(propertyId);
    
    if (icalSync.success && icalSync.blockedDates.length > 0) {
      for (const blocked of icalSync.blockedDates) {
        result.push({
          checkInDate: blocked.startDate,
          checkOutDate: blocked.endDate,
          status: 'blocked',
          source: blocked.source,
        });
      }
    }
  } catch (icalError) {
    console.error('iCal sync error in getBlockedDates:', icalError);
    // Continue without iCal data
  }

  return result;
}

/**
 * Get next available date for a property
 * Useful for suggesting alternative dates
 */
export async function getNextAvailableDate(
  propertyId: number,
  fromDate?: string
): Promise<string | null> {
  const startDate = fromDate ? new Date(fromDate) : new Date();
  startDate.setHours(0, 0, 0, 0);

  // Get all blocked dates for next 365 days
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + 365);

  const blockedBookings = await db
    .select({
      checkInDate: bookings.checkInDate,
      checkOutDate: bookings.checkOutDate,
    })
    .from(bookings)
    .where(
      and(
        eq(bookings.propertyId, propertyId),
        or(
          eq(bookings.bookingStatus, 'pending'),
          eq(bookings.bookingStatus, 'confirmed')
        ),
        lte(bookings.checkInDate, endDate.toISOString().split('T')[0])
      )
    );

  // Sort bookings by check-in date
  blockedBookings.sort((a, b) => 
    new Date(a.checkInDate).getTime() - new Date(b.checkInDate).getTime()
  );

  // Find first gap in bookings
  let currentDate = new Date(startDate);
  
  for (const booking of blockedBookings) {
    const bookingCheckIn = new Date(booking.checkInDate);
    
    // If there's a gap between current date and next booking
    if (currentDate < bookingCheckIn) {
      return currentDate.toISOString().split('T')[0];
    }
    
    // Move to day after this booking's check-out
    const bookingCheckOut = new Date(booking.checkOutDate);
    currentDate = new Date(bookingCheckOut);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // If we get here, property is available from current date
  return currentDate.toISOString().split('T')[0];
}
