/**
 * Owner Dashboard Metrics & Analytics
 * 
 * Provides comprehensive analytics for property owners.
 * All timestamps in UK format (DD/MM/YYYY HH:mm:ss).
 */

import { db } from '@/db';
import { properties, enquiries } from '@/db/schema';
import { eq, and, gte, lte, sql, desc } from 'drizzle-orm';
import { nowUKFormatted, formatDateUK } from './date-utils';

// ============================================
// TYPES & INTERFACES
// ============================================

export interface DashboardMetrics {
  overview: OverviewMetrics;
  properties: PropertyMetrics;
  enquiries: EnquiryMetrics;
  revenue: RevenueMetrics;
  performance: PerformanceMetrics;
  trends: TrendData;
  generatedAt: string; // UK timestamp
}

export interface OverviewMetrics {
  totalProperties: number;
  publishedProperties: number;
  draftProperties: number;
  totalEnquiries: number;
  newEnquiriesThisMonth: number;
  responseRate: number; // percentage
  averageResponseTime: string; // e.g., "2.5 hours"
}

export interface PropertyMetrics {
  byStatus: {
    published: number;
    draft: number;
    archived: number;
  };
  byType: Record<string, number>;
  byRegion: Record<string, number>;
  mostViewed: Array<{
    id: string;
    name: string;
    views: number;
    lastViewedAt: string;
  }>;
  mostEnquired: Array<{
    id: string;
    name: string;
    enquiries: number;
  }>;
}

export interface EnquiryMetrics {
  total: number;
  byStatus: {
    new: number;
    read: number;
    replied: number;
    archived: number;
  };
  byPeriod: {
    today: number;
    thisWeek: number;
    thisMonth: number;
    last30Days: number;
  };
  averageResponseTime: number; // in hours
  responseRate: number; // percentage
  conversionRate: number; // percentage (enquiries to bookings)
}

export interface RevenueMetrics {
  estimatedMonthlyRevenue: number;
  averagePricePerNight: number;
  highestPricedProperty: {
    id: string;
    name: string;
    price: number;
  } | null;
  lowestPricedProperty: {
    id: string;
    name: string;
    price: number;
  } | null;
  totalValue: number; // sum of all property values
}

export interface PerformanceMetrics {
  topPerformers: Array<{
    propertyId: string;
    propertyName: string;
    score: number;
    metrics: {
      views: number;
      enquiries: number;
      bookings: number;
      rating: number;
    };
  }>;
  underPerformers: Array<{
    propertyId: string;
    propertyName: string;
    issues: string[];
    suggestions: string[];
  }>;
}

export interface TrendData {
  enquiries: Array<{
    date: string; // DD/MM/YYYY
    count: number;
  }>;
  views: Array<{
    date: string; // DD/MM/YYYY
    count: number;
  }>;
  revenue: Array<{
    month: string; // MM/YYYY
    amount: number;
  }>;
}

export interface PropertyAnalytics {
  propertyId: string;
  propertyName: string;
  views: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    trend: 'up' | 'down' | 'stable';
    trendPercentage: number;
  };
  enquiries: {
    total: number;
    thisMonth: number;
    lastMonth: number;
    conversionRate: number;
  };
  performance: {
    score: number; // 0-100
    ranking: number; // among owner's properties
    strengths: string[];
    improvements: string[];
  };
  lastUpdatedAt: string;
}

// ============================================
// DASHBOARD METRICS
// ============================================

/**
 * Get comprehensive dashboard metrics
 */
export async function getDashboardMetrics(userId: string): Promise<DashboardMetrics> {
  const [overview, propertyMetrics, enquiryMetrics, revenue, performance, trends] = await Promise.all([
    getOverviewMetrics(userId),
    getPropertyMetrics(userId),
    getEnquiryMetrics(userId),
    getRevenueMetrics(userId),
    getPerformanceMetrics(userId),
    getTrendData(userId),
  ]);

  return {
    overview,
    properties: propertyMetrics,
    enquiries: enquiryMetrics,
    revenue,
    performance,
    trends,
    generatedAt: nowUKFormatted(),
  };
}

/**
 * Get overview metrics
 */
export async function getOverviewMetrics(userId: string): Promise<OverviewMetrics> {
  // In production, query actual data from database
  const userProperties = await db
    .select()
    .from(properties)
    .where(eq(properties.ownerId, userId));

  const totalProperties = userProperties.length;
  const publishedProperties = userProperties.filter(p => p.isPublished).length;
  const draftProperties = totalProperties - publishedProperties;

  // Mock enquiry data - in production, query enquiries table
  const totalEnquiries = 0;
  const newEnquiriesThisMonth = 0;
  const responseRate = 0;
  const averageResponseTime = "0 hours";

  return {
    totalProperties,
    publishedProperties,
    draftProperties,
    totalEnquiries,
    newEnquiriesThisMonth,
    responseRate,
    averageResponseTime,
  };
}

/**
 * Get property-specific metrics
 */
export async function getPropertyMetrics(userId: string): Promise<PropertyMetrics> {
  const userProperties = await db
    .select()
    .from(properties)
    .where(eq(properties.ownerId, userId));

  const byStatus = {
    published: userProperties.filter(p => p.isPublished).length,
    draft: userProperties.filter(p => !p.isPublished).length,
    archived: 0,
  };

  // Group by type
  const byType: Record<string, number> = {};
  userProperties.forEach(p => {
    const type = p.region || 'Other';
    byType[type] = (byType[type] || 0) + 1;
  });

  // Group by region
  const byRegion: Record<string, number> = {};
  userProperties.forEach(p => {
    const region = p.region || 'Unknown';
    byRegion[region] = (byRegion[region] || 0) + 1;
  });

  // Mock views and enquiries - in production, query from analytics
  const mostViewed: Array<any> = [];
  const mostEnquired: Array<any> = [];

  return {
    byStatus,
    byType,
    byRegion,
    mostViewed,
    mostEnquired,
  };
}

/**
 * Get enquiry metrics
 */
export async function getEnquiryMetrics(userId: string): Promise<EnquiryMetrics> {
  // In production, query from enquiries table
  return {
    total: 0,
    byStatus: {
      new: 0,
      read: 0,
      replied: 0,
      archived: 0,
    },
    byPeriod: {
      today: 0,
      thisWeek: 0,
      thisMonth: 0,
      last30Days: 0,
    },
    averageResponseTime: 0,
    responseRate: 0,
    conversionRate: 0,
  };
}

/**
 * Get revenue metrics
 */
export async function getRevenueMetrics(userId: string): Promise<RevenueMetrics> {
  const userProperties = await db
    .select()
    .from(properties)
    .where(eq(properties.ownerId, userId));

  if (userProperties.length === 0) {
    return {
      estimatedMonthlyRevenue: 0,
      averagePricePerNight: 0,
      highestPricedProperty: null,
      lowestPricedProperty: null,
      totalValue: 0,
    };
  }

  // Calculate average price
  const prices = userProperties.map(p => p.priceFromMidweek || 0);
  const averagePricePerNight = prices.reduce((sum, price) => sum + price, 0) / prices.length;

  // Find highest and lowest priced
  const sorted = [...userProperties].sort((a, b) => (b.priceFromMidweek || 0) - (a.priceFromMidweek || 0));
  
  const highestPricedProperty = sorted[0] ? {
    id: sorted[0].id.toString(),
    name: sorted[0].title,
    price: sorted[0].priceFromMidweek || 0,
  } : null;

  const lowestPricedProperty = sorted[sorted.length - 1] ? {
    id: sorted[sorted.length - 1].id.toString(),
    name: sorted[sorted.length - 1].title,
    price: sorted[sorted.length - 1].priceFromMidweek || 0,
  } : null;

  // Estimate monthly revenue (assume 50% occupancy, 15 nights per month)
  const estimatedMonthlyRevenue = userProperties.reduce((sum, p) => {
    return sum + (p.priceFromMidweek || 0) * 15;
  }, 0);

  const totalValue = prices.reduce((sum, price) => sum + price, 0);

  return {
    estimatedMonthlyRevenue,
    averagePricePerNight,
    highestPricedProperty,
    lowestPricedProperty,
    totalValue,
  };
}

/**
 * Get performance metrics
 */
export async function getPerformanceMetrics(userId: string): Promise<PerformanceMetrics> {
  // In production, calculate based on actual analytics data
  return {
    topPerformers: [],
    underPerformers: [],
  };
}

/**
 * Get trend data
 */
export async function getTrendData(userId: string): Promise<TrendData> {
  // In production, query time-series data
  return {
    enquiries: [],
    views: [],
    revenue: [],
  };
}

// ============================================
// PROPERTY ANALYTICS
// ============================================

/**
 * Get detailed analytics for a specific property
 */
export async function getPropertyAnalytics(
  userId: string,
  propertyId: string
): Promise<PropertyAnalytics | null> {
  // Verify ownership
  const property = await db
    .select()
    .from(properties)
    .where(and(eq(properties.id, parseInt(propertyId)), eq(properties.ownerId, userId)))
    .limit(1);

  if (!property || property.length === 0) {
    return null;
  }

  // In production, query actual analytics data
  return {
    propertyId,
    propertyName: property[0].title,
    views: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      trend: 'stable',
      trendPercentage: 0,
    },
    enquiries: {
      total: 0,
      thisMonth: 0,
      lastMonth: 0,
      conversionRate: 0,
    },
    performance: {
      score: 0,
      ranking: 0,
      strengths: [],
      improvements: [],
    },
    lastUpdatedAt: nowUKFormatted(),
  };
}

// ============================================
// COMPARISON & BENCHMARKS
// ============================================

/**
 * Compare property performance
 */
export async function compareProperties(
  userId: string,
  propertyIds: string[]
): Promise<Array<{
  propertyId: string;
  propertyName: string;
  metrics: Record<string, number>;
  ranking: number;
}>> {
  // In production, fetch and compare actual metrics
  return [];
}

/**
 * Get industry benchmarks
 */
export async function getIndustryBenchmarks(): Promise<{
  averagePricePerNight: number;
  averageOccupancyRate: number;
  averageResponseTime: number;
  averageRating: number;
}> {
  // In production, calculate from all properties
  return {
    averagePricePerNight: 150,
    averageOccupancyRate: 65,
    averageResponseTime: 4.5,
    averageRating: 4.2,
  };
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

/**
 * Export metrics to CSV
 */
export function exportMetricsToCSV(metrics: DashboardMetrics): string {
  const lines: string[] = [
    '# Owner Dashboard Metrics',
    `Generated at: ${metrics.generatedAt}`,
    '',
    '## Overview',
    `Total Properties,${metrics.overview.totalProperties}`,
    `Published Properties,${metrics.overview.publishedProperties}`,
    `Draft Properties,${metrics.overview.draftProperties}`,
    `Total Enquiries,${metrics.overview.totalEnquiries}`,
    `New Enquiries This Month,${metrics.overview.newEnquiriesThisMonth}`,
    `Response Rate,${metrics.overview.responseRate}%`,
    '',
    '## Revenue',
    `Estimated Monthly Revenue,£${metrics.revenue.estimatedMonthlyRevenue.toFixed(2)}`,
    `Average Price Per Night,£${metrics.revenue.averagePricePerNight.toFixed(2)}`,
    `Total Value,£${metrics.revenue.totalValue.toFixed(2)}`,
  ];

  return lines.join('\n');
}
