import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, desc, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { logPropertyAction, captureRequestDetails } from '@/lib/audit-logger';
import { revalidateProperty, revalidateOwnerDashboard } from '@/lib/cache';
import { canCreateProperty } from '@/lib/payment-verification';

export async function GET(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an owner or admin
    const userRole = (session.user as any).role;
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Owner or Admin role required.' },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status'); // active, draft, archived
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Fetch properties owned by this user
    const conditions = [eq(properties.ownerId, session.user.id)];
    
    // Apply status filter if provided
    if (status) {
      conditions.push(eq(properties.isPublished, status === 'active'));
    }

    const ownerProperties = await db
      .select()
      .from(properties)
      .where(and(...conditions))
      .orderBy(desc(properties.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count
    const totalCount = await db
      .select()
      .from(properties)
      .where(eq(properties.ownerId, session.user.id));

    return NextResponse.json({
      success: true,
      properties: ownerProperties.map(prop => ({
        ...prop,
        // Include status information for owner visibility
        statusInfo: {
          status: prop.status || 'pending',
          approvedAt: prop.approvedAt,
          rejectionReason: prop.rejectionReason,
        },
      })),
      pagination: {
        total: totalCount.length,
        limit,
        offset,
        hasMore: offset + limit < totalCount.length,
      },
      timestamp: nowUKFormatted(),
    });
  } catch (error) {
    console.error('Error fetching owner properties:', error);
    return NextResponse.json(
      { error: 'Failed to fetch properties' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if user is an owner or admin
    const userRole = (session.user as any).role;
    if (userRole !== 'owner' && userRole !== 'admin') {
      return NextResponse.json(
        { error: 'Access denied. Owner or Admin role required.' },
        { status: 403 }
      );
    }

    // PAYMENT VERIFICATION: Ensure payment is complete before allowing listing submission
    const paymentCheck = await canCreateProperty(session.user.id);
    if (!paymentCheck.allowed) {
      return NextResponse.json(
        { 
          error: 'Payment required', 
          message: paymentCheck.reason,
          requiresPayment: true 
        },
        { status: 402 } // 402 Payment Required
      );
    }

    const body = await request.json();
    const {
      title,
      location,
      region,
      sleepsMin,
      sleepsMax,
      bedrooms,
      bathrooms,
      priceFromMidweek,
      priceFromWeekend,
      description,
      heroImage,
    } = body;

    const timestamp = nowUKFormatted();

    // Create new property with UK timestamps
    // Status is set to 'pending' by default - requires admin approval
    const newProperty = await db.insert(properties).values({
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-'),
      location,
      region,
      sleepsMin,
      sleepsMax,
      bedrooms,
      bathrooms,
      priceFromMidweek,
      priceFromWeekend,
      description,
      heroImage,
      ownerId: session.user.id,
      status: 'pending', // New listings require admin approval
      isPublished: false,
      createdAt: timestamp,
      updatedAt: timestamp,
    }).returning();

    // Log audit event with UK timestamp
    const requestDetails = captureRequestDetails(request);
    await logPropertyAction(
      session.user.id,
      'property.create',
      newProperty[0].id!.toString(),
      title,
      { 
        bedrooms,
        bathrooms,
        sleepsMin,
        sleepsMax,
        priceFromMidweek,
        priceFromWeekend,
        ...requestDetails
      }
    );

    // Revalidate cache to update UI
    revalidateProperty(newProperty[0].id.toString(), session.user.id);
    revalidateOwnerDashboard(session.user.id);

    return NextResponse.json({
      success: true,
      property: newProperty[0],
      timestamp,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating property:', error);
    return NextResponse.json(
      { error: 'Failed to create property' },
      { status: 500 }
    );
  }
}
