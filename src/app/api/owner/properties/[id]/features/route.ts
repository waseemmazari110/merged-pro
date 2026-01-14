/**
 * Owner Dashboard - Property Features/Amenities Management
 * 
 * GET /api/owner/properties/[id]/features - List all features
 * POST /api/owner/properties/[id]/features - Add features (single or bulk)
 * DELETE /api/owner/properties/[id]/features/[featureId] - Remove feature
 * 
 * Features include amenities like: WiFi, Pool, Hot Tub, Parking, etc.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyFeatures } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { 
  validateSchema, 
  propertyFeatureSchema, 
  bulkFeaturesSchema 
} from '@/lib/validations/property-validations';
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// GET - List all features for property
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

    // Get all features for this property
    const features = await db
      .select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.propertyId, parseInt(id)));

    return NextResponse.json({
      success: true,
      propertyId: parseInt(id),
      propertyTitle: property[0].title,
      features: features.map(f => ({
        id: f.id,
        name: f.featureName,
        createdAt: f.createdAt,
      })),
      total: features.length,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error fetching property features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Add features (single or bulk)
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
    const timestamp = nowUKFormatted();

    // Check if bulk operation (array of features) or single feature
    if (Array.isArray(body.features)) {
      // Bulk add
      const validation = validateSchema(bulkFeaturesSchema, {
        propertyId: parseInt(id),
        features: body.features,
      });

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', errors: validation.errors },
          { status: 400 }
        );
      }

      // Insert all features
      const featuresToInsert = body.features.map((featureName: string) => ({
        propertyId: parseInt(id),
        featureName,
        createdAt: timestamp,
      }));

      const inserted = await db
        .insert(propertyFeatures)
        .values(featuresToInsert)
        .returning();

      // Log audit event
      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.update',
        id,
        property[0].title,
        {
          featuresAdded: body.features.length,
          features: body.features,
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: `Added ${inserted.length} features`,
        features: inserted.map(f => ({
          id: f.id,
          name: f.featureName,
          createdAt: f.createdAt,
        })),
        timestamp,
      }, { status: 201 });

    } else {
      // Single feature add
      const validation = validateSchema(propertyFeatureSchema, {
        propertyId: parseInt(id),
        featureName: body.featureName,
      });

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', errors: validation.errors },
          { status: 400 }
        );
      }

      const inserted = await db
        .insert(propertyFeatures)
        .values({
          propertyId: parseInt(id),
          featureName: body.featureName,
          createdAt: timestamp,
        })
        .returning();

      // Log audit event
      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.update',
        id,
        property[0].title,
        {
          featureName: body.featureName,
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Feature added successfully',
        feature: {
          id: inserted[0].id,
          name: inserted[0].featureName,
          createdAt: inserted[0].createdAt,
        },
        timestamp,
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error adding property features:', error);
    return NextResponse.json(
      { error: 'Failed to add features' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Remove all features for property
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

    // Get feature IDs to delete from query string
    const { searchParams } = new URL(request.url);
    const featureId = searchParams.get('featureId');

    if (featureId) {
      // Delete single feature
      await db
        .delete(propertyFeatures)
        .where(
          and(
            eq(propertyFeatures.id, parseInt(featureId)),
            eq(propertyFeatures.propertyId, parseInt(id))
          )
        );

      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.delete',
        id,
        property[0].title,
        {
          featureId: parseInt(featureId),
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Feature deleted successfully',
        timestamp: nowUKFormatted(),
      });
    } else {
      // Delete all features for property
      await db
        .delete(propertyFeatures)
        .where(eq(propertyFeatures.propertyId, parseInt(id)));

      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.delete',
        id,
        property[0].title,
        requestDetails
      );

      return NextResponse.json({
        success: true,
        message: 'All features deleted successfully',
        timestamp: nowUKFormatted(),
      });
    }

  } catch (error) {
    console.error('Error deleting property features:', error);
    return NextResponse.json(
      { error: 'Failed to delete features' },
      { status: 500 }
    );
  }
}
