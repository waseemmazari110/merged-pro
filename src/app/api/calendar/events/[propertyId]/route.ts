/**
 * Calendar Events API
 * Returns events in FullCalendar format for a specific property
 * 
 * STEP 2.3 - Availability & Calendar Integration
 * 
 * GET /api/calendar/events/[propertyId]
 * Returns all calendar events including:
 * - Existing bookings (confirmed, pending)
 * - iCal synced blocked dates
 * - Available dates (optional)
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { bookings, properties } from '@/db/schema';
import { eq, and, gte } from 'drizzle-orm';
import { syncPropertyICalFeed } from '@/lib/ical-sync';

export const dynamic = 'force-dynamic';

interface CalendarEvent {
  id: string;
  title: string;
  start: string; // ISO date
  end: string; // ISO date
  backgroundColor?: string;
  borderColor?: string;
  textColor?: string;
  extendedProps?: {
    type: 'booking' | 'ical-blocked' | 'available';
    bookingId?: number;
    status?: string;
    guestName?: string;
    guestEmail?: string;
    source?: string;
  };
}

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

    // Check if property exists
    const property = await db.select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);

    if (property.length === 0) {
      return NextResponse.json(
        { error: 'Property not found' },
        { status: 404 }
      );
    }

    const events: CalendarEvent[] = [];

    // 1. Get all bookings for this property (past 30 days to future)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const thirtyDaysAgoStr = thirtyDaysAgo.toISOString().split('T')[0];

    const propertyBookings = await db.select()
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, propertyId),
          gte(bookings.checkOutDate, thirtyDaysAgoStr)
        )
      );

    // Convert bookings to calendar events
    for (const booking of propertyBookings) {
      const status = booking.bookingStatus;
      
      // Determine event color based on status
      let backgroundColor = '#3b82f6'; // Blue for pending
      let borderColor = '#2563eb';
      let textColor = '#ffffff';
      
      if (status === 'confirmed') {
        backgroundColor = '#10b981'; // Green
        borderColor = '#059669';
      } else if (status === 'completed') {
        backgroundColor = '#6b7280'; // Gray
        borderColor = '#4b5563';
      } else if (status === 'cancelled') {
        backgroundColor = '#ef4444'; // Red
        borderColor = '#dc2626';
      }

      events.push({
        id: `booking-${booking.id}`,
        title: `${booking.guestName} - ${status}`,
        start: booking.checkInDate,
        end: booking.checkOutDate,
        backgroundColor,
        borderColor,
        textColor,
        extendedProps: {
          type: 'booking',
          bookingId: booking.id,
          status,
          guestName: booking.guestName,
          guestEmail: booking.guestEmail,
        },
      });
    }

    // 2. Sync iCal feed if available
    try {
      const icalSync = await syncPropertyICalFeed(propertyId);
      
      if (icalSync.success && icalSync.blockedDates.length > 0) {
        for (const blocked of icalSync.blockedDates) {
          // Only add iCal events that don't overlap with existing bookings
          const hasBookingOverlap = events.some(event => {
            if (event.extendedProps?.type !== 'booking') return false;
            
            const eventStart = new Date(event.start);
            const eventEnd = new Date(event.end);
            const blockedStart = new Date(blocked.startDate);
            const blockedEnd = new Date(blocked.endDate);
            
            // Check for overlap
            return eventStart < blockedEnd && blockedStart < eventEnd;
          });
          
          if (!hasBookingOverlap) {
            events.push({
              id: `ical-${blocked.startDate}-${blocked.endDate}`,
              title: `Blocked (${blocked.source})`,
              start: blocked.startDate,
              end: blocked.endDate,
              backgroundColor: '#f59e0b', // Orange
              borderColor: '#d97706',
              textColor: '#ffffff',
              extendedProps: {
                type: 'ical-blocked',
                source: blocked.source,
              },
            });
          }
        }
      }
    } catch (icalError) {
      console.error('iCal sync error:', icalError);
      // Continue without iCal data - don't fail the entire request
    }

    // 3. Return all events
    return NextResponse.json({
      success: true,
      propertyId,
      propertyName: property[0].title,
      events,
      eventCounts: {
        bookings: events.filter(e => e.extendedProps?.type === 'booking').length,
        icalBlocked: events.filter(e => e.extendedProps?.type === 'ical-blocked').length,
        total: events.length,
      },
    });

  } catch (error) {
    console.error('Calendar events API error:', error);
    return NextResponse.json(
      {
        error: 'Failed to fetch calendar events',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    );
  }
}
