/**
 * Owner Properties API - Create New Property
 * POST /api/owner/properties/create
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { createProperty, generateSlug, isSlugUnique } from '@/lib/property-manager';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/owner/properties/create`);

  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || ((session.user as any).role || 'guest') !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized - Owner access required' },
        { status: 401 }
      );
    }

    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      'title', 'location', 'region', 'sleepsMin', 'sleepsMax',
      'bedrooms', 'bathrooms', 'priceFromMidweek', 'priceFromWeekend',
      'description', 'heroImage'
    ];

    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Generate unique slug
    let slug = body.slug || generateSlug(body.title);
    let slugIsUnique = await isSlugUnique(slug);
    let counter = 1;

    while (!slugIsUnique) {
      slug = `${generateSlug(body.title)}-${counter}`;
      slugIsUnique = await isSlugUnique(slug);
      counter++;
    }

    // Create property
    const result = await createProperty({
      ownerId: session.user.id,
      title: body.title,
      slug,
      location: body.location,
      region: body.region,
      sleepsMin: Number(body.sleepsMin),
      sleepsMax: Number(body.sleepsMax),
      bedrooms: Number(body.bedrooms),
      bathrooms: Number(body.bathrooms),
      priceFromMidweek: Number(body.priceFromMidweek),
      priceFromWeekend: Number(body.priceFromWeekend),
      description: body.description,
      houseRules: body.houseRules,
      checkInOut: body.checkInOut,
      heroImage: body.heroImage,
      heroVideo: body.heroVideo,
      mapLat: body.mapLat ? Number(body.mapLat) : undefined,
      mapLng: body.mapLng ? Number(body.mapLng) : undefined,
      ownerContact: body.ownerContact,
      iCalURL: body.iCalURL,
    });

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    console.log(`[${nowUKFormatted()}] Property created successfully: ${result.property?.id}`);

    return NextResponse.json({
      success: true,
      property: result.property,
      message: 'Property created successfully - pending approval',
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Property creation error:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'POST to create property' }, { status: 200 });
}
