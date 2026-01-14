/**
 * API Route: Switch Subscription Plan
 * POST /api/subscriptions/switch-plan
 * Switches user's subscription to a different plan
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe-client';
import { getUserSubscription, updateSubscription } from '@/lib/stripe-billing';
import { getPlanById } from '@/lib/subscription-plans';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/subscriptions/switch-plan`);

  try {
    // Check authentication
    const session = await auth.api.getSession({ headers: request.headers });
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get request body
    const body = await request.json();
    const { newPlanId } = body;

    if (!newPlanId) {
      return NextResponse.json(
        { error: 'Missing newPlanId in request body' },
        { status: 400 }
      );
    }

    // Get current subscription
    const subscription = await getUserSubscription(session.user.id);

    if (!subscription) {
      return NextResponse.json(
        { error: 'No active subscription found. Please create a subscription first.' },
        { status: 404 }
      );
    }

    // Get the new plan details
    const newPlan = getPlanById(newPlanId);
    if (!newPlan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      );
    }

    // Check if already on this plan (compare by stripePriceId)
    if (subscription.stripePriceId === newPlan.stripePriceId) {
      return NextResponse.json(
        { error: 'Already subscribed to this plan' },
        { status: 400 }
      );
    }

    // Get the Stripe price ID for the new plan
    const newPriceId = newPlan.stripePriceId;
    if (!newPriceId) {
      return NextResponse.json(
        { error: 'Plan does not have a Stripe price ID configured' },
        { status: 500 }
      );
    }

    console.log(`[${nowUKFormatted()}] Switching subscription:`, {
      userId: session.user.id,
      currentPlan: subscription.planName,
      newPlan: newPlanId,
      subscriptionId: subscription.stripeSubscriptionId
    });

    // Update the subscription in Stripe
    const updatedSubscription = await updateSubscription(
      subscription.stripeSubscriptionId!,
      {
        priceId: newPriceId,
        prorationBehavior: 'always_invoice' // Prorate charges/credits
      }
    );

    console.log(`[${nowUKFormatted()}] Subscription switched successfully:`, {
      subscriptionId: updatedSubscription.id,
      newStatus: updatedSubscription.status
    });

    return NextResponse.json({
      success: true,
      message: `Successfully switched to ${newPlan.name} plan`,
      subscription: {
        id: updatedSubscription.id,
        planId: newPlanId,
        planName: newPlan.name,
        status: updatedSubscription.status,
        currentPeriodEnd: new Date((updatedSubscription as any).current_period_end * 1000).toISOString(),
      },
      timestamp: nowUKFormatted()
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${nowUKFormatted()}] Switch plan error:`, errorMessage);

    return NextResponse.json(
      {
        error: 'Failed to switch plan',
        message: errorMessage,
        timestamp: nowUKFormatted()
      },
      { status: 500 }
    );
  }
}
