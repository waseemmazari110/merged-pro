/**
 * API Route: /api/subscriptions/cancel
 * Cancel user's subscription
 * Milestone 4: Annual Subscription Workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserSubscription, cancelSubscription } from '@/lib/stripe-billing';
import { fullOwnerSyncToCRM } from '@/lib/crm-sync';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/subscriptions/cancel`);

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { immediate = false } = body;

    // Get user's subscription
    const subscription = await getUserSubscription(session.user.id);
    if (!subscription || !subscription.stripeSubscriptionId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Cancel subscription
    const result = await cancelSubscription(
      subscription.stripeSubscriptionId,
      !immediate
    );

    console.log(`[${nowUKFormatted()}] Subscription cancelled`);
    
    // Sync subscription cancellation to CRM
    try {
      await fullOwnerSyncToCRM(
        session.user.id,
        'subscription_cancelled',
        {
          subscriptionId: subscription.stripeSubscriptionId,
          immediate,
          cancelledAt: immediate ? nowUKFormatted() : result.subscription.currentPeriodEnd,
          planName: subscription.planName,
        }
      );
      
      console.log(`[${nowUKFormatted()}] CRM sync completed for subscription cancellation`);
    } catch (crmError) {
      console.error(`[${nowUKFormatted()}] Failed to sync cancellation to CRM:`, 
        crmError instanceof Error ? crmError.message : 'Unknown error');
      // Don't fail the API if CRM sync fails
    }

    return NextResponse.json({
      success: true,
      subscription: result.subscription,
      cancelledAt: immediate ? nowUKFormatted() : result.subscription.currentPeriodEnd,
      message: immediate
        ? 'Subscription cancelled immediately'
        : 'Subscription will cancel at end of billing period',
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error cancelling subscription:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to cancel subscription',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
