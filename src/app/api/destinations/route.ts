import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { destinations } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    // Single destination by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json({ 
          error: "Valid ID is required",
          code: "INVALID_ID" 
        }, { status: 400 });
      }

      const destination = await db.select()
        .from(destinations)
        .where(eq(destinations.id, parseInt(id)))
        .limit(1);

      if (destination.length === 0) {
        return NextResponse.json({ 
          error: 'Destination not found',
          code: 'DESTINATION_NOT_FOUND' 
        }, { status: 404 });
      }

      return NextResponse.json(destination[0], { status: 200 });
    }

    // List all destinations with filters
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const region = searchParams.get('region');
    const isPublished = searchParams.get('isPublished');
    const sort = searchParams.get('sort') ?? 'cityName';
    const order = searchParams.get('order') ?? 'asc';

    let query = db.select().from(destinations);

    // Build WHERE conditions
    const conditions = [];

    if (search) {
      conditions.push(
        or(
          like(destinations.cityName, `%${search}%`),
          like(destinations.region, `%${search}%`),
          like(destinations.overview, `%${search}%`)
        )
      );
    }

    if (region) {
      conditions.push(eq(destinations.region, region));
    }

    if (isPublished !== null && isPublished !== undefined) {
      const publishedValue = isPublished === 'true';
      conditions.push(eq(destinations.isPublished, publishedValue));
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }

    // Apply sorting
    const validSortFields = ['cityName', 'region', 'createdAt', 'updatedAt'];
    const sortField = validSortFields.includes(sort) ? sort : 'cityName';
    const sortOrder = order.toLowerCase() === 'desc' ? desc : asc;

    let orderByColumn: any;
    switch (sortField) {
      case 'cityName':
        orderByColumn = destinations.cityName;
        break;
      case 'region':
        orderByColumn = destinations.region;
        break;
      case 'createdAt':
        orderByColumn = destinations.createdAt;
        break;
      case 'updatedAt':
        orderByColumn = destinations.updatedAt;
        break;
      default:
        orderByColumn = destinations.cityName;
    }

    query = query.orderBy(sortOrder(orderByColumn)) as any;

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    return NextResponse.json(results, { status: 200 });
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
    const { cityName, slug, region, overview, heroImage, travelTips, topVenues, mapArea } = body;

    // Validate required fields
    if (!cityName) {
      return NextResponse.json({ 
        error: "cityName is required",
        code: "MISSING_CITY_NAME" 
      }, { status: 400 });
    }

    if (!slug) {
      return NextResponse.json({ 
        error: "slug is required",
        code: "MISSING_SLUG" 
      }, { status: 400 });
    }

    if (!region) {
      return NextResponse.json({ 
        error: "region is required",
        code: "MISSING_REGION" 
      }, { status: 400 });
    }

    if (!overview) {
      return NextResponse.json({ 
        error: "overview is required",
        code: "MISSING_OVERVIEW" 
      }, { status: 400 });
    }

    if (!heroImage) {
      return NextResponse.json({ 
        error: "heroImage is required",
        code: "MISSING_HERO_IMAGE" 
      }, { status: 400 });
    }

    // Check slug uniqueness
    const existingDestination = await db.select()
      .from(destinations)
      .where(eq(destinations.slug, slug.trim()))
      .limit(1);

    if (existingDestination.length > 0) {
      return NextResponse.json({ 
        error: "Destination with this slug already exists",
        code: "DUPLICATE_SLUG" 
      }, { status: 400 });
    }

    // Validate topVenues is valid JSON array if provided
    let parsedTopVenues = null;
    if (topVenues) {
      try {
        parsedTopVenues = typeof topVenues === 'string' ? JSON.parse(topVenues) : topVenues;
        if (!Array.isArray(parsedTopVenues)) {
          return NextResponse.json({ 
            error: "topVenues must be an array",
            code: "INVALID_TOP_VENUES" 
          }, { status: 400 });
        }
      } catch (e) {
        return NextResponse.json({ 
          error: "topVenues must be valid JSON array",
          code: "INVALID_TOP_VENUES_JSON" 
        }, { status: 400 });
      }
    }

    const now = new Date().toISOString();

    const newDestination = await db.insert(destinations)
      .values({
        cityName: cityName.trim(),
        slug: slug.trim(),
        region: region.trim(),
        overview: overview.trim(),
        heroImage: heroImage.trim(),
        travelTips: travelTips ? travelTips.trim() : null,
        topVenues: parsedTopVenues,
        mapArea: mapArea ? mapArea.trim() : null,
        isPublished: true,
        createdAt: now,
        updatedAt: now,
      })
      .returning();

    return NextResponse.json(newDestination[0], { status: 201 });
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

    // Check if destination exists
    const existingDestination = await db.select()
      .from(destinations)
      .where(eq(destinations.id, parseInt(id)))
      .limit(1);

    if (existingDestination.length === 0) {
      return NextResponse.json({ 
        error: 'Destination not found',
        code: 'DESTINATION_NOT_FOUND' 
      }, { status: 404 });
    }

    const body = await request.json();
    const { cityName, slug, region, overview, heroImage, travelTips, topVenues, mapArea, isPublished } = body;

    // Check slug uniqueness if slug is being updated
    if (slug && slug !== existingDestination[0].slug) {
      const duplicateSlug = await db.select()
        .from(destinations)
        .where(eq(destinations.slug, slug.trim()))
        .limit(1);

      if (duplicateSlug.length > 0) {
        return NextResponse.json({ 
          error: "Destination with this slug already exists",
          code: "DUPLICATE_SLUG" 
        }, { status: 400 });
      }
    }

    // Validate topVenues is valid JSON array if provided
    let parsedTopVenues = undefined;
    if (topVenues !== undefined) {
      if (topVenues === null) {
        parsedTopVenues = null;
      } else {
        try {
          parsedTopVenues = typeof topVenues === 'string' ? JSON.parse(topVenues) : topVenues;
          if (!Array.isArray(parsedTopVenues)) {
            return NextResponse.json({ 
              error: "topVenues must be an array",
              code: "INVALID_TOP_VENUES" 
            }, { status: 400 });
          }
        } catch (e) {
          return NextResponse.json({ 
            error: "topVenues must be valid JSON array",
            code: "INVALID_TOP_VENUES_JSON" 
          }, { status: 400 });
        }
      }
    }

    const updates: Record<string, any> = {
      updatedAt: new Date().toISOString(),
    };

    if (cityName !== undefined) updates.cityName = cityName.trim();
    if (slug !== undefined) updates.slug = slug.trim();
    if (region !== undefined) updates.region = region.trim();
    if (overview !== undefined) updates.overview = overview.trim();
    if (heroImage !== undefined) updates.heroImage = heroImage.trim();
    if (travelTips !== undefined) updates.travelTips = travelTips ? travelTips.trim() : null;
    if (topVenues !== undefined) updates.topVenues = parsedTopVenues;
    if (mapArea !== undefined) updates.mapArea = mapArea ? mapArea.trim() : null;
    if (isPublished !== undefined) updates.isPublished = isPublished;

    const updated = await db.update(destinations)
      .set(updates)
      .where(eq(destinations.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0], { status: 200 });
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

    // Check if destination exists
    const existingDestination = await db.select()
      .from(destinations)
      .where(eq(destinations.id, parseInt(id)))
      .limit(1);

    if (existingDestination.length === 0) {
      return NextResponse.json({ 
        error: 'Destination not found',
        code: 'DESTINATION_NOT_FOUND' 
      }, { status: 404 });
    }

    const deleted = await db.delete(destinations)
      .where(eq(destinations.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Destination deleted successfully',
      destination: deleted[0]
    }, { status: 200 });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ 
      error: 'Internal server error: ' + (error as Error).message 
    }, { status: 500 });
  }
}