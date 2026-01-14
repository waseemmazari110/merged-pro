#!/usr/bin/env node

/**
 * Stripe Configuration Diagnostic Script
 * Checks if all required Stripe environment variables are configured
 * Run: npx tsx check-stripe-setup.ts
 */

import 'dotenv/config';

const requiredEnvVars = [
  'STRIPE_PRICE_BASIC_MONTHLY',
  'STRIPE_PRICE_BASIC_YEARLY',
  'STRIPE_PRICE_PREMIUM_MONTHLY',
  'STRIPE_PRICE_PREMIUM_YEARLY',
  'STRIPE_PRICE_ENTERPRISE_MONTHLY',
  'STRIPE_PRICE_ENTERPRISE_YEARLY',
];

console.log('\n═══════════════════════════════════════════════════════════');
console.log('  STRIPE CONFIGURATION DIAGNOSTIC');
console.log('═══════════════════════════════════════════════════════════\n');

let allConfigured = true;
const results: { name: string; status: string; value?: string }[] = [];

for (const varName of requiredEnvVars) {
  const value = process.env[varName];
  
  if (!value) {
    results.push({
      name: varName,
      status: '❌ NOT SET'
    });
    allConfigured = false;
  } else if (!value.startsWith('price_')) {
    results.push({
      name: varName,
      status: '⚠️  INVALID FORMAT',
      value: value
    });
    allConfigured = false;
  } else {
    results.push({
      name: varName,
      status: '✅ CONFIGURED',
      value: value
    });
  }
}

// Display results
results.forEach(result => {
  console.log(`${result.status}  ${result.name}`);
  if (result.value) {
    console.log(`            Value: ${result.value}`);
  }
  console.log('');
});

console.log('═══════════════════════════════════════════════════════════\n');

if (allConfigured) {
  console.log('✅ All Stripe price IDs are configured correctly!\n');
  console.log('You can now:');
  console.log('  1. Run: npm run dev');
  console.log('  2. Navigate to: http://localhost:3000/owner/subscription');
  console.log('  3. Click "Subscribe Now" on any paid plan');
  console.log('');
} else {
  console.log('❌ Stripe configuration is incomplete.\n');
  console.log('To fix this:');
  console.log('  1. Visit: https://dashboard.stripe.com/products');
  console.log('  2. Create products for each subscription tier');
  console.log('  3. Copy the Price IDs (format: price_xxx)');
  console.log('  4. Add them to your .env.local file:');
  console.log('');
  requiredEnvVars.forEach(varName => {
    console.log(`     ${varName}=price_xxxxx`);
  });
  console.log('');
  console.log('  5. Restart: npm run dev');
  console.log('');
  console.log('📖 Full guide: See STRIPE_SETUP_GUIDE.md');
  process.exit(1);
}

console.log('═══════════════════════════════════════════════════════════\n');
