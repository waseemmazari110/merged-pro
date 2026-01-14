/**
 * iCal Sync API
 * Manually trigger iCal sync for a property
 * 
 * STEP 2.3 - Availability & Calendar Integration
 * 
 * POST /api/calendar/sync/[propertyId]
 * Fetches and syncs external iCal feed for the property
 * Returns blocked dates from external calendars (Airbnb, VRBO, etc.)
 */

import { NextRequest, NextResponse } from 'next/server';
import { syncPropertyICalFeed } from '@/lib/ical-sync';
import { auth, type ExtendedSession } from '@/lib/auth';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    }) as ExtendedSession | null;

    // Require authentication (owner or admin)
    if (!session?.user) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const userRole = session.user.role || 'guest';
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Owner or admin role required.' },
        { status: 403 }
      );
    }

    const { propertyId: propertyIdParam } = await params;
    const propertyId = parseInt(propertyIdParam);

    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    // Trigger iCal sync
    const syncResult = await syncPropertyICalFeed(propertyId);

    if (!syncResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: syncResult.error || 'iCal sync failed',
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      propertyId: syncResult.propertyId,
      eventsFound: syncResult.eventsFound,
      blockedDates: syncResult.blockedDates,
      message: `Successfully synced ${syncResult.eventsFound} events from external calendar`,
    });

  } catch (error) {
    console.error('iCal sync API error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to sync iCal feed',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/calendar/sync/[propertyId]
 * Check iCal sync status and last synced data
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ propertyId: string }> }
) {
  try {
    const { propertyId: propertyIdParam } = await params;
    const propertyId = parseInt(propertyIdParam);

    if (isNaN(propertyId)) {
      return NextResponse.json(
        { error: 'Invalid property ID' },
        { status: 400 }
      );
    }

    // Perform sync and return results (read-only, no auth required)
    const syncResult = await syncPropertyICalFeed(propertyId);

    return NextResponse.json({
      success: syncResult.success,
      propertyId: syncResult.propertyId,
      eventsFound: syncResult.eventsFound,
      blockedDates: syncResult.blockedDates,
      error: syncResult.error,
      lastSyncedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('iCal sync status error:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to check iCal sync status',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
