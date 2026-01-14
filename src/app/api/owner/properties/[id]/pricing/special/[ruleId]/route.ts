/**
 * Owner Dashboard - Special Date Pricing Management
 * 
 * POST /api/owner/properties/[id]/pricing/special - Create special date pricing
 * PUT /api/owner/properties/[id]/pricing/special/[ruleId] - Update special date pricing
 * DELETE /api/owner/properties/[id]/pricing/special/[ruleId] - Delete special date pricing
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, specialDatePricing } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { 
  validateSchema, 
  specialDatePricingSchema,
  validateDateRange
} from '@/lib/validations/property-validations';
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// POST - Create special date pricing
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
    const validation = validateSchema(specialDatePricingSchema, {
      ...body,
      propertyId: parseInt(id),
    });

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Validation failed', errors: validation.errors },
        { status: 400 }
      );
    }

    // Validate date range if endDate provided
    if (body.endDate) {
      const dateValidation = validateDateRange(body.date, body.endDate);
      if (!dateValidation.valid) {
        return NextResponse.json(
          { error: dateValidation.message },
          { status: 400 }
        );
      }
    }

    const timestamp = nowUKFormatted();

    // Create special date pricing
    const inserted = await db
      .insert(specialDatePricing)
      .values({
        propertyId: parseInt(id),
        name: body.name,
        date: body.date,
        endDate: body.endDate || null,
        pricePerNight: body.pricePerNight,
        minimumStay: body.minimumStay || null,
        isAvailable: body.isAvailable !== undefined ? body.isAvailable : true,
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
        date: body.date,
        pricePerNight: body.pricePerNight,
        ...requestDetails,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Special date pricing created successfully',
      rule: {
        id: inserted[0].id,
        name: inserted[0].name,
        date: inserted[0].date,
        endDate: inserted[0].endDate,
        pricePerNight: inserted[0].pricePerNight,
        minimumStay: inserted[0].minimumStay,
        isAvailable: inserted[0].isAvailable,
        createdAt: inserted[0].createdAt,
        updatedAt: inserted[0].updatedAt,
      },
      timestamp,
    }, { status: 201 });

  } catch (error) {
    console.error('Error creating special date pricing:', error);
    return NextResponse.json(
      { error: 'Failed to create special date pricing' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update special date pricing
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
      .from(specialDatePricing)
      .where(
        and(
          eq(specialDatePricing.id, parseInt(ruleId)),
          eq(specialDatePricing.propertyId, parseInt(id))
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
    if ((body.date || body.endDate) && body.endDate) {
      const date = body.date || existingRule[0].date;
      const endDate = body.endDate;
      
      const dateValidation = validateDateRange(date, endDate);
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
      .update(specialDatePricing)
      .set({
        ...body,
        updatedAt: timestamp,
      })
      .where(eq(specialDatePricing.id, parseInt(ruleId)))
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
      message: 'Special date pricing updated successfully',
      rule: updated[0],
      timestamp,
    });

  } catch (error) {
    console.error('Error updating special date pricing:', error);
    return NextResponse.json(
      { error: 'Failed to update special date pricing' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete special date pricing
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
      .delete(specialDatePricing)
      .where(
        and(
          eq(specialDatePricing.id, parseInt(ruleId)),
          eq(specialDatePricing.propertyId, parseInt(id))
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
      message: 'Special date pricing deleted successfully',
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error deleting special date pricing:', error);
    return NextResponse.json(
      { error: 'Failed to delete special date pricing' },
      { status: 500 }
    );
  }
}
