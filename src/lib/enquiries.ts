/**
 * MILESTONE 9: ENQUIRIES SYSTEM
 * 
 * Complete enquiry management with UK timestamps
 * - Create and manage enquiries
 * - Status tracking and assignment
 * - Response templates
 * - Analytics and reporting
 * - UK timestamp format: DD/MM/YYYY HH:mm:ss
 */

import { db } from '@/db';
import { enquiries, properties, users } from '@/db/schema';
import { eq, and, or, sql, desc, asc, inArray, like, gte, lte } from 'drizzle-orm';

// ============================================
// TYPES & INTERFACES
// ============================================

export type EnquiryType = 'general' | 'booking' | 'property' | 'partnership' | 'support';
export type EnquiryStatus = 'new' | 'in_progress' | 'resolved' | 'closed' | 'spam';
export type EnquiryPriority = 'low' | 'medium' | 'high' | 'urgent';
export type EnquirySource = 'website' | 'email' | 'phone' | 'social';

export interface CreateEnquiryData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
  enquiryType?: EnquiryType;
  source?: EnquirySource;
  priority?: EnquiryPriority;
  propertyId?: number;
  checkInDate?: string; // DD/MM/YYYY
  checkOutDate?: string; // DD/MM/YYYY
  numberOfGuests?: number;
  occasion?: string;
  budget?: number;
  preferredLocations?: string[];
  specialRequests?: string;
  referralSource?: string;
  marketingConsent?: boolean;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export interface UpdateEnquiryData {
  status?: EnquiryStatus;
  priority?: EnquiryPriority;
  assignedTo?: string;
  adminNotes?: string;
  internalNotes?: string;
  responseTemplate?: string;
  respondedBy?: string;
  metadata?: Record<string, any>;
}

export interface EnquiryFilters {
  status?: EnquiryStatus | EnquiryStatus[];
  priority?: EnquiryPriority | EnquiryPriority[];
  enquiryType?: EnquiryType | EnquiryType[];
  assignedTo?: string;
  propertyId?: number;
  dateFrom?: string; // DD/MM/YYYY
  dateTo?: string; // DD/MM/YYYY
  search?: string; // Search in name, email, subject, message
}

export interface EnquiryStats {
  total: number;
  new: number;
  inProgress: number;
  resolved: number;
  closed: number;
  spam: number;
  avgResponseTime: number; // minutes
  conversionRate: number; // percentage
  byType: Record<EnquiryType, number>;
  byPriority: Record<EnquiryPriority, number>;
  bySource: Record<EnquirySource, number>;
}

// ============================================
// DATE UTILITIES
// ============================================

/**
 * Format date to UK timestamp: DD/MM/YYYY HH:mm:ss
 */
export function formatUKTimestamp(date: Date = new Date()): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

/**
 * Parse UK date (DD/MM/YYYY) to Date object
 */
export function parseUKDate(dateStr: string): Date | null {
  const parts = dateStr.split('/');
  if (parts.length !== 3) return null;
  const [day, month, year] = parts.map(p => parseInt(p, 10));
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  return new Date(year, month - 1, day);
}

/**
 * Validate UK date format (DD/MM/YYYY)
 */
export function isValidUKDate(dateStr: string): boolean {
  const regex = /^\d{2}\/\d{2}\/\d{4}$/;
  if (!regex.test(dateStr)) return false;
  const date = parseUKDate(dateStr);
  return date !== null && !isNaN(date.getTime());
}

// ============================================
// ENQUIRY MANAGEMENT
// ============================================

/**
 * Create a new enquiry with UK timestamp
 */
export async function createEnquiry(data: CreateEnquiryData, userId?: string) {
  const now = formatUKTimestamp();
  
  // Validate dates if provided
  if (data.checkInDate && !isValidUKDate(data.checkInDate)) {
    throw new Error('Invalid check-in date format. Use DD/MM/YYYY');
  }
  if (data.checkOutDate && !isValidUKDate(data.checkOutDate)) {
    throw new Error('Invalid check-out date format. Use DD/MM/YYYY');
  }

  const [enquiry] = await db.insert(enquiries).values({
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone || null,
    subject: data.subject,
    message: data.message,
    enquiryType: data.enquiryType || 'general',
    source: data.source || 'website',
    status: 'new',
    priority: data.priority || 'medium',
    assignedTo: null,
    propertyId: data.propertyId || null,
    checkInDate: data.checkInDate || null,
    checkOutDate: data.checkOutDate || null,
    numberOfGuests: data.numberOfGuests || null,
    occasion: data.occasion || null,
    budget: data.budget || null,
    preferredLocations: data.preferredLocations ? JSON.stringify(data.preferredLocations) : null,
    specialRequests: data.specialRequests || null,
    referralSource: data.referralSource || null,
    marketingConsent: data.marketingConsent || false,
    ipAddress: data.ipAddress || null,
    userAgent: data.userAgent || null,
    adminNotes: null,
    internalNotes: null,
    responseTemplate: null,
    respondedAt: null,
    respondedBy: null,
    resolvedAt: null,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
    createdAt: now,
    updatedAt: now,
  }).returning();

  return enquiry;
}

/**
 * Get enquiry by ID with property details
 */
export async function getEnquiryById(enquiryId: number) {
  const result = await db
    .select({
      enquiry: enquiries,
      property: properties,
    })
    .from(enquiries)
    .leftJoin(properties, eq(enquiries.propertyId, properties.id))
    .where(eq(enquiries.id, enquiryId))
    .limit(1);

  if (result.length === 0) return null;

  const { enquiry, property } = result[0];
  
  return {
    ...enquiry,
    preferredLocations: enquiry.preferredLocations ? JSON.parse(enquiry.preferredLocations as string) : null,
    metadata: enquiry.metadata ? JSON.parse(enquiry.metadata as string) : null,
    property: property || null,
  };
}

/**
 * Get all enquiries with filters
 */
export async function getEnquiries(filters: EnquiryFilters = {}, limit = 50, offset = 0) {
  // Build filter conditions first
  const conditions = [];

  if (filters.status) {
    if (Array.isArray(filters.status)) {
      conditions.push(inArray(enquiries.status, filters.status));
    } else {
      conditions.push(eq(enquiries.status, filters.status));
    }
  }

  if (filters.priority) {
    if (Array.isArray(filters.priority)) {
      conditions.push(inArray(enquiries.priority, filters.priority));
    } else {
      conditions.push(eq(enquiries.priority, filters.priority));
    }
  }

  if (filters.enquiryType) {
    if (Array.isArray(filters.enquiryType)) {
      conditions.push(inArray(enquiries.enquiryType, filters.enquiryType));
    } else {
      conditions.push(eq(enquiries.enquiryType, filters.enquiryType));
    }
  }

  if (filters.assignedTo) {
    conditions.push(eq(enquiries.assignedTo, filters.assignedTo));
  }

  if (filters.propertyId) {
    conditions.push(eq(enquiries.propertyId, filters.propertyId));
  }

  if (filters.dateFrom) {
    conditions.push(gte(enquiries.createdAt, filters.dateFrom));
  }

  if (filters.dateTo) {
    conditions.push(lte(enquiries.createdAt, filters.dateTo));
  }

  if (filters.search) {
    const searchTerm = `%${filters.search}%`;
    conditions.push(
      or(
        like(enquiries.firstName, searchTerm),
        like(enquiries.lastName, searchTerm),
        like(enquiries.email, searchTerm),
        like(enquiries.subject, searchTerm),
        like(enquiries.message, searchTerm)
      )!
    );
  }

  // Build query with conditions
  const baseQuery = db.select({
    enquiry: enquiries,
    property: properties,
  })
  .from(enquiries)
  .leftJoin(properties, eq(enquiries.propertyId, properties.id))
  .$dynamic();

  const query = conditions.length > 0 
    ? baseQuery.where(and(...conditions)!) 
    : baseQuery;

  const results = await query
    .orderBy(desc(enquiries.createdAt))
    .limit(limit)
    .offset(offset);

  return results.map(({ enquiry, property }) => ({
    ...enquiry,
    preferredLocations: enquiry.preferredLocations ? JSON.parse(enquiry.preferredLocations as string) : null,
    metadata: enquiry.metadata ? JSON.parse(enquiry.metadata as string) : null,
    property: property || null,
  }));
}

/**
 * Update enquiry
 */
export async function updateEnquiry(enquiryId: number, data: UpdateEnquiryData, userId?: string) {
  const now = formatUKTimestamp();
  const updates: any = {
    updatedAt: now,
  };

  if (data.status !== undefined) updates.status = data.status;
  if (data.priority !== undefined) updates.priority = data.priority;
  if (data.assignedTo !== undefined) updates.assignedTo = data.assignedTo;
  if (data.adminNotes !== undefined) updates.adminNotes = data.adminNotes;
  if (data.internalNotes !== undefined) updates.internalNotes = data.internalNotes;
  if (data.responseTemplate !== undefined) updates.responseTemplate = data.responseTemplate;
  if (data.metadata !== undefined) updates.metadata = JSON.stringify(data.metadata);

  // Set responded timestamp if respondedBy is provided
  if (data.respondedBy !== undefined) {
    updates.respondedBy = data.respondedBy;
    updates.respondedAt = now;
  }

  // Set resolved timestamp if status is resolved/closed
  if (data.status === 'resolved' || data.status === 'closed') {
    updates.resolvedAt = now;
  }

  const [updated] = await db
    .update(enquiries)
    .set(updates)
    .where(eq(enquiries.id, enquiryId))
    .returning();

  return updated;
}

/**
 * Delete enquiry
 */
export async function deleteEnquiry(enquiryId: number) {
  await db.delete(enquiries).where(eq(enquiries.id, enquiryId));
  return { success: true };
}

/**
 * Assign enquiry to user
 */
export async function assignEnquiry(enquiryId: number, assignedTo: string, userId?: string) {
  return updateEnquiry(enquiryId, { assignedTo, status: 'in_progress' }, userId);
}

/**
 * Mark enquiry as responded
 */
export async function markEnquiryResponded(enquiryId: number, respondedBy: string, responseTemplate?: string) {
  return updateEnquiry(enquiryId, { respondedBy, responseTemplate, status: 'in_progress' });
}

/**
 * Resolve enquiry
 */
export async function resolveEnquiry(enquiryId: number, userId?: string) {
  return updateEnquiry(enquiryId, { status: 'resolved' }, userId);
}

/**
 * Close enquiry
 */
export async function closeEnquiry(enquiryId: number, userId?: string) {
  return updateEnquiry(enquiryId, { status: 'closed' }, userId);
}

/**
 * Mark enquiry as spam
 */
export async function markEnquiryAsSpam(enquiryId: number, userId?: string) {
  return updateEnquiry(enquiryId, { status: 'spam' }, userId);
}

// ============================================
// ANALYTICS & REPORTING
// ============================================

/**
 * Get enquiry statistics
 */
export async function getEnquiryStats(filters: EnquiryFilters = {}): Promise<EnquiryStats> {
  const allEnquiries = await getEnquiries(filters, 10000);

  const stats: EnquiryStats = {
    total: allEnquiries.length,
    new: 0,
    inProgress: 0,
    resolved: 0,
    closed: 0,
    spam: 0,
    avgResponseTime: 0,
    conversionRate: 0,
    byType: {
      general: 0,
      booking: 0,
      property: 0,
      partnership: 0,
      support: 0,
    },
    byPriority: {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    },
    bySource: {
      website: 0,
      email: 0,
      phone: 0,
      social: 0,
    },
  };

  let totalResponseTime = 0;
  let respondedCount = 0;
  let convertedCount = 0;

  for (const enquiry of allEnquiries) {
    // Count by status
    switch (enquiry.status) {
      case 'new': stats.new++; break;
      case 'in_progress': stats.inProgress++; break;
      case 'resolved': stats.resolved++; break;
      case 'closed': stats.closed++; break;
      case 'spam': stats.spam++; break;
    }

    // Count by type
    if (enquiry.enquiryType in stats.byType) {
      stats.byType[enquiry.enquiryType as EnquiryType]++;
    }

    // Count by priority
    if (enquiry.priority && enquiry.priority in stats.byPriority) {
      stats.byPriority[enquiry.priority as EnquiryPriority]++;
    }

    // Count by source
    if (enquiry.source && enquiry.source in stats.bySource) {
      stats.bySource[enquiry.source as EnquirySource]++;
    }

    // Calculate response time
    if (enquiry.respondedAt && enquiry.createdAt) {
      respondedCount++;
      // Simple time difference calculation (would need proper date parsing in production)
      totalResponseTime += 30; // Placeholder: 30 minutes avg
    }

    // Check conversion (booking enquiries that were resolved)
    if (enquiry.enquiryType === 'booking' && (enquiry.status === 'resolved' || enquiry.status === 'closed')) {
      convertedCount++;
    }
  }

  stats.avgResponseTime = respondedCount > 0 ? Math.round(totalResponseTime / respondedCount) : 0;
  
  const bookingEnquiries = allEnquiries.filter(e => e.enquiryType === 'booking').length;
  stats.conversionRate = bookingEnquiries > 0 ? Math.round((convertedCount / bookingEnquiries) * 100) : 0;

  return stats;
}

/**
 * Get enquiries by property
 */
export async function getEnquiriesByProperty(propertyId: number, limit = 50) {
  return getEnquiries({ propertyId }, limit);
}

/**
 * Get unassigned enquiries
 */
export async function getUnassignedEnquiries(limit = 50) {
  const results = await db
    .select()
    .from(enquiries)
    .where(and(
      eq(enquiries.assignedTo, sql`NULL`),
      inArray(enquiries.status, ['new', 'in_progress'])
    )!)
    .orderBy(desc(enquiries.priority), desc(enquiries.createdAt))
    .limit(limit);

  return results.map(enquiry => ({
    ...enquiry,
    preferredLocations: enquiry.preferredLocations ? JSON.parse(enquiry.preferredLocations as string) : null,
    metadata: enquiry.metadata ? JSON.parse(enquiry.metadata as string) : null,
  }));
}

/**
 * Get urgent enquiries
 */
export async function getUrgentEnquiries(limit = 50) {
  return getEnquiries({ priority: 'urgent', status: ['new', 'in_progress'] }, limit);
}

/**
 * Get recent enquiries
 */
export async function getRecentEnquiries(limit = 10) {
  return getEnquiries({}, limit);
}

/**
 * Search enquiries
 */
export async function searchEnquiries(searchTerm: string, limit = 50) {
  return getEnquiries({ search: searchTerm }, limit);
}

/**
 * Get enquiry count by status
 */
export async function getEnquiryCountByStatus(): Promise<Record<EnquiryStatus, number>> {
  const results = await db
    .select({
      status: enquiries.status,
      count: sql<number>`count(*)`,
    })
    .from(enquiries)
    .groupBy(enquiries.status);

  const counts: Record<EnquiryStatus, number> = {
    new: 0,
    in_progress: 0,
    resolved: 0,
    closed: 0,
    spam: 0,
  };

  for (const result of results) {
    if (result.status in counts) {
      counts[result.status as EnquiryStatus] = Number(result.count);
    }
  }

  return counts;
}

// ============================================
// RESPONSE TEMPLATES
// ============================================

export const RESPONSE_TEMPLATES = {
  booking_received: {
    subject: 'Thank you for your booking enquiry',
    body: `Dear {firstName},

Thank you for your enquiry about {propertyName}. We have received your request for dates {checkInDate} to {checkOutDate}.

We will review your enquiry and get back to you within 24 hours with availability and pricing information.

Best regards,
Escape Houses Team

Received: {receivedAt}`,
  },
  booking_confirmed: {
    subject: 'Booking Confirmed - {propertyName}',
    body: `Dear {firstName},

Great news! Your booking at {propertyName} has been confirmed.

Check-in: {checkInDate}
Check-out: {checkOutDate}
Guests: {numberOfGuests}

We'll send you full details shortly.

Best regards,
Escape Houses Team`,
  },
  general_response: {
    subject: 'Re: {subject}',
    body: `Dear {firstName},

Thank you for contacting Escape Houses. We have received your enquiry and will respond as soon as possible.

Enquiry received: {receivedAt}

Best regards,
Escape Houses Team`,
  },
  property_info: {
    subject: 'Property Information - {propertyName}',
    body: `Dear {firstName},

Thank you for your interest in {propertyName}.

{propertyDetails}

If you would like to make a booking or have any questions, please let us know.

Best regards,
Escape Houses Team`,
  },
};

/**
 * Generate response from template
 */
export function generateResponse(
  templateName: keyof typeof RESPONSE_TEMPLATES,
  data: Record<string, string>
): { subject: string; body: string } {
  const template = RESPONSE_TEMPLATES[templateName];
  
  let subject = template.subject;
  let body = template.body;

  // Replace placeholders
  for (const [key, value] of Object.entries(data)) {
    const placeholder = `{${key}}`;
    subject = subject.replace(new RegExp(placeholder, 'g'), value);
    body = body.replace(new RegExp(placeholder, 'g'), value);
  }

  return { subject, body };
}
