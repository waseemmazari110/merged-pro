import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { stripe } from '@/lib/stripe';
import { PLANS, PlanId, getPlanPriceId } from '@/lib/plans';
import { auth } from '@/lib/auth';
import { db } from '@/db';
import { user as userTable } from '@/db/schema';
import { eq } from 'drizzle-orm';

export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { planId, propertyId, interval = 'yearly' } = body as { 
      planId: PlanId; 
      propertyId?: string;
      interval?: 'monthly' | 'yearly';
    };

    if (!planId || !PLANS[planId]) {
      return NextResponse.json({ error: 'Invalid plan selected' }, { status: 400 });
    }

    // Persist plan selection to user's account before payment as requested
    await db
      .update(userTable)
      .set({
        planId: planId,
        updatedAt: new Date(),
      })
      .where(eq(userTable.id, session.user.id));

    // Get the correct Stripe price ID from environment variables
    const stripePriceId = getPlanPriceId(planId, interval);
    const plan = PLANS[planId];
    const headersList = await headers();
    const origin = headersList.get('origin') || 'http://localhost:3000';

    console.log(`Creating Stripe checkout for plan: ${planId}, interval: ${interval}, priceId: ${stripePriceId}`);

      const checkoutSession = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'subscription',
        billing_address_collection: 'required',
        line_items: [
          {
            price: stripePriceId,
            quantity: 1,
          },
        ],
      success_url: `${origin}/payment/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/payment/cancel`,
      customer_email: session.user.email,
      metadata: {
        userId: session.user.id,
        planId: planId,
        propertyId: propertyId || '',
        interval: interval,
      },
      subscription_data: {
        metadata: {
          userId: session.user.id,
          planId: planId,
          propertyId: propertyId || '',
          interval: interval,
        },
      },
      automatic_tax: {
        enabled: true,
      },
      tax_id_collection: {
        enabled: true,
      },
    });

    console.log(`Stripe checkout session created: ${checkoutSession.id}`);
    return NextResponse.json({ url: checkoutSession.url });
    } catch (error: any) {
      console.error('Stripe Checkout Error:', {
        message: error.message,
        type: error.type,
        code: error.code,
        param: error.param,
        detail: error
      });
      
      const errorMessage = error.message || 'Failed to create checkout session';
      
      return NextResponse.json(
        { error: errorMessage },
        { status: 500 }
      );
    }
}
