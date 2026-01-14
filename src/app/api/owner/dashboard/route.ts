/**
 * Owner Dashboard - Summary API
 * 
 * GET /api/owner/dashboard - Get complete dashboard summary
 * 
 * Returns aggregated data for dashboard home page with UK timestamps.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import { getDashboardMetrics } from '@/lib/owner-metrics';
import { getRecentActivity } from '@/lib/audit-logger';
import { getMembershipData } from '@/lib/crm-sync';
import { db } from '@/db';
import { properties } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';

export interface DashboardSummary {
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    memberSince: string;
  };
  subscription: {
    tier: string;
    status: string;
    planName: string;
    validUntil: string;
    maxProperties: number;
    currentProperties: number;
    remainingProperties: number;
  };
  quickStats: {
    totalProperties: number;
    publishedProperties: number;
    totalEnquiries: number;
    newEnquiriesToday: number;
    totalViews: number;
    viewsThisWeek: number;
    estimatedRevenue: number;
    responseRate: number;
  };
  recentProperties: Array<{
    id: string;
    title: string;
    status: string;
    createdAt: string;
    updatedAt: string;
    views: number;
    enquiries: number;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    resourceType: string;
    resourceName: string;
    timestamp: string;
    status: string;
  }>;
  alerts: Array<{
    id: string;
    type: 'info' | 'warning' | 'error' | 'success';
    title: string;
    message: string;
    actionText?: string;
    actionUrl?: string;
    timestamp: string;
  }>;
  generatedAt: string;
}

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

    // Fetch all required data in parallel
    const [metrics, recentActivity, membership, userProperties] = await Promise.all([
      getDashboardMetrics(session.user.id),
      getRecentActivity(session.user.id, 10),
      getMembershipData(session.user.id),
      db
        .select()
        .from(properties)
        .where(eq(properties.ownerId, session.user.id))
        .orderBy(desc(properties.createdAt))
        .limit(5),
    ]);

    // Build dashboard summary
    const summary: DashboardSummary = {
      user: {
        id: session.user.id,
        name: session.user.name || 'Unknown',
        email: session.user.email || '',
        role: (session.user as any).role || 'owner',
        memberSince: (session.user as any).createdAt || nowUKFormatted(),
      },
      subscription: {
        tier: membership?.tier || 'free',
        status: membership?.status || 'inactive',
        planName: membership?.planName || 'Free Plan',
        validUntil: membership?.subscriptionEnd || 'N/A',
        maxProperties: membership?.maxProperties || 1,
        currentProperties: metrics.overview.totalProperties,
        remainingProperties: Math.max(0, (membership?.maxProperties || 1) - metrics.overview.totalProperties),
      },
      quickStats: {
        totalProperties: metrics.overview.totalProperties,
        publishedProperties: metrics.overview.publishedProperties,
        totalEnquiries: metrics.overview.totalEnquiries,
        newEnquiriesToday: metrics.enquiries.byPeriod.today,
        totalViews: 0, // In production, sum from analytics
        viewsThisWeek: 0, // In production, sum from analytics
        estimatedRevenue: metrics.revenue.estimatedMonthlyRevenue,
        responseRate: metrics.overview.responseRate,
      },
      recentProperties: userProperties.map(p => ({
        id: p.id!.toString(),
        title: p.title,
        status: p.isPublished ? 'published' : 'draft',
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        views: 0, // In production, fetch from analytics
        enquiries: 0, // In production, count from enquiries table
      })),
      recentActivity: recentActivity.map(a => ({
        id: a.id,
        action: a.action,
        resourceType: a.resourceType,
        resourceName: a.resourceName || 'Unknown',
        timestamp: a.timestamp,
        status: a.status,
      })),
      alerts: generateAlerts(membership, metrics),
      generatedAt: nowUKFormatted(),
    };

    return NextResponse.json({
      success: true,
      dashboard: summary,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error fetching dashboard summary:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard summary' },
      { status: 500 }
    );
  }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

function generateAlerts(membership: any, metrics: any): Array<{
  id: string;
  type: 'info' | 'warning' | 'error' | 'success';
  title: string;
  message: string;
  actionText?: string;
  actionUrl?: string;
  timestamp: string;
}> {
  const alerts: any[] = [];
  const timestamp = nowUKFormatted();

  // Check property limit
  if (membership.maxProperties > 0) {
    const usage = (metrics.overview.totalProperties / membership.maxProperties) * 100;
    
    if (usage >= 90) {
      alerts.push({
        id: 'alert-property-limit',
        type: 'warning',
        title: 'Property Limit Almost Reached',
        message: `You have ${metrics.overview.totalProperties} of ${membership.maxProperties} properties. Consider upgrading to add more.`,
        actionText: 'Upgrade Plan',
        actionUrl: '/owner/subscription',
        timestamp,
      });
    }
  }

  // Check for unpublished properties
  if (metrics.overview.draftProperties > 0) {
    alerts.push({
      id: 'alert-draft-properties',
      type: 'info',
      title: 'Unpublished Properties',
      message: `You have ${metrics.overview.draftProperties} draft ${metrics.overview.draftProperties === 1 ? 'property' : 'properties'}. Publish them to start receiving enquiries.`,
      actionText: 'View Drafts',
      actionUrl: '/owner/properties?status=draft',
      timestamp,
    });
  }

  // Check for new enquiries
  if (metrics.overview.newEnquiriesThisMonth > 0) {
    alerts.push({
      id: 'alert-new-enquiries',
      type: 'success',
      title: 'New Enquiries',
      message: `You have ${metrics.overview.newEnquiriesThisMonth} new ${metrics.overview.newEnquiriesThisMonth === 1 ? 'enquiry' : 'enquiries'} this month!`,
      actionText: 'View Enquiries',
      actionUrl: '/owner/enquiries',
      timestamp,
    });
  }

  // Check subscription status
  if (membership.status === 'past_due') {
    alerts.push({
      id: 'alert-payment-failed',
      type: 'error',
      title: 'Payment Failed',
      message: 'Your last payment failed. Please update your payment method to avoid service interruption.',
      actionText: 'Update Payment',
      actionUrl: '/owner/billing',
      timestamp,
    });
  }

  if (membership.status === 'trial') {
    alerts.push({
      id: 'alert-trial-ending',
      type: 'warning',
      title: 'Trial Period',
      message: `Your trial ends on ${membership.trialEnd}. Subscribe to continue accessing all features.`,
      actionText: 'Subscribe Now',
      actionUrl: '/owner/subscription',
      timestamp,
    });
  }

  // Check response rate
  if (metrics.overview.responseRate < 50 && metrics.overview.totalEnquiries > 5) {
    alerts.push({
      id: 'alert-low-response-rate',
      type: 'warning',
      title: 'Low Response Rate',
      message: `Your response rate is ${metrics.overview.responseRate}%. Responding quickly can improve bookings.`,
      actionText: 'View Enquiries',
      actionUrl: '/owner/enquiries',
      timestamp,
    });
  }

  return alerts;
}
