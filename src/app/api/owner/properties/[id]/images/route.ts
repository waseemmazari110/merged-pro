/**
 * Owner Dashboard - Property Images Management
 * 
 * GET /api/owner/properties/[id]/images - List all images
 * POST /api/owner/properties/[id]/images - Add images (single or bulk)
 * PUT /api/owner/properties/[id]/images - Update image or reorder
 * DELETE /api/owner/properties/[id]/images - Remove image(s)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages } from '@/db/schema';
import { eq, and, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { 
  validateSchema, 
  propertyImageSchema, 
  bulkImagesSchema,
  reorderImagesSchema 
} from '@/lib/validations/property-validations';
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// GET - List all images for property
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

    // Get all images for this property, ordered by orderIndex
    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, parseInt(id)))
      .orderBy(propertyImages.orderIndex);

    return NextResponse.json({
      success: true,
      propertyId: parseInt(id),
      propertyTitle: property[0].title,
      heroImage: property[0].heroImage,
      images: images.map(img => ({
        id: img.id,
        url: img.imageURL,
        caption: img.caption,
        order: img.orderIndex,
        createdAt: img.createdAt,
      })),
      total: images.length,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error fetching property images:', error);
    return NextResponse.json(
      { error: 'Failed to fetch images' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Add images (single or bulk)
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

    // Check if bulk operation (array of images) or single image
    if (Array.isArray(body.images)) {
      // Bulk add
      const validation = validateSchema(bulkImagesSchema, {
        propertyId: parseInt(id),
        images: body.images,
      });

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', errors: validation.errors },
          { status: 400 }
        );
      }

      // Get current max order index
      const existingImages = await db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, parseInt(id)));

      let maxOrder = 0;
      if (existingImages.length > 0) {
        maxOrder = Math.max(...existingImages.map(img => img.orderIndex || 0));
      }

      // Insert all images
      const imagesToInsert = body.images.map((img: any, index: number) => ({
        propertyId: parseInt(id),
        imageURL: img.imageURL,
        caption: img.caption || null,
        orderIndex: img.orderIndex !== undefined ? img.orderIndex : maxOrder + index + 1,
        createdAt: timestamp,
      }));

      const inserted = await db
        .insert(propertyImages)
        .values(imagesToInsert)
        .returning();

      // Log audit event
      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.update',
        id,
        property[0].title,
        {
          imagesAdded: inserted.length,
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: `Added ${inserted.length} images`,
        images: inserted.map(img => ({
          id: img.id,
          url: img.imageURL,
          caption: img.caption,
          order: img.orderIndex,
          createdAt: img.createdAt,
        })),
        timestamp,
      }, { status: 201 });

    } else {
      // Single image add
      const validation = validateSchema(propertyImageSchema, {
        propertyId: parseInt(id),
        imageURL: body.imageURL,
        caption: body.caption,
        orderIndex: body.orderIndex,
      });

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', errors: validation.errors },
          { status: 400 }
        );
      }

      // Get current max order index if not specified
      let orderIndex = body.orderIndex;
      if (orderIndex === undefined) {
        const existingImages = await db
          .select()
          .from(propertyImages)
          .where(eq(propertyImages.propertyId, parseInt(id)));

        orderIndex = existingImages.length > 0 
          ? Math.max(...existingImages.map(img => img.orderIndex || 0)) + 1 
          : 0;
      }

      const inserted = await db
        .insert(propertyImages)
        .values({
          propertyId: parseInt(id),
          imageURL: body.imageURL,
          caption: body.caption || null,
          orderIndex,
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
          imageId: inserted[0].id,
          imageURL: body.imageURL,
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Image added successfully',
        image: {
          id: inserted[0].id,
          url: inserted[0].imageURL,
          caption: inserted[0].caption,
          order: inserted[0].orderIndex,
          createdAt: inserted[0].createdAt,
        },
        timestamp,
      }, { status: 201 });
    }

  } catch (error) {
    console.error('Error adding property images:', error);
    return NextResponse.json(
      { error: 'Failed to add images' },
      { status: 500 }
    );
  }
}

// ============================================
// PUT - Update image or reorder images
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
    const { action } = body;

    if (action === 'reorder') {
      // Reorder images
      const validation = validateSchema(reorderImagesSchema, {
        propertyId: parseInt(id),
        imageIds: body.imageIds,
      });

      if (!validation.success) {
        return NextResponse.json(
          { error: 'Validation failed', errors: validation.errors },
          { status: 400 }
        );
      }

      // Update order index for each image
      for (let i = 0; i < body.imageIds.length; i++) {
        await db
          .update(propertyImages)
          .set({ orderIndex: i })
          .where(
            and(
              eq(propertyImages.id, body.imageIds[i]),
              eq(propertyImages.propertyId, parseInt(id))
            )
          );
      }

      // Log audit event
      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.update',
        id,
        property[0].title,
        {
          newOrder: body.imageIds,
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Images reordered successfully',
        timestamp: nowUKFormatted(),
      });

    } else {
      // Update single image (caption)
      const { imageId, caption } = body;

      if (!imageId) {
        return NextResponse.json(
          { error: 'imageId is required' },
          { status: 400 }
        );
      }

      await db
        .update(propertyImages)
        .set({ caption })
        .where(
          and(
            eq(propertyImages.id, imageId),
            eq(propertyImages.propertyId, parseInt(id))
          )
        );

      // Log audit event
      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.update',
        id,
        property[0].title,
        {
          imageId,
          caption,
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Image updated successfully',
        timestamp: nowUKFormatted(),
      });
    }

  } catch (error) {
    console.error('Error updating property images:', error);
    return NextResponse.json(
      { error: 'Failed to update images' },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE - Remove image(s)
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

    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get('imageId');
    const imageIds = searchParams.get('imageIds'); // Comma-separated list

    if (imageIds) {
      // Delete multiple images
      const idsArray = imageIds.split(',').map(id => parseInt(id));
      
      await db
        .delete(propertyImages)
        .where(
          and(
            inArray(propertyImages.id, idsArray),
            eq(propertyImages.propertyId, parseInt(id))
          )
        );

      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.delete',
        id,
        property[0].title,
        {
          imageIds: idsArray,
          count: idsArray.length,
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: `Deleted ${idsArray.length} images`,
        timestamp: nowUKFormatted(),
      });

    } else if (imageId) {
      // Delete single image
      await db
        .delete(propertyImages)
        .where(
          and(
            eq(propertyImages.id, parseInt(imageId)),
            eq(propertyImages.propertyId, parseInt(id))
          )
        );

      const requestDetails = captureRequestDetails(request);
      await logPropertyAction(
        session.user.id,
        'property.delete',
        id,
        property[0].title,
        {
          imageId: parseInt(imageId),
          ...requestDetails,
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Image deleted successfully',
        timestamp: nowUKFormatted(),
      });

    } else {
      return NextResponse.json(
        { error: 'imageId or imageIds parameter is required' },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error('Error deleting property images:', error);
    return NextResponse.json(
      { error: 'Failed to delete images' },
      { status: 500 }
    );
  }
}
