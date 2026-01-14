/**
 * API Route: /api/subscriptions/current
 * Get current user's subscription details
 * Milestone 4: Annual Subscription Workflow
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getUserSubscription, getUserInvoices } from '@/lib/stripe-billing';
import { getCurrentBillingCycle } from '@/lib/billing-cycle';
import { getRetryPolicy, isAccountSuspended } from '@/lib/payment-retry';
import { nowUKFormatted } from '@/lib/date-utils';

export async function GET(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] GET /api/subscriptions/current`);

  try {
    const session = await auth.api.getSession({ headers: request.headers });
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Get subscription
    const subscription = await getUserSubscription(session.user.id);
    
    if (!subscription) {
      return NextResponse.json({
        hasSubscription: false,
        message: 'No active subscription',
        timestamp: nowUKFormatted(),
      });
    }

    // Get billing cycle info
    const billingCycle = await getCurrentBillingCycle(subscription.id.toString());

    // Get retry policy if exists
    const retryPolicy = await getRetryPolicy(subscription.id.toString());

    // Check suspension status
    const isSuspended = await isAccountSuspended(subscription.id.toString());

    // Get recent invoices
    const invoices = await getUserInvoices(session.user.id);
    const recentInvoices = invoices.slice(0, 5);

    return NextResponse.json({
      hasSubscription: true,
      subscription: {
        id: subscription.id,
        planName: subscription.planName,
        planType: subscription.planType,
        status: subscription.status,
        amount: subscription.amount,
        currency: subscription.currency,
        interval: subscription.interval,
        currentPeriodStart: subscription.currentPeriodStart,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        cancelledAt: subscription.cancelledAt,
        trialStart: subscription.trialStart,
        trialEnd: subscription.trialEnd,
      },
      billingCycle: billingCycle ? {
        daysUntilRenewal: billingCycle.daysUntilRenewal,
        nextBillingDate: billingCycle.nextBillingDate,
        isRenewalDue: billingCycle.isRenewalDue,
      } : null,
      retryPolicy: retryPolicy ? {
        currentAttempt: retryPolicy.currentAttempt,
        maxAttempts: retryPolicy.maxAttempts,
        nextRetryDate: retryPolicy.nextRetryDate,
        status: retryPolicy.status,
      } : null,
      isSuspended,
      recentInvoices: recentInvoices.map(inv => ({
        id: inv.id,
        invoiceNumber: inv.invoiceNumber,
        status: inv.status,
        total: inv.total,
        currency: inv.currency,
        invoiceDate: inv.invoiceDate,
        paidAt: inv.paidAt,
        invoicePdf: inv.invoicePdf,
        hostedInvoiceUrl: inv.hostedInvoiceUrl,
      })),
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Error fetching subscription:`, (error as Error).message);
    return NextResponse.json(
      {
        error: 'Failed to fetch subscription',
        message: (error as Error).message,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
