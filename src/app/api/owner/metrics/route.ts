/**
 * Owner Dashboard - Metrics & Analytics API
 * 
 * GET /api/owner/metrics - Get dashboard metrics
 * GET /api/owner/metrics?propertyId=xxx - Get property-specific analytics
 * GET /api/owner/metrics?compare=prop1,prop2 - Compare properties
 * GET /api/owner/metrics?export=csv - Export metrics to CSV
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { nowUKFormatted } from '@/lib/date-utils';
import {
  getDashboardMetrics,
  getPropertyAnalytics,
  compareProperties,
  getIndustryBenchmarks,
  exportMetricsToCSV,
} from '@/lib/owner-metrics';

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
    const propertyId = searchParams.get('propertyId');
    const compare = searchParams.get('compare');
    const exportFormat = searchParams.get('export');
    const benchmarks = searchParams.get('benchmarks');

    // Property-specific analytics
    if (propertyId) {
      const analytics = await getPropertyAnalytics(session.user.id, propertyId);
      
      if (!analytics) {
        return NextResponse.json(
          { error: 'Property not found or access denied' },
          { status: 404 }
        );
      }

      return NextResponse.json({
        success: true,
        analytics,
        timestamp: nowUKFormatted(),
      });
    }

    // Compare properties
    if (compare) {
      const propertyIds = compare.split(',').map(id => id.trim());
      const comparison = await compareProperties(session.user.id, propertyIds);

      return NextResponse.json({
        success: true,
        comparison,
        timestamp: nowUKFormatted(),
      });
    }

    // Industry benchmarks
    if (benchmarks === 'true') {
      const benchmarkData = await getIndustryBenchmarks();

      return NextResponse.json({
        success: true,
        benchmarks: benchmarkData,
        timestamp: nowUKFormatted(),
      });
    }

    // Full dashboard metrics
    const metrics = await getDashboardMetrics(session.user.id);

    // Export to CSV
    if (exportFormat === 'csv') {
      const csv = exportMetricsToCSV(metrics);

      return new NextResponse(csv, {
        status: 200,
        headers: {
          'Content-Type': 'text/csv',
          'Content-Disposition': `attachment; filename="dashboard-metrics-${Date.now()}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      metrics,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error('Error fetching metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch metrics' },
      { status: 500 }
    );
  }
}
