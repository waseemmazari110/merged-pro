import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, properties } from '@/db/schema';
import { eq, and, sql, asc, gte } from 'drizzle-orm';
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
      return unauthorizedResponse('Only owners and admins can view upcoming check-ins');
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
        checkIns: [],
      }, { status: 200 });
    }

    const propertyIds = ownerProperties.map(p => p.id);
    const propertyNames = ownerProperties.map(p => p.title);
    
    // Get upcoming check-ins (next 30 days)
    const now = new Date().toISOString().split('T')[0];
    const thirtyDaysFromNow = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString().split('T')[0];
    
    const upcomingCheckIns = await db
      .select()
      .from(bookings)
      .where(
        sql`(${bookings.propertyId} IN ${sql.raw(`(${propertyIds.join(',')})`)} OR ${bookings.propertyName} IN ${sql.raw(`(${propertyNames.map(n => `'${n.replace(/'/g, "''")}'`).join(',')})`)}) AND ${bookings.checkInDate} >= ${now} AND ${bookings.checkInDate} <= ${thirtyDaysFromNow}`
      )
      .orderBy(asc(bookings.checkInDate))
      .limit(10);

    return NextResponse.json({
      checkIns: upcomingCheckIns,
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching upcoming check-ins:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming check-ins' },
      { status: 500 }
    );
  }
}
