import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { propertyFeatures, properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get('propertyId');

    if (!propertyId || isNaN(parseInt(propertyId))) {
      return NextResponse.json(
        { 
          error: 'Valid propertyId is required',
          code: 'MISSING_PROPERTY_ID' 
        },
        { status: 400 }
      );
    }

    const features = await db
      .select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.propertyId, parseInt(propertyId)));

    return NextResponse.json(features, { status: 200 });
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { propertyId, featureName } = body;

    // Validate required fields
    if (!propertyId) {
      return NextResponse.json(
        { 
          error: 'propertyId is required',
          code: 'MISSING_PROPERTY_ID' 
        },
        { status: 400 }
      );
    }

    if (!featureName || typeof featureName !== 'string' || featureName.trim() === '') {
      return NextResponse.json(
        { 
          error: 'featureName is required and must be a non-empty string',
          code: 'MISSING_FEATURE_NAME' 
        },
        { status: 400 }
      );
    }

    // Validate propertyId is a valid number
    if (isNaN(parseInt(propertyId))) {
      return NextResponse.json(
        { 
          error: 'propertyId must be a valid number',
          code: 'INVALID_PROPERTY_ID' 
        },
        { status: 400 }
      );
    }

    // Validate property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(propertyId)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { 
          error: 'Property not found',
          code: 'PROPERTY_NOT_FOUND' 
        },
        { status: 400 }
      );
    }

    // Create the feature
    const newFeature = await db
      .insert(propertyFeatures)
      .values({
        propertyId: parseInt(propertyId),
        featureName: featureName.trim(),
        createdAt: new Date().toISOString(),
      })
      .returning();

    return NextResponse.json(newFeature[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { 
          error: 'Valid ID is required',
          code: 'INVALID_ID' 
        },
        { status: 400 }
      );
    }

    // Check if feature exists
    const existingFeature = await db
      .select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.id, parseInt(id)))
      .limit(1);

    if (existingFeature.length === 0) {
      return NextResponse.json(
        { 
          error: 'Feature not found',
          code: 'FEATURE_NOT_FOUND' 
        },
        { status: 404 }
      );
    }

    // Delete the feature
    const deleted = await db
      .delete(propertyFeatures)
      .where(eq(propertyFeatures.id, parseInt(id)))
      .returning();

    return NextResponse.json(
      { 
        message: 'Feature deleted successfully',
        feature: deleted[0] 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}