/**
 * Owner Dashboard - Single Property Management
 * 
 * GET /api/owner/properties/[id] - Get property details
 * PUT /api/owner/properties/[id] - Update property
 * DELETE /api/owner/properties/[id] - Delete property
 * 
 * All operations include audit logging with UK timestamps.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// GET - Fetch single property
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

    // Fetch property and verify ownership
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
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      property: property[0],
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error fetching property:', error);
    return NextResponse.json(
      { error: 'Failed to fetch property' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update property
// ============================================

export async function PUT(
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

    // Verify ownership
    const existing = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.id, parseInt(id)),
          eq(properties.ownerId, session.user.id)
        )
      )
      .limit(1);

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const {
      title,
      location,
      region,
      sleepsMin,
      sleepsMax,
      bedrooms,
      bathrooms,
      priceFromMidweek,
      priceFromWeekend,
      description,
      heroImage,
      isPublished,
    } = body;

    const timestamp = nowUKFormatted();

    // Track changes for audit log
    const changes: Record<string, any> = {};
    const oldProperty = existing[0];

    if (title && title !== oldProperty.title) changes.title = { old: oldProperty.title, new: title };
    if (bedrooms !== undefined && bedrooms !== oldProperty.bedrooms) changes.bedrooms = { old: oldProperty.bedrooms, new: bedrooms };
    if (priceFromMidweek !== undefined && priceFromMidweek !== oldProperty.priceFromMidweek) changes.priceFromMidweek = { old: oldProperty.priceFromMidweek, new: priceFromMidweek };

    // Update property
    // If property is being updated, reset status to pending for re-approval
    const needsReapproval = Boolean(
      title || description || sleepsMin !== undefined || 
      sleepsMax !== undefined || priceFromMidweek !== undefined
    );
    
    const updated = await db
      .update(properties)
      .set({
        ...(title && { title, slug: title.toLowerCase().replace(/\s+/g, '-') }),
        ...(location && { location }),
        ...(region && { region }),
        ...(sleepsMin !== undefined && { sleepsMin }),
        ...(sleepsMax !== undefined && { sleepsMax }),
        ...(bedrooms !== undefined && { bedrooms }),
        ...(bathrooms !== undefined && { bathrooms }),
        ...(priceFromMidweek !== undefined && { priceFromMidweek }),
        ...(priceFromWeekend !== undefined && { priceFromWeekend }),
        ...(description && { description }),
        ...(heroImage && { heroImage }),
        ...(isPublished !== undefined && { isPublished }),
        // Reset to pending if significant changes made
        ...(needsReapproval && oldProperty.status === 'approved' && { 
          status: 'pending',
          approvedBy: null,
          approvedAt: null,
        }),
        updatedAt: timestamp,
      })
      .where(
        and(
          eq(properties.id, parseInt(id)),
          eq(properties.ownerId, session.user.id)
        )
      )
      .returning();

    // Log audit event
    const requestDetails = captureRequestDetails(request);
    await logPropertyAction(
      session.user.id,
      'property.update',
      id,
      title || oldProperty.title,
      { changes, ...requestDetails }
    );

    // Log publish/unpublish separately if changed
    if (isPublished !== undefined && isPublished !== oldProperty.isPublished) {
      await logPropertyAction(
        session.user.id,
        isPublished ? 'property.publish' : 'property.unpublish',
        id,
        title || oldProperty.title,
        requestDetails
      );
    }

    return NextResponse.json({
      success: true,
      property: updated[0],
      timestamp,
    });

  } catch (error) {
    console.error('Error updating property:', error);
    return NextResponse.json(
      { error: 'Failed to update property' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Delete property
// ============================================

export async function DELETE(
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

    // Verify ownership
    const existing = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.id, parseInt(id)),
          eq(properties.ownerId, session.user.id)
        )
      )
      .limit(1);

    if (!existing || existing.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Delete property
    await db
      .delete(properties)
      .where(
        and(
          eq(properties.id, parseInt(id)),
          eq(properties.ownerId, session.user.id)
        )
      );

    // Log audit event
    const requestDetails = captureRequestDetails(request);
    await logPropertyAction(
      session.user.id,
      'property.delete',
      id,
      existing[0].title,
      requestDetails
    );

    return NextResponse.json({
      success: true,
      message: 'Property deleted successfully',
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error deleting property:', error);
    return NextResponse.json(
      { error: 'Failed to delete property' },
      { status: 500 }
    );
  }
}
