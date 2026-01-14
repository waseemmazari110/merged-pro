/**
 * Booking Price Calculator
 * Calculate total booking price including deposits, fees, and seasonal pricing
 * 
 * STEP 2.1 - Booking Checkout Flow
 */

import { db } from '@/db';
import { properties, seasonalPricing } from '@/db/schema';
import { eq, and, gte, lte } from 'drizzle-orm';

export interface PriceCalculationInput {
  propertyId: number;
  checkInDate: string; // ISO format: YYYY-MM-DD
  checkOutDate: string; // ISO format: YYYY-MM-DD
  numberOfGuests: number;
}

export interface PriceBreakdown {
  nights: number;
  pricePerNight: number; // Average price per night
  nightlyBreakdown: Array<{
    date: string;
    price: number;
    isWeekend: boolean;
    seasonType?: string;
  }>;
  subtotal: number; // Total for accommodation
  cleaningFee?: number;
  securityDeposit?: number;
  serviceFee?: number; // Platform fee (if applicable)
  taxes?: number; // VAT or other taxes
  totalPrice: number; // Grand total
  depositAmount: number; // 25% deposit
  balanceAmount: number; // Remaining balance
  currency: string;
}

export interface PricingError {
  error: string;
  code: string;
}

/**
 * Calculate booking price with detailed breakdown
 * 
 * Pricing Logic:
 * 1. Base price from property (weekday/weekend rates)
 * 2. Seasonal pricing overrides (if active)
 * 3. Cleaning fee (optional)
 * 4. Security deposit (standard £500 or property-specific)
 * 5. 25% deposit required upfront
 */
export async function calculateBookingPrice(
  input: PriceCalculationInput
): Promise<PriceBreakdown | PricingError> {
  const { propertyId, checkInDate, checkOutDate, numberOfGuests } = input;

  // Validate dates
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  if (isNaN(checkIn.getTime()) || isNaN(checkOut.getTime())) {
    return {
      error: 'Invalid date format',
      code: 'INVALID_DATE',
    };
  }

  if (checkOut <= checkIn) {
    return {
      error: 'Check-out must be after check-in',
      code: 'INVALID_DATE_RANGE',
    };
  }

  // Get property details
  const property = await db
    .select({
      id: properties.id,
      title: properties.title,
      priceFromMidweek: properties.priceFromMidweek,
      priceFromWeekend: properties.priceFromWeekend,
      sleepsMin: properties.sleepsMin,
      sleepsMax: properties.sleepsMax,
    })
    .from(properties)
    .where(eq(properties.id, propertyId))
    .limit(1);

  if (property.length === 0) {
    return {
      error: 'Property not found',
      code: 'PROPERTY_NOT_FOUND',
    };
  }

  const prop = property[0];

  // Validate guest count
  if (numberOfGuests < prop.sleepsMin || numberOfGuests > prop.sleepsMax) {
    return {
      error: `Property accommodates ${prop.sleepsMin}-${prop.sleepsMax} guests`,
      code: 'INVALID_GUEST_COUNT',
    };
  }

  // Calculate number of nights
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  // Get seasonal pricing for date range (if exists)
  const seasonalPrices = await db
    .select()
    .from(seasonalPricing)
    .where(
      and(
        eq(seasonalPricing.propertyId, propertyId),
        eq(seasonalPricing.isActive, true)
      )
    );

  // Build nightly breakdown
  const nightlyBreakdown: Array<{
    date: string;
    price: number;
    isWeekend: boolean;
    seasonType?: string;
  }> = [];

  let subtotal = 0;

  // Iterate through each night
  for (let i = 0; i < nights; i++) {
    const currentDate = new Date(checkIn);
    currentDate.setDate(currentDate.getDate() + i);
    const dateString = currentDate.toISOString().split('T')[0];
    
    // Check if weekend (Friday or Saturday night)
    const dayOfWeek = currentDate.getDay();
    const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday = 5, Saturday = 6

    // Check for seasonal pricing on this date
    let nightPrice = isWeekend ? prop.priceFromWeekend : prop.priceFromMidweek;
    let seasonType: string | undefined;

    for (const season of seasonalPrices) {
      const seasonStart = new Date(season.startDate);
      const seasonEnd = new Date(season.endDate);
      
      if (currentDate >= seasonStart && currentDate <= seasonEnd) {
        // Check if day type matches
        if (
          season.dayType === 'any' ||
          (season.dayType === 'weekend' && isWeekend) ||
          (season.dayType === 'weekday' && !isWeekend)
        ) {
          nightPrice = season.pricePerNight;
          seasonType = season.seasonType;
          break; // Use first matching seasonal price (priority-based)
        }
      }
    }

    nightlyBreakdown.push({
      date: dateString,
      price: nightPrice,
      isWeekend,
      seasonType,
    });

    subtotal += nightPrice;
  }

  // Calculate average price per night
  const pricePerNight = subtotal / nights;

  // Add fees
  const cleaningFee = 50; // Standard cleaning fee (can be property-specific)
  const securityDeposit = 500; // Standard security deposit (refundable)
  const serviceFee = 0; // No platform fee for now
  const taxRate = 0; // No VAT for now (accommodation is usually VAT exempt in UK)
  const taxes = subtotal * taxRate;

  // Calculate total
  const totalPrice = subtotal + cleaningFee + taxes;

  // Calculate deposit (25% of total, excluding security deposit)
  const depositAmount = Math.round(totalPrice * 0.25 * 100) / 100;
  const balanceAmount = Math.round((totalPrice - depositAmount) * 100) / 100;

  return {
    nights,
    pricePerNight: Math.round(pricePerNight * 100) / 100,
    nightlyBreakdown,
    subtotal: Math.round(subtotal * 100) / 100,
    cleaningFee,
    securityDeposit,
    serviceFee,
    taxes: Math.round(taxes * 100) / 100,
    totalPrice: Math.round(totalPrice * 100) / 100,
    depositAmount,
    balanceAmount,
    currency: 'GBP',
  };
}

/**
 * Format price for display
 */
export function formatPrice(amount: number, currency: string = 'GBP'): string {
  return new Intl.NumberFormat('en-GB', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Calculate deposit due date (at booking)
 * Calculate balance due date (6 weeks before check-in)
 */
export function calculatePaymentDueDates(checkInDate: string): {
  depositDueDate: string;
  balanceDueDate: string;
} {
  const checkIn = new Date(checkInDate);
  
  // Deposit due immediately (at booking)
  const depositDueDate = new Date().toISOString().split('T')[0];
  
  // Balance due 6 weeks (42 days) before check-in
  const balanceDue = new Date(checkIn);
  balanceDue.setDate(balanceDue.getDate() - 42);
  
  // If balance due date is in the past, it's due immediately
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const balanceDueDate = balanceDue < today 
    ? today.toISOString().split('T')[0]
    : balanceDue.toISOString().split('T')[0];

  return {
    depositDueDate,
    balanceDueDate,
  };
}

/**
 * Validate if booking is within allowed booking window
 * Typically: minimum 2 days advance, maximum 18 months
 */
export function validateBookingWindow(checkInDate: string): {
  valid: boolean;
  reason?: string;
} {
  const checkIn = new Date(checkInDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Minimum advance booking (2 days)
  const minAdvance = new Date(today);
  minAdvance.setDate(minAdvance.getDate() + 2);

  if (checkIn < minAdvance) {
    return {
      valid: false,
      reason: 'Minimum 2 days advance booking required',
    };
  }

  // Maximum advance booking (18 months)
  const maxAdvance = new Date(today);
  maxAdvance.setMonth(maxAdvance.getMonth() + 18);

  if (checkIn > maxAdvance) {
    return {
      valid: false,
      reason: 'Bookings can only be made up to 18 months in advance',
    };
  }

  return { valid: true };
}
