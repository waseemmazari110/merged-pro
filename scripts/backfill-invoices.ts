/**
 * Backfill Invoice Records
 * Creates invoice records for existing subscriptions that don't have them
 */

import { config } from 'dotenv';
config();

import { db } from '@/db';
import { subscriptions, invoices } from '@/db/schema';
import { eq } from 'drizzle-orm';
import Stripe from 'stripe';
import { createInvoiceFromStripe } from '@/lib/stripe-billing';

const stripeSecretKey = process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key. Set STRIPE_TEST_KEY in environment variables.');
}

const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

async function backfillInvoices() {
  console.log('Starting invoice backfill...');

  try {
    // Get all subscriptions
    const allSubscriptions = await db.select().from(subscriptions);
    console.log(`Found ${allSubscriptions.length} subscriptions`);

    for (const subscription of allSubscriptions) {
      try {
        // Get invoices from Stripe for this subscription
        const stripeInvoices = await stripe.invoices.list({
          subscription: subscription.stripeSubscriptionId,
          limit: 100,
        });

        console.log(`Processing ${stripeInvoices.data.length} invoices for subscription ${subscription.stripeSubscriptionId}`);

        for (const stripeInvoice of stripeInvoices.data) {
          // Check if invoice already exists in our database
          const existingInvoice = await db
            .select()
            .from(invoices)
            .where(eq(invoices.stripeInvoiceId, stripeInvoice.id))
            .limit(1);

          if (existingInvoice.length === 0) {
            // Create the invoice
            await createInvoiceFromStripe(stripeInvoice, subscription.userId);
            console.log(`✓ Created invoice ${stripeInvoice.id} for user ${subscription.userId}`);
          } else {
            console.log(`- Invoice ${stripeInvoice.id} already exists`);
          }
        }
      } catch (error) {
        console.error(`Error processing subscription ${subscription.id}:`, error);
      }
    }

    console.log('\nBackfill complete!');
    
    // Summary
    const totalInvoices = await db.select().from(invoices);
    console.log(`Total invoices in database: ${totalInvoices.length}`);

  } catch (error) {
    console.error('Backfill failed:', error);
    throw error;
  }
}

backfillInvoices()
  .then(() => {
    console.log('Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });
