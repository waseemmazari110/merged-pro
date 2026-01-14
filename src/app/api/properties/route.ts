import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, like, and, or, desc, asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// Placeholder image for invalid URLs
const PLACEHOLDER_IMAGE = 'https://slelguoygbfzlpylpxfs.supabase.co/storage/v1/object/public/project-uploads/8330e9be-5e47-4f2b-bda0-4162d899b6d9/generated_images/elegant-luxury-property-placeholder-imag-83731ee8-20251207154036.jpg';

// Server-side image validation function
function validateImageUrl(url: string, propertyTitle: string): string {
  if (!url || url === '/placeholder-property.jpg') {
    return PLACEHOLDER_IMAGE;
  }
  
  // CRITICAL: Block ALL Google Images URLs (they're temporary and cause config issues)
  if (url.includes('gstatic.com') || url.includes('google.com/images') || url.includes('googleusercontent.com')) {
    console.warn(`[API] Google Images URL detected for property "${propertyTitle}" - using placeholder:`, url);
    return PLACEHOLDER_IMAGE;
  }
  
  // Block other problematic domains
  if (url.includes('propertista.co.uk') || url.includes('londonbay.com')) {
    console.warn(`[API] Webpage URL detected for property "${propertyTitle}" - using placeholder:`, url);
    return PLACEHOLDER_IMAGE;
  }
  
  // Check if it's a valid image URL (must end with image extension or be from known image CDN)
  const hasImageExtension = /\.(jpg|jpeg|png|webp|avif|gif)(\?.*)?$/i.test(url);
  const isImageCDN = 
    url.includes('supabase.co/storage') ||
    url.includes('unsplash.com') ||
    url.includes('fal.media');
  
  // If URL doesn't have image extension and isn't from known CDN, use placeholder
  if (!hasImageExtension && !isImageCDN) {
    console.warn(`[API] Invalid image URL detected for property "${propertyTitle}":`, url);
    return PLACEHOLDER_IMAGE;
  }
  
  return url;
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    const ownerId = searchParams.get('ownerId');
    const includeUnpublished = searchParams.get('includeUnpublished') === 'true';

    // Single property by ID
    if (id) {
      if (!id || isNaN(parseInt(id))) {
        return NextResponse.json(
          { error: 'Valid ID is required', code: 'INVALID_ID' },
          { status: 400 }
        );
      }

      const property = await db
        .select()
        .from(properties)
        .where(eq(properties.id, parseInt(id)))
        .limit(1);

      if (property.length === 0) {
        return NextResponse.json(
          { error: 'Property not found', code: 'NOT_FOUND' },
          { status: 404 }
        );
      }

      // Validate and fix image URL
      const validatedProperty = {
        ...property[0],
        heroImage: validateImageUrl(property[0].heroImage, property[0].title),
      };

      return NextResponse.json(validatedProperty);
    }

    // List properties with pagination, search, filters, and sorting
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '20'), 100);
    const offset = parseInt(searchParams.get('offset') ?? '0');
    const search = searchParams.get('search');
    const region = searchParams.get('region');
    const featured = searchParams.get('featured');
    const isPublished = searchParams.get('isPublished');
    const sortField = searchParams.get('sort') ?? 'createdAt';
    const sortOrder = searchParams.get('order') ?? 'desc';

    let query: any = db.select().from(properties);

    // Build where conditions
    const conditions: any[] = [];

    if (ownerId) {
      conditions.push(eq(properties.ownerId, ownerId));
    } else if (!includeUnpublished) {
      conditions.push(eq(properties.isPublished, true));
      conditions.push(eq(properties.status, 'Active'));
    }

    // Search condition
    if (search) {
      conditions.push(
        or(
          like(properties.title, `%${search}%`),
          like(properties.location, `%${search}%`),
          like(properties.region, `%${search}%`)
        )
      );
    }

    // Filter conditions
    if (region) {
      conditions.push(eq(properties.region, region));
    }

    if (featured !== null && featured !== undefined) {
      const featuredBool = featured === 'true';
      conditions.push(eq(properties.featured, featuredBool));
    }

    if (isPublished !== null && isPublished !== undefined) {
      const isPublishedBool = isPublished === 'true';
      conditions.push(eq(properties.isPublished, isPublishedBool));
    }

    // Apply conditions
    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Apply sorting
    const sortColumn = {
      title: properties.title,
      location: properties.location,
      region: properties.region,
      createdAt: properties.createdAt,
      updatedAt: properties.updatedAt,
      priceFromMidweek: properties.priceFromMidweek,
      priceFromWeekend: properties.priceFromWeekend,
    }[sortField] ?? properties.createdAt;

    if (sortOrder === 'asc') {
      query = query.orderBy(asc(sortColumn));
    } else {
      query = query.orderBy(desc(sortColumn));
    }

    // Apply pagination
    const results = await query.limit(limit).offset(offset);

    // Validate and fix image URLs for all properties
    const validatedResults = results.map((property: any) => ({
      ...property,
      heroImage: validateImageUrl(property.heroImage, property.title),
    }));

    return NextResponse.json(validatedResults);
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
    const session = await auth.api.getSession({ headers: await headers() });
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title',
      'slug',
      'location',
      'region',
      'sleepsMin',
      'sleepsMax',
      'bedrooms',
      'bathrooms',
      'priceFromMidweek',
      'priceFromWeekend',
      'description',
      'heroImage',
    ];

    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          {
            error: `Required field '${field}' is missing`,
            code: 'MISSING_REQUIRED_FIELD',
          },
          { status: 400 }
        );
      }
    }

    // Validate numeric fields
    if (body.sleepsMax < body.sleepsMin) {
      return NextResponse.json(
        {
          error: 'sleepsMax must be greater than or equal to sleepsMin',
          code: 'INVALID_SLEEPS_RANGE',
        },
        { status: 400 }
      );
    }

    if (body.priceFromMidweek <= 0 || body.priceFromWeekend <= 0) {
      return NextResponse.json(
        {
          error: 'Prices must be positive values',
          code: 'INVALID_PRICE',
        },
        { status: 400 }
      );
    }

    if (body.bedrooms < 0 || body.bathrooms < 0) {
      return NextResponse.json(
        {
          error: 'Bedrooms and bathrooms must be non-negative',
          code: 'INVALID_ROOM_COUNT',
        },
        { status: 400 }
      );
    }

    // Check slug uniqueness
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.slug, body.slug.trim()))
      .limit(1);

    if (existingProperty.length > 0) {
      return NextResponse.json(
        {
          error: 'Slug already exists',
          code: 'DUPLICATE_SLUG',
        },
        { status: 400 }
      );
    }

    // Sanitize and prepare data
    const now = new Date().toISOString();
    const propertyData = {
      ownerId: session?.user?.id || null,
      title: body.title.trim(),
      slug: body.slug.trim(),
      location: body.location.trim(),
      region: body.region.trim(),
      sleepsMin: parseInt(body.sleepsMin),
      sleepsMax: parseInt(body.sleepsMax),
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      priceFromMidweek: parseFloat(body.priceFromMidweek),
      priceFromWeekend: parseFloat(body.priceFromWeekend),
      description: body.description.trim(),
      houseRules: body.houseRules?.trim() || null,
      checkInOut: body.checkInOut?.trim() || null,
      iCalURL: body.iCalURL?.trim() || null,
      heroImage: body.heroImage.trim(),
      heroVideo: body.heroVideo?.trim() || null,
      floorplanURL: body.floorplanURL?.trim() || null,
      mapLat: body.mapLat !== undefined ? parseFloat(body.mapLat) : null,
      mapLng: body.mapLng !== undefined ? parseFloat(body.mapLng) : null,
      ownerContact: body.ownerContact?.trim() || null,
      featured: body.featured ?? false,
      isPublished: false, // Default to unpublished until paid
      status: 'pending',
      createdAt: now,
      updatedAt: now,
    };

    const newProperty = await db
      .insert(properties)
      .values(propertyData)
      .returning();

    return NextResponse.json(newProperty[0], { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}


export async function PUT(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id || isNaN(parseInt(id))) {
      return NextResponse.json(
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Validate numeric constraints if provided
    if (body.sleepsMin !== undefined && body.sleepsMax !== undefined) {
      if (body.sleepsMax < body.sleepsMin) {
        return NextResponse.json(
          {
            error: 'sleepsMax must be greater than or equal to sleepsMin',
            code: 'INVALID_SLEEPS_RANGE',
          },
          { status: 400 }
        );
      }
    }

    if (body.priceFromMidweek !== undefined && body.priceFromMidweek <= 0) {
      return NextResponse.json(
        {
          error: 'priceFromMidweek must be a positive value',
          code: 'INVALID_PRICE',
        },
        { status: 400 }
      );
    }

    if (body.priceFromWeekend !== undefined && body.priceFromWeekend <= 0) {
      return NextResponse.json(
        {
          error: 'priceFromWeekend must be a positive value',
          code: 'INVALID_PRICE',
        },
        { status: 400 }
      );
    }

    if (body.bedrooms !== undefined && body.bedrooms < 0) {
      return NextResponse.json(
        {
          error: 'Bedrooms must be non-negative',
          code: 'INVALID_ROOM_COUNT',
        },
        { status: 400 }
      );
    }

    if (body.bathrooms !== undefined && body.bathrooms < 0) {
      return NextResponse.json(
        {
          error: 'Bathrooms must be non-negative',
          code: 'INVALID_ROOM_COUNT',
        },
        { status: 400 }
      );
    }

    // Check slug uniqueness if provided
    if (body.slug) {
      const slugCheck = await db
        .select()
        .from(properties)
        .where(eq(properties.slug, body.slug.trim()))
        .limit(1);

      if (slugCheck.length > 0 && slugCheck[0].id !== parseInt(id)) {
        return NextResponse.json(
          {
            error: 'Slug already exists',
            code: 'DUPLICATE_SLUG',
          },
          { status: 400 }
        );
      }
    }

    // Build update object
    const updates: any = {
      updatedAt: new Date().toISOString(),
    };

    // Log admin overrides
    const session = await auth.api.getSession({ headers: await headers() });
    if (session?.user?.role === 'admin' && body.status && body.status !== existingProperty[0].status) {
      console.log(`[ADMIN OVERRIDE] User ${session.user.email} changed property ${id} status from ${existingProperty[0].status} to ${body.status}`);
      // In a real app, we might store this in an audit_logs table.
    }

    if (body.title !== undefined) updates.title = body.title.trim();
    if (body.slug !== undefined) updates.slug = body.slug.trim();
    if (body.location !== undefined) updates.location = body.location.trim();
    if (body.region !== undefined) updates.region = body.region.trim();
    if (body.sleepsMin !== undefined) updates.sleepsMin = parseInt(body.sleepsMin);
    if (body.sleepsMax !== undefined) updates.sleepsMax = parseInt(body.sleepsMax);
    if (body.bedrooms !== undefined) updates.bedrooms = parseInt(body.bedrooms);
    if (body.bathrooms !== undefined) updates.bathrooms = parseInt(body.bathrooms);
    if (body.priceFromMidweek !== undefined) updates.priceFromMidweek = parseFloat(body.priceFromMidweek);
    if (body.priceFromWeekend !== undefined) updates.priceFromWeekend = parseFloat(body.priceFromWeekend);
    if (body.description !== undefined) updates.description = body.description.trim();
    if (body.houseRules !== undefined) updates.houseRules = body.houseRules?.trim() || null;
    if (body.checkInOut !== undefined) updates.checkInOut = body.checkInOut?.trim() || null;
    if (body.iCalURL !== undefined) updates.iCalURL = body.iCalURL?.trim() || null;
    if (body.heroImage !== undefined) updates.heroImage = body.heroImage.trim();
    if (body.heroVideo !== undefined) updates.heroVideo = body.heroVideo?.trim() || null;
    if (body.floorplanURL !== undefined) updates.floorplanURL = body.floorplanURL?.trim() || null;
    if (body.mapLat !== undefined) updates.mapLat = body.mapLat !== null ? parseFloat(body.mapLat) : null;
    if (body.mapLng !== undefined) updates.mapLng = body.mapLng !== null ? parseFloat(body.mapLng) : null;
    if (body.ownerContact !== undefined) updates.ownerContact = body.ownerContact?.trim() || null;
    if (body.featured !== undefined) updates.featured = body.featured;
    if (body.isPublished !== undefined) updates.isPublished = body.isPublished;

    const updated = await db
      .update(properties)
      .set(updates)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error('PUT error:', error);
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
        { error: 'Valid ID is required', code: 'INVALID_ID' },
        { status: 400 }
      );
    }

    // Check if property exists
    const existingProperty = await db
      .select()
      .from(properties)
      .where(eq(properties.id, parseInt(id)))
      .limit(1);

    if (existingProperty.length === 0) {
      return NextResponse.json(
        { error: 'Property not found', code: 'NOT_FOUND' },
        { status: 404 }
      );
    }

    const deleted = await db
      .delete(properties)
      .where(eq(properties.id, parseInt(id)))
      .returning();

    return NextResponse.json({
      message: 'Property deleted successfully',
      property: deleted[0],
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}