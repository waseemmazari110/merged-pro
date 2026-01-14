/**
 * Property Calendar Example Page
 * Demonstrates FullCalendar integration with booking selection
 * 
 * STEP 2.3 - Calendar Integration Example
 * 
 * Usage: /property/[slug]/calendar
 */

'use client';

import { useState } from 'react';
import { PropertyCalendar } from '@/components/calendar/property-calendar';
import { useRouter } from 'next/navigation';

interface PropertyCalendarPageProps {
  propertyId: number;
  propertySlug: string;
  propertyName: string;
}

export default function PropertyCalendarPage({
  propertyId,
  propertySlug,
  propertyName,
}: PropertyCalendarPageProps) {
  const router = useRouter();
  const [selectedDates, setSelectedDates] = useState<{ start: Date; end: Date } | null>(null);

  const handleDateSelect = (start: Date, end: Date) => {
    setSelectedDates({ start, end });
    
    // Show confirmation
    const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
    const confirmed = window.confirm(
      `Book ${propertyName}\n\n` +
      `Check-in: ${start.toLocaleDateString('en-GB')}\n` +
      `Check-out: ${end.toLocaleDateString('en-GB')}\n` +
      `Nights: ${nights}\n\n` +
      `Proceed to booking?`
    );
    
    if (confirmed) {
      // Navigate to booking page with pre-filled dates
      const checkIn = start.toISOString().split('T')[0];
      const checkOut = end.toISOString().split('T')[0];
      router.push(`/book/${propertySlug}?checkIn=${checkIn}&checkOut=${checkOut}`);
    }
  };

  const handleEventClick = (bookingId: number) => {
    // Navigate to booking details (if user is authenticated as owner/admin)
    router.push(`/owner/bookings/${bookingId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {propertyName} - Availability Calendar
          </h1>
          <p className="text-gray-600">
            Select your desired check-in and check-out dates to book this property.
          </p>
        </div>

        {/* Calendar */}
        <PropertyCalendar
          propertyId={propertyId}
          propertyName={propertyName}
          selectable={true}
          onDateSelect={handleDateSelect}
          onEventClick={handleEventClick}
          className="mb-8"
        />

        {/* Instructions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">How to Book</h2>
          <ol className="space-y-2 text-gray-700">
            <li className="flex gap-2">
              <span className="font-semibold">1.</span>
              <span>Click and drag on the calendar to select your check-in and check-out dates</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">2.</span>
              <span>Review the dates and confirm to proceed to booking</span>
            </li>
            <li className="flex gap-2">
              <span className="font-semibold">3.</span>
              <span>Complete your booking details and payment</span>
            </li>
          </ol>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <h3 className="font-semibold text-gray-900 mb-2">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-500"></div>
                <span>Pending Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-500"></div>
                <span>Confirmed Booking</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-orange-500"></div>
                <span>Blocked (External)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
