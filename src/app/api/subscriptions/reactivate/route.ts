/**
 * API Route: /api/subscriptions/reactivate
 * Reactivate a cancelled or suspended subscription
 * Milestone 4: Annual Subscription Workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserSubscription, reactivateSubscription } from '@/lib/stripe-billing';
import { reactivateSuspendedAccount, isAccountSuspended } from '@/lib/payment-retry';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/subscriptions/reactivate`);

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get user's subscription
    const subscription = await getUserSubscription(session.user.id);
    if (!subscription) {
      return NextResponse.json(
        { error: 'No subscription found' },
        { status: 404 }
      );
    }

    // Check if suspended
    const isSuspended = await isAccountSuspended(subscription.id.toString());

    if (isSuspended) {
      // Reactivate suspended account (requires payment)
      await reactivateSuspendedAccount(subscription.id.toString(), session.user.id);
      
      console.log(`[${nowUKFormatted()}] Suspended account reactivated`);

      return NextResponse.json({
        success: true,
        message: 'Suspended account reactivated successfully',
        timestamp: nowUKFormatted(),
      });
    } else if (subscription.cancelAtPeriodEnd) {
      // Reactivate cancelled subscription
      if (!subscription.stripeSubscriptionId) {
        return NextResponse.json(
          { error: 'Subscription ID not found' },
          { status: 400 }
        );
      }
      const result = await reactivateSubscription(subscription.stripeSubscriptionId);

      console.log(`[${nowUKFormatted()}] Cancelled subscription reactivated`);

      return NextResponse.json({
        success: true,
        subscription: result.subscription,
        message: 'Subscription reactivated successfully',
        timestamp: nowUKFormatted(),
      });
    } else {
      return NextResponse.json(
        {
          error: 'Subscription is already active',
          timestamp: nowUKFormatted(),
        },
        { status: 400 }
      );
    }

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error reactivating subscription:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to reactivate subscription',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
