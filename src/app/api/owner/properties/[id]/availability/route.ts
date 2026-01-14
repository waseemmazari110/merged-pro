/**
 * API Route: Owner Property Availability
 * GET/PUT availability for a specific property
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { properties, bookings, availabilityCalendar } from "@/db/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { 
  getCurrentUserWithRole,
  unauthenticatedResponse,
  unauthorizedResponse
} from "@/lib/auth-roles";

// GET - Fetch availability for a property
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const propertyId = parseInt(id);

    // Verify authentication
    const currentUser = await getCurrentUserWithRole();
    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    // Verify property exists and user owns it
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check ownership (unless admin)
    if (currentUser.role !== 'admin' && property[0].ownerId !== currentUser.id) {
      return unauthorizedResponse('You do not own this property');
    }

    // Get date range (3 months ahead)
    const startDate = new Date();
    const endDate = new Date();
    endDate.setMonth(endDate.getMonth() + 6);

    const startDateStr = startDate.toISOString().split('T')[0];
    const endDateStr = endDate.toISOString().split('T')[0];

    // Fetch availability records
    let availability: any[] = [];
    try {
      const availabilityRecords = await db
        .select()
        .from(availabilityCalendar)
        .where(
          and(
            eq(availabilityCalendar.propertyId, propertyId),
            gte(availabilityCalendar.date, startDateStr),
            lte(availabilityCalendar.date, endDateStr)
          )
        );
      
      availability = availabilityRecords.map(record => ({
        date: record.date,
        available: record.isAvailable,
        status: record.status,
        price: record.price,
        notes: record.notes,
      }));
    } catch (err) {
      // Table might not exist yet
      console.log('Availability table not found, using empty array');
    }

    // Fetch bookings for this property
    let propertyBookings: any[] = [];
    try {
      const bookingRecords = await db
        .select()
        .from(bookings)
        .where(
          and(
            eq(bookings.propertyId, propertyId),
            gte(bookings.checkInDate, startDateStr)
          )
        );
      
      propertyBookings = bookingRecords.map(booking => ({
        id: booking.id,
        checkIn: booking.checkInDate,
        checkOut: booking.checkOutDate,
        guestName: booking.guestName,
        status: booking.bookingStatus,
      }));
    } catch (err) {
      console.log('Error fetching bookings:', err);
    }

    return NextResponse.json({
      propertyId,
      availability,
      bookings: propertyBookings,
      dateRange: {
        start: startDateStr,
        end: endDateStr,
      },
    });

  } catch (error) {
    console.error("Error fetching availability:", error);
    return NextResponse.json(
      { error: "Failed to fetch availability", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// PUT - Update availability for a property
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const propertyId = parseInt(id);

    // Verify authentication
    const currentUser = await getCurrentUserWithRole();
    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    // Verify property exists and user owns it
    const property = await db
      .select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return NextResponse.json({ error: 'Property not found' }, { status: 404 });
    }

    // Check ownership (unless admin)
    if (currentUser.role !== 'admin' && property[0].ownerId !== currentUser.id) {
      return unauthorizedResponse('You do not own this property');
    }

    const body = await request.json();
    const { availability } = body;

    if (!Array.isArray(availability)) {
      return NextResponse.json({ error: 'Invalid availability data' }, { status: 400 });
    }

    // Process each date
    const now = new Date().toISOString();
    let updated = 0;
    let created = 0;

    for (const item of availability) {
      if (!item.date) continue;

      try {
        // Check if record exists
        const existing = await db
          .select()
          .from(availabilityCalendar)
          .where(
            and(
              eq(availabilityCalendar.propertyId, propertyId),
              eq(availabilityCalendar.date, item.date)
            )
          )
          .limit(1);

        if (existing.length > 0) {
          // Update existing
          await db
            .update(availabilityCalendar)
            .set({
              isAvailable: item.available !== false,
              status: item.available !== false ? 'available' : 'blocked',
              price: item.price || null,
              notes: item.notes || null,
              updatedAt: now,
            })
            .where(eq(availabilityCalendar.id, existing[0].id));
          updated++;
        } else {
          // Create new
          await db
            .insert(availabilityCalendar)
            .values({
              propertyId,
              date: item.date,
              isAvailable: item.available !== false,
              status: item.available !== false ? 'available' : 'blocked',
              price: item.price || null,
              notes: item.notes || null,
              createdAt: now,
              updatedAt: now,
            });
          created++;
        }
      } catch (err) {
        console.error(`Error processing date ${item.date}:`, err);
      }
    }

    return NextResponse.json({
      success: true,
      message: `Updated ${updated} dates, created ${created} dates`,
      updated,
      created,
    });

  } catch (error) {
    console.error("Error updating availability:", error);
    return NextResponse.json(
      { error: "Failed to update availability", details: (error as Error).message },
      { status: 500 }
    );
  }
}
