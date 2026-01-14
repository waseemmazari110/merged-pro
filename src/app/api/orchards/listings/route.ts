/**
 * Orchards Website API Integration
 * Provides listings and availability data to external Orchards website
 * 
 * External website should call these endpoints to get property data
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages, propertyFeatures, bookings, seasonalPricing } from '@/db/schema';
import { eq, and, gte, lte, or, inArray } from 'drizzle-orm';

/**
 * GET /api/orchards/listings
 * Returns all approved properties with details
 * Query params:
 *   - region: Filter by region
 *   - sleeps: Min number of guests
 *   - available_from: Check availability from date (YYYY-MM-DD)
 *   - available_to: Check availability to date (YYYY-MM-DD)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const region = searchParams.get('region');
    const sleeps = searchParams.get('sleeps');
    const availableFrom = searchParams.get('available_from');
    const availableTo = searchParams.get('available_to');
    const limit = parseInt(searchParams.get('limit') || '100');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Build query conditions
    const conditions = [eq(properties.status, 'approved')];

    if (region) {
      conditions.push(eq(properties.region, region));
    }

    if (sleeps) {
      const minGuests = parseInt(sleeps);
      // Using custom SQL for sleepsMax comparison
      conditions.push(gte(properties.sleepsMax, minGuests));
    }

    // Get properties
    const propertiesList = await db
      .select({
        id: properties.id,
        title: properties.title,
        slug: properties.slug,
        location: properties.location,
        region: properties.region,
        sleepsMin: properties.sleepsMin,
        sleepsMax: properties.sleepsMax,
        bedrooms: properties.bedrooms,
        bathrooms: properties.bathrooms,
        priceFromMidweek: properties.priceFromMidweek,
        priceFromWeekend: properties.priceFromWeekend,
        description: properties.description,
        houseRules: properties.houseRules,
        checkInOut: properties.checkInOut,
        heroImage: properties.heroImage,
        heroVideo: properties.heroVideo,
        mapLat: properties.mapLat,
        mapLng: properties.mapLng,
      })
      .from(properties)
      .where(and(...conditions))
      .limit(limit)
      .offset(offset);

    // Get images and features for each property
    const enrichedProperties = await Promise.all(
      propertiesList.map(async (property) => {
        // Get images
        const images = await db
          .select({
            id: propertyImages.id,
            url: propertyImages.imageURL,
            caption: propertyImages.caption,
            order: propertyImages.orderIndex,
          })
          .from(propertyImages)
          .where(eq(propertyImages.propertyId, property.id))
          .orderBy(propertyImages.orderIndex);

        // Get features
        const features = await db
          .select({
            id: propertyFeatures.id,
            name: propertyFeatures.featureName,
          })
          .from(propertyFeatures)
          .where(eq(propertyFeatures.propertyId, property.id));

        // Check availability if dates provided
        let isAvailable = true;
        if (availableFrom && availableTo) {
          const conflictingBookings = await db
            .select({ id: bookings.id })
            .from(bookings)
            .where(
              and(
                eq(bookings.propertyId, property.id),
                or(
                  eq(bookings.bookingStatus, 'confirmed'),
                  eq(bookings.bookingStatus, 'pending')
                ),
                // Check if booking overlaps with requested dates
                and(
                  lte(bookings.checkInDate, availableTo),
                  gte(bookings.checkOutDate, availableFrom)
                )
              )
            );

          isAvailable = conflictingBookings.length === 0;
        }

        // Get seasonal pricing if available
        const seasonalPrices = await db
          .select()
          .from(seasonalPricing)
          .where(
            and(
              eq(seasonalPricing.propertyId, property.id),
              eq(seasonalPricing.isActive, true)
            )
          );

        return {
          ...property,
          images,
          features: features.map(f => ({
            name: f.name,
          })),
          availability: {
            isAvailable,
            checkedFrom: availableFrom,
            checkedTo: availableTo,
          },
          seasonalPricing: seasonalPrices.map(sp => ({
            name: sp.name,
            type: sp.seasonType,
            startDate: sp.startDate,
            endDate: sp.endDate,
            pricePerNight: sp.pricePerNight,
            minimumStay: sp.minimumStay,
          })),
        };
      })
    );

    return NextResponse.json({
      success: true,
      properties: enrichedProperties,
      total: enrichedProperties.length,
      limit,
      offset,
      timestamp: new Date().toISOString(),
    }, {
      headers: {
        'Cache-Control': 'public, max-age=300', // Cache for 5 minutes
      },
    });

  } catch (error) {
    console.error('Orchards listings error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch listings',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/orchards/availability/:slug
 * Check availability for a specific property
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, checkIn, checkOut } = body;

    if (!slug || !checkIn || !checkOut) {
      return NextResponse.json(
        { error: 'Missing required fields: slug, checkIn, checkOut' },
        { status: 400 }
      );
    }

    // Get property
    const [property] = await db
      .select({
        id: properties.id,
        title: properties.title,
        slug: properties.slug,
        priceFromMidweek: properties.priceFromMidweek,
        priceFromWeekend: properties.priceFromWeekend,
      })
      .from(properties)
      .where(
        and(
          eq(properties.slug, slug),
          eq(properties.status, 'approved')
        )
      )
      .limit(1);

    if (!property) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    // Check for conflicting bookings
    const conflictingBookings = await db
      .select()
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, property.id),
          or(
            eq(bookings.bookingStatus, 'confirmed'),
            eq(bookings.bookingStatus, 'pending')
          ),
          and(
            lte(bookings.checkInDate, checkOut),
            gte(bookings.checkOutDate, checkIn)
          )
        )
      );

    const isAvailable = conflictingBookings.length === 0;

    // Calculate price based on dates and seasonal pricing
    const seasonalPrices = await db
      .select()
      .from(seasonalPricing)
      .where(
        and(
          eq(seasonalPricing.propertyId, property.id),
          eq(seasonalPricing.isActive, true),
          lte(seasonalPricing.startDate, checkOut),
          gte(seasonalPricing.endDate, checkIn)
        )
      );

    // Simple pricing calculation (you can make this more sophisticated)
    const basePrice = seasonalPrices.length > 0 
      ? seasonalPrices[0].pricePerNight 
      : property.priceFromMidweek;

    return NextResponse.json({
      success: true,
      available: isAvailable,
      property: {
        id: property.id,
        title: property.title,
        slug: property.slug,
      },
      pricing: {
        basePrice,
        currency: 'GBP',
        seasonalPricing: seasonalPrices.map(sp => ({
          name: sp.name,
          price: sp.pricePerNight,
          startDate: sp.startDate,
          endDate: sp.endDate,
        })),
      },
      checkIn,
      checkOut,
      conflictingBookings: conflictingBookings.map(b => ({
        checkIn: b.checkInDate,
        checkOut: b.checkOutDate,
      })),
    }, {
      headers: {
        'Cache-Control': 'public, max-age=60', // Cache for 1 minute
      },
    });

  } catch (error) {
    console.error('Orchards availability error:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to check availability',
        message: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
