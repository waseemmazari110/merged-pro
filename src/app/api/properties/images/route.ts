import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { propertyImages, properties } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const propertyId = searchParams.get('propertyId');

    if (!propertyId) {
      return NextResponse.json({ 
        error: 'propertyId is required',
        code: 'MISSING_PROPERTY_ID' 
      }, { status: 400 });
    }

    const propertyIdInt = parseInt(propertyId);
    if (isNaN(propertyIdInt)) {
      return NextResponse.json({ 
        error: 'Valid propertyId is required',
        code: 'INVALID_PROPERTY_ID' 
      }, { status: 400 });
    }

    const images = await db.select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, propertyIdInt))
      .orderBy(asc(propertyImages.orderIndex));

    return NextResponse.json(images, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, imageURL, caption, orderIndex } = body;

    if (!propertyId) {
      return NextResponse.json({ 
        error: 'propertyId is required',
        code: 'MISSING_PROPERTY_ID' 
      }, { status: 400 });
    }

    if (!imageURL || typeof imageURL !== 'string' || imageURL.trim() === '') {
      return NextResponse.json({ 
        error: 'imageURL is required and must be a non-empty string',
        code: 'MISSING_IMAGE_URL' 
      }, { status: 400 });
    }

    const propertyIdInt = parseInt(propertyId);
    if (isNaN(propertyIdInt)) {
      return NextResponse.json({ 
        error: 'Valid propertyId is required',
        code: 'INVALID_PROPERTY_ID' 
      }, { status: 400 });
    }

    // Validate that the property exists
    const property = await db.select()
      .from(properties)
      .where(eq(properties.id, propertyIdInt))
      .limit(1);

    if (property.length === 0) {
      return NextResponse.json({ 
        error: 'Property not found',
        code: 'PROPERTY_NOT_FOUND' 
      }, { status: 400 });
    }

    const newImage = await db.insert(propertyImages)
      .values({
        propertyId: propertyIdInt,
        imageURL: imageURL.trim(),
        caption: caption ? caption.trim() : null,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newImage[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const imageId = parseInt(id);
    const body = await request.json();
    const { imageURL, caption, orderIndex } = body;

    // Check if record exists
    const existingImage = await db.select()
      .from(propertyImages)
      .where(eq(propertyImages.id, imageId))
      .limit(1);

    if (existingImage.length === 0) {
      return NextResponse.json({ 
        error: 'Image not found',
        code: 'IMAGE_NOT_FOUND' 
      }, { status: 404 });
    }

    const updates: Record<string, any> = {};

    if (imageURL !== undefined) {
      if (typeof imageURL !== 'string' || imageURL.trim() === '') {
        return NextResponse.json({ 
          error: 'imageURL must be a non-empty string',
          code: 'INVALID_IMAGE_URL' 
        }, { status: 400 });
      }
      updates.imageURL = imageURL.trim();
    }

    if (caption !== undefined) {
      updates.caption = caption ? caption.trim() : null;
    }

    if (orderIndex !== undefined) {
      const orderIndexInt = parseInt(orderIndex);
      if (isNaN(orderIndexInt)) {
        return NextResponse.json({ 
          error: 'orderIndex must be a valid integer',
          code: 'INVALID_ORDER_INDEX' 
        }, { status: 400 });
      }
      updates.orderIndex = orderIndexInt;
    }

    const updatedImage = await db.update(propertyImages)
      .set(updates)
      .where(eq(propertyImages.id, imageId))
      .returning();

    return NextResponse.json(updatedImage[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const imageId = parseInt(id);

    // Check if record exists
    const existingImage = await db.select()
      .from(propertyImages)
      .where(eq(propertyImages.id, imageId))
      .limit(1);

    if (existingImage.length === 0) {
      return NextResponse.json({ 
        error: 'Image not found',
        code: 'IMAGE_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(propertyImages)
      .where(eq(propertyImages.id, imageId))
      .returning();

    return NextResponse.json({ 
      message: 'Image deleted successfully',
      deleted: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error instanceof Error ? error.message : 'Unknown error')
    }, { status: 500 });
  }
}