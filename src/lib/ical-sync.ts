/**
 * iCal Sync Service
 * Parse external iCal feeds (Airbnb, VRBO, Booking.com) and sync blocked dates
 * 
 * STEP 2.3 - Availability & Calendar Integration
 */

import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq } from 'drizzle-orm';

export interface ICalEvent {
  uid: string;
  summary: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  status?: 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED';
}

export interface ICalSyncResult {
  success: boolean;
  propertyId: number;
  eventsFound: number;
  blockedDates: Array<{
    startDate: string;
    endDate: string;
    source: string;
  }>;
  error?: string;
}

/**
 * Parse iCal format data into structured events
 * 
 * iCal format example:
 * BEGIN:VCALENDAR
 * BEGIN:VEVENT
 * UID:xxx@airbnb.com
 * DTSTART;VALUE=DATE:20250101
 * DTEND;VALUE=DATE:20250105
 * SUMMARY:Reserved
 * END:VEVENT
 * END:VCALENDAR
 */
export function parseICalData(icalData: string): ICalEvent[] {
  const events: ICalEvent[] = [];
  
  // Split by VEVENT blocks
  const eventBlocks = icalData.split('BEGIN:VEVENT');
  
  for (let i = 1; i < eventBlocks.length; i++) {
    const block = eventBlocks[i];
    const endIndex = block.indexOf('END:VEVENT');
    if (endIndex === -1) continue;
    
    const eventData = block.substring(0, endIndex);
    
    try {
      // Extract UID
      const uidMatch = eventData.match(/UID:(.+)/);
      const uid = uidMatch ? uidMatch[1].trim() : `event-${i}`;
      
      // Extract SUMMARY
      const summaryMatch = eventData.match(/SUMMARY:(.+)/);
      const summary = summaryMatch ? summaryMatch[1].trim() : 'Reserved';
      
      // Extract DESCRIPTION (optional)
      const descMatch = eventData.match(/DESCRIPTION:(.+)/);
      const description = descMatch ? descMatch[1].trim() : undefined;
      
      // Extract DTSTART
      const startMatch = eventData.match(/DTSTART(?:;VALUE=DATE)?:(\d{8})/);
      if (!startMatch) continue;
      
      const startDateStr = startMatch[1];
      const startDate = parseICalDate(startDateStr);
      
      // Extract DTEND
      const endMatch = eventData.match(/DTEND(?:;VALUE=DATE)?:(\d{8})/);
      if (!endMatch) continue;
      
      const endDateStr = endMatch[1];
      const endDate = parseICalDate(endDateStr);
      
      // Extract STATUS (optional)
      const statusMatch = eventData.match(/STATUS:(.+)/);
      const statusStr = statusMatch ? statusMatch[1].trim() : 'CONFIRMED';
      const status = ['CONFIRMED', 'TENTATIVE', 'CANCELLED'].includes(statusStr) 
        ? statusStr as 'CONFIRMED' | 'TENTATIVE' | 'CANCELLED'
        : 'CONFIRMED';
      
      // Only include confirmed/tentative events (skip cancelled)
      if (status !== 'CANCELLED') {
        events.push({
          uid,
          summary,
          description,
          startDate,
          endDate,
          status,
        });
      }
    } catch (error) {
      console.error('Error parsing iCal event:', error);
      // Skip this event and continue
    }
  }
  
  return events;
}

/**
 * Parse iCal date format (YYYYMMDD) to JavaScript Date
 */
function parseICalDate(dateStr: string): Date {
  const year = parseInt(dateStr.substring(0, 4));
  const month = parseInt(dateStr.substring(4, 6)) - 1; // Months are 0-indexed
  const day = parseInt(dateStr.substring(6, 8));
  return new Date(year, month, day);
}

/**
 * Fetch and parse iCal feed from external URL
 */
export async function fetchICalFeed(url: string): Promise<ICalEvent[]> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'EscapeHouses-Calendar-Sync/1.0',
      },
      // Cache for 5 minutes to avoid hammering external services
      next: { revalidate: 300 },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const icalData = await response.text();
    return parseICalData(icalData);
  } catch (error) {
    console.error('Error fetching iCal feed:', error);
    throw new Error(`Failed to fetch iCal feed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Sync iCal feed for a property and return blocked dates
 * 
 * This fetches the iCal URL from the property record, parses events,
 * and returns blocked date ranges that should be unavailable for booking.
 */
export async function syncPropertyICalFeed(propertyId: number): Promise<ICalSyncResult> {
  try {
    // Get property with iCal URL
    const property = await db.select()
      .from(properties)
      .where(eq(properties.id, propertyId))
      .limit(1);
    
    if (property.length === 0) {
      return {
        success: false,
        propertyId,
        eventsFound: 0,
        blockedDates: [],
        error: 'Property not found',
      };
    }
    
    const { iCalURL } = property[0];
    
    if (!iCalURL) {
      return {
        success: false,
        propertyId,
        eventsFound: 0,
        blockedDates: [],
        error: 'No iCal URL configured for this property',
      };
    }
    
    // Fetch and parse iCal feed
    const events = await fetchICalFeed(iCalURL);
    
    // Convert events to blocked date ranges
    const blockedDates = events.map(event => ({
      startDate: event.startDate.toISOString().split('T')[0],
      endDate: event.endDate.toISOString().split('T')[0],
      source: extractICalSource(event.uid),
    }));
    
    return {
      success: true,
      propertyId,
      eventsFound: events.length,
      blockedDates,
    };
  } catch (error) {
    console.error(`Error syncing iCal for property ${propertyId}:`, error);
    return {
      success: false,
      propertyId,
      eventsFound: 0,
      blockedDates: [],
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Extract the source platform from iCal UID
 * Example: "abc123@airbnb.com" -> "Airbnb"
 */
function extractICalSource(uid: string): string {
  if (uid.includes('@airbnb.com')) return 'Airbnb';
  if (uid.includes('@vrbo.com')) return 'VRBO';
  if (uid.includes('@booking.com')) return 'Booking.com';
  if (uid.includes('@homeaway.com')) return 'HomeAway';
  return 'External Calendar';
}

/**
 * Check if a date range overlaps with any iCal blocked dates
 */
export function hasICalConflict(
  checkInDate: string,
  checkOutDate: string,
  blockedDates: Array<{ startDate: string; endDate: string }>
): boolean {
  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);
  
  for (const blocked of blockedDates) {
    const blockedStart = new Date(blocked.startDate);
    const blockedEnd = new Date(blocked.endDate);
    
    // Check for overlap
    // Two ranges overlap if: start1 < end2 AND start2 < end1
    if (checkIn < blockedEnd && blockedStart < checkOut) {
      return true;
    }
  }
  
  return false;
}

/**
 * Merge overlapping date ranges
 * Useful for consolidating multiple iCal events into continuous blocked periods
 */
export function mergeBlockedDates(
  dates: Array<{ startDate: string; endDate: string }>
): Array<{ startDate: string; endDate: string }> {
  if (dates.length === 0) return [];
  
  // Sort by start date
  const sorted = [...dates].sort((a, b) => 
    new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
  );
  
  const merged: Array<{ startDate: string; endDate: string }> = [sorted[0]];
  
  for (let i = 1; i < sorted.length; i++) {
    const current = sorted[i];
    const last = merged[merged.length - 1];
    
    const currentStart = new Date(current.startDate);
    const lastEnd = new Date(last.endDate);
    
    // If current starts before or on the day last ends, merge them
    if (currentStart <= lastEnd) {
      const currentEnd = new Date(current.endDate);
      const mergedEnd = currentEnd > lastEnd ? currentEnd : lastEnd;
      last.endDate = mergedEnd.toISOString().split('T')[0];
    } else {
      merged.push(current);
    }
  }
  
  return merged;
}
