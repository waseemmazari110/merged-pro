/**
 * API Route: /api/subscriptions/create
 * Create new subscription for user
 * Milestone 4: Annual Subscription Workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { createCustomer, createSubscription, getOrCreateCustomer } from '@/lib/stripe-billing';
import { getPlanById } from '@/lib/subscription-plans';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/subscriptions/create`);

  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { planId, trialDays } = body;

    if (!planId) {
      return NextResponse.json(
        { error: 'Plan ID is required' },
        { status: 400 }
      );
    }

    // Get plan details
    const plan = getPlanById(planId);
    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(
      session.user.id,
      session.user.email || '',
      session.user.name || 'User'
    );

    // Create subscription
    const result = await createSubscription({
      userId: session.user.id,
      customerId,
      priceId: plan.stripePriceId,
      planName: plan.name,
      planType: plan.interval === 'yearly' ? 'yearly' : 'monthly',
      trialDays: trialDays || 0,
      metadata: {
        planId: plan.id,
        tier: plan.tier,
      },
    });

    console.log(`[${nowUKFormatted()}] Subscription created successfully`);

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      clientSecret: result.clientSecret,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error creating subscription:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to create subscription',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
