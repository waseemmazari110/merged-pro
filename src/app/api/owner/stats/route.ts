import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, properties } from '@/db/schema';
import { eq, and, gte, sql, count } from 'drizzle-orm';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  isOwner,
  unauthorizedResponse,
  unauthenticatedResponse
} from "@/lib/auth-roles";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    // Must be owner or admin
    if (!currentUser || (!isOwner(currentUser) && !isAdmin(currentUser))) {
      return unauthorizedResponse('Only owners and admins can view owner stats');
    }

    // Get owner's properties
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(
        isAdmin(currentUser) 
          ? sql`1=1`  // Admin sees all
          : eq(properties.ownerId, currentUser.id)
      );

    if (ownerProperties.length === 0) {
      return NextResponse.json({
        totalBookings: 0,
        bookingsGrowth: 0,
        activeProperties: 0,
        propertiesGrowth: 0,
        revenue: 0,
        revenueGrowth: 0,
        upcomingCheckIns: 0,
        checkInsGrowth: 0,
      }, { status: 200 });
    }

    const propertyIds = ownerProperties.map(p => p.id);
    
    // Get all bookings for owner's properties (select specific fields to avoid JSON parsing issues)
    const ownerBookings = await db
      .select({
        id: bookings.id,
        propertyId: bookings.propertyId,
        propertyName: bookings.propertyName,
        guestName: bookings.guestName,
        guestEmail: bookings.guestEmail,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        numberOfGuests: bookings.numberOfGuests,
        totalPrice: bookings.totalPrice,
        bookingStatus: bookings.bookingStatus,
        createdAt: bookings.createdAt,
      })
      .from(bookings)
      .where(
        sql`${bookings.propertyId} IN ${sql.raw(`(${propertyIds.join(',')})`)} OR ${bookings.propertyName} IN ${sql.raw(`(${ownerProperties.map(p => `'${p.title.replace(/'/g, "''")}'`).join(',')})`)}`
      );

    // Calculate stats
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, now.getDate());
    const lastMonthStr = lastMonth.toISOString().split('T')[0];
    
    // Total bookings
    const totalBookings = ownerBookings.length;
    const lastMonthBookings = ownerBookings.filter(b => b.createdAt >= lastMonthStr).length;
    const bookingsGrowth = lastMonthBookings > 0 ? ((lastMonthBookings / totalBookings) * 100).toFixed(1) : '0';

    // Active properties (published)
    const activeProperties = ownerProperties.filter(p => p.isPublished).length;
    const propertiesGrowth = '+0%'; // Calculate based on newly published properties

    // Revenue
    const revenue = ownerBookings
      .filter(b => b.bookingStatus === 'confirmed')
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const lastMonthRevenue = ownerBookings
      .filter(b => b.bookingStatus === 'confirmed' && b.createdAt >= lastMonthStr)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0);
    const revenueGrowth = lastMonthRevenue > 0 ? `+${((lastMonthRevenue / revenue) * 100).toFixed(1)}%` : '+0%';

    // Upcoming check-ins (next 30 days)
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    const upcomingCheckIns = ownerBookings.filter(b => 
      b.checkInDate >= now.toISOString().split('T')[0] && 
      b.checkInDate <= thirtyDaysFromNow
    ).length;

    return NextResponse.json({
      totalBookings,
      bookingsGrowth: `+${bookingsGrowth}%`,
      activeProperties,
      propertiesGrowth,
      revenue,
      revenueGrowth,
      upcomingCheckIns,
      checkInsGrowth: '+0%',
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching owner stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owner statistics' },
      { status: 500 }
    );
  }
}
