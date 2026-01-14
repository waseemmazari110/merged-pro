/**
 * Manual Payment Sync Endpoint
 * Manually creates payment record from a Stripe checkout session
 * This is a workaround for local development without Stripe CLI
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe-client';
import { db } from '@/db';
import { payments, subscriptions } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
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
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: 'Session ID is required' },
        { status: 400 }
      );
    }

    console.log(`[${nowUKFormatted()}] Manual sync requested for session: ${sessionId}`);

    // Retrieve the checkout session from Stripe
    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'subscription', 'line_items']
    });

    if (!checkoutSession) {
      return NextResponse.json(
        { error: 'Checkout session not found' },
        { status: 404 }
      );
    }

    // Verify the session belongs to this user
    if (checkoutSession.metadata?.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Session does not belong to this user' },
        { status: 403 }
      );
    }

    // Create subscription record if doesn't exist
    if (checkoutSession.subscription && typeof checkoutSession.subscription === 'string') {
      const stripeSubscription = await stripe.subscriptions.retrieve(checkoutSession.subscription);
      
      // Check if subscription already exists
      const existingSub = await db
        .select()
        .from(subscriptions)
        .where(eq(subscriptions.stripeSubscriptionId, stripeSubscription.id))
        .limit(1);

      if (existingSub.length === 0) {
        const currentPeriodStart = new Date((stripeSubscription as any).current_period_start * 1000)
          .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
        const currentPeriodEnd = new Date((stripeSubscription as any).current_period_end * 1000)
          .toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

        await db.insert(subscriptions).values({
          userId: session.user.id,
          stripeSubscriptionId: stripeSubscription.id,
          stripeCustomerId: stripeSubscription.customer as string,
          stripePriceId: stripeSubscription.items.data[0].price.id,
          planName: checkoutSession.metadata?.subscriptionPlan || 'Unknown Plan',
          planType: checkoutSession.metadata?.tier || 'basic',
          status: stripeSubscription.status,
          currentPeriodStart,
          currentPeriodEnd,
          amount: (stripeSubscription.items.data[0].price.unit_amount || 0) / 100,
          currency: stripeSubscription.currency.toUpperCase(),
          interval: stripeSubscription.items.data[0].price.recurring?.interval || 'month',
          intervalCount: stripeSubscription.items.data[0].price.recurring?.interval_count || 1,
          cancelAtPeriodEnd: false,
          createdAt: nowUKFormatted(),
          updatedAt: nowUKFormatted(),
        });

        console.log(`[${nowUKFormatted()}] Created subscription record: ${stripeSubscription.id}`);
      }
    }

    // Create payment record
    if (checkoutSession.payment_intent) {
      const paymentIntentId = typeof checkoutSession.payment_intent === 'string'
        ? checkoutSession.payment_intent
        : checkoutSession.payment_intent.id;

      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId, {
        expand: ['charges']
      });

      // Check if payment already exists
      const existingPayment = await db
        .select()
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, paymentIntent.id))
        .limit(1);

      if (existingPayment.length === 0) {
        const charge = (paymentIntent as any).charges?.data[0];
        
        const subscriptionRecord = await db
          .select()
          .from(subscriptions)
          .where(eq(subscriptions.stripeSubscriptionId, checkoutSession.subscription as string))
          .limit(1);

        await db.insert(payments).values({
          userId: session.user.id,
          userRole: checkoutSession.metadata?.role || checkoutSession.metadata?.userRole || 'owner',
          stripeCustomerId: typeof checkoutSession.customer === 'string' ? checkoutSession.customer : checkoutSession.customer?.id || null,
          stripePaymentIntentId: paymentIntent.id,
          stripeChargeId: charge?.id || null,
          stripeSubscriptionId: checkoutSession.subscription as string || null,
          stripeSessionId: sessionId,
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          paymentStatus: paymentIntent.status === 'succeeded' ? 'succeeded' : paymentIntent.status,
          paymentMethod: charge?.payment_method_details?.type || 'card',
          paymentMethodBrand: charge?.payment_method_details?.card?.brand || 'unknown',
          paymentMethodLast4: charge?.payment_method_details?.card?.last4 || '****',
          description: checkoutSession.metadata?.subscriptionPlan || `Subscription payment - ${checkoutSession.metadata?.planName || 'Plan'}`,
          billingReason: checkoutSession.metadata?.billingReason || 'subscription_create',
          subscriptionPlan: checkoutSession.metadata?.subscriptionPlan || checkoutSession.metadata?.planName || null,
          subscriptionId: subscriptionRecord[0]?.id || null,
          receiptUrl: charge?.receipt_url || null,
          receiptEmail: charge?.receipt_email || session.user.email || null,
          stripeEventId: 'manual_sync',
          createdAt: nowUKFormatted(),
          updatedAt: nowUKFormatted(),
          processedAt: paymentIntent.status === 'succeeded' ? nowUKFormatted() : null,
        });

        console.log(`[${nowUKFormatted()}] Created payment record: ${paymentIntent.id}`);

        return NextResponse.json({
          success: true,
          message: 'Payment record created successfully',
          paymentIntentId: paymentIntent.id,
          timestamp: nowUKFormatted(),
        });
      } else {
        return NextResponse.json({
          success: true,
          message: 'Payment record already exists',
          timestamp: nowUKFormatted(),
        });
      }
    }

    return NextResponse.json({
      success: false,
      message: 'No payment intent found in checkout session',
    }, { status: 400 });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error(`[${nowUKFormatted()}] Error syncing payment:`, errorMessage);
    
    return NextResponse.json(
      {
        error: 'Failed to sync payment',
        message: errorMessage,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
