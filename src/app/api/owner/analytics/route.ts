/**
 * Owner Dashboard Analytics API
 * GET /api/owner/analytics - Get complete dashboard statistics
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { 
  getOwnerDashboardStats, 
  getRevenueByMonth, 
  getBookingTrends,
  compareOwnerProperties 
} from '@/lib/owner-analytics';
import { nowUKFormatted } from '@/lib/date-utils';

export async function GET(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/owner/analytics`);

  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user || ((session.user as any).role || 'guest') !== 'owner') {
      return NextResponse.json(
        { error: 'Unauthorized - Owner access required' },
        { status: 401 }
      );
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const includeRevenue = searchParams.get('includeRevenue') === 'true';
    const includeTrends = searchParams.get('includeTrends') === 'true';
    const includeComparison = searchParams.get('includeComparison') === 'true';

    // Get dashboard stats
    const stats = await getOwnerDashboardStats(session.user.id);

    // Build response
    const response: any = {
      success: true,
      stats,
    };

    // Include optional data
    if (includeRevenue) {
      response.revenueByMonth = await getRevenueByMonth(session.user.id);
    }

    if (includeTrends) {
      response.bookingTrends = await getBookingTrends(session.user.id);
    }

    if (includeComparison) {
      response.propertyComparison = await compareOwnerProperties(session.user.id);
    }

    console.log(`[${nowUKFormatted()}] Analytics retrieved for owner ${session.user.id}`);

    return NextResponse.json(response);

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Analytics error:`, error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
