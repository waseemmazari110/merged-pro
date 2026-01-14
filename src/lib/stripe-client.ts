/**
 * Stripe Client Instance
 * Separated to avoid "use server" conflicts
 */

import Stripe from 'stripe';

// Initialize Stripe with test key
const stripeSecretKey = process.env.STRIPE_TEST_KEY || process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error('Missing Stripe secret key. Set STRIPE_TEST_KEY in environment variables.');
}

export const stripe = new Stripe(stripeSecretKey, {
  apiVersion: '2025-10-29.clover',
  typescript: true,
});

// Webhook secret for signature verification
export const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
