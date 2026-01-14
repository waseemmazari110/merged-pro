/**
 * API Route: Owner Payment Sync
 * Sync payments from Stripe webhook data to database
 */

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { payments, subscriptions } from "@/db/schema";
import { eq } from "drizzle-orm";
import { 
  getCurrentUserWithRole,
  unauthenticatedResponse
} from "@/lib/auth-roles";
import { stripe } from "@/lib/stripe-client";

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const currentUser = await getCurrentUserWithRole();

    if (!currentUser) {
      return unauthenticatedResponse('Please log in to access this resource');
    }

    let syncedCount = 0;

    // ===== SYNC INVOICES (Primary for subscriptions) =====
    console.log(`[${new Date().toISOString()}] Syncing invoices for user: ${currentUser.id}`);
    
    const invoices = await stripe.invoices.list({ 
      limit: 100,
      expand: ['data.payment_intent', 'data.charge']
    });

    // Process each invoice
    for (const invoice of invoices.data) {
      // Check if this is for the current user
      const userId = invoice.metadata?.userId;
      if (!userId || userId !== currentUser.id) {
        continue;
      }

      // Skip draft invoices
      if (invoice.status === 'draft') {
        continue;
      }

      // Check if payment already exists
      const existing = await db
        .select()
        .from(payments)
        .where(eq(payments.stripeInvoiceId, invoice.id));

      if (existing.length === 0) {
        try {
          // Get subscription details
          let subscriptionId = null;
          const invoiceData = invoice as any;
          if (invoiceData.subscription && typeof invoiceData.subscription === 'string') {
            const subRecords = await db
              .select()
              .from(subscriptions)
              .where(eq(subscriptions.stripeSubscriptionId, invoiceData.subscription));
            subscriptionId = subRecords[0]?.id || null;
          }

          const paymentIntent = invoiceData.payment_intent as any;
          const charge = invoiceData.charge as any;

          // Only sync paid or failed invoices
          if (invoice.status === 'paid' || invoice.status === 'open' || invoice.status === 'uncollectible') {
            await db.insert(payments).values({
              userId: currentUser.id,
              subscriptionId: subscriptionId,
              stripeCustomerId: invoiceData.customer as string || null,
              stripePaymentIntentId: paymentIntent?.id || null,
              stripeChargeId: charge?.id || null,
              stripeInvoiceId: invoice.id,
              amount: (invoiceData.amount_paid || 0) / 100,
              currency: (invoiceData.currency || 'gbp').toUpperCase(),
              paymentStatus: invoice.status === 'paid' ? 'succeeded' : (invoice.status === 'open' ? 'pending' : 'failed'),
              paymentMethod: (charge as any)?.payment_method_details?.type || 'card',
              paymentMethodBrand: (charge as any)?.payment_method_details?.card?.brand || null,
              paymentMethodLast4: (charge as any)?.payment_method_details?.card?.last4 || null,
              description: `Invoice #${invoiceData.number || invoice.id.substring(0, 8)}`,
              billingReason: invoiceData.billing_reason || null,
              receiptUrl: invoiceData.receipt_url || null,
              receiptEmail: invoiceData.receipt_email || null,
              failureCode: (paymentIntent as any)?.last_payment_error?.code || null,
              failureMessage: (paymentIntent as any)?.last_payment_error?.message || null,
              subscriptionPlan: invoiceData.metadata?.planName || null,
              metadata: JSON.stringify(invoiceData.metadata || {}),
              stripeEventId: 'manual_sync',
              processedAt: new Date().toISOString(),
              createdAt: new Date(invoiceData.created * 1000).toISOString(),
              updatedAt: new Date().toISOString(),
            });
            
            syncedCount++;
            console.log(`[${new Date().toISOString()}] Synced invoice: ${invoice.id}`);
          }
        } catch (error) {
          console.error(`Error inserting invoice payment ${invoice.id}:`, error);
        }
      }
    }

    // ===== SYNC PAYMENT INTENTS (One-time payments) =====
    console.log(`[${new Date().toISOString()}] Syncing payment intents for user: ${currentUser.id}`);
    
    const paymentIntents = await stripe.paymentIntents.list({ 
      limit: 100,
      expand: ['data.charges']
    });

    // Process each payment intent
    for (const intent of paymentIntents.data) {
      // Check if this is for the current user
      const userId = intent.metadata?.userId;
      if (!userId || userId !== currentUser.id) {
        continue;
      }

      // Check if payment already exists
      const existing = await db
        .select()
        .from(payments)
        .where(eq(payments.stripePaymentIntentId, intent.id));

      if (existing.length === 0 && intent.status === 'succeeded') {
        // Create payment record
        const intentData = intent as any;
        const charge = intentData.charges?.data?.[0];
        
        try {
          await db.insert(payments).values({
            userId: currentUser.id,
            stripeCustomerId: intentData.customer as string || null,
            stripePaymentIntentId: intent.id,
            stripeChargeId: charge?.id || null,
            stripeInvoiceId: intentData.invoice as string || null,
            amount: intent.amount / 100,
            currency: intent.currency.toUpperCase(),
            paymentStatus: intent.status,
            paymentMethod: charge?.payment_method_details?.type || null,
            paymentMethodBrand: (charge?.payment_method_details as any)?.card?.brand || null,
            paymentMethodLast4: (charge?.payment_method_details as any)?.card?.last4 || null,
            description: intent.description || 'Payment',
            receiptUrl: charge?.receipt_url || null,
            receiptEmail: intentData.receipt_email || null,
            failureCode: intentData.last_payment_error?.code || null,
            failureMessage: intentData.last_payment_error?.message || null,
            metadata: JSON.stringify(intent.metadata || {}),
            stripeEventId: 'manual_sync',
            processedAt: new Date().toISOString(),
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          });
          
          syncedCount++;
          console.log(`[${new Date().toISOString()}] Synced payment intent: ${intent.id}`);
        } catch (error) {
          console.error('Error inserting payment intent:', error);
        }
      }
    }

    console.log(`[${new Date().toISOString()}] Payment sync complete. Total synced: ${syncedCount}`);

    return NextResponse.json({
      success: true,
      synced: syncedCount,
      message: `Successfully synced ${syncedCount} payments from Stripe`
    });

  } catch (error) {
    console.error("Error syncing payments:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Failed to sync payments", 
        details: (error as Error).message 
      },
      { status: 500 }
    );
  }
}
