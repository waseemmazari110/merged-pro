import Stripe from 'stripe';

// Use TEST key for development, LIVE key for production
const stripeKey = process.env.NODE_ENV === 'production' 
  ? process.env.STRIPE_LIVE_KEY 
  : (process.env.STRIPE_TEST_KEY || process.env.STRIPE_TESTMODE_KEY);

if (!stripeKey) {
  throw new Error('Stripe API Key is missing');
}

console.log(`[Stripe] Using ${process.env.NODE_ENV === 'production' ? 'LIVE' : 'TEST'} mode`);

export const stripe = new Stripe(stripeKey, {
  apiVersion: '2025-10-29.clover',
});
