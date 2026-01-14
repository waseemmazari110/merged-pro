/**
 * Complete Payment Verification and Fix Script
 * Checks payments and offers to backfill if needed
 */

import 'dotenv/config';
import { db } from './src/db/index';
import { payments, subscriptions, user } from './src/db/schema';
import { desc, eq } from 'drizzle-orm';
import { execSync } from 'child_process';

async function verifyAndFixPayments() {
  console.log('\n╔═══════════════════════════════════════════════════════════╗');
  console.log('║     PAYMENT VERIFICATION & FIX UTILITY                    ║');
  console.log('╚═══════════════════════════════════════════════════════════╝\n');

  try {
    // 1. Check payments
    console.log('📊 STEP 1: Checking current payment data...\n');
    
    const allPayments = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt));

    const allSubscriptions = await db.select().from(subscriptions);

    console.log(`✓ Found ${allPayments.length} payment records`);
    console.log(`✓ Found ${allSubscriptions.length} subscription records\n`);

    // 2. Identify issues
    const issues: string[] = [];
    
    if (allSubscriptions.length > 0 && allPayments.length === 0) {
      issues.push('⚠️  CRITICAL: Subscriptions exist but NO payment records found');
    }

    const paymentsWithoutPlan = allPayments.filter(
      p => !p.subscriptionPlan
    );
    
    if (paymentsWithoutPlan.length > 0) {
      issues.push(`⚠️  ${paymentsWithoutPlan.length} payments missing subscription plan info`);
    }

    // Check for subscriptions without payments
    const subsWithPayments = new Set(
      allPayments
        .filter(p => p.subscriptionId)
        .map(p => p.subscriptionId)
    );
    
    const subsWithoutPayments = allSubscriptions.filter(
      s => !subsWithPayments.has(s.id)
    );

    if (subsWithoutPayments.length > 0) {
      issues.push(`⚠️  ${subsWithoutPayments.length} subscriptions without payment records`);
    }

    // 3. Display issues
    if (issues.length > 0) {
      console.log('🔍 STEP 2: Issues detected:\n');
      issues.forEach((issue, index) => {
        console.log(`   ${index + 1}. ${issue}`);
      });
      console.log();
    } else {
      console.log('✅ STEP 2: No issues detected!\n');
      console.log('All subscriptions have payment records and data looks good.\n');
      displaySummary(allPayments, allSubscriptions);
      return;
    }

    // 4. Offer solutions
    console.log('💡 STEP 3: Recommended actions:\n');
    
    if (subsWithoutPayments.length > 0) {
      console.log('   → Run backfill script to sync from Stripe');
      console.log('     Command: npx tsx backfill-missing-payments.ts\n');
    }

    if (paymentsWithoutPlan.length > 0) {
      console.log('   → Update payments with subscription plan data');
      console.log('     Command: See PAYMENT_TRANSACTION_TRACKING_GUIDE.md\n');
    }

    // 5. Auto-fix option
    console.log('═'.repeat(60));
    console.log('\n🔧 Would you like to run the backfill script now? (Recommended)');
    console.log('\nThis will:');
    console.log('  - Fetch payment data from Stripe');
    console.log('  - Create missing payment records');
    console.log('  - Skip existing records (safe to run)');
    console.log('  - Show detailed results\n');
    
    // For automated runs, check if there are missing payments and recommend manual action
    if (subsWithoutPayments.length > 0 || paymentsWithoutPlan.length > 0) {
      console.log('⚠️  ACTION REQUIRED:\n');
      console.log('Run the following command to fix payment records:');
      console.log('  npx tsx backfill-missing-payments.ts\n');
      console.log('Or check the complete guide:');
      console.log('  PAYMENT_TRANSACTION_TRACKING_GUIDE.md\n');
    }

    displaySummary(allPayments, allSubscriptions);

  } catch (error) {
    console.error('❌ Error during verification:', error);
    process.exit(1);
  }
}

function displaySummary(allPayments: any[], allSubscriptions: any[]) {
  console.log('═'.repeat(60));
  console.log('\n📈 SUMMARY:\n');
  
  const succeeded = allPayments.filter(p => p.paymentStatus === 'succeeded').length;
  const total = allPayments.reduce((sum, p) => sum + (p.paymentStatus === 'succeeded' ? p.amount : 0), 0);
  
  console.log(`   Total Subscriptions:     ${allSubscriptions.length}`);
  console.log(`   Total Payment Records:   ${allPayments.length}`);
  console.log(`   Successful Payments:     ${succeeded}`);
  console.log(`   Total Revenue:           £${total.toFixed(2)}`);
  console.log();
  console.log('═'.repeat(60));
  console.log('\n✓ Verification complete!\n');
  console.log('Next steps:');
  console.log('  1. Review admin dashboard: /admin/payments');
  console.log('  2. Check owner payments: /owner/payments');
  console.log('  3. Monitor webhook events in server logs\n');
}

verifyAndFixPayments();
