/**
 * MILESTONE 9: ENQUIRIES API
 * 
 * API endpoints for enquiry management
 * GET: List/search enquiries with filters
 * POST: Create new enquiry, update, assign, respond
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiry,
  deleteEnquiry,
  assignEnquiry,
  markEnquiryResponded,
  resolveEnquiry,
  closeEnquiry,
  markEnquiryAsSpam,
  getEnquiryStats,
  getUnassignedEnquiries,
  getUrgentEnquiries,
  getRecentEnquiries,
  searchEnquiries,
  getEnquiryCountByStatus,
  generateResponse,
  type CreateEnquiryData,
  type UpdateEnquiryData,
  type EnquiryFilters,
} from '@/lib/enquiries';

// ============================================
// GET - List/Search Enquiries
// ============================================

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const action = searchParams.get('action') || 'list';

    // Public actions (no auth required)
    if (action === 'create-public') {
      return NextResponse.json({
        success: false,
        error: 'Use POST method to create enquiry',
      }, { status: 405 });
    }

    // Protected actions (admin/owner only)
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please login',
      }, { status: 401 });
    }

    const userRole = ((session.user as any).role || 'guest');
    const userId = session.user.id;

    // Only admin can access enquiry management
    if (userRole !== 'admin' && userRole !== 'owner') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required',
      }, { status: 403 });
    }

    // Handle different actions
    switch (action) {
      case 'list': {
        const filters: EnquiryFilters = {};

        // Parse filters from query params
        const status = searchParams.get('status');
        if (status) filters.status = status.split(',') as any;

        const priority = searchParams.get('priority');
        if (priority) filters.priority = priority.split(',') as any;

        const enquiryType = searchParams.get('enquiryType');
        if (enquiryType) filters.enquiryType = enquiryType.split(',') as any;

        const assignedTo = searchParams.get('assignedTo');
        if (assignedTo) filters.assignedTo = assignedTo;

        const propertyId = searchParams.get('propertyId');
        if (propertyId) filters.propertyId = parseInt(propertyId);

        const dateFrom = searchParams.get('dateFrom');
        if (dateFrom) filters.dateFrom = dateFrom;

        const dateTo = searchParams.get('dateTo');
        if (dateTo) filters.dateTo = dateTo;

        const search = searchParams.get('search');
        if (search) filters.search = search;

        const limit = parseInt(searchParams.get('limit') || '50');
        const offset = parseInt(searchParams.get('offset') || '0');

        const enquiries = await getEnquiries(filters, limit, offset);

        return NextResponse.json({
          success: true,
          enquiries,
          total: enquiries.length,
          limit,
          offset,
          filters,
        });
      }

      case 'get': {
        const id = searchParams.get('id');
        if (!id) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID required',
          }, { status: 400 });
        }

        const enquiry = await getEnquiryById(parseInt(id));
        if (!enquiry) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry not found',
          }, { status: 404 });
        }

        return NextResponse.json({
          success: true,
          enquiry,
        });
      }

      case 'stats': {
        const filters: EnquiryFilters = {};
        
        const dateFrom = searchParams.get('dateFrom');
        if (dateFrom) filters.dateFrom = dateFrom;

        const dateTo = searchParams.get('dateTo');
        if (dateTo) filters.dateTo = dateTo;

        const stats = await getEnquiryStats(filters);

        return NextResponse.json({
          success: true,
          stats,
        });
      }

      case 'count-by-status': {
        const counts = await getEnquiryCountByStatus();

        return NextResponse.json({
          success: true,
          counts,
        });
      }

      case 'unassigned': {
        const limit = parseInt(searchParams.get('limit') || '50');
        const enquiries = await getUnassignedEnquiries(limit);

        return NextResponse.json({
          success: true,
          enquiries,
          total: enquiries.length,
        });
      }

      case 'urgent': {
        const limit = parseInt(searchParams.get('limit') || '50');
        const enquiries = await getUrgentEnquiries(limit);

        return NextResponse.json({
          success: true,
          enquiries,
          total: enquiries.length,
        });
      }

      case 'recent': {
        const limit = parseInt(searchParams.get('limit') || '10');
        const enquiries = await getRecentEnquiries(limit);

        return NextResponse.json({
          success: true,
          enquiries,
          total: enquiries.length,
        });
      }

      case 'search': {
        const q = searchParams.get('q');
        if (!q) {
          return NextResponse.json({
            success: false,
            error: 'Search query required',
          }, { status: 400 });
        }

        const limit = parseInt(searchParams.get('limit') || '50');
        const enquiries = await searchEnquiries(q, limit);

        return NextResponse.json({
          success: true,
          enquiries,
          total: enquiries.length,
          query: q,
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Enquiries GET error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}

// ============================================
// POST - Create/Update Enquiries
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const action = body.action || 'create';

    // Public action: Create enquiry (no auth required)
    if (action === 'create-public') {
      const data: CreateEnquiryData = {
        firstName: body.firstName,
        lastName: body.lastName,
        email: body.email,
        phone: body.phone,
        subject: body.subject,
        message: body.message,
        enquiryType: body.enquiryType || 'general',
        source: body.source || 'website',
        priority: body.priority || 'medium',
        propertyId: body.propertyId,
        checkInDate: body.checkInDate,
        checkOutDate: body.checkOutDate,
        numberOfGuests: body.numberOfGuests,
        occasion: body.occasion,
        budget: body.budget,
        preferredLocations: body.preferredLocations,
        specialRequests: body.specialRequests,
        referralSource: body.referralSource,
        marketingConsent: body.marketingConsent || false,
        ipAddress: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || undefined,
        userAgent: request.headers.get('user-agent') || undefined,
        metadata: body.metadata,
      };

      const enquiry = await createEnquiry(data);

      return NextResponse.json({
        success: true,
        enquiry,
        message: 'Enquiry submitted successfully',
      }, { status: 201 });
    }

    // Protected actions (admin only)
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Please login',
      }, { status: 401 });
    }

    const userRole = ((session.user as any).role || 'guest');
    const userId = session.user.id;

    if (userRole !== 'admin' && userRole !== 'owner') {
      return NextResponse.json({
        success: false,
        error: 'Unauthorized - Admin access required',
      }, { status: 403 });
    }

    // Handle different actions
    switch (action) {
      case 'create': {
        const data: CreateEnquiryData = {
          firstName: body.firstName,
          lastName: body.lastName,
          email: body.email,
          phone: body.phone,
          subject: body.subject,
          message: body.message,
          enquiryType: body.enquiryType || 'general',
          source: body.source || 'website',
          priority: body.priority || 'medium',
          propertyId: body.propertyId,
          checkInDate: body.checkInDate,
          checkOutDate: body.checkOutDate,
          numberOfGuests: body.numberOfGuests,
          occasion: body.occasion,
          budget: body.budget,
          preferredLocations: body.preferredLocations,
          specialRequests: body.specialRequests,
          referralSource: body.referralSource,
          marketingConsent: body.marketingConsent || false,
          metadata: body.metadata,
        };

        const enquiry = await createEnquiry(data, userId);

        return NextResponse.json({
          success: true,
          enquiry,
          message: 'Enquiry created successfully',
        }, { status: 201 });
      }

      case 'update': {
        const { enquiryId, ...updateData } = body;
        if (!enquiryId) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID required',
          }, { status: 400 });
        }

        const updated = await updateEnquiry(enquiryId, updateData as UpdateEnquiryData, userId);

        return NextResponse.json({
          success: true,
          enquiry: updated,
          message: 'Enquiry updated successfully',
        });
      }

      case 'assign': {
        const { enquiryId, assignedTo } = body;
        if (!enquiryId || !assignedTo) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID and assignedTo required',
          }, { status: 400 });
        }

        const updated = await assignEnquiry(enquiryId, assignedTo, userId);

        return NextResponse.json({
          success: true,
          enquiry: updated,
          message: `Enquiry assigned to ${assignedTo}`,
        });
      }

      case 'respond': {
        const { enquiryId, respondedBy, responseTemplate } = body;
        if (!enquiryId || !respondedBy) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID and respondedBy required',
          }, { status: 400 });
        }

        const updated = await markEnquiryResponded(enquiryId, respondedBy, responseTemplate);

        return NextResponse.json({
          success: true,
          enquiry: updated,
          message: 'Enquiry marked as responded',
        });
      }

      case 'resolve': {
        const { enquiryId } = body;
        if (!enquiryId) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID required',
          }, { status: 400 });
        }

        const updated = await resolveEnquiry(enquiryId, userId);

        return NextResponse.json({
          success: true,
          enquiry: updated,
          message: 'Enquiry resolved',
        });
      }

      case 'close': {
        const { enquiryId } = body;
        if (!enquiryId) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID required',
          }, { status: 400 });
        }

        const updated = await closeEnquiry(enquiryId, userId);

        return NextResponse.json({
          success: true,
          enquiry: updated,
          message: 'Enquiry closed',
        });
      }

      case 'mark-spam': {
        const { enquiryId } = body;
        if (!enquiryId) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID required',
          }, { status: 400 });
        }

        const updated = await markEnquiryAsSpam(enquiryId, userId);

        return NextResponse.json({
          success: true,
          enquiry: updated,
          message: 'Enquiry marked as spam',
        });
      }

      case 'delete': {
        const { enquiryId } = body;
        if (!enquiryId) {
          return NextResponse.json({
            success: false,
            error: 'Enquiry ID required',
          }, { status: 400 });
        }

        await deleteEnquiry(enquiryId);

        return NextResponse.json({
          success: true,
          message: 'Enquiry deleted',
        });
      }

      case 'generate-response': {
        const { templateName, data } = body;
        if (!templateName || !data) {
          return NextResponse.json({
            success: false,
            error: 'Template name and data required',
          }, { status: 400 });
        }

        const response = generateResponse(templateName, data);

        return NextResponse.json({
          success: true,
          response,
        });
      }

      default:
        return NextResponse.json({
          success: false,
          error: `Unknown action: ${action}`,
        }, { status: 400 });
    }
  } catch (error: any) {
    console.error('Enquiries POST error:', error);
    return NextResponse.json({
      success: false,
      error: error.message || 'Internal server error',
    }, { status: 500 });
  }
}
