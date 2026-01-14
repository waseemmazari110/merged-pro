/**
 * Owner Dashboard - Seasonal Pricing Management
 * 
 * POST /api/owner/properties/[id]/pricing/seasonal - Create seasonal pricing rule
 * PUT /api/owner/properties/[id]/pricing/seasonal/[ruleId] - Update seasonal pricing rule
 * DELETE /api/owner/properties/[id]/pricing/seasonal/[ruleId] - Delete seasonal pricing rule
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, seasonalPricing } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { 
  validateSchema, 
  seasonalPricingSchema,
  validateDateRange
} from '@/lib/validations/property-validations';
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// POST - Create seasonal pricing rule
// ============================================

export async function POST(
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

    const body = await request.json();

    // Validate input
    const validation = validateSchema(seasonalPricingSchema, {
      ...body,
      propertyId: parseInt(id),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Validate date range
    const dateValidation = validateDateRange(body.startDate, body.endDate);
    if (!dateValidation.valid) {
      return NextResponse.json(
        { error: dateValidation.message },
        { status: 400 }
      );
    }

    const timestamp = nowUKFormatted();

    // Create seasonal pricing rule
    const inserted = await db
      .insert(seasonalPricing)
      .values({
        propertyId: parseInt(id),
        name: body.name,
        seasonType: body.seasonType,
        startDate: body.startDate,
        endDate: body.endDate,
        pricePerNight: body.pricePerNight,
        minimumStay: body.minimumStay || null,
        dayType: body.dayType || 'any',
        isActive: body.isActive !== undefined ? body.isActive : true,
        priority: body.priority || 0,
        createdAt: timestamp,
        updatedAt: timestamp,
      })
      .returning();

    // Log audit event
    const requestDetails = captureRequestDetails(request);
    await logPropertyAction(
      session.user.id,
      'property.create',
      id,
      property[0].title,
      {
        ruleId: inserted[0].id,
        name: body.name,
        seasonType: body.seasonType,
        pricePerNight: body.pricePerNight,
        ...requestDetails,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Seasonal pricing rule created successfully',
      rule: {
        id: inserted[0].id,
        name: inserted[0].name,
        seasonType: inserted[0].seasonType,
        startDate: inserted[0].startDate,
        endDate: inserted[0].endDate,
        pricePerNight: inserted[0].pricePerNight,
        minimumStay: inserted[0].minimumStay,
        dayType: inserted[0].dayType,
        isActive: inserted[0].isActive,
        priority: inserted[0].priority,
        createdAt: inserted[0].createdAt,
        updatedAt: inserted[0].updatedAt,
      },
      timestamp,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating seasonal pricing rule:', error);
    return NextResponse.json(
      { error: 'Failed to create seasonal pricing rule' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update seasonal pricing rule
// ============================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> }
) {
  try {
    const { id, ruleId } = await params;
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

    // Verify rule exists and belongs to property
    const existingRule = await db
      .select()
      .from(seasonalPricing)
      .where(
        and(
          eq(seasonalPricing.id, parseInt(ruleId)),
          eq(seasonalPricing.propertyId, parseInt(id))
        )
      )
      .limit(1);

    if (!existingRule || existingRule.length === 0) {
      return NextResponse.json(
        { error: 'Pricing rule not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate date range if dates are being updated
    if (body.startDate || body.endDate) {
      const startDate = body.startDate || existingRule[0].startDate;
      const endDate = body.endDate || existingRule[0].endDate;
      
      const dateValidation = validateDateRange(startDate, endDate);
      if (!dateValidation.valid) {
        return NextResponse.json(
          { error: dateValidation.message },
          { status: 400 }
        );
      }
    }

    const timestamp = nowUKFormatted();

    // Update rule
    const updated = await db
      .update(seasonalPricing)
      .set({
        ...body,
        updatedAt: timestamp,
      })
      .where(eq(seasonalPricing.id, parseInt(ruleId)))
      .returning();

    // Log audit event
    const requestDetails = captureRequestDetails(request);
    await logPropertyAction(
      session.user.id,
      'property.update',
      id,
      property[0].title,
      {
        ruleId: parseInt(ruleId),
        changes: body,
        ...requestDetails,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Seasonal pricing rule updated successfully',
      rule: updated[0],
      timestamp,
    });

  } catch (error) {
    console.error('Error updating seasonal pricing rule:', error);
    return NextResponse.json(
      { error: 'Failed to update seasonal pricing rule' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete seasonal pricing rule
// ============================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; ruleId: string }> }
) {
  try {
    const { id, ruleId } = await params;
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

    // Delete rule
    await db
      .delete(seasonalPricing)
      .where(
        and(
          eq(seasonalPricing.id, parseInt(ruleId)),
          eq(seasonalPricing.propertyId, parseInt(id))
        )
      );

    // Log audit event
    const requestDetails = captureRequestDetails(request);
    await logPropertyAction(
      session.user.id,
      'property.delete',
      id,
      property[0].title,
      {
        ruleId: parseInt(ruleId),
        ...requestDetails,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Seasonal pricing rule deleted successfully',
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error deleting seasonal pricing rule:', error);
    return NextResponse.json(
      { error: 'Failed to delete seasonal pricing rule' },
      { status: 500 }
    );
  }
}
