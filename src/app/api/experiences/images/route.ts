import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { experienceImages, experiences } from '@/db/schema';
import { eq, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const experienceId = searchParams.get('experienceId');

    if (!experienceId || isNaN(parseInt(experienceId))) {
      return NextResponse.json({ 
        error: 'Valid experienceId is required',
        code: 'MISSING_EXPERIENCE_ID' 
      }, { status: 400 });
    }

    const images = await db.select()
      .from(experienceImages)
      .where(eq(experienceImages.experienceId, parseInt(experienceId)))
      .orderBy(asc(experienceImages.orderIndex));

    return NextResponse.json(images, { status: 200 });
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
    const { experienceId, imageURL, orderIndex } = body;

    if (!experienceId) {
      return NextResponse.json({ 
        error: 'experienceId is required',
        code: 'MISSING_EXPERIENCE_ID' 
      }, { status: 400 });
    }

    if (isNaN(parseInt(experienceId))) {
      return NextResponse.json({ 
        error: 'Valid experienceId is required',
        code: 'INVALID_EXPERIENCE_ID' 
      }, { status: 400 });
    }

    if (!imageURL) {
      return NextResponse.json({ 
        error: 'imageURL is required',
        code: 'MISSING_IMAGE_URL' 
      }, { status: 400 });
    }

    if (typeof imageURL !== 'string' || imageURL.trim() === '') {
      return NextResponse.json({ 
        error: 'imageURL must be a non-empty string',
        code: 'INVALID_IMAGE_URL' 
      }, { status: 400 });
    }

    const existingExperience = await db.select()
      .from(experiences)
      .where(eq(experiences.id, parseInt(experienceId)))
      .limit(1);

    if (existingExperience.length === 0) {
      return NextResponse.json({ 
        error: 'Experience not found',
        code: 'EXPERIENCE_NOT_FOUND' 
      }, { status: 400 });
    }

    const newImage = await db.insert(experienceImages)
      .values({
        experienceId: parseInt(experienceId),
        imageURL: imageURL.trim(),
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
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json({ 
        error: 'Valid ID is required',
        code: 'INVALID_ID' 
      }, { status: 400 });
    }

    const body = await request.json();
    const { imageURL, orderIndex } = body;

    const existingImage = await db.select()
      .from(experienceImages)
      .where(eq(experienceImages.id, parseInt(id)))
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

    if (orderIndex !== undefined) {
      if (isNaN(parseInt(orderIndex))) {
        return NextResponse.json({ 
          error: 'orderIndex must be a valid number',
          code: 'INVALID_ORDER_INDEX' 
        }, { status: 400 });
      }
      updates.orderIndex = parseInt(orderIndex);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json(existingImage[0], { status: 200 });
    }

    const updatedImage = await db.update(experienceImages)
      .set(updates)
      .where(eq(experienceImages.id, parseInt(id)))
      .returning();

    return NextResponse.json(updatedImage[0], { status: 200 });
  } catch (error) {
    console.error('PUT error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
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

    const existingImage = await db.select()
      .from(experienceImages)
      .where(eq(experienceImages.id, parseInt(id)))
      .limit(1);

    if (existingImage.length === 0) {
      return NextResponse.json({ 
        error: 'Image not found',
        code: 'IMAGE_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(experienceImages)
      .where(eq(experienceImages.id, parseInt(id)))
      .returning();

    return NextResponse.json({ 
      message: 'Image deleted successfully',
      deletedImage: deleted[0] 
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}