/**
 * ORCHARDS WEBSITE INTEGRATION - Single Property API
 * 
 * GET /api/orchards/properties/[id] - Get detailed property information
 * 
 * Returns complete property details including:
 * - Basic information
 * - Images gallery
 * - Features/amenities
 * - Availability status
 * - Pricing information
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties, propertyImages, propertyFeatures } from '@/db/schema';
import { eq, and } from 'drizzle-orm';
import { rateLimit, addRateLimitHeaders } from '@/lib/rate-limiter';
import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// CORS Headers
// ============================================

const ORCHARDS_ORIGINS = [
  'https://www.orchards-escapes.co.uk',
  'https://orchards-escapes.co.uk',
  'https://orchards-staging.vercel.app',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

function getCorsHeaders(request: NextRequest): HeadersInit {
  const origin = request.headers.get('origin');
  const allowedOrigin = ORCHARDS_ORIGINS.includes(origin || '') ? origin : ORCHARDS_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin || '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Access-Control-Max-Age': '86400',
  };
}

// ============================================
// OPTIONS - CORS Preflight
// ============================================

export async function OPTIONS(request: NextRequest) {
  return new NextResponse(null, {
    status: 204,
    headers: getCorsHeaders(request),
  });
}

// ============================================
// GET - Property Details
// ============================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Apply rate limiting
    const rateLimitResult = rateLimit(request);
    if (!rateLimitResult.success) {
      return rateLimitResult.error;
    }

    const { id } = await params;

    // Fetch property
    const property = await db
      .select()
      .from(properties)
      .where(
        and(
          eq(properties.id, parseInt(id)),
          eq(properties.isPublished, true),
          eq(properties.status, 'approved') // Only show approved properties
        )
      )
      .limit(1);

    if (!property || property.length === 0) {
      const response = NextResponse.json(
        { error: 'Property not found or not available' },
        { status: 404 }
      );
      
      const corsHeaders = getCorsHeaders(request);
      Object.entries(corsHeaders).forEach(([key, value]) => {
        response.headers.set(key, value as string);
      });
      
      return response;
    }

    // Fetch images
    const images = await db
      .select()
      .from(propertyImages)
      .where(eq(propertyImages.propertyId, parseInt(id)))
      .orderBy(propertyImages.orderIndex);

    // Fetch features
    const features = await db
      .select()
      .from(propertyFeatures)
      .where(eq(propertyFeatures.propertyId, parseInt(id)));

    // Build comprehensive response
    const propertyData = property[0];
    
    const response = NextResponse.json({
      success: true,
      property: {
        id: propertyData.id,
        title: propertyData.title,
        slug: propertyData.slug,
        location: propertyData.location,
        region: propertyData.region,
        description: propertyData.description,
        
        // Capacity
        sleepsMin: propertyData.sleepsMin,
        sleepsMax: propertyData.sleepsMax,
        bedrooms: propertyData.bedrooms,
        bathrooms: propertyData.bathrooms,
        
        // Pricing
        priceFromMidweek: propertyData.priceFromMidweek,
        priceFromWeekend: propertyData.priceFromWeekend,
        
        // Media
        heroImage: propertyData.heroImage,
        heroVideo: propertyData.heroVideo,
        floorplanURL: propertyData.floorplanURL,
        images: images.map(img => ({
          id: img.id,
          url: img.imageURL,
          caption: img.caption,
          order: img.orderIndex,
        })),
        
        // Features/Amenities
        features: features.map(f => f.featureName),
        
        // Additional Info
        houseRules: propertyData.houseRules,
        checkInOut: propertyData.checkInOut,
        
        // Location
        mapLat: propertyData.mapLat,
        mapLng: propertyData.mapLng,
        
        // Metadata
        featured: propertyData.featured,
        createdAt: propertyData.createdAt,
        updatedAt: propertyData.updatedAt,
      },
      timestamp: nowUKFormatted(),
    });

    // Add CORS and rate limit headers
    const corsHeaders = getCorsHeaders(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
    
    return addRateLimitHeaders(response, request, rateLimitResult.tier);

  } catch (error) {
    console.error('Error fetching property details for Orchards:', error);
    
    const response = NextResponse.json(
      { error: 'Failed to fetch property details' },
      { status: 500 }
    );
    
    const corsHeaders = getCorsHeaders(request);
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value as string);
    });
    
    return response;
  }
}
