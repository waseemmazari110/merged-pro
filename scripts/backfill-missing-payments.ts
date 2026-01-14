/**
 * Backfill Missing Payments Script
 * Syncs payment data from Stripe for all subscriptions that don't have payment records
 */

import 'dotenv/config';
import Stripe from 'stripe';
import { db } from './src/db/index';
import { payments, subscriptions, user } from './src/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted } from './src/lib/date-utils';

// Initialize Stripe
const stripeSecretKey = process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  console.error('❌ Missing Stripe secret key. Set STRIPE_TEST_KEY in .env');
  process.exit(1);
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

async function backfillMissingPayments() {
  console.log('\n=== Backfilling Missing Payments ===\n');

  try {
    // 1. Get all subscriptions
    const allSubscriptions = await db
      .select({
        subscription: subscriptions,
        user: user,
      })
      .from(subscriptions)
      .leftJoin(user, eq(subscriptions.userId, user.id));

    console.log(`Found ${allSubscriptions.length} subscriptions in database\n`);

    if (allSubscriptions.length === 0) {
      console.log('No subscriptions found. Nothing to backfill.\n');
      return;
    }

    let processedCount = 0;
    let createdCount = 0;
    let skippedCount = 0;
    let errorCount = 0;

    // 2. Process each subscription
    for (const { subscription: sub, user: userRecord } of allSubscriptions) {
      processedCount++;
      console.log(`\n[${processedCount}/${allSubscriptions.length}] Processing subscription ID ${sub.id}`);
      console.log(`  User: ${userRecord?.name || 'Unknown'} (${sub.userId})`);
      console.log(`  Plan: ${sub.planName} (${sub.planType})`);
      console.log(`  Stripe Subscription: ${sub.stripeSubscriptionId}`);

      try {
        // Check if payment already exists for this subscription
        const existingPayments = await db
          .select()
          .from(payments)
          .where(eq(payments.subscriptionId, sub.id));

        if (existingPayments.length > 0) {
          console.log(`  ✓ Already has ${existingPayments.length} payment record(s) - skipping`);
          skippedCount++;
          continue;
        }

        // Fetch payment intents from Stripe for this subscription
        console.log(`  → Fetching payment intents from Stripe...`);
        
        const paymentIntents = await stripe.paymentIntents.list({
          customer: sub.stripeCustomerId || undefined,
          limit: 100,
        });

        // Filter for payment intents related to this subscription
        const relatedPayments = paymentIntents.data.filter(pi => {
          // Check if payment intent is related to this subscription
          const metadata = pi.metadata || {};
          const invoice = pi.invoice as string | null;
          
          return (
            metadata.subscriptionId === sub.stripeSubscriptionId ||
            pi.metadata?.subscriptionPlan === sub.planName ||
            invoice // Has invoice (likely subscription-related)
          );
        });

        console.log(`  Found ${relatedPayments.length} related payment intent(s)`);

        if (relatedPayments.length === 0) {
          console.log(`  ⚠️  No payment intents found for this subscription`);
          continue;
        }

        // Create payment records for each payment intent
        for (const paymentIntent of relatedPayments) {
          const charge = paymentIntent.charges?.data[0];
          const paymentMethod = charge?.payment_method_details;

          // Check if payment already exists by payment intent ID
          const existingByIntent = await db
            .select()
            .from(payments)
            .where(eq(payments.stripePaymentIntentId, paymentIntent.id));

          if (existingByIntent.length > 0) {
            console.log(`    ↩ Payment intent ${paymentIntent.id} already recorded - skipping`);
            continue;
          }

          const paymentData = {
            userId: sub.userId,
            stripeCustomerId: paymentIntent.customer as string || sub.stripeCustomerId || null,
            stripePaymentIntentId: paymentIntent.id,
            stripeChargeId: charge?.id || null,
            stripeInvoiceId: paymentIntent.invoice as string || null,
            stripeSubscriptionId: sub.stripeSubscriptionId,
            subscriptionPlan: sub.planName,
            userRole: userRecord?.role || 'owner',
            amount: paymentIntent.amount / 100, // Convert from cents
            currency: paymentIntent.currency.toUpperCase(),
            paymentStatus: paymentIntent.status,
            paymentMethod: paymentMethod?.type || null,
            paymentMethodBrand: (paymentMethod as any)?.card?.brand || null,
            paymentMethodLast4: (paymentMethod as any)?.card?.last4 || null,
            description: paymentIntent.description || `${sub.planName} Subscription`,
            billingReason: 'subscription_cycle',
            receiptUrl: charge?.receipt_url || null,
            receiptEmail: paymentIntent.receipt_email || userRecord?.email || null,
            subscriptionId: sub.id,
            metadata: JSON.stringify(paymentIntent.metadata || {}),
            stripeEventId: 'backfill',
            processedAt: nowUKFormatted(),
            createdAt: nowUKFormatted(),
            updatedAt: nowUKFormatted(),
          };

          await db.insert(payments).values(paymentData);
          console.log(`    ✓ Created payment record for ${paymentIntent.id} (${paymentIntent.currency.toUpperCase()} ${(paymentIntent.amount / 100).toFixed(2)})`);
          createdCount++;
        }

      } catch (error) {
        console.error(`  ❌ Error processing subscription ${sub.id}:`, (error as Error).message);
        errorCount++;
      }
    }

    // 3. Summary
    console.log('\n' + '='.repeat(60));
    console.log('BACKFILL SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Subscriptions Processed: ${processedCount}`);
    console.log(`✓ Payment Records Created: ${createdCount}`);
    console.log(`↩ Subscriptions Skipped (already had payments): ${skippedCount}`);
    console.log(`❌ Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    if (createdCount > 0) {
      console.log('✓ Backfill completed successfully!');
      console.log('\nYou can now view these payments in:');
      console.log('  - Admin Dashboard: /admin/payments');
      console.log('  - Owner Payment History: /owner/payments\n');
    } else {
      console.log('No new payment records were created.\n');
    }

  } catch (error) {
    console.error('Fatal error during backfill:', error);
    process.exit(1);
  }
}

backfillMissingPayments();
