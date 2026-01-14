/**
 * ORCHARDS WEBSITE INTEGRATION API
 * 
 * Public API endpoints specifically designed for the Orchards website integration.
 * Features:
 * - Read-only access to property listings
 * - Real-time availability checking
 * - Rate limiting with premium tier for Orchards
 * - Secure API key authentication
 * - CORS support
 * 
 * GET /api/orchards/properties - List all available properties
 * GET /api/orchards/properties/[id] - Get property details
 * POST /api/orchards/availability - Check availability for dates
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages, propertyFeatures, availabilityCalendar, bookings } from '@/db/schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { rateLimit, addRateLimitHeaders } from '@/lib/rate-limiter';
import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// CORS Headers for Orchards Website
// ============================================

const ORCHARDS_ORIGINS = [
  'https://www.orchards-escapes.co.uk',
  'https://orchards-escapes.co.uk',
  'https://orchards-staging.vercel.app', // Staging
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

function getCorsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get('origin');
  const allowedOrigin = ORCHARDS_ORIGINS.includes(origin || '') ? origin : ORCHARDS_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key, Authorization',
    'Access-Control-Max-Age': '86400', // 24 hours
  };
}

// ============================================
// OPTIONS - Handle CORS Preflight
// ============================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

// ============================================
// GET - List Properties
// ============================================

export async function GET(request: NextRequest) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitResult.error;
    }

    const { searchParams } = new URL(request.url);
    
    // Pagination
    const limit = Math.min(parseInt(searchParams.get('limit') || '50'), 100);
    const offset = parseInt(searchParams.get('offset') || '0');
    
    // Filters
    const region = searchParams.get('region');
    const minGuests = searchParams.get('minGuests');
    const maxPrice = searchParams.get('maxPrice');
    const featured = searchParams.get('featured') === 'true';
    
    // Build query
    let query = db
      .select({
        id: properties.id,
        title: properties.title,
        slug: properties.slug,
        location: properties.location,
        region: properties.region,
        sleepsMin: properties.sleepsMin,
        sleepsMax: properties.sleepsMax,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        priceFromMidweek: properties.priceFromMidweek,
        priceFromWeekend: properties.priceFromWeekend,
        description: properties.description,
        heroImage: properties.heroImage,
        featured: properties.featured,
      })
      .from(properties)
      .where(
        and(
          eq(properties.isPublished, true),
          eq(properties.status, 'approved'), // Only show approved properties
          region ? eq(properties.region, region) : sql`1=1`,
          minGuests ? gte(properties.sleepsMax, parseInt(minGuests)) : sql`1=1`,
          maxPrice ? lte(properties.priceFromMidweek, parseFloat(maxPrice)) : sql`1=1`,
          featured ? eq(properties.featured, true) : sql`1=1`
        )
      )
      .orderBy(desc(properties.featured), desc(properties.createdAt))
      .limit(limit)
      .offset(offset);

    const propertyList = await query;

    // Get total count
    const countResult = await db
      .select({ count: sql<number>`count(*)` })
      .from(properties)
      .where(
        and(
          eq(properties.isPublished, true),
          eq(properties.status, 'approved') // Only count approved properties
        )
      );
    
    const total = Number(countResult[0]?.count || 0);

    // Build response
    const response = NextResponse.json({
      success: true,
      properties: propertyList,
      pagination: {
        total,
        limit,
        offset,
        hasMore: offset + limit < total,
      },
      timestamp: nowUKFormatted(),
    });

    // Add CORS and rate limit headers
    const corsHeaders = getCorsHeaders(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
    
    return addRateLimitHeaders(response, request, rateLimitResult.tier);

  } catch (error) {
    console.error('Error fetching properties for Orchards:', error);
    
    const response = NextResponse.json(
      { error: 'Failed to fetch properties' },
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
    const { propertyId, checkInDate, checkOutDate } = body;

    // Validation
    if (!propertyId || !checkInDate || !checkOutDate) {
      const response = NextResponse.json(
        {
          error: 'Missing required fields',
          message: 'propertyId, checkInDate, and checkOutDate are required (format: DD/MM/YYYY)',
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
          eq(properties.isPublished, true)
        )
      )
      .limit(1);

    if (!property || property.length === 0) {
      const response = NextResponse.json(
        { error: 'Property not found or not available' },
        { status: 404 }
      );
      
      const corsHeaders = getCorsHeaders(request);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });
      
      return response;
    }

    // Check availability in calendar
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

    // Check for any unavailable dates
    const unavailableDates = calendarEntries.filter(
      entry => !entry.isAvailable || entry.status === 'booked' || entry.status === 'blocked'
    );

    const isAvailable = unavailableDates.length === 0;

    // Calculate pricing
    let totalPrice = 0;
    let numberOfNights = 0;
    
    if (calendarEntries.length > 0) {
      numberOfNights = calendarEntries.length;
      totalPrice = calendarEntries.reduce((sum, entry) => {
        return sum + (entry.price || property[0].priceFromMidweek);
      }, 0);
    } else {
      // Estimate based on base price (no specific calendar entries)
      numberOfNights = calculateNights(checkInDate, checkOutDate);
      totalPrice = numberOfNights * property[0].priceFromMidweek;
    }

    // Build response
    const response = NextResponse.json({
      success: true,
      propertyId,
      propertyTitle: property[0].title,
      checkInDate,
      checkOutDate,
      isAvailable,
      unavailableDates: unavailableDates.map(d => d.date),
      pricing: {
        numberOfNights,
        pricePerNight: Math.round(totalPrice / numberOfNights),
        totalPrice: Math.round(totalPrice),
        currency: 'GBP',
      },
      minimumStay: property[0].checkInOut?.includes('minimum') ? 7 : null,
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
      { error: 'Failed to check availability' },
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
  
  const diffTime = Math.abs(checkOut.getTime() - checkIn.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}
