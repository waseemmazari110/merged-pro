/**
 * Stripe Configuration Verification Script
 * Run this to verify all Stripe environment variables are correctly set
 */

import * as dotenv from 'dotenv';
import { resolve } from 'path';

// Load environment variables
dotenv.config({ path: resolve(process.cwd(), '.env') });
dotenv.config({ path: resolve(process.cwd(), '.env.local') });

const REQUIRED_STRIPE_VARS = [
  'STRIPE_PRICE_BASIC_MONTHLY',
  'STRIPE_PRICE_BASIC_YEARLY',
  'STRIPE_PRICE_PREMIUM_MONTHLY',
  'STRIPE_PRICE_PREMIUM_YEARLY',
  'STRIPE_PRICE_ENTERPRISE_MONTHLY',
  'STRIPE_PRICE_ENTERPRISE_YEARLY',
] as const;

console.log('\n🔍 Verifying Stripe Configuration...\n');
console.log('=' .repeat(70));

let allValid = true;
const results: { name: string; value: string; valid: boolean; error?: string }[] = [];

for (const varName of REQUIRED_STRIPE_VARS) {
  const value = process.env[varName];
  const isValid = value && value.startsWith('price_') && !value.includes('REPLACE') && !value.includes('xxx');
  
  results.push({
    name: varName,
    value: value || 'NOT SET',
    valid: !!isValid,
    error: !value ? 'Missing' : !value.startsWith('price_') ? 'Invalid format' : undefined
  });
  
  if (!isValid) allValid = false;
}

// Print results
results.forEach(({ name, value, valid, error }) => {
  const status = valid ? '✅' : '❌';
  const maskedValue = value.startsWith('price_') 
    ? `${value.substring(0, 12)}...${value.substring(value.length - 4)}`
    : value;
  
  console.log(`${status} ${name}`);
  console.log(`   Value: ${maskedValue}`);
  if (error) console.log(`   Error: ${error}`);
  console.log('');
});

console.log('=' .repeat(70));

if (allValid) {
  console.log('\n✅ All Stripe environment variables are correctly configured!');
  console.log('\n📌 Next steps:');
  console.log('   1. Make sure these same variables are set in Vercel dashboard');
  console.log('   2. Restart your dev server: npm run dev');
  console.log('   3. Test subscription checkout at /owner/subscription');
} else {
  console.log('\n❌ Some Stripe environment variables are missing or invalid!');
  console.log('\n📝 To fix:');
  console.log('   1. Check your .env file');
  console.log('   2. Ensure variable names match exactly (STRIPE_PRICE_*)');
  console.log('   3. Verify price IDs start with "price_"');
  console.log('   4. See STRIPE_ENV_FIX.md for detailed instructions');
}

console.log('\n');

// Exit with appropriate code
process.exit(allValid ? 0 : 1);
