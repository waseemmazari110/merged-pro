/**
 * Subscription Update Payment Method API
 * POST /api/subscriptions/update-payment-method
 * Allows users to update their payment method for active subscription
 */

import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe-client';
import { db } from '@/db';
import { subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/subscriptions/update-payment-method`);

  try {
    // Authenticate user
    const session = await auth.api.getSession({ headers: await headers() });

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { paymentMethodId } = body;

    if (!paymentMethodId) {
      return NextResponse.json(
        { error: 'Payment method ID is required' },
        { status: 400 }
      );
    }

    // Get user's active subscription
    const [subscription] = await db
      .select()
      .from(subscriptions)
      .where(eq(subscriptions.userId, session.user.id))
      .limit(1);

    if (!subscription || !subscription.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active subscription found' },
        { status: 404 }
      );
    }

    // Attach payment method to customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: subscription.stripeCustomerId,
    });

    // Set as default payment method
    await stripe.customers.update(subscription.stripeCustomerId, {
      invoice_settings: {
        default_payment_method: paymentMethodId,
      },
    });

    // If subscription is past_due, retry payment immediately
    if (subscription.status === 'past_due' && subscription.stripeSubscriptionId) {
      try {
        // Get latest invoice
        const invoices = await stripe.invoices.list({
          subscription: subscription.stripeSubscriptionId,
          limit: 1,
        });

        if (invoices.data.length > 0) {
          const latestInvoice = invoices.data[0];
          if (latestInvoice.status === 'open') {
            // Attempt to pay the invoice
            await stripe.invoices.pay(latestInvoice.id);
            
            // Update subscription status
            await db
              .update(subscriptions)
              .set({
                status: 'active',
                updatedAt: nowUKFormatted(),
              })
              .where(eq(subscriptions.id, subscription.id));
          }
        }
      } catch (payError) {
        console.error('Failed to retry payment:', payError);
        // Continue anyway, payment will be retried on schedule
      }
    }

    console.log(`[${nowUKFormatted()}] Payment method updated for user ${session.user.id}`);

    return NextResponse.json({
      success: true,
      message: 'Payment method updated successfully',
    });

  } catch (error) {
    console.error(`[${nowUKFormatted()}] Payment method update error:`, error);
    return NextResponse.json(
      { error: 'Failed to update payment method' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'POST to update payment method' }, { status: 200 });
}
