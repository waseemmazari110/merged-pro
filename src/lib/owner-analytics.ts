/**
 * Owner Dashboard Analytics & Performance Stats
 * Comprehensive analytics for property performance and bookings
 */

import { db } from '@/db';
import { properties, bookings, enquiries, propertyImages } from '@/db/schema';
import { eq, and, desc, gte, lte, sql } from 'drizzle-orm';
import { nowUKFormatted, formatDateUK } from '@/lib/date-utils';

export interface OwnerStats {
  totalProperties: number;
  activeProperties: number;
  pendingApproval: number;
  totalBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  totalRevenue: number;
  monthRevenue: number;
  totalEnquiries: number;
  newEnquiries: number;
  averageBookingValue: number;
  occupancyRate: number;
  topPerformingProperty?: PropertyPerformance;
}

export interface PropertyPerformance {
  propertyId: number;
  propertyName: string;
  totalBookings: number;
  revenue: number;
  occupancyRate: number;
  averageBookingValue: number;
  enquiryCount: number;
  conversionRate: number;
}

export interface RevenueByMonth {
  month: string;
  revenue: number;
  bookings: number;
}

export interface BookingTrend {
  date: string;
  bookings: number;
  revenue: number;
}

/**
 * Log analytics action with UK timestamp
 */
function logAnalyticsAction(action: string, details?: any) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] Analytics: ${action}`, details || '');
}

// ============================================
// OWNER DASHBOARD STATS
// ============================================

/**
 * Get comprehensive owner statistics
 */
export async function getOwnerDashboardStats(ownerId: string): Promise<OwnerStats> {
  try {
    logAnalyticsAction('Fetching owner dashboard stats', { ownerId });

    // Get all properties for owner
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    const propertyIds = ownerProperties.map(p => p.id);

    // Get bookings for owner's properties
    const allBookings = await db
      .select()
      .from(bookings)
      .where(sql`${bookings.propertyId} IN (${sql.join(propertyIds.map(id => sql`${id}`), sql`, `)})`);

    // Calculate current month start
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const monthStartFormatted = formatDateUK(monthStart);

    // Filter bookings by status
    const confirmedBookings = allBookings.filter(b => 
      b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed'
    );
    const pendingBookings = allBookings.filter(b => b.bookingStatus === 'pending');

    // Calculate revenue
    const totalRevenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const monthRevenue = confirmedBookings
      .filter(b => {
        const bookingDate = new Date(b.createdAt);
        return bookingDate >= monthStart;
      })
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);

    // Get enquiries
    const allEnquiries = await db
      .select()
      .from(enquiries)
      .where(sql`${enquiries.status} != 'spam'`);

    const newEnquiries = allEnquiries.filter(e => e.status === 'new').length;

    // Calculate averages
    const averageBookingValue = confirmedBookings.length > 0 
      ? totalRevenue / confirmedBookings.length 
      : 0;

    // Calculate occupancy rate (simplified - based on bookings vs available days)
    const daysInYear = 365;
    const totalAvailableDays = ownerProperties.length * daysInYear;
    const bookedDays = confirmedBookings.reduce((sum, b) => {
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    const occupancyRate = totalAvailableDays > 0 
      ? (bookedDays / totalAvailableDays) * 100 
      : 0;

    // Get top performing property
    const propertiesPerformance = await Promise.all(
      ownerProperties.map(async (property) => {
        const propertyBookings = allBookings.filter(b => b.propertyId === property.id);
        const propertyConfirmedBookings = propertyBookings.filter(b => 
          b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed'
        );
        const propertyRevenue = propertyConfirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);

        return {
          propertyId: property.id,
          propertyName: property.title,
          totalBookings: propertyConfirmedBookings.length,
          revenue: propertyRevenue,
          occupancyRate: 0, // Simplified for now
          averageBookingValue: propertyConfirmedBookings.length > 0 
            ? propertyRevenue / propertyConfirmedBookings.length 
            : 0,
          enquiryCount: 0,
          conversionRate: 0,
        };
      })
    );

    const topPerformingProperty = propertiesPerformance.sort((a, b) => b.revenue - a.revenue)[0];

    const stats: OwnerStats = {
      totalProperties: ownerProperties.length,
      activeProperties: ownerProperties.filter(p => p.isPublished && p.status === 'approved').length,
      pendingApproval: ownerProperties.filter(p => p.status === 'pending').length,
      totalBookings: confirmedBookings.length,
      confirmedBookings: confirmedBookings.length,
      pendingBookings: pendingBookings.length,
      totalRevenue,
      monthRevenue,
      totalEnquiries: allEnquiries.length,
      newEnquiries,
      averageBookingValue,
      occupancyRate,
      topPerformingProperty,
    };

    logAnalyticsAction('Owner stats calculated', { 
      ownerId, 
      totalProperties: stats.totalProperties,
      totalRevenue: stats.totalRevenue 
    });

    return stats;

  } catch (error) {
    logAnalyticsAction('Error fetching owner stats', { error: (error as Error).message });
    throw error;
  }
}

// ============================================
// PROPERTY PERFORMANCE ANALYTICS
// ============================================

/**
 * Get detailed performance for a specific property
 */
export async function getPropertyPerformance(
  propertyId: number,
  ownerId: string
): Promise<PropertyPerformance | null> {
  try {
    logAnalyticsAction('Fetching property performance', { propertyId, ownerId });

    // Verify ownership
    const [property] = await db
      .select()
      .from(properties)
      .where(and(
        eq(properties.id, propertyId),
        eq(properties.ownerId, ownerId)
      ));

    if (!property) {
      return null;
    }

    // Get bookings
    const propertyBookings = await db
      .select()
      .from(bookings)
      .where(eq(bookings.propertyId, propertyId));

    const confirmedBookings = propertyBookings.filter(b => 
      b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed'
    );

    const revenue = confirmedBookings.reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const averageBookingValue = confirmedBookings.length > 0 
      ? revenue / confirmedBookings.length 
      : 0;

    // Calculate occupancy
    const daysInYear = 365;
    const bookedDays = confirmedBookings.reduce((sum, b) => {
      const checkIn = new Date(b.checkInDate);
      const checkOut = new Date(b.checkOutDate);
      const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
      return sum + days;
    }, 0);
    const occupancyRate = (bookedDays / daysInYear) * 100;

    // Get enquiries (would need to implement this)
    const enquiryCount = 0;
    const conversionRate = enquiryCount > 0 
      ? (confirmedBookings.length / enquiryCount) * 100 
      : 0;

    const performance: PropertyPerformance = {
      propertyId,
      propertyName: property.title,
      totalBookings: confirmedBookings.length,
      revenue,
      occupancyRate,
      averageBookingValue,
      enquiryCount,
      conversionRate,
    };

    return performance;

  } catch (error) {
    logAnalyticsAction('Error fetching property performance', { error: (error as Error).message });
    return null;
  }
}

// ============================================
// REVENUE ANALYTICS
// ============================================

/**
 * Get revenue breakdown by month for the last 12 months
 */
export async function getRevenueByMonth(ownerId: string): Promise<RevenueByMonth[]> {
  try {
    logAnalyticsAction('Fetching revenue by month', { ownerId });

    // Get owner's properties
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    const propertyIds = ownerProperties.map(p => p.id);

    if (propertyIds.length === 0) {
      return [];
    }

    // Get all bookings for the last 12 months
    const twelveMonthsAgo = new Date();
    twelveMonthsAgo.setMonth(twelveMonthsAgo.getMonth() - 12);

    const allBookings = await db
      .select()
      .from(bookings)
      .where(sql`${bookings.propertyId} IN (${sql.join(propertyIds.map(id => sql`${id}`), sql`, `)})`);

    const confirmedBookings = allBookings.filter(b => 
      b.bookingStatus === 'confirmed' || b.bookingStatus === 'completed'
    );

    // Group by month
    const revenueByMonth: Map<string, { revenue: number; bookings: number }> = new Map();

    for (const booking of confirmedBookings) {
      const bookingDate = new Date(booking.createdAt);
      if (bookingDate >= twelveMonthsAgo) {
        const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`;
        
        if (!revenueByMonth.has(monthKey)) {
          revenueByMonth.set(monthKey, { revenue: 0, bookings: 0 });
        }

        const data = revenueByMonth.get(monthKey)!;
        data.revenue += booking.totalPrice || 0;
        data.bookings += 1;
      }
    }

    // Convert to array and sort
    const result: RevenueByMonth[] = Array.from(revenueByMonth.entries())
      .map(([month, data]) => ({
        month,
        revenue: data.revenue,
        bookings: data.bookings,
      }))
      .sort((a, b) => a.month.localeCompare(b.month));

    return result;

  } catch (error) {
    logAnalyticsAction('Error fetching revenue by month', { error: (error as Error).message });
    return [];
  }
}

// ============================================
// BOOKING TRENDS
// ============================================

/**
 * Get booking trends for the last 30 days
 */
export async function getBookingTrends(ownerId: string): Promise<BookingTrend[]> {
  try {
    logAnalyticsAction('Fetching booking trends', { ownerId });

    // Get owner's properties
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    const propertyIds = ownerProperties.map(p => p.id);

    if (propertyIds.length === 0) {
      return [];
    }

    // Get bookings for last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const allBookings = await db
      .select()
      .from(bookings)
      .where(sql`${bookings.propertyId} IN (${sql.join(propertyIds.map(id => sql`${id}`), sql`, `)})`);

    const recentBookings = allBookings.filter(b => {
      const bookingDate = new Date(b.createdAt);
      return bookingDate >= thirtyDaysAgo;
    });

    // Group by date
    const trendsByDate: Map<string, { bookings: number; revenue: number }> = new Map();

    for (const booking of recentBookings) {
      const bookingDate = new Date(booking.createdAt);
      const dateKey = formatDateUK(bookingDate);

      if (!trendsByDate.has(dateKey)) {
        trendsByDate.set(dateKey, { bookings: 0, revenue: 0 });
      }

      const data = trendsByDate.get(dateKey)!;
      data.bookings += 1;
      data.revenue += booking.totalPrice || 0;
    }

    // Convert to array
    const result: BookingTrend[] = Array.from(trendsByDate.entries())
      .map(([date, data]) => ({
        date,
        bookings: data.bookings,
        revenue: data.revenue,
      }))
      .sort((a, b) => a.date.localeCompare(b.date));

    return result;

  } catch (error) {
    logAnalyticsAction('Error fetching booking trends', { error: (error as Error).message });
    return [];
  }
}

// ============================================
// PROPERTY COMPARISON
// ============================================

/**
 * Compare all properties for an owner
 */
export async function compareOwnerProperties(ownerId: string): Promise<PropertyPerformance[]> {
  try {
    logAnalyticsAction('Comparing owner properties', { ownerId });

    // Get all properties
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, ownerId));

    // Get performance for each property
    const performances = await Promise.all(
      ownerProperties.map(property => getPropertyPerformance(property.id, ownerId))
    );

    // Filter out nulls and sort by revenue
    const validPerformances = performances.filter(p => p !== null) as PropertyPerformance[];
    validPerformances.sort((a, b) => b.revenue - a.revenue);

    return validPerformances;

  } catch (error) {
    logAnalyticsAction('Error comparing properties', { error: (error as Error).message });
    return [];
  }
}

// ============================================
// EXPORT FUNCTIONS
// ============================================

/**
 * Export owner stats as CSV data
 */
export function exportStatsToCSV(stats: OwnerStats): string {
  const csv = [
    'Metric,Value',
    `Total Properties,${stats.totalProperties}`,
    `Active Properties,${stats.activeProperties}`,
    `Pending Approval,${stats.pendingApproval}`,
    `Total Bookings,${stats.totalBookings}`,
    `Confirmed Bookings,${stats.confirmedBookings}`,
    `Pending Bookings,${stats.pendingBookings}`,
    `Total Revenue,£${stats.totalRevenue.toFixed(2)}`,
    `Month Revenue,£${stats.monthRevenue.toFixed(2)}`,
    `Average Booking Value,£${stats.averageBookingValue.toFixed(2)}`,
    `Occupancy Rate,${stats.occupancyRate.toFixed(2)}%`,
    `Total Enquiries,${stats.totalEnquiries}`,
    `New Enquiries,${stats.newEnquiries}`,
  ].join('\n');

  return csv;
}
