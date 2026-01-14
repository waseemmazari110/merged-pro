/**
 * MILESTONE 9: PERFORMANCE STATS SYSTEM
 * 
 * Comprehensive performance tracking and analytics
 * - Property performance metrics
 * - Owner performance metrics
 * - Platform-wide statistics
 * - Time-series data (daily, weekly, monthly, yearly)
 * - UK timestamp format: DD/MM/YYYY HH:mm:ss
 */

import { db } from '@/db';
import { performanceStats, enquiries, bookings, properties, users } from '@/db/schema';
import { eq, and, sql, desc, gte, lte, inArray } from 'drizzle-orm';

// ============================================
// TYPES & INTERFACES
// ============================================

export type EntityType = 'property' | 'owner' | 'platform';
export type Period = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface PerformanceMetrics {
  // Traffic
  pageViews: number;
  uniqueVisitors: number;
  avgSessionDuration: number;
  bounceRate: number;

  // Enquiries
  totalEnquiries: number;
  newEnquiries: number;
  inProgressEnquiries: number;
  resolvedEnquiries: number;
  avgResponseTime: number;
  conversionRate: number;

  // Bookings
  totalBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  avgBookingValue: number;
  occupancyRate: number;

  // Guests
  totalGuests: number;
  returningGuests: number;
  avgGuestsPerBooking: number;

  // Ratings
  totalReviews: number;
  avgRating: number;
  fiveStarReviews: number;
  fourStarReviews: number;
  threeStarReviews: number;
  twoStarReviews: number;
  oneStarReviews: number;

  // Financial
  depositsPaid: number;
  balancesPaid: number;
  pendingPayments: number;
  refundsIssued: number;

  // Marketing
  emailSent: number;
  emailOpened: number;
  emailClicked: number;
  emailOpenRate: number;
  emailClickRate: number;
}

export interface CreateStatsData {
  entityType: EntityType;
  entityId?: string;
  period: Period;
  periodStart: string; // DD/MM/YYYY
  periodEnd: string; // DD/MM/YYYY
  metrics: Partial<PerformanceMetrics>;
  metadata?: Record<string, any>;
}

export interface StatsFilters {
  entityType?: EntityType;
  entityId?: string;
  period?: Period;
  dateFrom?: string; // DD/MM/YYYY
  dateTo?: string; // DD/MM/YYYY
}

export interface PerformanceComparison {
  current: PerformanceMetrics;
  previous: PerformanceMetrics;
  changes: Record<keyof PerformanceMetrics, {
    value: number;
    percentage: number;
    trend: 'up' | 'down' | 'stable';
  }>;
}

// ============================================
// DATE UTILITIES
// ============================================

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
 * Format date to UK date: DD/MM/YYYY
 */
export function formatUKDate(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

/**
 * Get period dates
 */
export function getPeriodDates(period: Period, date: Date = new Date()): { start: string; end: string } {
  const d = new Date(date);
  let start: Date;
  let end: Date;

  switch (period) {
    case 'daily':
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      end = new Date(d.getFullYear(), d.getMonth(), d.getDate() + 1);
      break;
    case 'weekly':
      const dayOfWeek = d.getDay();
      start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - dayOfWeek);
      end = new Date(start.getTime() + 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      start = new Date(d.getFullYear(), d.getMonth(), 1);
      end = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      break;
    case 'yearly':
      start = new Date(d.getFullYear(), 0, 1);
      end = new Date(d.getFullYear() + 1, 0, 1);
      break;
  }

  return {
    start: formatUKDate(start),
    end: formatUKDate(end),
  };
}

// ============================================
// STATS CREATION & MANAGEMENT
// ============================================

/**
 * Create or update performance stats
 */
export async function savePerformanceStats(data: CreateStatsData) {
  const now = formatUKTimestamp();

  // Check if stats already exist for this period
  const existing = await db
    .select()
    .from(performanceStats)
    .where(
      and(
        eq(performanceStats.entityType, data.entityType),
        data.entityId ? eq(performanceStats.entityId, data.entityId) : sql`entity_id IS NULL`,
        eq(performanceStats.period, data.period),
        eq(performanceStats.periodStart, data.periodStart),
        eq(performanceStats.periodEnd, data.periodEnd)
      )!
    )
    .limit(1);

  const statsData = {
    entityType: data.entityType,
    entityId: data.entityId || null,
    period: data.period,
    periodStart: data.periodStart,
    periodEnd: data.periodEnd,
    ...data.metrics,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    calculatedAt: now,
    updatedAt: now,
  };

  if (existing.length > 0) {
    // Update existing
    const [updated] = await db
      .update(performanceStats)
      .set(statsData)
      .where(eq(performanceStats.id, existing[0].id))
      .returning();
    return updated;
  } else {
    // Create new
    const [created] = await db
      .insert(performanceStats)
      .values({
        ...statsData,
        createdAt: now,
      })
      .returning();
    return created;
  }
}

/**
 * Get performance stats with filters
 */
export async function getPerformanceStats(filters: StatsFilters = {}, limit = 100) {
  const query = db.select().from(performanceStats).$dynamic();

  const conditions = [];

  if (filters.entityType) {
    conditions.push(eq(performanceStats.entityType, filters.entityType));
  }

  if (filters.entityId) {
    conditions.push(eq(performanceStats.entityId, filters.entityId));
  }

  if (filters.period) {
    conditions.push(eq(performanceStats.period, filters.period));
  }

  if (filters.dateFrom) {
    conditions.push(gte(performanceStats.periodStart, filters.dateFrom));
  }

  if (filters.dateTo) {
    conditions.push(lte(performanceStats.periodEnd, filters.dateTo));
  }

  let finalQuery = query;
  if (conditions.length > 0) {
    finalQuery = query.where(and(...conditions)!);
  }

  const results = await finalQuery
    .orderBy(desc(performanceStats.periodStart))
    .limit(limit);

  return results.map(stat => ({
    ...stat,
    metadata: stat.metadata ? JSON.parse(stat.metadata as string) : null,
  }));
}

/**
 * Get latest stats for entity
 */
export async function getLatestStats(entityType: EntityType, entityId?: string, period: Period = 'daily') {
  const results = await getPerformanceStats({ entityType, entityId, period }, 1);
  return results[0] || null;
}

// ============================================
// STATS CALCULATION
// ============================================

/**
 * Calculate property performance stats
 */
export async function calculatePropertyStats(propertyId: number, period: Period = 'monthly'): Promise<PerformanceMetrics> {
  const dates = getPeriodDates(period);

  // Get bookings for period
  const propertyBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        eq(bookings.propertyId, propertyId),
        gte(bookings.createdAt, dates.start)
      )!
    );

  // Get enquiries for period
  const propertyEnquiries = await db
    .select()
    .from(enquiries)
    .where(
      and(
        eq(enquiries.propertyId, propertyId),
        gte(enquiries.createdAt, dates.start)
      )!
    );

  // Calculate booking metrics
  const confirmedBookings = propertyBookings.filter(b => b.bookingStatus === 'confirmed').length;
  const cancelledBookings = propertyBookings.filter(b => b.bookingStatus === 'cancelled').length;
  const pendingBookings = propertyBookings.filter(b => b.bookingStatus === 'pending').length;
  
  const totalRevenue = propertyBookings
    .filter(b => b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const depositsPaid = propertyBookings
    .filter(b => b.depositPaid)
    .reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  const balancesPaid = propertyBookings
    .filter(b => b.balancePaid)
    .reduce((sum, b) => sum + (b.balanceAmount || 0), 0);

  const totalGuests = propertyBookings.reduce((sum, b) => sum + b.numberOfGuests, 0);

  // Calculate enquiry metrics
  const newEnquiries = propertyEnquiries.filter(e => e.status === 'new').length;
  const inProgressEnquiries = propertyEnquiries.filter(e => e.status === 'in_progress').length;
  const resolvedEnquiries = propertyEnquiries.filter(e => e.status === 'resolved').length;
  
  const bookingEnquiries = propertyEnquiries.filter(e => e.enquiryType === 'booking');
  const convertedEnquiries = bookingEnquiries.filter(e => e.status === 'resolved' || e.status === 'closed').length;
  const conversionRate = bookingEnquiries.length > 0 ? (convertedEnquiries / bookingEnquiries.length) * 100 : 0;

  return {
    // Traffic (would need analytics integration)
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,

    // Enquiries
    totalEnquiries: propertyEnquiries.length,
    newEnquiries,
    inProgressEnquiries,
    resolvedEnquiries,
    avgResponseTime: 0, // Would need timestamp parsing
    conversionRate,

    // Bookings
    totalBookings: propertyBookings.length,
    confirmedBookings,
    cancelledBookings,
    pendingBookings,
    totalRevenue,
    avgBookingValue: propertyBookings.length > 0 ? totalRevenue / propertyBookings.length : 0,
    occupancyRate: 0, // Would need calendar calculation

    // Guests
    totalGuests,
    returningGuests: 0, // Would need guest history
    avgGuestsPerBooking: propertyBookings.length > 0 ? totalGuests / propertyBookings.length : 0,

    // Ratings (would need reviews table)
    totalReviews: 0,
    avgRating: 0,
    fiveStarReviews: 0,
    fourStarReviews: 0,
    threeStarReviews: 0,
    twoStarReviews: 0,
    oneStarReviews: 0,

    // Financial
    depositsPaid,
    balancesPaid,
    pendingPayments: totalRevenue - depositsPaid - balancesPaid,
    refundsIssued: 0,

    // Marketing
    emailSent: 0,
    emailOpened: 0,
    emailClicked: 0,
    emailOpenRate: 0,
    emailClickRate: 0,
  };
}

/**
 * Calculate owner performance stats
 */
export async function calculateOwnerStats(ownerId: string, period: Period = 'monthly'): Promise<PerformanceMetrics> {
  const dates = getPeriodDates(period);

  // Get owner's properties
  const ownerProperties = await db
    .select()
    .from(properties)
    .where(eq(properties.ownerId, ownerId));

  const propertyIds = ownerProperties.map(p => p.id);

  if (propertyIds.length === 0) {
    return createEmptyMetrics();
  }

  // Get all bookings for owner's properties
  const ownerBookings = await db
    .select()
    .from(bookings)
    .where(
      and(
        inArray(bookings.propertyId, propertyIds),
        gte(bookings.createdAt, dates.start)
      )!
    );

  // Get all enquiries for owner's properties
  const ownerEnquiries = await db
    .select()
    .from(enquiries)
    .where(
      and(
        inArray(enquiries.propertyId, propertyIds),
        gte(enquiries.createdAt, dates.start)
      )!
    );

  // Aggregate metrics across all properties
  const confirmedBookings = ownerBookings.filter(b => b.bookingStatus === 'confirmed').length;
  const cancelledBookings = ownerBookings.filter(b => b.bookingStatus === 'cancelled').length;
  const pendingBookings = ownerBookings.filter(b => b.bookingStatus === 'pending').length;
  
  const totalRevenue = ownerBookings
    .filter(b => b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const depositsPaid = ownerBookings
    .filter(b => b.depositPaid)
    .reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  const balancesPaid = ownerBookings
    .filter(b => b.balancePaid)
    .reduce((sum, b) => sum + (b.balanceAmount || 0), 0);

  const totalGuests = ownerBookings.reduce((sum, b) => sum + b.numberOfGuests, 0);

  const newEnquiries = ownerEnquiries.filter(e => e.status === 'new').length;
  const inProgressEnquiries = ownerEnquiries.filter(e => e.status === 'in_progress').length;
  const resolvedEnquiries = ownerEnquiries.filter(e => e.status === 'resolved').length;

  const bookingEnquiries = ownerEnquiries.filter(e => e.enquiryType === 'booking');
  const convertedEnquiries = bookingEnquiries.filter(e => e.status === 'resolved' || e.status === 'closed').length;
  const conversionRate = bookingEnquiries.length > 0 ? (convertedEnquiries / bookingEnquiries.length) * 100 : 0;

  return {
    // Traffic
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,

    // Enquiries
    totalEnquiries: ownerEnquiries.length,
    newEnquiries,
    inProgressEnquiries,
    resolvedEnquiries,
    avgResponseTime: 0,
    conversionRate,

    // Bookings
    totalBookings: ownerBookings.length,
    confirmedBookings,
    cancelledBookings,
    pendingBookings,
    totalRevenue,
    avgBookingValue: ownerBookings.length > 0 ? totalRevenue / ownerBookings.length : 0,
    occupancyRate: 0,

    // Guests
    totalGuests,
    returningGuests: 0,
    avgGuestsPerBooking: ownerBookings.length > 0 ? totalGuests / ownerBookings.length : 0,

    // Ratings
    totalReviews: 0,
    avgRating: 0,
    fiveStarReviews: 0,
    fourStarReviews: 0,
    threeStarReviews: 0,
    twoStarReviews: 0,
    oneStarReviews: 0,

    // Financial
    depositsPaid,
    balancesPaid,
    pendingPayments: totalRevenue - depositsPaid - balancesPaid,
    refundsIssued: 0,

    // Marketing
    emailSent: 0,
    emailOpened: 0,
    emailClicked: 0,
    emailOpenRate: 0,
    emailClickRate: 0,
  };
}

/**
 * Calculate platform-wide stats
 */
export async function calculatePlatformStats(period: Period = 'monthly'): Promise<PerformanceMetrics> {
  const dates = getPeriodDates(period);

  // Get all bookings
  const allBookings = await db
    .select()
    .from(bookings)
    .where(gte(bookings.createdAt, dates.start));

  // Get all enquiries
  const allEnquiries = await db
    .select()
    .from(enquiries)
    .where(gte(enquiries.createdAt, dates.start));

  const confirmedBookings = allBookings.filter(b => b.bookingStatus === 'confirmed').length;
  const cancelledBookings = allBookings.filter(b => b.bookingStatus === 'cancelled').length;
  const pendingBookings = allBookings.filter(b => b.bookingStatus === 'pending').length;
  
  const totalRevenue = allBookings
    .filter(b => b.bookingStatus === 'confirmed')
    .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

  const depositsPaid = allBookings
    .filter(b => b.depositPaid)
    .reduce((sum, b) => sum + (b.depositAmount || 0), 0);

  const balancesPaid = allBookings
    .filter(b => b.balancePaid)
    .reduce((sum, b) => sum + (b.balanceAmount || 0), 0);

  const totalGuests = allBookings.reduce((sum, b) => sum + b.numberOfGuests, 0);

  const newEnquiries = allEnquiries.filter(e => e.status === 'new').length;
  const inProgressEnquiries = allEnquiries.filter(e => e.status === 'in_progress').length;
  const resolvedEnquiries = allEnquiries.filter(e => e.status === 'resolved').length;

  const bookingEnquiries = allEnquiries.filter(e => e.enquiryType === 'booking');
  const convertedEnquiries = bookingEnquiries.filter(e => e.status === 'resolved' || e.status === 'closed').length;
  const conversionRate = bookingEnquiries.length > 0 ? (convertedEnquiries / bookingEnquiries.length) * 100 : 0;

  return {
    // Traffic
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,

    // Enquiries
    totalEnquiries: allEnquiries.length,
    newEnquiries,
    inProgressEnquiries,
    resolvedEnquiries,
    avgResponseTime: 0,
    conversionRate,

    // Bookings
    totalBookings: allBookings.length,
    confirmedBookings,
    cancelledBookings,
    pendingBookings,
    totalRevenue,
    avgBookingValue: allBookings.length > 0 ? totalRevenue / allBookings.length : 0,
    occupancyRate: 0,

    // Guests
    totalGuests,
    returningGuests: 0,
    avgGuestsPerBooking: allBookings.length > 0 ? totalGuests / allBookings.length : 0,

    // Ratings
    totalReviews: 0,
    avgRating: 0,
    fiveStarReviews: 0,
    fourStarReviews: 0,
    threeStarReviews: 0,
    twoStarReviews: 0,
    oneStarReviews: 0,

    // Financial
    depositsPaid,
    balancesPaid,
    pendingPayments: totalRevenue - depositsPaid - balancesPaid,
    refundsIssued: 0,

    // Marketing
    emailSent: 0,
    emailOpened: 0,
    emailClicked: 0,
    emailOpenRate: 0,
    emailClickRate: 0,
  };
}

/**
 * Create empty metrics
 */
function createEmptyMetrics(): PerformanceMetrics {
  return {
    pageViews: 0,
    uniqueVisitors: 0,
    avgSessionDuration: 0,
    bounceRate: 0,
    totalEnquiries: 0,
    newEnquiries: 0,
    inProgressEnquiries: 0,
    resolvedEnquiries: 0,
    avgResponseTime: 0,
    conversionRate: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    cancelledBookings: 0,
    pendingBookings: 0,
    totalRevenue: 0,
    avgBookingValue: 0,
    occupancyRate: 0,
    totalGuests: 0,
    returningGuests: 0,
    avgGuestsPerBooking: 0,
    totalReviews: 0,
    avgRating: 0,
    fiveStarReviews: 0,
    fourStarReviews: 0,
    threeStarReviews: 0,
    twoStarReviews: 0,
    oneStarReviews: 0,
    depositsPaid: 0,
    balancesPaid: 0,
    pendingPayments: 0,
    refundsIssued: 0,
    emailSent: 0,
    emailOpened: 0,
    emailClicked: 0,
    emailOpenRate: 0,
    emailClickRate: 0,
  };
}

// ============================================
// COMPARISON & TRENDS
// ============================================

/**
 * Compare current period with previous period
 */
export async function comparePerformance(
  entityType: EntityType,
  entityId: string | undefined,
  period: Period
): Promise<PerformanceComparison> {
  const currentDates = getPeriodDates(period);
  
  // Calculate previous period dates
  const currentStart = new Date(currentDates.start.split('/').reverse().join('-'));
  let previousStart: Date;
  
  switch (period) {
    case 'daily':
      previousStart = new Date(currentStart.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'weekly':
      previousStart = new Date(currentStart.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'monthly':
      previousStart = new Date(currentStart.getFullYear(), currentStart.getMonth() - 1, 1);
      break;
    case 'yearly':
      previousStart = new Date(currentStart.getFullYear() - 1, 0, 1);
      break;
  }

  const previousDates = getPeriodDates(period, previousStart);

  // Get stats for both periods
  const currentStats = await getPerformanceStats({
    entityType,
    entityId,
    period,
    dateFrom: currentDates.start,
    dateTo: currentDates.end,
  }, 1);

  const previousStats = await getPerformanceStats({
    entityType,
    entityId,
    period,
    dateFrom: previousDates.start,
    dateTo: previousDates.end,
  }, 1);

  const normalizeStats = (stat: any): any => {
    if (!stat) return createEmptyMetrics();
    return {
      ...stat,
      pageViews: stat.pageViews ?? 0,
      uniqueVisitors: stat.uniqueVisitors ?? 0,
      sessions: stat.sessions ?? 0,
      bounceRate: stat.bounceRate ?? 0,
      avgSessionDuration: stat.avgSessionDuration ?? 0,
      totalClicks: stat.totalClicks ?? 0,
      searchAppearances: stat.searchAppearances ?? 0,
      avgSearchPosition: stat.avgSearchPosition ?? 0,
      ctr: stat.ctr ?? 0,
      conversions: stat.conversions ?? 0,
      conversionRate: stat.conversionRate ?? 0,
      leads: stat.leads ?? 0,
      leadConversionRate: stat.leadConversionRate ?? 0,
      bookings: stat.bookings ?? 0,
      bookingValue: stat.bookingValue ?? 0,
      avgBookingValue: stat.avgBookingValue ?? 0,
      revenue: stat.revenue ?? 0,
      avgRevenuePerBooking: stat.avgRevenuePerBooking ?? 0,
      occupancyRate: stat.occupancyRate ?? 0,
      adr: stat.adr ?? 0,
      revpar: stat.revpar ?? 0,
      cancellations: stat.cancellations ?? 0,
      cancellationRate: stat.cancellationRate ?? 0,
      enquiries: stat.enquiries ?? 0,
      enquiryResponseTime: stat.enquiryResponseTime ?? 0,
      enquiryConversionRate: stat.enquiryConversionRate ?? 0,
      reviews: stat.reviews ?? 0,
      averageRating: stat.averageRating ?? 0,
    };
  };

  const current = normalizeStats(currentStats[0]);
  const previous = normalizeStats(previousStats[0]);

  // Calculate changes
  const changes: any = {};
  const metrics = Object.keys(current) as Array<keyof PerformanceMetrics>;

  for (const metric of metrics) {
    const currentValue = current[metric] as number;
    const previousValue = previous[metric] as number;
    const diff = currentValue - previousValue;
    const percentage = previousValue !== 0 ? (diff / previousValue) * 100 : 0;
    
    changes[metric] = {
      value: diff,
      percentage: Math.round(percentage * 10) / 10,
      trend: diff > 0 ? 'up' : diff < 0 ? 'down' : 'stable',
    };
  }

  return {
    current,
    previous,
    changes,
  };
}

/**
 * Get time-series data
 */
export async function getTimeSeriesData(
  entityType: EntityType,
  entityId: string | undefined,
  period: Period,
  points = 12
) {
  const data = [];
  const today = new Date();

  for (let i = points - 1; i >= 0; i--) {
    let date: Date;
    
    switch (period) {
      case 'daily':
        date = new Date(today.getTime() - i * 24 * 60 * 60 * 1000);
        break;
      case 'weekly':
        date = new Date(today.getTime() - i * 7 * 24 * 60 * 60 * 1000);
        break;
      case 'monthly':
        date = new Date(today.getFullYear(), today.getMonth() - i, 1);
        break;
      case 'yearly':
        date = new Date(today.getFullYear() - i, 0, 1);
        break;
    }

    const dates = getPeriodDates(period, date);
    const stats = await getPerformanceStats({
      entityType,
      entityId,
      period,
      dateFrom: dates.start,
      dateTo: dates.end,
    }, 1);

    data.push({
      period: dates.start,
      data: stats[0] || createEmptyMetrics(),
    });
  }

  return data;
}
