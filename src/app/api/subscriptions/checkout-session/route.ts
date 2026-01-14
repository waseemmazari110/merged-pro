/**
 * API Route: Create Stripe Checkout Session
 * Handles subscription checkout with success/cancel URLs
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe-client';
import { getOrCreateCustomer } from '@/lib/stripe-billing';
import { getPlanById } from '@/lib/subscription-plans';
import { nowUKFormatted } from '@/lib/date-utils';

export async function POST(request: NextRequest) {
  const timestamp = nowUKFormatted();
  console.log(`[${timestamp}] POST /api/subscriptions/checkout-session`);

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
    const { planId, successUrl, cancelUrl } = body;

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

    // Free plan doesn't need checkout
    if (plan.price === 0) {
      return NextResponse.json(
        { error: 'Free plan does not require checkout' },
        { status: 400 }
      );
    }

    // Validate Stripe Price ID
    const isInvalidPriceId = !plan.stripePriceId || 
                             plan.stripePriceId.includes('REPLACE_ME') || 
                             plan.stripePriceId.includes('XXXXXX') ||
                             plan.stripePriceId.startsWith('price_') && 
                             !plan.stripePriceId.startsWith('price_') ||
                             (plan.stripePriceId === `price_${plan.tier}_${plan.interval}`);
    
    if (isInvalidPriceId || !plan.stripePriceId.startsWith('price_')) {
      console.error(`[${nowUKFormatted()}] Invalid or unconfigured Stripe Price ID for plan ${planId}:`, plan.stripePriceId);
      return NextResponse.json(
        { 
          error: 'Checkout not available',
          message: `Subscription plan "${plan.name}" is not yet available. Please contact support to set up this plan.`,
          details: `Plan ID: ${planId}, Tier: ${plan.tier}, Interval: ${plan.interval}`
        },
        { status: 503 }
      );
    }

    // Get or create Stripe customer
    const customerId = await getOrCreateCustomer(
      session.user.id,
      session.user.email || '',
      session.user.name || 'User'
    );

    // Determine the base URL for redirects
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   request.headers.get('origin') || 
                   'http://localhost:3000';

    // Create Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      line_items: [
        {
          price: plan.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: successUrl || `${baseUrl}/owner/dashboard?payment_success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/owner/subscription?canceled=true`,
      metadata: {
        userId: session.user.id,
        role: 'owner',
        userRole: 'owner',
        subscriptionPlan: `${plan.name} (${plan.tier} - ${plan.interval})`,
        planName: plan.name,
        userName: session.user.name || '',
        userEmail: session.user.email || '',
        planId: plan.id,
        tier: plan.tier,
        billingReason: 'subscription_create',
        timestamp: nowUKFormatted(),
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          role: 'owner',
          userRole: 'owner',
          subscriptionPlan: `${plan.name} (${plan.tier} - ${plan.interval})`,
          planName: plan.name,
          userName: session.user.name || '',
          userEmail: session.user.email || '',
          planId: plan.id,
          tier: plan.tier,
          billingReason: 'subscription_create',
        },
      },
      billing_address_collection: 'auto',
      customer_update: {
        address: 'auto',
      },
    });

    console.log(`[${nowUKFormatted()}] Checkout session created: ${checkoutSession.id}`);

    return NextResponse.json({
      sessionId: checkoutSession.id,
      url: checkoutSession.url,
      timestamp: nowUKFormatted(),
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorDetails = error instanceof Error && 'type' in error 
      ? { type: (error as any).type, code: (error as any).code }
      : {};
    
    console.error(`[${nowUKFormatted()}] Error creating checkout session:`, {
      message: errorMessage,
      details: errorDetails,
      stripeConfigured: !!process.env.STRIPE_TEST_KEY || !!process.env.STRIPE_SECRET_KEY,
    });
    
    return NextResponse.json(
      {
        error: 'Failed to create checkout session',
        message: errorMessage,
        details: errorDetails,
        timestamp: nowUKFormatted(),
      },
      { status: 500 }
    );
  }
}
