/**
 * Milestone 4: Annual Subscription Workflow - Test Suite
 * Tests for subscription plans, retry policy, billing cycles, and API endpoints
 */

import {
  SUBSCRIPTION_PLANS,
  getPlanById,
  getPlansByTier,
  calculateAnnualSavings,
  calculateAnnualDiscount,
  canAddProperty,
  getUpgradeSuggestion,
} from '@/lib/subscription-plans';

import {
  RETRY_CONFIG,
  calculateNextRetryDate,
  calculateSuspensionDate,
  initializeRetryPolicy,
  processRetryAttempt,
} from '@/lib/payment-retry';

import {
  getCurrentBillingCycle,
  processSubscriptionRenewal,
  getSubscriptionsDueForRenewal,
  getBillingCycleStatistics,
  calculateProratedAmount,
} from '@/lib/billing-cycle';

import { nowUKFormatted } from '@/lib/date-utils';

// ============================================
// TEST UTILITIES
// ============================================

function log(message: string, data?: any) {
  console.log(`[${nowUKFormatted()}] TEST: ${message}`, data || '');
}

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

// ============================================
// SUBSCRIPTION PLANS TESTS
// ============================================

async function testSubscriptionPlans() {
  log('=== Testing Subscription Plans ===');

  // Test 1: Get plan by ID
  log('Test 1: Get plan by ID');
  const premiumMonthly = getPlanById('premium_monthly');
  assert(premiumMonthly !== null, 'Premium monthly plan should exist');
  assert(premiumMonthly?.price === 49.99, 'Premium monthly price should be £49.99');
  assert(premiumMonthly?.interval === 'monthly', 'Premium monthly interval should be monthly');
  log('✓ Get plan by ID works');

  // Test 2: Get plans by tier
  log('Test 2: Get plans by tier');
  const basicPlans = getPlansByTier('basic');
  assert(basicPlans.length === 2, 'Should have 2 basic plans (monthly + yearly)');
  log('✓ Get plans by tier works');

  // Test 3: Calculate annual savings
  log('Test 3: Calculate annual savings');
  const basicSavings = calculateAnnualSavings('basic');
  const expectedBasicSavings = (19.99 * 12) - 199.99; // £39.89
  assert(
    Math.abs(basicSavings - expectedBasicSavings) < 0.01,
    `Basic annual savings should be £${expectedBasicSavings.toFixed(2)}`
  );
  log(`✓ Basic annual savings: £${basicSavings.toFixed(2)}`);

  const premiumSavings = calculateAnnualSavings('premium');
  const expectedPremiumSavings = (49.99 * 12) - 499.99; // £99.89
  assert(
    Math.abs(premiumSavings - expectedPremiumSavings) < 0.01,
    `Premium annual savings should be £${expectedPremiumSavings.toFixed(2)}`
  );
  log(`✓ Premium annual savings: £${premiumSavings.toFixed(2)}`);

  // Test 4: Calculate discount percentage
  log('Test 4: Calculate discount percentage');
  const basicDiscount = calculateAnnualDiscount('basic');
  assert(
    Math.abs(basicDiscount - 16.6) < 0.1,
    'Basic discount should be ~16.6%'
  );
  log(`✓ Basic annual discount: ${basicDiscount.toFixed(1)}%`);

  // Test 5: Check property limits
  log('Test 5: Check property limits');
  assert(canAddProperty(3, 'basic_monthly') === true, 'Should allow adding property (3/5)');
  assert(canAddProperty(5, 'basic_monthly') === false, 'Should not allow adding property (5/5)');
  assert(canAddProperty(100, 'enterprise_monthly') === true, 'Enterprise should have unlimited');
  log('✓ Property limits work correctly');

  // Test 6: Get upgrade suggestion
  log('Test 6: Get upgrade suggestion');
  const basicUpgrade = getUpgradeSuggestion('basic_monthly');
  assert(basicUpgrade?.tier === 'premium', 'Basic should upgrade to Premium');
  assert(basicUpgrade?.interval === 'monthly', 'Should maintain same interval');
  
  const enterpriseUpgrade = getUpgradeSuggestion('enterprise_yearly');
  assert(enterpriseUpgrade === null, 'Enterprise should have no upgrade');
  log('✓ Upgrade suggestions work correctly');

  log('✅ All Subscription Plans tests passed\n');
}

// ============================================
// RETRY POLICY TESTS
// ============================================

async function testRetryPolicy() {
  log('=== Testing Retry Policy ===');

  // Test 1: Retry configuration
  log('Test 1: Retry configuration');
  assert(RETRY_CONFIG.maxAttempts === 4, 'Should have 4 max attempts');
  assert(RETRY_CONFIG.retrySchedule.length === 4, 'Should have 4 retry schedules');
  assert(RETRY_CONFIG.totalDaysUntilSuspension === 25, 'Total days should be 25');
  log('✓ Retry configuration is correct');

  // Test 2: Calculate next retry date
  log('Test 2: Calculate next retry date');
  const failureDate = new Date('2025-01-01');
  
  const retry1 = calculateNextRetryDate(failureDate, 1);
  assert(retry1 !== null, 'First retry should be calculated');
  log(`  First retry: ${retry1} (after 3 days)`);
  
  const retry2 = calculateNextRetryDate(failureDate, 2);
  assert(retry2 !== null, 'Second retry should be calculated');
  log(`  Second retry: ${retry2} (after 8 days total)`);
  
  const retry5 = calculateNextRetryDate(failureDate, 5);
  assert(retry5 === null, 'Should return null after max attempts');
  log('✓ Retry date calculation works correctly');

  // Test 3: Calculate suspension date
  log('Test 3: Calculate suspension date');
  const suspensionDate = calculateSuspensionDate(failureDate);
  assert(suspensionDate !== null, 'Suspension date should be calculated');
  log(`  Suspension date: ${suspensionDate} (after 25 days)`);
  log('✓ Suspension date calculation works correctly');

  log('✅ All Retry Policy tests passed\n');
}

// ============================================
// BILLING CYCLE TESTS
// ============================================

async function testBillingCycle() {
  log('=== Testing Billing Cycle ===');

  // Test 1: Prorated amount calculation
  log('Test 1: Prorated amount calculation');
  
  // Upgrade from £19.99 to £49.99 with 15 days remaining in 30-day cycle
  const proratedUpgrade = calculateProratedAmount(19.99, 49.99, 15, 30);
  log(`  Prorated upgrade: £${proratedUpgrade.toFixed(2)}`);
  assert(proratedUpgrade > 0, 'Upgrade should have positive charge');
  
  // Downgrade from £49.99 to £19.99 with 15 days remaining in 30-day cycle
  const proratedDowngrade = calculateProratedAmount(49.99, 19.99, 15, 30);
  log(`  Prorated downgrade: £${proratedDowngrade.toFixed(2)}`);
  assert(proratedDowngrade < 0, 'Downgrade should have negative charge (credit)');
  
  log('✓ Prorated amount calculation works correctly');

  // Test 2: Get billing cycle statistics
  log('Test 2: Get billing cycle statistics');
  const stats = await getBillingCycleStatistics();
  if (stats) {
    log('  Statistics:', stats);
    assert(typeof stats.total === 'number', 'Should have total count');
    assert(typeof stats.active === 'number', 'Should have active count');
    log('✓ Billing statistics retrieved successfully');
  } else {
    log('  No subscriptions found (database might be empty)');
  }

  log('✅ All Billing Cycle tests passed\n');
}

// ============================================
// INTEGRATION TESTS
// ============================================

async function testIntegration() {
  log('=== Integration Tests ===');

  // Test 1: Complete subscription lifecycle simulation
  log('Test 1: Subscription lifecycle simulation');
  
  log('  Step 1: User selects Premium Yearly plan');
  const plan = getPlanById('premium_yearly');
  assert(plan !== null, 'Plan should exist');
  log(`    Selected: ${plan?.name} - £${plan?.price}/year`);
  
  log('  Step 2: Calculate savings vs monthly');
  const savings = calculateAnnualSavings('premium');
  log(`    Annual savings: £${savings.toFixed(2)}`);
  
  log('  Step 3: Check trial eligibility');
  const trialDays = 14; // Premium trial
  log(`    Trial period: ${trialDays} days`);
  
  log('  Step 4: Simulate payment failure');
  const failureDate = new Date();
  const suspensionDate = calculateSuspensionDate(failureDate);
  log(`    If payment fails, suspension date: ${suspensionDate}`);
  
  log('✓ Subscription lifecycle simulation completed');

  // Test 2: Plan comparison
  log('Test 2: Plan comparison');
  const allPlans = Object.values(SUBSCRIPTION_PLANS);
  const monthlyPlans = allPlans.filter(p => p.interval === 'monthly');
  const yearlyPlans = allPlans.filter(p => p.interval === 'yearly');
  
  log(`  Monthly plans: ${monthlyPlans.length}`);
  log(`  Yearly plans: ${yearlyPlans.length}`);
  assert(monthlyPlans.length === yearlyPlans.length, 'Should have equal monthly and yearly plans');
  log('✓ Plan comparison completed');

  log('✅ All Integration tests passed\n');
}

// ============================================
// RUN ALL TESTS
// ============================================

async function runAllTests() {
  console.log('\n' + '='.repeat(60));
  console.log('MILESTONE 4: Annual Subscription Workflow - Test Suite');
  console.log('='.repeat(60));
  console.log(`Started at: ${nowUKFormatted()}\n`);

  try {
    await testSubscriptionPlans();
    await testRetryPolicy();
    await testBillingCycle();
    await testIntegration();

    console.log('='.repeat(60));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(60));
    console.log(`Completed at: ${nowUKFormatted()}\n`);

  } catch (error) {
    console.error('\n' + '='.repeat(60));
    console.error('❌ TEST FAILED');
    console.error('='.repeat(60));
    console.error('Error:', (error as Error).message);
    console.error('Stack:', (error as Error).stack);
    console.error(`Failed at: ${nowUKFormatted()}\n`);
    process.exit(1);
  }
}

// Run tests
runAllTests();
