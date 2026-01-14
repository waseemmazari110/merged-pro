import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, properties } from '@/db/schema';
import { eq, and, sql, desc } from 'drizzle-orm';
import { 
  getCurrentUserWithRole, 
  isAdmin,
  isOwner,
  unauthorizedResponse
} from "@/lib/auth-roles";

export async function GET(request: NextRequest) {
  try {
    const currentUser = await getCurrentUserWithRole();
    
    // Must be owner or admin
    if (!currentUser || (!isOwner(currentUser) && !isAdmin(currentUser))) {
      return unauthorizedResponse('Only owners and admins can view bookings');
    }

    const searchParams = request.nextUrl.searchParams;
    const limit = Math.min(parseInt(searchParams.get('limit') ?? '10'), 50);
    
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
        bookings: [],
        total: 0,
      }, { status: 200 });
    }

    const propertyIds = ownerProperties.map(p => p.id);
    const propertyNames = ownerProperties.map(p => p.title);
    
    // Get recent bookings for owner's properties (exclude JSON fields to avoid parsing errors)
    const ownerBookings = await db
      .select({
        id: bookings.id,
        propertyId: bookings.propertyId,
        propertyName: bookings.propertyName,
        propertyLocation: bookings.propertyLocation,
        guestName: bookings.guestName,
        guestEmail: bookings.guestEmail,
        guestPhone: bookings.guestPhone,
        checkInDate: bookings.checkInDate,
        checkOutDate: bookings.checkOutDate,
        numberOfGuests: bookings.numberOfGuests,
        totalPrice: bookings.totalPrice,
        depositPaid: bookings.depositPaid,
        depositAmount: bookings.depositAmount,
        balanceAmount: bookings.balanceAmount,
        balancePaid: bookings.balancePaid,
        bookingStatus: bookings.bookingStatus,
        specialRequests: bookings.specialRequests,
        createdAt: bookings.createdAt,
        updatedAt: bookings.updatedAt,
      })
      .from(bookings)
      .where(
        sql`${bookings.propertyId} IN ${sql.raw(`(${propertyIds.join(',')})`)} OR ${bookings.propertyName} IN ${sql.raw(`(${propertyNames.map(n => `'${n.replace(/'/g, "''")}'`).join(',')})`)}`
      )
      .orderBy(desc(bookings.createdAt))
      .limit(limit);

    return NextResponse.json({
      bookings: ownerBookings,
      total: ownerBookings.length,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching owner bookings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch bookings' },
      { status: 500 }
    );
  }
}
