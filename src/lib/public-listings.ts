/**
 * MILESTONE 10: PUBLIC LISTINGS SYSTEM
 * 
 * Complete public-facing property listing and search
 * - Public property listings with search/filter
 * - Availability calendar with UK dates (DD/MM/YYYY)
 * - Property reviews and ratings
 * - Advanced search and filtering
 * - SEO-friendly URLs and metadata
 */

import { db } from '@/db';
import { 
  properties, 
  propertyImages, 
  propertyFeatures, 
  availabilityCalendar,
  propertyReviews,
  bookings,
  seasonalPricing,
  specialDatePricing,
} from '@/db/schema';
import { eq, and, or, sql, desc, asc, gte, lte, like, inArray, ne } from 'drizzle-orm';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface PublicProperty {
  id: number;
  title: string;
  slug: string;
  location: string;
  region: string;
  sleepsMin: number;
  sleepsMax: number;
  bedrooms: number;
  bathrooms: number;
  priceFromMidweek: number;
  priceFromWeekend: number;
  description: string;
  heroImage: string;
  heroVideo?: string;
  mapLat?: number;
  mapLng?: number;
  featured: boolean;
  images: Array<{
    id: number;
    imageURL: string;
    caption?: string;
    orderIndex: number;
  }>;
  features: string[];
  averageRating: number;
  totalReviews: number;
  availableFrom?: string; // DD/MM/YYYY
  priceRange: {
    min: number;
    max: number;
  };
}

export interface PropertySearchFilters {
  search?: string; // Search in title, location, description
  region?: string | string[];
  location?: string | string[];
  minPrice?: number;
  maxPrice?: number;
  minBedrooms?: number;
  maxBedrooms?: number;
  minGuests?: number;
  maxGuests?: number;
  features?: string[]; // Must have all these features
  featured?: boolean;
  checkInDate?: string; // DD/MM/YYYY
  checkOutDate?: string; // DD/MM/YYYY
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
}

export interface AvailabilityDate {
  date: string; // DD/MM/YYYY
  isAvailable: boolean;
  status: 'available' | 'booked' | 'blocked' | 'maintenance';
  price?: number;
  minimumStay: number;
  bookingId?: number;
}

export interface PropertyReview {
  id: number;
  propertyId: number;
  guestName: string;
  rating: number;
  title?: string;
  review: string;
  cleanliness?: number;
  accuracy?: number;
  communication?: number;
  location?: number;
  value?: number;
  isVerified: boolean;
  ownerResponse?: string;
  respondedAt?: string;
  createdAt: string;
}

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Format date to UK date: DD/MM/YYYY
 */
export function formatUKDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Format date to UK timestamp: DD/MM/YYYY HH:mm:ss
 */
export function formatUKTimestamp(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parse UK date (DD/MM/YYYY) to Date object
 */
export function parseUKDate(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(p => parseInt(p, 10));
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month - 1, day);
}

/**
 * Validate UK date format (DD/MM/YYYY)
 */
export function isValidUKDate(dateStr: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;
  const date = parseUKDate(dateStr);
  return date !== null && !isNaN(date.getTime());
}

/**
 * Get date range between two UK dates
 */
export function getDateRange(startDate: string, endDate: string): string[] {
  const start = parseUKDate(startDate);
  const end = parseUKDate(endDate);
  
  if (!start || !end) return [];
  
  const dates: string[] = [];
  const current = new Date(start);
  
  while (current <= end) {
    dates.push(formatUKDate(current));
    current.setDate(current.getDate() + 1);
  }
  
  return dates;
}

/**
 * Calculate nights between two dates
 */
export function calculateNights(checkInDate: string, checkOutDate: string): number {
  const start = parseUKDate(checkInDate);
  const end = parseUKDate(checkOutDate);
  
  if (!start || !end) return 0;
  
  const diffTime = end.getTime() - start.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

// ============================================
// PUBLIC PROPERTY LISTINGS
// ============================================

/**
 * Get all published properties with filters
 */
export async function getPublicProperties(
  filters: PropertySearchFilters = {},
  limit = 50,
  offset = 0
): Promise<{ properties: PublicProperty[]; total: number }> {
  // Build all conditions first
  const conditions = [
    eq(properties.isPublished, true),
    eq(properties.status, 'approved')
  ];

  // Search filter
  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(properties.title, searchTerm),
        like(properties.location, searchTerm),
        like(properties.description, searchTerm)
      )!
    );
  }

  // Region filter
  if (filters.region) {
    if (Array.isArray(filters.region)) {
      conditions.push(inArray(properties.region, filters.region));
    } else {
      conditions.push(eq(properties.region, filters.region));
    }
  }

  // Location filter
  if (filters.location) {
    if (Array.isArray(filters.location)) {
      conditions.push(inArray(properties.location, filters.location));
    } else {
      conditions.push(eq(properties.location, filters.location));
    }
  }

  // Price filters
  if (filters.minPrice !== undefined) {
    conditions.push(gte(properties.priceFromMidweek, filters.minPrice));
  }
  if (filters.maxPrice !== undefined) {
    conditions.push(lte(properties.priceFromMidweek, filters.maxPrice));
  }

  // Bedroom filters
  if (filters.minBedrooms !== undefined) {
    conditions.push(gte(properties.bedrooms, filters.minBedrooms));
  }
  if (filters.maxBedrooms !== undefined) {
    conditions.push(lte(properties.bedrooms, filters.maxBedrooms));
  }

  // Guest capacity filters
  if (filters.minGuests !== undefined) {
    conditions.push(gte(properties.sleepsMax, filters.minGuests));
  }
  if (filters.maxGuests !== undefined) {
    conditions.push(lte(properties.sleepsMin, filters.maxGuests));
  }

  // Featured filter
  if (filters.featured !== undefined) {
    conditions.push(eq(properties.featured, filters.featured));
  }

  // Build query with all conditions
  let query = db
    .select({
      property: properties,
    })
    .from(properties)
    .where(and(...conditions)!);

  // Sorting
  let orderBy;
  switch (filters.sortBy) {
    case 'price_asc':
      orderBy = asc(properties.priceFromMidweek);
      break;
    case 'price_desc':
      orderBy = desc(properties.priceFromMidweek);
      break;
    case 'newest':
      orderBy = desc(properties.createdAt);
      break;
    default:
      orderBy = desc(properties.featured);
  }

  const results = await (query as any)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  // Get total count
  const countResult = await db
    .select({ count: sql<number>`count(*)` })
    .from(properties)
    .where(and(...conditions)!);
  const total = Number(countResult[0]?.count || 0);

  // Fetch related data for each property
  const enrichedProperties = await Promise.all(
    results.map(async ({ property }: any) => {
      // Get images
      const images = await db
        .select()
        .from(propertyImages)
        .where(eq(propertyImages.propertyId, property.id))
        .orderBy(asc(propertyImages.orderIndex));

      // Get features
      const featuresResult = await db
        .select()
        .from(propertyFeatures)
        .where(eq(propertyFeatures.propertyId, property.id));
      const features = featuresResult.map(f => f.featureName);

      // Get reviews stats
      const reviewsStats = await db
        .select({
          avgRating: sql<number>`AVG(${propertyReviews.rating})`,
          totalReviews: sql<number>`COUNT(*)`,
        })
        .from(propertyReviews)
        .where(
          and(
            eq(propertyReviews.propertyId, property.id),
            eq(propertyReviews.isPublished, true)
          )!
        );

      const avgRating = Number(reviewsStats[0]?.avgRating || 0);
      const totalReviews = Number(reviewsStats[0]?.totalReviews || 0);

      // Get price range (from seasonal pricing if available)
      const seasonalPrices = await db
        .select()
        .from(seasonalPricing)
        .where(
          and(
            eq(seasonalPricing.propertyId, property.id),
            eq(seasonalPricing.isActive, true)
          )!
        );

      let priceRange = {
        min: property.priceFromMidweek,
        max: property.priceFromWeekend,
      };

      if (seasonalPrices.length > 0) {
        const prices = seasonalPrices.map(sp => sp.pricePerNight);
        priceRange = {
          min: Math.min(...prices, property.priceFromMidweek),
          max: Math.max(...prices, property.priceFromWeekend),
        };
      }

      return {
        id: property.id,
        title: property.title,
        slug: property.slug,
        location: property.location,
        region: property.region,
        sleepsMin: property.sleepsMin,
        sleepsMax: property.sleepsMax,
        bedrooms: property.bedrooms,
        bathrooms: property.bathrooms,
        priceFromMidweek: property.priceFromMidweek,
        priceFromWeekend: property.priceFromWeekend,
        description: property.description,
        heroImage: property.heroImage,
        heroVideo: property.heroVideo || undefined,
        mapLat: property.mapLat || undefined,
        mapLng: property.mapLng || undefined,
        featured: property.featured || false,
        images: images.map(img => ({
          id: img.id,
          imageURL: img.imageURL,
          caption: img.caption || undefined,
          orderIndex: img.orderIndex || 0,
        })),
        features,
        averageRating: Math.round(avgRating * 10) / 10,
        totalReviews,
        priceRange,
      };
    })
  );

  // Filter by availability if dates provided
  let finalProperties = enrichedProperties;
  if (filters.checkInDate && filters.checkOutDate) {
    const availableProperties = await filterByAvailability(
      enrichedProperties.map(p => p.id),
      filters.checkInDate,
      filters.checkOutDate
    );
    finalProperties = enrichedProperties.filter(p => availableProperties.includes(p.id));
  }

  return {
    properties: finalProperties,
    total: filters.checkInDate && filters.checkOutDate ? finalProperties.length : total,
  };
}

/**
 * Get single property by slug (public view)
 */
export async function getPublicPropertyBySlug(slug: string): Promise<PublicProperty | null> {
  const result = await db
    .select()
    .from(properties)
    .where(
      and(
        eq(properties.slug, slug),
        eq(properties.isPublished, true),
        eq(properties.status, 'approved') // Only show approved properties
      )!
    )
    .limit(1);

  if (result.length === 0) return null;

  const property = result[0];

  // Get all related data
  const images = await db
    .select()
    .from(propertyImages)
    .where(eq(propertyImages.propertyId, property.id))
    .orderBy(asc(propertyImages.orderIndex));

  const featuresResult = await db
    .select()
    .from(propertyFeatures)
    .where(eq(propertyFeatures.propertyId, property.id));
  const features = featuresResult.map(f => f.featureName);

  const reviewsStats = await db
    .select({
      avgRating: sql<number>`AVG(${propertyReviews.rating})`,
      totalReviews: sql<number>`COUNT(*)`,
    })
    .from(propertyReviews)
    .where(
      and(
        eq(propertyReviews.propertyId, property.id),
        eq(propertyReviews.isPublished, true)
      )!
    );

  const avgRating = Number(reviewsStats[0]?.avgRating || 0);
  const totalReviews = Number(reviewsStats[0]?.totalReviews || 0);

  // Get price range
  const seasonalPrices = await db
    .select()
    .from(seasonalPricing)
    .where(
      and(
        eq(seasonalPricing.propertyId, property.id),
        eq(seasonalPricing.isActive, true)
      )!
    );

  let priceRange = {
    min: property.priceFromMidweek,
    max: property.priceFromWeekend,
  };

  if (seasonalPrices.length > 0) {
    const prices = seasonalPrices.map(sp => sp.pricePerNight);
    priceRange = {
      min: Math.min(...prices, property.priceFromMidweek),
      max: Math.max(...prices, property.priceFromWeekend),
    };
  }

  return {
    id: property.id,
    title: property.title,
    slug: property.slug,
    location: property.location,
    region: property.region,
    sleepsMin: property.sleepsMin,
    sleepsMax: property.sleepsMax,
    bedrooms: property.bedrooms,
    bathrooms: property.bathrooms,
    priceFromMidweek: property.priceFromMidweek,
    priceFromWeekend: property.priceFromWeekend,
    description: property.description,
    heroImage: property.heroImage,
    heroVideo: property.heroVideo || undefined,
    mapLat: property.mapLat || undefined,
    mapLng: property.mapLng || undefined,
    featured: property.featured || false,
    images: images.map(img => ({
      id: img.id,
      imageURL: img.imageURL,
      caption: img.caption || undefined,
      orderIndex: img.orderIndex || 0,
    })),
    features,
    averageRating: Math.round(avgRating * 10) / 10,
    totalReviews,
    priceRange,
  };
}

/**
 * Get property by ID (public view)
 */
export async function getPublicPropertyById(propertyId: number): Promise<PublicProperty | null> {
  const result = await db
    .select()
    .from(properties)
    .where(
      and(
        eq(properties.id, propertyId),
        eq(properties.isPublished, true),
        eq(properties.status, 'approved') // Only show approved properties
      )!
    )
    .limit(1);

  if (result.length === 0) return null;

  const property = result[0];
  return getPublicPropertyBySlug(property.slug);
}

// ============================================
// AVAILABILITY MANAGEMENT
// ============================================

/**
 * Get availability calendar for property
 */
export async function getPropertyAvailability(
  propertyId: number,
  startDate: string, // DD/MM/YYYY
  endDate: string // DD/MM/YYYY
): Promise<AvailabilityDate[]> {
  if (!isValidUKDate(startDate) || !isValidUKDate(endDate)) {
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  const dates = getDateRange(startDate, endDate);
  const availabilityMap = new Map<string, AvailabilityDate>();

  // Initialize all dates as available
  for (const date of dates) {
    availabilityMap.set(date, {
      date,
      isAvailable: true,
      status: 'available',
      minimumStay: 1,
    });
  }

  // Get existing availability records
  const existingAvailability = await db
    .select()
    .from(availabilityCalendar)
    .where(
      and(
        eq(availabilityCalendar.propertyId, propertyId),
        gte(availabilityCalendar.date, startDate),
        lte(availabilityCalendar.date, endDate)
      )!
    );

  // Update with existing records
  for (const record of existingAvailability) {
    availabilityMap.set(record.date, {
      date: record.date,
      isAvailable: record.isAvailable || false,
      status: (record.status as any) || 'available',
      price: record.price || undefined,
      minimumStay: record.minimumStay || 1,
      bookingId: record.bookingId || undefined,
    });
  }

  return Array.from(availabilityMap.values()).sort((a, b) => {
    const dateA = parseUKDate(a.date)!;
    const dateB = parseUKDate(b.date)!;
    return dateA.getTime() - dateB.getTime();
  });
}

/**
 * Check if property is available for date range
 */
export async function checkAvailability(
  propertyId: number,
  checkInDate: string, // DD/MM/YYYY
  checkOutDate: string // DD/MM/YYYY
): Promise<{ available: boolean; unavailableDates?: string[] }> {
  if (!isValidUKDate(checkInDate) || !isValidUKDate(checkOutDate)) {
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  const dates = getDateRange(checkInDate, checkOutDate);
  const availability = await getPropertyAvailability(propertyId, checkInDate, checkOutDate);
  
  const unavailableDates = availability
    .filter(a => !a.isAvailable || a.status !== 'available')
    .map(a => a.date);

  return {
    available: unavailableDates.length === 0,
    unavailableDates: unavailableDates.length > 0 ? unavailableDates : undefined,
  };
}

/**
 * Block dates (owner/admin)
 */
export async function blockDates(
  propertyId: number,
  startDate: string, // DD/MM/YYYY
  endDate: string, // DD/MM/YYYY
  status: 'blocked' | 'maintenance' = 'blocked',
  notes?: string
) {
  if (!isValidUKDate(startDate) || !isValidUKDate(endDate)) {
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  const dates = getDateRange(startDate, endDate);
  const now = formatUKTimestamp();

  for (const date of dates) {
    // Check if record exists
    const existing = await db
      .select()
      .from(availabilityCalendar)
      .where(
        and(
          eq(availabilityCalendar.propertyId, propertyId),
          eq(availabilityCalendar.date, date)
        )!
      )
      .limit(1);

    if (existing.length > 0) {
      // Update existing
      await db
        .update(availabilityCalendar)
        .set({
          isAvailable: false,
          status,
          notes: notes || null,
          updatedAt: now,
        })
        .where(eq(availabilityCalendar.id, existing[0].id));
    } else {
      // Insert new
      await db.insert(availabilityCalendar).values({
        propertyId,
        date,
        isAvailable: false,
        status,
        notes: notes || null,
        createdAt: now,
        updatedAt: now,
      });
    }
  }

  return { success: true, datesBlocked: dates.length };
}

/**
 * Unblock dates (owner/admin)
 */
export async function unblockDates(
  propertyId: number,
  startDate: string, // DD/MM/YYYY
  endDate: string // DD/MM/YYYY
) {
  if (!isValidUKDate(startDate) || !isValidUKDate(endDate)) {
    throw new Error('Invalid date format. Use DD/MM/YYYY');
  }

  const now = formatUKTimestamp();

  await db
    .update(availabilityCalendar)
    .set({
      isAvailable: true,
      status: 'available',
      bookingId: null,
      notes: null,
      updatedAt: now,
    })
    .where(
      and(
        eq(availabilityCalendar.propertyId, propertyId),
        gte(availabilityCalendar.date, startDate),
        lte(availabilityCalendar.date, endDate)
      )!
    );

  return { success: true };
}

/**
 * Filter properties by availability
 */
async function filterByAvailability(
  propertyIds: number[],
  checkInDate: string,
  checkOutDate: string
): Promise<number[]> {
  const availableIds: number[] = [];

  for (const propertyId of propertyIds) {
    const { available } = await checkAvailability(propertyId, checkInDate, checkOutDate);
    if (available) {
      availableIds.push(propertyId);
    }
  }

  return availableIds;
}

// ============================================
// REVIEWS & RATINGS
// ============================================

/**
 * Get property reviews
 */
export async function getPropertyReviews(
  propertyId: number,
  limit = 50,
  offset = 0
): Promise<PropertyReview[]> {
  const reviews = await db
    .select()
    .from(propertyReviews)
    .where(
      and(
        eq(propertyReviews.propertyId, propertyId),
        eq(propertyReviews.isPublished, true)
      )!
    )
    .orderBy(desc(propertyReviews.createdAt))
    .limit(limit)
    .offset(offset);

  return reviews.map(review => ({
    id: review.id,
    propertyId: review.propertyId,
    guestName: review.guestName,
    rating: review.rating,
    title: review.title || undefined,
    review: review.review,
    cleanliness: review.cleanliness || undefined,
    accuracy: review.accuracy || undefined,
    communication: review.communication || undefined,
    location: review.location || undefined,
    value: review.value || undefined,
    isVerified: review.isVerified || false,
    ownerResponse: review.ownerResponse || undefined,
    respondedAt: review.respondedAt || undefined,
    createdAt: review.createdAt,
  }));
}

/**
 * Get featured properties
 */
export async function getFeaturedProperties(limit = 6): Promise<PublicProperty[]> {
  const { properties } = await getPublicProperties({ featured: true, sortBy: 'rating' }, limit);
  return properties;
}

/**
 * Search properties
 */
export async function searchProperties(
  searchTerm: string,
  limit = 20
): Promise<PublicProperty[]> {
  const { properties } = await getPublicProperties({ search: searchTerm }, limit);
  return properties;
}

/**
 * Get properties by region
 */
export async function getPropertiesByRegion(
  region: string,
  limit = 50
): Promise<PublicProperty[]> {
  const { properties } = await getPublicProperties({ region }, limit);
  return properties;
}
