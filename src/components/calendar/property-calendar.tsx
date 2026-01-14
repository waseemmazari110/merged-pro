/**
 * Property Calendar Component
 * FullCalendar integration showing bookings, blocked dates, and iCal sync
 * 
 * STEP 2.3 - Availability & Calendar Integration
 */

'use client';

import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import type { EventInput, DateSelectArg, EventClickArg } from '@fullcalendar/core';

interface PropertyCalendarProps {
  propertyId: number;
  propertyName?: string;
  onDateSelect?: (start: Date, end: Date) => void;
  onEventClick?: (bookingId: number) => void;
  selectable?: boolean;
  className?: string;
}

interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
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

export function PropertyCalendar({
  propertyId,
  propertyName,
  onDateSelect,
  onEventClick,
  selectable = false,
  className = '',
}: PropertyCalendarProps) {
  const [events, setEvents] = useState<EventInput[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch calendar events
  useEffect(() => {
    async function fetchEvents() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch(`/api/calendar/events/${propertyId}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch calendar events');
        }

        const data = await response.json();
        
        if (data.success && data.events) {
          setEvents(data.events);
        } else {
          throw new Error(data.error || 'Unknown error');
        }
      } catch (err) {
        console.error('Error fetching calendar events:', err);
        setError(err instanceof Error ? err.message : 'Failed to load calendar');
      } finally {
        setLoading(false);
      }
    }

    fetchEvents();
  }, [propertyId]);

  // Handle date selection
  const handleDateSelect = (selectInfo: DateSelectArg) => {
    if (onDateSelect) {
      onDateSelect(selectInfo.start, selectInfo.end);
    }
  };

  // Handle event click
  const handleEventClick = (clickInfo: EventClickArg) => {
    const bookingId = clickInfo.event.extendedProps?.bookingId;
    
    if (bookingId && onEventClick) {
      onEventClick(bookingId);
    } else {
      // Show event details in alert (basic fallback)
      const props = clickInfo.event.extendedProps;
      let message = `${clickInfo.event.title}\n\n`;
      message += `Start: ${clickInfo.event.start?.toLocaleDateString()}\n`;
      message += `End: ${clickInfo.event.end?.toLocaleDateString()}\n`;
      
      if (props.guestName) {
        message += `\nGuest: ${props.guestName}`;
      }
      if (props.guestEmail) {
        message += `\nEmail: ${props.guestEmail}`;
      }
      if (props.source) {
        message += `\nSource: ${props.source}`;
      }
      
      alert(message);
    }
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] ${className}`}>
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading calendar...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`flex items-center justify-center min-h-[500px] ${className}`}>
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-gray-900 font-medium mb-2">Failed to load calendar</p>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {propertyName && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900">{propertyName} - Calendar</h3>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <FullCalendar
          plugins={[dayGridPlugin, interactionPlugin]}
          initialView="dayGridMonth"
          events={events}
          selectable={selectable}
          selectMirror={true}
          dayMaxEvents={true}
          weekends={true}
          select={handleDateSelect}
          eventClick={handleEventClick}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,dayGridWeek',
          }}
          height="auto"
          eventTimeFormat={{
            hour: '2-digit',
            minute: '2-digit',
            meridiem: false,
          }}
          displayEventTime={false}
          eventDisplay="block"
          // Customize appearance
          eventClassNames={(arg) => {
            const classes = ['cursor-pointer', 'hover:opacity-80', 'transition-opacity'];
            
            if (arg.event.extendedProps?.type === 'ical-blocked') {
              classes.push('italic');
            }
            
            return classes;
          }}
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap gap-4 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-blue-500"></div>
          <span className="text-gray-700">Pending</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-green-500"></div>
          <span className="text-gray-700">Confirmed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-gray-500"></div>
          <span className="text-gray-700">Completed</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-red-500"></div>
          <span className="text-gray-700">Cancelled</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded bg-orange-500"></div>
          <span className="text-gray-700">Blocked (External)</span>
        </div>
      </div>
    </div>
  );
}

/**
 * Minimal Calendar View (for property listing pages)
 */
export function PropertyCalendarMini({
  propertyId,
  className = '',
}: {
  propertyId: number;
  className?: string;
}) {
  return (
    <PropertyCalendar
      propertyId={propertyId}
      selectable={false}
      className={className}
    />
  );
}
