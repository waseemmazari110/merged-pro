import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { destinationImages, destinations } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const destinationId = searchParams.get('destinationId');

    if (!destinationId) {
      return NextResponse.json({ 
        error: "destinationId is required",
        code: "MISSING_DESTINATION_ID" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(destinationId))) {
      return NextResponse.json({ 
        error: "Valid destinationId is required",
        code: "INVALID_DESTINATION_ID" 
      }, { status: 400 });
    }

    const images = await db.select()
      .from(destinationImages)
      .where(eq(destinationImages.destinationId, parseInt(destinationId)))
      .orderBy(asc(destinationImages.orderIndex));

    return NextResponse.json(images);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { destinationId, imageURL, caption, orderIndex } = body;

    if (!destinationId) {
      return NextResponse.json({ 
        error: "destinationId is required",
        code: "MISSING_DESTINATION_ID" 
      }, { status: 400 });
    }

    if (!imageURL) {
      return NextResponse.json({ 
        error: "imageURL is required",
        code: "MISSING_IMAGE_URL" 
      }, { status: 400 });
    }

    if (typeof imageURL !== 'string' || imageURL.trim() === '') {
      return NextResponse.json({ 
        error: "imageURL must be a non-empty string",
        code: "INVALID_IMAGE_URL" 
      }, { status: 400 });
    }

    if (isNaN(parseInt(destinationId))) {
      return NextResponse.json({ 
        error: "Valid destinationId is required",
        code: "INVALID_DESTINATION_ID" 
      }, { status: 400 });
    }

    const destination = await db.select()
      .from(destinations)
      .where(eq(destinations.id, parseInt(destinationId)))
      .limit(1);

    if (destination.length === 0) {
      return NextResponse.json({ 
        error: "Destination not found",
        code: "DESTINATION_NOT_FOUND" 
      }, { status: 400 });
    }

    const newImage = await db.insert(destinationImages)
      .values({
        destinationId: parseInt(destinationId),
        imageURL: imageURL.trim(),
        caption: caption?.trim() || null,
        orderIndex: orderIndex !== undefined ? parseInt(orderIndex) : 0,
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newImage[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const body = await request.json();
    const { imageURL, caption, orderIndex } = body;

    const existing = await db.select()
      .from(destinationImages)
      .where(eq(destinationImages.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Image not found',
        code: 'IMAGE_NOT_FOUND' 
      }, { status: 404 });
    }

    const updates: {
      imageURL?: string;
      caption?: string | null;
      orderIndex?: number;
    } = {};

    if (imageURL !== undefined) {
      if (typeof imageURL !== 'string' || imageURL.trim() === '') {
        return NextResponse.json({ 
          error: "imageURL must be a non-empty string",
          code: "INVALID_IMAGE_URL" 
        }, { status: 400 });
      }
      updates.imageURL = imageURL.trim();
    }

    if (caption !== undefined) {
      updates.caption = caption ? caption.trim() : null;
    }

    if (orderIndex !== undefined) {
      updates.orderIndex = parseInt(orderIndex);
    }

    const updated = await db.update(destinationImages)
      .set(updates)
      .where(eq(destinationImages.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: "Valid ID is required",
        code: "INVALID_ID" 
      }, { status: 400 });
    }

    const existing = await db.select()
      .from(destinationImages)
      .where(eq(destinationImages.id, parseInt(id)))
      .limit(1);

    if (existing.length === 0) {
      return NextResponse.json({ 
        error: 'Image not found',
        code: 'IMAGE_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(destinationImages)
      .where(eq(destinationImages.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Image deleted successfully',
      image: deleted[0]
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}