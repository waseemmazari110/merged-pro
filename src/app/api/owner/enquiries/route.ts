/**
 * Owner Dashboard - Enquiries Viewer API
 * 
 * GET /api/owner/enquiries - Get enquiries for owner's properties
 * GET /api/owner/enquiries/[id] - Get single enquiry details
 * PUT /api/owner/enquiries/[id] - Update enquiry (respond, update status)
 * 
 * Owners can view enquiries related to their properties only.
 */

import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { enquiries, crmEnquiries, properties } from '@/db/schema';
import { eq, and, desc, or, sql, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { logEnquiryAction, captureRequestDetails } from '@/lib/audit-logger';

// ============================================
// GET - List enquiries for owner's properties
// ============================================

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied. Owner role required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // new, in_progress, resolved, closed
    const propertyId = searchParams.get('propertyId');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');
    const includeResolved = searchParams.get('includeResolved') === 'true';

    // Get owner's properties
    const ownerProperties = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, session.user.id));

    if (ownerProperties.length === 0) {
      return NextResponse.json({
        success: true,
        enquiries: [],
        total: 0,
        pagination: {
          limit,
          offset,
          hasMore: false,
        },
        timestamp: nowUKFormatted(),
      });
    }

    const propertyIds = ownerProperties.map(p => p.id);

    // Build query for general enquiries
    let generalQuery = db
      .select()
      .from(enquiries)
      .where(
        and(
          inArray(enquiries.propertyId as any, propertyIds),
          status ? eq(enquiries.status, status) : sql`1=1`,
          propertyId ? eq(enquiries.propertyId as any, parseInt(propertyId)) : sql`1=1`,
          !includeResolved ? sql`${enquiries.status} != 'resolved' AND ${enquiries.status} != 'closed'` : sql`1=1`
        )
      )
      .orderBy(desc(enquiries.createdAt))
      .limit(limit)
      .offset(offset);

    // Build query for CRM enquiries
    let crmQuery = db
      .select()
      .from(crmEnquiries)
      .where(
        and(
          eq(crmEnquiries.ownerId, session.user.id),
          status ? eq(crmEnquiries.status, status) : sql`1=1`,
          propertyId ? eq(crmEnquiries.propertyId as any, parseInt(propertyId)) : sql`1=1`,
          !includeResolved ? sql`${crmEnquiries.status} != 'converted' AND ${crmEnquiries.status} != 'lost'` : sql`1=1`
        )
      )
      .orderBy(desc(crmEnquiries.createdAt))
      .limit(limit)
      .offset(offset);

    const [generalEnquiries, crmEnquiriesResult] = await Promise.all([
      generalQuery,
      crmQuery,
    ]);

    // Combine and format enquiries
    const combinedEnquiries = [
      ...generalEnquiries.map(e => ({
        id: `gen_${e.id}`,
        source: 'general',
        firstName: e.firstName,
        lastName: e.lastName,
        email: e.email,
        phone: e.phone,
        subject: e.subject,
        message: e.message,
        enquiryType: e.enquiryType,
        status: e.status,
        priority: e.priority,
        propertyId: e.propertyId,
        checkInDate: e.checkInDate,
        checkOutDate: e.checkOutDate,
        numberOfGuests: e.numberOfGuests,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        respondedAt: e.respondedAt,
        resolvedAt: e.resolvedAt,
      })),
      ...crmEnquiriesResult.map(e => ({
        id: `crm_${e.id}`,
        source: 'crm',
        guestName: e.guestName,
        email: e.guestEmail,
        phone: e.guestPhone,
        subject: e.subject,
        message: e.message,
        enquiryType: e.enquiryType,
        status: e.status,
        priority: e.priority,
        propertyId: e.propertyId,
        checkInDate: e.checkInDate,
        checkOutDate: e.checkOutDate,
        numberOfGuests: e.numberOfGuests,
        createdAt: e.createdAt,
        updatedAt: e.updatedAt,
        closedAt: e.closedAt,
      })),
    ].sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return dateB - dateA;
    });

    // Get counts by status for owner
    const statusCounts = {
      new: 0,
      in_progress: 0,
      resolved: 0,
      closed: 0,
    };

    combinedEnquiries.forEach(e => {
      const status = e.status || 'new';
      if (status in statusCounts) {
        statusCounts[status as keyof typeof statusCounts]++;
      }
    });

    return NextResponse.json({
      success: true,
      enquiries: combinedEnquiries,
      total: combinedEnquiries.length,
      statusCounts,
      properties: ownerProperties.map(p => ({
        id: p.id,
        title: p.title,
        location: p.location,
      })),
      pagination: {
        limit,
        offset,
        hasMore: combinedEnquiries.length === limit,
      },
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error fetching owner enquiries:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enquiries' },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create owner response/note
// ============================================

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    if ((session.user as any).role !== 'owner') {
      return NextResponse.json(
        { error: 'Access denied. Owner role required.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { enquiryId, notes, status } = body;

    if (!enquiryId) {
      return NextResponse.json(
        { error: 'enquiryId is required' },
        { status: 400 }
      );
    }

    // Parse enquiry source and ID
    const [source, id] = enquiryId.split('_');

    if (source === 'gen') {
      // Update general enquiry
      const updateData: any = {};
      
      if (notes !== undefined) updateData.adminNotes = notes;
      if (status) updateData.status = status;
      updateData.updatedAt = nowUKFormatted();
      
      if (status === 'in_progress' || status === 'resolved') {
        updateData.respondedAt = nowUKFormatted();
        updateData.respondedBy = session.user.id;
      }
      
      if (status === 'resolved' || status === 'closed') {
        updateData.resolvedAt = nowUKFormatted();
      }

      await db
        .update(enquiries)
        .set(updateData)
        .where(eq(enquiries.id, parseInt(id)));

    } else if (source === 'crm') {
      // Update CRM enquiry
      const updateData: any = {};
      
      if (notes !== undefined) updateData.notes = notes;
      if (status) updateData.status = status;
      updateData.updatedAt = nowUKFormatted();
      
      if (status === 'converted' || status === 'lost') {
        updateData.closedAt = nowUKFormatted();
      }

      await db
        .update(crmEnquiries)
        .set(updateData)
        .where(eq(crmEnquiries.id, parseInt(id)));
    } else {
      return NextResponse.json(
        { error: 'Invalid enquiry ID format' },
        { status: 400 }
      );
    }

    // Log audit event
    const requestDetails = captureRequestDetails(request);
    await logEnquiryAction(
      session.user.id,
      'enquiry.respond',
      enquiryId.toString(),
      {
        notes,
        status,
        ...requestDetails,
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Enquiry updated successfully',
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error updating enquiry:', error);
    return NextResponse.json(
      { error: 'Failed to update enquiry' },
      { status: 500 }
    );
  }
}
