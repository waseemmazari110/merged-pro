/**
 * Multi-Property Management System
 * 
 * Features for owners managing multiple properties including:
 * - Property grouping and portfolios
 * - Bulk operations across properties
 * - Comparative analytics
 * - Unified calendar view
 * - Cross-property availability
 * - Portfolio performance metrics
 */

import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, and, desc, asc, sql, inArray } from 'drizzle-orm';
import { nowUKFormatted } from './date-utils';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface PropertyPortfolio {
  ownerId: string;
  properties: PropertySummary[];
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  averageRating: number;
}

export interface PropertySummary {
  id: number;
  title: string;
  slug: string;
  location: string;
  region: string;
  bedrooms: number;
  bathrooms: number;
  sleepsMax: number;
  priceFromMidweek: number;
  priceFromWeekend: number;
  heroImage: string;
  isPublished: boolean;
  featured: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
  stats?: {
    totalBookings: number;
    totalRevenue: number;
    averageRating: number;
    occupancyRate: number;
    lastBookingDate?: string;
  };
}

export interface PropertyGroup {
  id: number;
  ownerId: string;
  name: string;
  description?: string;
  propertyIds: number[];
  color?: string;
  icon?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BulkOperation {
  operation: 'publish' | 'unpublish' | 'update-pricing' | 'update-amenities' | 'delete';
  propertyIds: number[];
  params?: Record<string, any>;
}

export interface BulkOperationResult {
  success: number;
  failed: number;
  results: Array<{
    propertyId: number;
    success: boolean;
    error?: string;
  }>;
}

export interface PropertyComparison {
  properties: Array<{
    id: number;
    title: string;
    metrics: {
      totalBookings: number;
      totalRevenue: number;
      averageRating: number;
      occupancyRate: number;
      pricePerNight: number;
      revenuePerNight: number;
    };
  }>;
  summary: {
    bestPerformer: number; // property ID
    worstPerformer: number; // property ID
    averageOccupancy: number;
    totalRevenue: number;
  };
}

// ============================================
// PORTFOLIO MANAGEMENT
// ============================================

/**
 * Get owner's property portfolio
 */
export async function getPropertyPortfolio(ownerId: string): Promise<PropertyPortfolio> {
  // Get all properties for owner
  const ownerProperties = await db
    .select()
    .from(properties)
    .where(eq(properties.ownerId, ownerId))
    .orderBy(desc(properties.createdAt));

  const totalProperties = ownerProperties.length;
  const publishedProperties = ownerProperties.filter(p => p.isPublished).length;
  const draftProperties = totalProperties - publishedProperties;

  // Get stats for each property
  const propertiesWithStats: PropertySummary[] = await Promise.all(
    ownerProperties.map(async (prop) => {
      const stats = await getPropertyStats(prop.id);
      return {
        id: prop.id,
        title: prop.title,
        slug: prop.slug,
        location: prop.location,
        region: prop.region,
        bedrooms: prop.bedrooms,
        bathrooms: prop.bathrooms,
        sleepsMax: prop.sleepsMax,
        priceFromMidweek: prop.priceFromMidweek,
        priceFromWeekend: prop.priceFromWeekend,
        heroImage: prop.heroImage,
        isPublished: prop.isPublished || false,
        featured: prop.featured || false,
        ownerId: prop.ownerId || '',
        createdAt: prop.createdAt,
        updatedAt: prop.updatedAt,
        stats,
      };
    })
  );

  // Calculate portfolio metrics
  const totalRevenue = propertiesWithStats.reduce(
    (sum, p) => sum + (p.stats?.totalRevenue || 0),
    0
  );
  const totalBookings = propertiesWithStats.reduce(
    (sum, p) => sum + (p.stats?.totalBookings || 0),
    0
  );
  const averageOccupancy =
    propertiesWithStats.reduce((sum, p) => sum + (p.stats?.occupancyRate || 0), 0) /
    (totalProperties || 1);
  const averageRating =
    propertiesWithStats.reduce((sum, p) => sum + (p.stats?.averageRating || 0), 0) /
    (totalProperties || 1);

  return {
    ownerId,
    properties: propertiesWithStats,
    totalProperties,
    publishedProperties,
    draftProperties,
    totalRevenue,
    totalBookings,
    averageOccupancy,
    averageRating,
  };
}

/**
 * Get property stats
 */
async function getPropertyStats(propertyId: number): Promise<PropertySummary['stats']> {
  // Get bookings count
  const bookingsResult = await db.run(
    sql`SELECT COUNT(*) as count, SUM(total_price) as revenue 
        FROM bookings 
        WHERE property_id = ${propertyId} AND booking_status = 'confirmed'`
  );

  const totalBookings = (bookingsResult.rows[0] as any)?.count || 0;
  const totalRevenue = (bookingsResult.rows[0] as any)?.revenue || 0;

  // Get last booking date
  const lastBookingResult = await db.run(
    sql`SELECT created_at FROM bookings 
        WHERE property_id = ${propertyId} AND booking_status = 'confirmed'
        ORDER BY created_at DESC LIMIT 1`
  );

  const lastBookingDate = (lastBookingResult.rows[0] as any)?.created_at;

  // Calculate occupancy rate (simplified - would need date range analysis)
  const occupancyRate = totalBookings > 0 ? Math.min((totalBookings / 365) * 100, 100) : 0;

  // Get average rating (placeholder - would come from reviews table)
  const averageRating = 4.5;

  return {
    totalBookings,
    totalRevenue,
    averageRating,
    occupancyRate,
    lastBookingDate,
  };
}

/**
 * Get properties by IDs
 */
export async function getPropertiesByIds(propertyIds: number[]): Promise<PropertySummary[]> {
  if (propertyIds.length === 0) return [];

  const props = await db
    .select()
    .from(properties)
    .where(inArray(properties.id, propertyIds));

  return props.map(p => ({
    id: p.id,
    title: p.title,
    slug: p.slug,
    location: p.location,
    region: p.region,
    bedrooms: p.bedrooms,
    bathrooms: p.bathrooms,
    sleepsMax: p.sleepsMax,
    priceFromMidweek: p.priceFromMidweek,
    priceFromWeekend: p.priceFromWeekend,
    heroImage: p.heroImage,
    isPublished: p.isPublished || false,
    featured: p.featured || false,
    ownerId: p.ownerId || '',
    createdAt: p.createdAt,
    updatedAt: p.updatedAt,
  }));
}

// ============================================
// BULK OPERATIONS
// ============================================

/**
 * Execute bulk operation on properties
 */
export async function executeBulkOperation(
  ownerId: string,
  operation: BulkOperation
): Promise<BulkOperationResult> {
  const results: BulkOperationResult = {
    success: 0,
    failed: 0,
    results: [],
  };

  // Verify ownership of all properties
  const props = await getPropertiesByIds(operation.propertyIds);
  const ownedPropertyIds = props.filter(p => p.ownerId === ownerId).map(p => p.id);

  if (ownedPropertyIds.length !== operation.propertyIds.length) {
    throw new Error('You do not own all specified properties');
  }

  // Execute operation based on type
  for (const propertyId of ownedPropertyIds) {
    try {
      switch (operation.operation) {
        case 'publish':
          await updatePropertyPublishStatus(propertyId, true);
          break;

        case 'unpublish':
          await updatePropertyPublishStatus(propertyId, false);
          break;

        case 'update-pricing':
          if (operation.params?.priceFromMidweek || operation.params?.priceFromWeekend) {
            await updatePropertyPricing(propertyId, operation.params);
          }
          break;

        case 'update-amenities':
          if (operation.params?.amenityIds) {
            const { savePropertyAmenities } = await import('./amenities');
            await savePropertyAmenities(propertyId, operation.params.amenityIds);
          }
          break;

        case 'delete':
          await deleteProperty(propertyId);
          break;

        default:
          throw new Error(`Unknown operation: ${operation.operation}`);
      }

      results.success++;
      results.results.push({ propertyId, success: true });
    } catch (error: any) {
      results.failed++;
      results.results.push({
        propertyId,
        success: false,
        error: error.message,
      });
    }
  }

  return results;
}

/**
 * Update property publish status
 */
async function updatePropertyPublishStatus(propertyId: number, isPublished: boolean): Promise<void> {
  const now = nowUKFormatted();
  await db
    .update(properties)
    .set({ isPublished, updatedAt: now })
    .where(eq(properties.id, propertyId));
}

/**
 * Update property pricing
 */
async function updatePropertyPricing(
  propertyId: number,
  params: { priceFromMidweek?: number; priceFromWeekend?: number }
): Promise<void> {
  const now = nowUKFormatted();
  const updates: any = { updatedAt: now };

  if (params.priceFromMidweek !== undefined) {
    updates.priceFromMidweek = params.priceFromMidweek;
  }
  if (params.priceFromWeekend !== undefined) {
    updates.priceFromWeekend = params.priceFromWeekend;
  }

  await db.update(properties).set(updates).where(eq(properties.id, propertyId));
}

/**
 * Delete property
 */
async function deleteProperty(propertyId: number): Promise<void> {
  await db.delete(properties).where(eq(properties.id, propertyId));
}

// ============================================
// COMPARATIVE ANALYTICS
// ============================================

/**
 * Compare multiple properties
 */
export async function compareProperties(
  propertyIds: number[]
): Promise<PropertyComparison> {
  if (propertyIds.length < 2) {
    throw new Error('At least 2 properties are required for comparison');
  }

  const propertiesData = await Promise.all(
    propertyIds.map(async (id) => {
      const props = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
      if (props.length === 0) {
        throw new Error(`Property ${id} not found`);
      }

      const prop = props[0];
      const stats = await getPropertyStats(id);

      const averagePrice = (prop.priceFromMidweek + prop.priceFromWeekend) / 2;
      const revenuePerNight = (stats?.totalBookings ?? 0) > 0 ? (stats?.totalRevenue ?? 0) / (stats?.totalBookings ?? 1) : 0;

      return {
        id,
        title: prop.title,
        metrics: {
          totalBookings: stats?.totalBookings ?? 0,
          totalRevenue: stats?.totalRevenue ?? 0,
          averageRating: stats?.averageRating ?? 0,
          occupancyRate: stats?.occupancyRate ?? 0,
          pricePerNight: averagePrice,
          revenuePerNight,
        },
      };
    })
  );

  // Find best and worst performers
  const sortedByRevenue = [...propertiesData].sort(
    (a, b) => b.metrics.totalRevenue - a.metrics.totalRevenue
  );
  const bestPerformer = sortedByRevenue[0].id;
  const worstPerformer = sortedByRevenue[sortedByRevenue.length - 1].id;

  const averageOccupancy =
    propertiesData.reduce((sum, p) => sum + p.metrics.occupancyRate, 0) / propertiesData.length;
  const totalRevenue = propertiesData.reduce((sum, p) => sum + p.metrics.totalRevenue, 0);

  return {
    properties: propertiesData,
    summary: {
      bestPerformer,
      worstPerformer,
      averageOccupancy,
      totalRevenue,
    },
  };
}

/**
 * Get cross-property availability
 */
export async function getCrossPropertyAvailability(
  propertyIds: number[],
  startDate: string, // UK format: DD/MM/YYYY
  endDate: string // UK format: DD/MM/YYYY
): Promise<Array<{
  propertyId: number;
  propertyTitle: string;
  availability: Array<{ date: string; available: boolean; price: number }>;
}>> {
  const { getAvailabilityCalendar } = await import('./seasonal-pricing');

  const results = await Promise.all(
    propertyIds.map(async (id) => {
      const props = await db.select().from(properties).where(eq(properties.id, id)).limit(1);
      if (props.length === 0) {
        throw new Error(`Property ${id} not found`);
      }

      const availability = await getAvailabilityCalendar(id, startDate, endDate);

      return {
        propertyId: id,
        propertyTitle: props[0].title,
        availability,
      };
    })
  );

  return results;
}

/**
 * Get portfolio performance summary
 */
export async function getPortfolioPerformance(ownerId: string): Promise<{
  totalRevenue: number;
  totalBookings: number;
  averageOccupancy: number;
  averageRating: number;
  topPerformer: { id: number; title: string; revenue: number };
  recentActivity: Array<{ date: string; action: string; propertyTitle: string }>;
}> {
  const portfolio = await getPropertyPortfolio(ownerId);

  // Find top performer
  const sortedByRevenue = [...portfolio.properties].sort(
    (a, b) => (b.stats?.totalRevenue || 0) - (a.stats?.totalRevenue || 0)
  );
  const topPerformer = sortedByRevenue[0]
    ? {
        id: sortedByRevenue[0].id,
        title: sortedByRevenue[0].title,
        revenue: sortedByRevenue[0].stats?.totalRevenue || 0,
      }
    : { id: 0, title: 'N/A', revenue: 0 };

  // Get recent activity (simplified)
  const recentActivity = portfolio.properties.slice(0, 5).map((p) => ({
    date: p.updatedAt,
    action: p.isPublished ? 'Published' : 'Updated',
    propertyTitle: p.title,
  }));

  return {
    totalRevenue: portfolio.totalRevenue,
    totalBookings: portfolio.totalBookings,
    averageOccupancy: portfolio.averageOccupancy,
    averageRating: portfolio.averageRating,
    topPerformer,
    recentActivity,
  };
}
