/**
 * API Route: /api/subscriptions/plans
 * Get all available subscription plans
 * Milestone 4: Annual Subscription Workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import {
  SUBSCRIPTION_PLANS,
  getPlansByTier,
  getPlansByInterval,
  getPlanComparison,
  TRIAL_CONFIG,
} from '@/lib/subscription-plans';
import { nowUKFormatted } from '@/lib/date-utils';

export async function GET(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/subscriptions/plans`);

  try {
    const { searchParams } = new URL(request.url);
    const tier = searchParams.get('tier');
    const interval = searchParams.get('interval');

    let plans;

    if (tier) {
      plans = getPlansByTier(tier as any);
    } else if (interval) {
      plans = getPlansByInterval(interval as any);
    } else {
      plans = Object.values(SUBSCRIPTION_PLANS);
    }

    const comparison = getPlanComparison();

    return NextResponse.json({
      plans,
      comparison,
      trialConfig: TRIAL_CONFIG,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error fetching plans:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to fetch plans',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
