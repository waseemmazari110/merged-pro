import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings } from '@/db/schema';
import { eq, gte, count, sum, avg, sql } from 'drizzle-orm';

export async function GET(request: NextRequest) {
  try {
    // Get total bookings count
    const totalBookingsResult = await db
      .select({ count: count() })
      .from(bookings);
    const totalBookings = totalBookingsResult[0]?.count || 0;

    // Get bookings by status
    const statusResults = await db
      .select({
        status: bookings.bookingStatus,
        count: count(),
      })
      .from(bookings)
      .groupBy(bookings.bookingStatus);

    const bookingsByStatus: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      cancelled: 0,
      completed: 0,
    };

    statusResults.forEach((result) => {
      if (result.status) {
        bookingsByStatus[result.status] = result.count;
      }
    });

    // Calculate total revenue (confirmed or completed bookings)
    const revenueResult = await db
      .select({
        total: sum(bookings.totalPrice),
      })
      .from(bookings)
      .where(
        sql`${bookings.bookingStatus} IN ('confirmed', 'completed')`
      );
    const totalRevenue = Number(revenueResult[0]?.total) || 0;

    // Calculate pending deposits
    const depositsResult = await db
      .select({
        total: sum(bookings.depositAmount),
      })
      .from(bookings)
      .where(eq(bookings.depositPaid, false));
    const depositsPending = Number(depositsResult[0]?.total) || 0;

    // Calculate pending balances
    const balancesResult = await db
      .select({
        total: sum(bookings.balanceAmount),
      })
      .from(bookings)
      .where(eq(bookings.balancePaid, false));
    const balancesPending = Number(balancesResult[0]?.total) || 0;

    // Count upcoming bookings (check-in date in the future)
    const today = new Date().toISOString().split('T')[0];
    const upcomingResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(gte(bookings.checkInDate, today));
    const upcomingBookings = upcomingResult[0]?.count || 0;

    // Count recent bookings (created in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoISO = thirtyDaysAgo.toISOString();
    const recentResult = await db
      .select({ count: count() })
      .from(bookings)
      .where(gte(bookings.createdAt, thirtyDaysAgoISO));
    const recentBookings = recentResult[0]?.count || 0;

    // Calculate average group size
    const avgGuestsResult = await db
      .select({
        average: avg(bookings.numberOfGuests),
      })
      .from(bookings);
    const averageGroupSize = Number(avgGuestsResult[0]?.average) || 0;

    // Get popular properties (top 5)
    const popularPropertiesResult = await db
      .select({
        propertyName: bookings.propertyName,
        count: count(),
      })
      .from(bookings)
      .groupBy(bookings.propertyName)
      .orderBy(sql`count(*) DESC`)
      .limit(5);

    const popularProperties = popularPropertiesResult.map((result) => ({
      propertyName: result.propertyName,
      count: result.count,
    }));

    // Get occasion breakdown
    const occasionResults = await db
      .select({
        occasion: bookings.occasion,
        count: count(),
      })
      .from(bookings)
      .groupBy(bookings.occasion);

    const occasionBreakdown: Record<string, number> = {};
    occasionResults.forEach((result) => {
      if (result.occasion) {
        occasionBreakdown[result.occasion] = result.count;
      }
    });

    return NextResponse.json({
      totalBookings,
      bookingsByStatus,
      totalRevenue: Math.round(totalRevenue * 100) / 100,
      depositsPending: Math.round(depositsPending * 100) / 100,
      balancesPending: Math.round(balancesPending * 100) / 100,
      upcomingBookings,
      recentBookings,
      averageGroupSize: Math.round(averageGroupSize * 10) / 10,
      popularProperties,
      occasionBreakdown,
    });
  } catch (error) {
    console.error('GET stats error:', error);
    return NextResponse.json(
      { error: 'Internal server error: ' + (error as Error).message },
      { status: 500 }
    );
  }
}