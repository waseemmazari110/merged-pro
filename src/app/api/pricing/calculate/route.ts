/**
 * Pricing Calculator API
 * 
 * GET /api/pricing/calculate - Calculate price for date range
 * GET /api/pricing/availability - Get availability calendar
 * POST /api/pricing/seasonal - Create/manage seasonal pricing
 * GET /api/pricing/seasonal/[id] - Get/update/delete seasonal pricing
 * 
 * All dates in UK format: DD/MM/YYYY
 * 
 * Milestone 8: Amenities, Pricing, Multi-Property
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import {
  calculatePrice,
  getAvailabilityCalendar,
  getSeasonalPricing,
  createSeasonalPricing,
  updateSeasonalPricing,
  deleteSeasonalPricing,
  getSpecialDatePricing,
  createSpecialDatePricing,
} from '@/lib/seasonal-pricing';
import { logAuditEvent } from '@/lib/audit-logger';

/**
 * GET /api/pricing/calculate
 * Calculate price for date range
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const action = searchParams.get('action') || 'calculate';

    if (action === 'calculate') {
      return await handleCalculate(req);
    } else if (action === 'availability') {
      return await handleAvailability(req);
    } else if (action === 'seasonal') {
      return await handleGetSeasonal(req);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: calculate, availability, or seasonal' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Pricing API error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/pricing/calculate
 * Create seasonal pricing or special dates
 */
export async function POST(req: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: req.headers });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Only owners and admins can create pricing
    if (((session.user as any).role || 'guest') !== 'owner' && ((session.user as any).role || 'guest') !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Only property owners can manage pricing' },
        { status: 403 }
      );
    }

    const body = await req.json();
    const { action } = body;

    if (action === 'create-seasonal') {
      return await handleCreateSeasonal(req, session.user.id, body);
    } else if (action === 'create-special-date') {
      return await handleCreateSpecialDate(req, session.user.id, body);
    }

    return NextResponse.json(
      { error: 'Invalid action. Use: create-seasonal or create-special-date' },
      { status: 400 }
    );
  } catch (error: any) {
    console.error('Pricing create error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

// ============================================
// CALCULATE PRICE
// ============================================

async function handleCalculate(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const propertyId = parseInt(searchParams.get('propertyId') || '0');
  const checkInDate = searchParams.get('checkInDate');
  const checkOutDate = searchParams.get('checkOutDate');

  // Validate inputs
  if (!propertyId || !checkInDate || !checkOutDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: propertyId, checkInDate, checkOutDate' },
      { status: 400 }
    );
  }

  // Validate UK date format
  const ukDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!ukDateRegex.test(checkInDate) || !ukDateRegex.test(checkOutDate)) {
    return NextResponse.json(
      { error: 'Dates must be in UK format: DD/MM/YYYY' },
      { status: 400 }
    );
  }

  // Calculate price
  const quote = await calculatePrice(propertyId, checkInDate, checkOutDate);

  return NextResponse.json({
    success: true,
    quote: {
      propertyId: quote.propertyId,
      checkInDate: quote.checkInDate,
      checkOutDate: quote.checkOutDate,
      nights: quote.nights,
      basePrice: quote.basePrice,
      seasonalAdjustments: quote.seasonalAdjustments,
      subtotal: quote.subtotal,
      totalPrice: quote.totalPrice,
      pricePerNight: quote.pricePerNight,
      minimumStay: quote.minimumStay,
      meetsMinimumStay: quote.meetsMinimumStay,
      breakdown: quote.breakdown,
    },
  });
}

// ============================================
// AVAILABILITY CALENDAR
// ============================================

async function handleAvailability(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  
  const propertyId = parseInt(searchParams.get('propertyId') || '0');
  const startDate = searchParams.get('startDate');
  const endDate = searchParams.get('endDate');

  // Validate inputs
  if (!propertyId || !startDate || !endDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: propertyId, startDate, endDate' },
      { status: 400 }
    );
  }

  // Validate UK date format
  const ukDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!ukDateRegex.test(startDate) || !ukDateRegex.test(endDate)) {
    return NextResponse.json(
      { error: 'Dates must be in UK format: DD/MM/YYYY' },
      { status: 400 }
    );
  }

  // Get availability
  const availability = await getAvailabilityCalendar(propertyId, startDate, endDate);

  return NextResponse.json({
    success: true,
    propertyId,
    startDate,
    endDate,
    availability,
  });
}

// ============================================
// GET SEASONAL PRICING
// ============================================

async function handleGetSeasonal(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const propertyId = parseInt(searchParams.get('propertyId') || '0');

  if (!propertyId) {
    return NextResponse.json(
      { error: 'Missing required parameter: propertyId' },
      { status: 400 }
    );
  }

  const seasonalPricing = await getSeasonalPricing(propertyId);
  const specialDates = await getSpecialDatePricing(propertyId);

  return NextResponse.json({
    success: true,
    propertyId,
    seasonalPricing,
    specialDates,
  });
}

// ============================================
// CREATE SEASONAL PRICING
// ============================================

async function handleCreateSeasonal(req: NextRequest, userId: string, body: any) {
  const {
    propertyId,
    name,
    seasonType,
    startDate,
    endDate,
    pricePerNight,
    minimumStay,
    dayType,
    priority,
  } = body;

  // Validate required fields
  if (!propertyId || !name || !seasonType || !startDate || !endDate || !pricePerNight) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Validate UK date format
  const ukDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!ukDateRegex.test(startDate) || !ukDateRegex.test(endDate)) {
    return NextResponse.json(
      { error: 'Dates must be in UK format: DD/MM/YYYY' },
      { status: 400 }
    );
  }

  // TODO: Verify property ownership

  // Create seasonal pricing
  const seasonal = await createSeasonalPricing({
    propertyId,
    name,
    seasonType,
    startDate,
    endDate,
    pricePerNight,
    minimumStay,
    dayType: dayType || 'any',
    isActive: true,
    priority: priority || 0,
  });

  // Log audit event
  await logAuditEvent({
    userId,
    action: 'property.update',
    resourceType: 'property',
    resourceId: propertyId.toString(),
    details: {
      operation: 'create-seasonal-pricing',
      seasonalPricing: {
        name,
        dateRange: `${startDate} – ${endDate}`,
        pricePerNight,
      },
    },
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
  });

  return NextResponse.json({
    success: true,
    seasonal,
  });
}

// ============================================
// CREATE SPECIAL DATE PRICING
// ============================================

async function handleCreateSpecialDate(req: NextRequest, userId: string, body: any) {
  const {
    propertyId,
    name,
    date,
    endDate,
    pricePerNight,
    minimumStay,
    isAvailable,
  } = body;

  // Validate required fields
  if (!propertyId || !name || !date || !pricePerNight) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    );
  }

  // Validate UK date format
  const ukDateRegex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!ukDateRegex.test(date)) {
    return NextResponse.json(
      { error: 'Date must be in UK format: DD/MM/YYYY' },
      { status: 400 }
    );
  }
  if (endDate && !ukDateRegex.test(endDate)) {
    return NextResponse.json(
      { error: 'End date must be in UK format: DD/MM/YYYY' },
      { status: 400 }
    );
  }

  // TODO: Verify property ownership

  // Create special date pricing
  const specialDate = await createSpecialDatePricing({
    propertyId,
    name,
    date,
    endDate,
    pricePerNight,
    minimumStay,
    isAvailable: isAvailable !== false,
  });

  // Log audit event
  await logAuditEvent({
    userId,
    action: 'property.update',
    resourceType: 'property',
    resourceId: propertyId.toString(),
    details: {
      operation: 'create-special-date-pricing',
      specialDate: {
        name,
        date: endDate ? `${date} – ${endDate}` : date,
        pricePerNight,
      },
    },
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
  });

  return NextResponse.json({
    success: true,
    specialDate,
  });
}
