/**
 * Seasonal Pricing System
 * 
 * Manages property pricing with seasonal rates, special dates,
 * and dynamic pricing rules. All date ranges in UK format.
 * 
 * Features:
 * - Seasonal pricing periods (UK date ranges)
 * - Day-of-week pricing (weekday/weekend)
 * - Special event pricing
 * - Minimum stay requirements
 * - Booking windows
 * - Dynamic price calculation
 * - UK date format: DD/MM/YYYY
 */

import { db } from '@/db';
import { sql } from 'drizzle-orm';
import { nowUKFormatted, parseUKDate, formatDateUK } from './date-utils';

// ============================================
// TYPES & INTERFACES
// ============================================

export type PricingType = 'base' | 'seasonal' | 'event' | 'last-minute' | 'early-bird';
export type DayType = 'weekday' | 'weekend' | 'any';
export type SeasonType = 'peak' | 'high' | 'mid' | 'low' | 'off-peak';

export interface SeasonalPricing {
  id: number;
  propertyId: number;
  name: string; // e.g., "Summer Peak Season"
  seasonType: SeasonType;
  startDate: string; // UK format: DD/MM/YYYY
  endDate: string; // UK format: DD/MM/YYYY
  pricePerNight: number;
  minimumStay?: number; // nights
  dayType: DayType;
  isActive: boolean;
  priority: number; // Higher priority = applied first
  createdAt: string; // UK format: DD/MM/YYYY HH:mm:ss
  updatedAt: string; // UK format: DD/MM/YYYY HH:mm:ss
}

export interface SpecialDatePricing {
  id: number;
  propertyId: number;
  name: string; // e.g., "Christmas Week"
  date: string; // UK format: DD/MM/YYYY
  endDate?: string; // For multi-day events, UK format: DD/MM/YYYY
  pricePerNight: number;
  minimumStay?: number;
  isAvailable: boolean; // Can be blocked (not available)
  createdAt: string;
  updatedAt: string;
}

export interface PricingRule {
  id: number;
  propertyId: number;
  name: string;
  type: PricingType;
  adjustmentType: 'percentage' | 'fixed';
  adjustmentValue: number; // +/- percentage or fixed amount
  conditions?: {
    minAdvanceBooking?: number; // days
    maxAdvanceBooking?: number; // days
    minStay?: number; // nights
    applicableMonths?: number[]; // 1-12
    applicableDays?: number[]; // 0-6 (Sunday-Saturday)
  };
  isActive: boolean;
  priority: number;
  createdAt: string;
  updatedAt: string;
}

export interface PriceQuote {
  propertyId: number;
  checkInDate: string; // UK format: DD/MM/YYYY
  checkOutDate: string; // UK format: DD/MM/YYYY
  nights: number;
  basePrice: number; // Per night average
  seasonalAdjustments: Array<{
    name: string;
    dateRange: string; // UK format: "DD/MM/YYYY – DD/MM/YYYY"
    nights: number;
    pricePerNight: number;
    total: number;
  }>;
  ruleAdjustments: Array<{
    name: string;
    type: PricingType;
    amount: number;
  }>;
  subtotal: number;
  totalAdjustments: number;
  totalPrice: number;
  pricePerNight: number; // Average
  minimumStay: number;
  meetsMinimumStay: boolean;
  breakdown: string; // Human-readable
}

export interface DateAvailability {
  date: string; // UK format: DD/MM/YYYY
  available: boolean;
  price: number;
  minimumStay: number;
  reason?: string; // If not available
}

// ============================================
// SEASONAL PRICING MANAGEMENT
// ============================================

/**
 * Create seasonal pricing period
 */
export async function createSeasonalPricing(
  data: Omit<SeasonalPricing, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SeasonalPricing> {
  const now = nowUKFormatted();

  // Validate UK date format
  if (!isValidUKDate(data.startDate) || !isValidUKDate(data.endDate)) {
    throw new Error('Dates must be in UK format: DD/MM/YYYY');
  }

  // Validate date range
  const start = parseUKDate(data.startDate);
  const end = parseUKDate(data.endDate);
  if (end <= start) {
    throw new Error('End date must be after start date');
  }

  const result = await db.run(
    sql`INSERT INTO seasonal_pricing 
        (property_id, name, season_type, start_date, end_date, price_per_night, 
         minimum_stay, day_type, is_active, priority, created_at, updated_at)
        VALUES (${data.propertyId}, ${data.name}, ${data.seasonType}, ${data.startDate}, 
                ${data.endDate}, ${data.pricePerNight}, ${data.minimumStay || null}, 
                ${data.dayType}, ${data.isActive ? 1 : 0}, ${data.priority}, ${now}, ${now})
        RETURNING *`
  );

  return (result.rows as unknown as SeasonalPricing[])[0];
}

/**
 * Get seasonal pricing for property
 */
export async function getSeasonalPricing(propertyId: number): Promise<SeasonalPricing[]> {
  const result = await db.run(
    sql`SELECT * FROM seasonal_pricing 
        WHERE property_id = ${propertyId} AND is_active = 1
        ORDER BY priority DESC, start_date ASC`
  );

  return result.rows as unknown as SeasonalPricing[];
}

/**
 * Update seasonal pricing
 */
export async function updateSeasonalPricing(
  id: number,
  updates: Partial<Omit<SeasonalPricing, 'id' | 'propertyId' | 'createdAt' | 'updatedAt'>>
): Promise<void> {
  // TODO: Implement with proper Drizzle update syntax or fix sql.raw usage
  console.warn('updateSeasonalPricing not yet implemented with db.run');
}

/**
 * Delete seasonal pricing
 */
export async function deleteSeasonalPricing(id: number): Promise<void> {
  await db.run(sql`DELETE FROM seasonal_pricing WHERE id = ${id}`);
}

// ============================================
// SPECIAL DATE PRICING
// ============================================

/**
 * Create special date pricing
 */
export async function createSpecialDatePricing(
  data: Omit<SpecialDatePricing, 'id' | 'createdAt' | 'updatedAt'>
): Promise<SpecialDatePricing> {
  const now = nowUKFormatted();

  // Validate UK date format
  if (!isValidUKDate(data.date)) {
    throw new Error('Date must be in UK format: DD/MM/YYYY');
  }
  if (data.endDate && !isValidUKDate(data.endDate)) {
    throw new Error('End date must be in UK format: DD/MM/YYYY');
  }

  const result = await db.run(
    sql`INSERT INTO special_date_pricing 
        (property_id, name, date, end_date, price_per_night, minimum_stay, 
         is_available, created_at, updated_at)
        VALUES (${data.propertyId}, ${data.name}, ${data.date}, ${data.endDate || null}, 
                ${data.pricePerNight}, ${data.minimumStay || null}, 
                ${data.isAvailable ? 1 : 0}, ${now}, ${now})
        RETURNING *`
  );

  return (result.rows as unknown as SpecialDatePricing[])[0];
}

/**
 * Get special date pricing for property
 */
export async function getSpecialDatePricing(propertyId: number): Promise<SpecialDatePricing[]> {
  const result = await db.run(
    sql`SELECT * FROM special_date_pricing 
        WHERE property_id = ${propertyId}
        ORDER BY date ASC`
  );

  return result.rows as unknown as SpecialDatePricing[];
}

// ============================================
// PRICE CALCULATION
// ============================================

/**
 * Calculate price for date range
 */
export async function calculatePrice(
  propertyId: number,
  checkInDate: string, // UK format: DD/MM/YYYY
  checkOutDate: string // UK format: DD/MM/YYYY
): Promise<PriceQuote> {
  // Validate dates
  if (!isValidUKDate(checkInDate) || !isValidUKDate(checkOutDate)) {
    throw new Error('Dates must be in UK format: DD/MM/YYYY');
  }

  const checkIn = parseUKDate(checkInDate);
  const checkOut = parseUKDate(checkOutDate);
  const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

  if (nights <= 0) {
    throw new Error('Check-out must be after check-in');
  }

  // Get property base price
  const property = await db.run(
    sql`SELECT price_from_midweek, price_from_weekend FROM properties WHERE id = ${propertyId}`
  );

  if (!property.rows || property.rows.length === 0) {
    throw new Error('Property not found');
  }

  const basePrice = (property.rows[0] as any).price_from_midweek || 100;

  // Get seasonal pricing
  const seasonalPricing = await getSeasonalPricing(propertyId);

  // Get special dates
  const specialDates = await getSpecialDatePricing(propertyId);

  // Calculate nightly prices
  const nightlyPrices: Array<{ date: string; price: number; source: string }> = [];
  let currentDate = new Date(checkIn);
  let minimumStay = 1;

  for (let i = 0; i < nights; i++) {
    const dateStr = formatDateUK(currentDate);

    // Check special dates first
    let nightPrice = basePrice;
    let source = 'base';

    const specialDate = specialDates.find(sd => {
      const sdDate = parseUKDate(sd.date);
      const sdEndDate = sd.endDate ? parseUKDate(sd.endDate) : sdDate;
      return currentDate >= sdDate && currentDate <= sdEndDate;
    });

    if (specialDate) {
      nightPrice = specialDate.pricePerNight;
      source = specialDate.name;
      if (specialDate.minimumStay) {
        minimumStay = Math.max(minimumStay, specialDate.minimumStay);
      }
    } else {
      // Check seasonal pricing
      const season = seasonalPricing.find(sp => {
        const start = parseUKDate(sp.startDate);
        const end = parseUKDate(sp.endDate);
        const dayOfWeek = currentDate.getDay();
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

        const dateInRange = currentDate >= start && currentDate <= end;
        const dayTypeMatches =
          sp.dayType === 'any' ||
          (sp.dayType === 'weekend' && isWeekend) ||
          (sp.dayType === 'weekday' && !isWeekend);

        return dateInRange && dayTypeMatches;
      });

      if (season) {
        nightPrice = season.pricePerNight;
        source = season.name;
        if (season.minimumStay) {
          minimumStay = Math.max(minimumStay, season.minimumStay);
        }
      }
    }

    nightlyPrices.push({ date: dateStr, price: nightPrice, source });
    currentDate.setDate(currentDate.getDate() + 1);
  }

  // Group consecutive nights with same source
  const seasonalAdjustments: PriceQuote['seasonalAdjustments'] = [];
  let currentGroup: typeof seasonalAdjustments[0] | null = null;

  for (const night of nightlyPrices) {
    if (!currentGroup || currentGroup.name !== night.source || currentGroup.pricePerNight !== night.price) {
      if (currentGroup) {
        seasonalAdjustments.push(currentGroup);
      }
      currentGroup = {
        name: night.source,
        dateRange: night.date,
        nights: 1,
        pricePerNight: night.price,
        total: night.price,
      };
    } else {
      currentGroup.nights++;
      currentGroup.total += night.price;
      const endDate = night.date;
      currentGroup.dateRange = currentGroup.nights === 1 
        ? endDate 
        : `${currentGroup.dateRange.split(' – ')[0]} – ${endDate}`;
    }
  }
  if (currentGroup) {
    seasonalAdjustments.push(currentGroup);
  }

  // Calculate totals
  const subtotal = nightlyPrices.reduce((sum, n) => sum + n.price, 0);
  const totalAdjustments = 0; // Can add dynamic rules here
  const totalPrice = subtotal + totalAdjustments;
  const pricePerNight = totalPrice / nights;

  // Build breakdown
  const breakdown = seasonalAdjustments
    .map(sa => `${sa.dateRange}: ${sa.nights} night(s) × £${sa.pricePerNight} = £${sa.total}`)
    .join('\n');

  return {
    propertyId,
    checkInDate,
    checkOutDate,
    nights,
    basePrice,
    seasonalAdjustments,
    ruleAdjustments: [],
    subtotal,
    totalAdjustments,
    totalPrice,
    pricePerNight,
    minimumStay,
    meetsMinimumStay: nights >= minimumStay,
    breakdown,
  };
}

/**
 * Get availability calendar for property
 */
export async function getAvailabilityCalendar(
  propertyId: number,
  startDate: string, // UK format: DD/MM/YYYY
  endDate: string // UK format: DD/MM/YYYY
): Promise<DateAvailability[]> {
  const start = parseUKDate(startDate);
  const end = parseUKDate(endDate);
  const availability: DateAvailability[] = [];

  let currentDate = new Date(start);
  while (currentDate <= end) {
    const dateStr = formatDateUK(currentDate);

    // Get price for this date (1 night stay)
    try {
      const nextDay = new Date(currentDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const quote = await calculatePrice(propertyId, dateStr, formatDateUK(nextDay));

      availability.push({
        date: dateStr,
        available: true,
        price: quote.seasonalAdjustments[0]?.pricePerNight || quote.basePrice,
        minimumStay: quote.minimumStay,
      });
    } catch (error) {
      availability.push({
        date: dateStr,
        available: false,
        price: 0,
        minimumStay: 1,
        reason: 'Not available',
      });
    }

    currentDate.setDate(currentDate.getDate() + 1);
  }

  return availability;
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Validate UK date format
 */
function isValidUKDate(dateStr: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;

  try {
    const date = parseUKDate(dateStr);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

/**
 * Get season name from date
 */
export function getSeasonFromDate(date: Date): SeasonType {
  const month = date.getMonth() + 1;

  if (month >= 7 && month <= 8) return 'peak'; // July-August
  if (month === 6 || month === 9) return 'high'; // June, September
  if (month >= 4 && month <= 5) return 'mid'; // April-May
  if (month >= 10 && month <= 11) return 'low'; // October-November
  return 'off-peak'; // December-March
}

/**
 * Format date range in UK format
 */
export function formatUKDateRange(startDate: string, endDate: string): string {
  return `${startDate} – ${endDate}`;
}
