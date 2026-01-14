/**
 * Owner Dashboard - Pricing Management API
 * 
 * Manage seasonal pricing and special date pricing for properties
 * 
 * GET /api/owner/properties/[id]/pricing - Get all pricing rules
 * POST /api/owner/properties/[id]/pricing/seasonal - Create seasonal pricing
 * PUT /api/owner/properties/[id]/pricing/seasonal/[ruleId] - Update seasonal pricing
 * DELETE /api/owner/properties/[id]/pricing/seasonal/[ruleId] - Delete seasonal pricing
 * POST /api/owner/properties/[id]/pricing/special - Create special date pricing
 * PUT /api/owner/properties/[id]/pricing/special/[ruleId] - Update special date pricing
 * DELETE /api/owner/properties/[id]/pricing/special/[ruleId] - Delete special date pricing
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, seasonalPricing, specialDatePricing } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { 
  validateSchema, 
  seasonalPricingSchema, 
  specialDatePricingSchema,
  validateDateRange
} from '@/lib/validations/property-validations';
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// GET - Get all pricing rules for property
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied. Owner role required.' },
        { status: 403 }
      );
    }

    // Verify property ownership
    const property = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.id, parseInt(id)),
          eq(properties.ownerId, session.user.id)
        )
      )
      .limit(1);

    if (!property || property.length === 0) {
      return NextResponse.json(
        { error: 'Property not found or access denied' },
        { status: 404 }
      );
    }

    // Get seasonal pricing rules
    const seasonalRules = await db
      .select()
      .from(seasonalPricing)
      .where(eq(seasonalPricing.propertyId, parseInt(id)))
      .orderBy(seasonalPricing.priority);

    // Get special date pricing rules
    const specialRules = await db
      .select()
      .from(specialDatePricing)
      .where(eq(specialDatePricing.propertyId, parseInt(id)))
      .orderBy(specialDatePricing.date);

    return NextResponse.json({
      success: true,
      propertyId: parseInt(id),
      propertyTitle: property[0].title,
      basePrice: {
        midweek: property[0].priceFromMidweek,
        weekend: property[0].priceFromWeekend,
      },
      seasonal: seasonalRules.map(rule => ({
        id: rule.id,
        name: rule.name,
        seasonType: rule.seasonType,
        startDate: rule.startDate,
        endDate: rule.endDate,
        pricePerNight: rule.pricePerNight,
        minimumStay: rule.minimumStay,
        dayType: rule.dayType,
        isActive: rule.isActive,
        priority: rule.priority,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      })),
      special: specialRules.map(rule => ({
        id: rule.id,
        name: rule.name,
        date: rule.date,
        endDate: rule.endDate,
        pricePerNight: rule.pricePerNight,
        minimumStay: rule.minimumStay,
        isAvailable: rule.isAvailable,
        createdAt: rule.createdAt,
        updatedAt: rule.updatedAt,
      })),
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error fetching pricing rules:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pricing rules' },
      { status: 500 }
    );
  }
}
