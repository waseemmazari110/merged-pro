/**
 * ORCHARDS WEBSITE INTEGRATION - Availability Check API
 * 
 * POST /api/orchards/availability - Check availability for specific dates
 * 
 * Dedicated endpoint for checking property availability with enhanced features:
 * - Date range validation
 * - Pricing calculation
 * - Minimum stay requirements
 * - Blocked dates information
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, availabilityCalendar, seasonalPricing, specialDatePricing } from '@/db/schema';
import { eq, and, gte, lte, sql } from 'drizzle-orm';
import { rateLimit, addRateLimitHeaders } from '@/lib/rate-limiter';
import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// CORS Headers
// ============================================

const ORCHARDS_ORIGINS = [
  'https://www.orchards-escapes.co.uk',
  'https://orchards-escapes.co.uk',
  'https://orchards-staging.vercel.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

function getCorsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get('origin');
  const allowedOrigin = ORCHARDS_ORIGINS.includes(origin || '') ? origin : ORCHARDS_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Access-Control-Max-Age': '86400',
  };
}

// ============================================
// OPTIONS - CORS Preflight
// ============================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

// ============================================
// POST - Check Availability
// ============================================

export async function POST(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitResult.error;
    }

    const body = await request.json();
    const { propertyId, checkInDate, checkOutDate, guests } = body;

    // Validation
    if (!propertyId || !checkInDate || !checkOutDate) {
      const response = NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'propertyId, checkInDate (DD/MM/YYYY), and checkOutDate (DD/MM/YYYY) are required',
          example: {
            propertyId: 1,
            checkInDate: '25/12/2025',
            checkOutDate: '01/01/2026',
            guests: 8
          }
        },
        { status: 400 }
      );
      
      const corsHeaders = getCorsHeaders(request);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });
      
      return response;
    }

    // Verify property exists and is published
    const property = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.id, propertyId),
          eq(properties.isPublished, true),
          eq(properties.status, 'approved') // Only check availability for approved properties
        )
      )
      .limit(1);

    if (!property || property.length === 0) {
      const response = NextResponse.json(
        { error: 'Property not found or not available for booking' },
        { status: 404 }
      );
      
      const corsHeaders = getCorsHeaders(request);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });
      
      return response;
    }

    const propertyData = property[0];

    // Validate guest count
    if (guests && (guests < propertyData.sleepsMin || guests > propertyData.sleepsMax)) {
      const response = NextResponse.json(
        {
          error: 'Invalid guest count',
          message: `This property accommodates ${propertyData.sleepsMin}-${propertyData.sleepsMax} guests`,
          sleepsMin: propertyData.sleepsMin,
          sleepsMax: propertyData.sleepsMax,
        },
        { status: 400 }
      );
      
      const corsHeaders = getCorsHeaders(request);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });
      
      return response;
    }

    // Calculate number of nights
    const numberOfNights = calculateNights(checkInDate, checkOutDate);

    // Check availability calendar
    const calendarEntries = await db
      .select()
      .from(availabilityCalendar)
      .where(
        and(
          eq(availabilityCalendar.propertyId, propertyId),
          gte(availabilityCalendar.date, checkInDate),
          lte(availabilityCalendar.date, checkOutDate)
        )
      );

    // Identify unavailable dates
    const unavailableDates = calendarEntries
      .filter(entry => !entry.isAvailable || entry.status === 'booked' || entry.status === 'blocked')
      .map(entry => ({
        date: entry.date,
        reason: entry.status === 'booked' ? 'Already booked' : entry.notes || 'Blocked',
      }));

    const isAvailable = unavailableDates.length === 0;

    // Calculate pricing
    let totalPrice = 0;
    let dailyBreakdown: Array<{ date: string; price: number; type: string }> = [];

    // Get seasonal pricing rules
    const seasonalRules = await db
      .select()
      .from(seasonalPricing)
      .where(
        and(
          eq(seasonalPricing.propertyId, propertyId),
          eq(seasonalPricing.isActive, true)
        )
      );

    // Get special date pricing
    const specialRules = await db
      .select()
      .from(specialDatePricing)
      .where(
        and(
          eq(specialDatePricing.propertyId, propertyId),
          gte(specialDatePricing.date, checkInDate),
          lte(specialDatePricing.date, checkOutDate)
        )
      );

    // Calculate price for each night
    const dates = generateDateRange(checkInDate, checkOutDate);
    for (const date of dates) {
      let nightPrice = propertyData.priceFromMidweek; // Default price
      let priceType = 'base';

      // Check special date pricing (highest priority)
      const specialPrice = specialRules.find(r => 
        r.date === date || (r.endDate && isDateInRange(date, r.date, r.endDate))
      );
      if (specialPrice) {
        nightPrice = specialPrice.pricePerNight;
        priceType = 'special';
      }
      // Check seasonal pricing
      else {
        const seasonalPrice = seasonalRules.find(r => 
          isDateInRange(date, r.startDate, r.endDate)
        );
        if (seasonalPrice) {
          nightPrice = seasonalPrice.pricePerNight;
          priceType = `seasonal-${seasonalPrice.seasonType}`;
        }
      }

      // Check calendar specific price
      const calendarEntry = calendarEntries.find(e => e.date === date);
      if (calendarEntry?.price) {
        nightPrice = calendarEntry.price;
        priceType = 'calendar';
      }

      dailyBreakdown.push({ date, price: nightPrice, type: priceType });
      totalPrice += nightPrice;
    }

    // Build response
    const response = NextResponse.json({
      success: true,
      propertyId,
      propertyTitle: propertyData.title,
      checkInDate,
      checkOutDate,
      guests: guests || null,
      
      // Availability
      isAvailable,
      unavailableDates,
      
      // Pricing
      pricing: {
        numberOfNights,
        totalPrice: Math.round(totalPrice),
        averagePricePerNight: Math.round(totalPrice / numberOfNights),
        currency: 'GBP',
        dailyBreakdown: dailyBreakdown.map(d => ({
          date: d.date,
          price: Math.round(d.price),
          type: d.type,
        })),
      },
      
      // Property constraints
      sleepsMin: propertyData.sleepsMin,
      sleepsMax: propertyData.sleepsMax,
      minimumStay: extractMinimumStay(propertyData.checkInOut),
      
      // Metadata
      timestamp: nowUKFormatted(),
    });

    // Add CORS and rate limit headers
    const corsHeaders = getCorsHeaders(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
    
    return addRateLimitHeaders(response, request, rateLimitResult.tier);

  } catch (error) {
    console.error('Error checking availability for Orchards:', error);
    
    const response = NextResponse.json(
      { error: 'Failed to check availability', message: String(error) },
      { status: 500 }
    );
    
    const corsHeaders = getCorsHeaders(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
    
    return response;
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Calculate number of nights between two dates
 */
function calculateNights(checkInDate: string, checkOutDate: string): number {
  const [inDay, inMonth, inYear] = checkInDate.split('/').map(Number);
  const [outDay, outMonth, outYear] = checkOutDate.split('/').map(Number);
  
  const checkIn = new Date(inYear, inMonth - 1, inDay);
  const checkOut = new Date(outYear, outMonth - 1, outDay);
  
  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

/**
 * Generate array of dates between start and end (DD/MM/YYYY format)
 */
function generateDateRange(startDate: string, endDate: string): string[] {
  const [startDay, startMonth, startYear] = startDate.split('/').map(Number);
  const [endDay, endMonth, endYear] = endDate.split('/').map(Number);
  
  const start = new Date(startYear, startMonth - 1, startDay);
  const end = new Date(endYear, endMonth - 1, endDay);
  
  const dates: string[] = [];
  const current = new Date(start);
  
  while (current < end) {
    const day = String(current.getDate()).padStart(2, '0');
    const month = String(current.getMonth() + 1).padStart(2, '0');
    const year = current.getFullYear();
    dates.push(`${day}/${month}/${year}`);
    
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Check if date is within range (DD/MM/YYYY format)
 */
function isDateInRange(date: string, startDate: string, endDate: string): boolean {
  const [d, m, y] = date.split('/').map(Number);
  const [sd, sm, sy] = startDate.split('/').map(Number);
  const [ed, em, ey] = endDate.split('/').map(Number);
  
  const checkDate = new Date(y, m - 1, d);
  const start = new Date(sy, sm - 1, sd);
  const end = new Date(ey, em - 1, ed);
  
  return checkDate >= start && checkDate <= end;
}

/**
 * Extract minimum stay from checkInOut text
 */
function extractMinimumStay(checkInOut: string | null): number | null {
  if (!checkInOut) return null;
  
  const match = checkInOut.match(/minimum.*?(\d+).*?(night|day)/i);
  if (match) {
    return parseInt(match[1]);
  }
  
  return null;
}
