/**
 * Verification Script: Check Payment History Setup
 * 
 * This script verifies that payment history is properly configured and working
 */

import { db } from '../src/db/index.js';
import { payments, subscriptions, user } from '../src/db/schema.js';
import { eq, desc } from 'drizzle-orm';

async function verifyPaymentHistorySetup() {
  console.log('\n🔍 VERIFYING PAYMENT HISTORY SETUP\n');
  console.log('=' .repeat(60));

  try {
    // 1. Check if payments table exists and has data
    console.log('\n1️⃣  Checking payments table...');
    const allPayments = await db.select().from(payments).limit(5);
    console.log(`   ✅ Payments table exists`);
    console.log(`   📊 Total payments found: ${allPayments.length}`);
    
    if (allPayments.length > 0) {
      console.log(`   📝 Sample payment:`, {
        id: allPayments[0].id,
        userId: allPayments[0].userId,
        amount: allPayments[0].amount,
        currency: allPayments[0].currency,
        status: allPayments[0].paymentStatus,
        createdAt: allPayments[0].createdAt,
      });
    }

    // 2. Check for owner users
    console.log('\n2️⃣  Checking owner users...');
    const owners = await db
      .select()
      .from(user)
      .where(eq(user.role, 'owner'))
      .limit(5);
    
    console.log(`   ✅ Found ${owners.length} owner users`);
    
    if (owners.length === 0) {
      console.log('   ⚠️  WARNING: No owner users found!');
      console.log('   💡 Create an owner user first before testing payments');
    } else {
      console.log(`   📝 Sample owner:`, {
        id: owners[0].id,
        email: owners[0].email,
        name: owners[0].name,
        role: owners[0].role,
      });

      // 3. Check payments for each owner
      console.log('\n3️⃣  Checking payments for each owner...');
      for (const owner of owners) {
        const ownerPayments = await db
          .select()
          .from(payments)
          .where(eq(payments.userId, owner.id))
          .orderBy(desc(payments.createdAt))
          .limit(5);

        console.log(`\n   👤 Owner: ${owner.email}`);
        console.log(`   💳 Payments: ${ownerPayments.length}`);
        
        if (ownerPayments.length > 0) {
          console.log(`   📋 Recent payments:`);
          ownerPayments.forEach((payment: any, idx: number) => {
            console.log(`      ${idx + 1}. ${payment.amount} ${payment.currency} - ${payment.paymentStatus} (${payment.createdAt})`);
          });
        } else {
          console.log(`   ℹ️  No payments found for this owner`);
        }
      }
    }

    // 4. Check subscriptions
    console.log('\n4️⃣  Checking subscriptions...');
    const allSubscriptions = await db
      .select()
      .from(subscriptions)
      .limit(5);
    
    console.log(`   ✅ Found ${allSubscriptions.length} subscriptions`);
    
    if (allSubscriptions.length > 0) {
      console.log(`   📝 Sample subscription:`, {
        id: allSubscriptions[0].id,
        userId: allSubscriptions[0].userId,
        planName: allSubscriptions[0].planName,
        status: allSubscriptions[0].status,
        amount: allSubscriptions[0].amount,
      });
    }

    // 5. Check payment-subscription relationships
    console.log('\n5️⃣  Checking payment-subscription relationships...');
    const paymentsWithSubs = await db
      .select({
        payment: payments,
        subscription: subscriptions,
      })
      .from(payments)
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .limit(5);
    
    const linkedPayments = paymentsWithSubs.filter((p: any) => p.subscription !== null);
    console.log(`   📊 Payments with subscriptions: ${linkedPayments.length}/${paymentsWithSubs.length}`);
    
    if (linkedPayments.length > 0) {
      console.log(`   ✅ Payment-subscription linking is working`);
    } else if (paymentsWithSubs.length > 0) {
      console.log(`   ⚠️  Payments exist but none are linked to subscriptions`);
      console.log(`   💡 This is normal if payments are one-time or subscription payments haven't been processed yet`);
    }

    // 6. Check for required fields in payment records
    console.log('\n6️⃣  Checking payment data quality...');
    const paymentsWithIssues = allPayments.filter((p: any) =>
      !p.userId || 
      !p.amount || 
      !p.currency || 
      !p.paymentStatus || 
      !p.createdAt
    );
    
    if (paymentsWithIssues.length === 0) {
      console.log(`   ✅ All payments have required fields`);
    } else {
      console.log(`   ⚠️  Found ${paymentsWithIssues.length} payments with missing required fields`);
      paymentsWithIssues.forEach((p: any) => {
        console.log(`      Payment ID ${p.id}: Missing fields`);
      });
    }

    // 7. Summary
    console.log('\n' + '='.repeat(60));
    console.log('📊 SUMMARY\n');
    console.log(`Total Payments: ${allPayments.length}`);
    console.log(`Total Owners: ${owners.length}`);
    console.log(`Total Subscriptions: ${allSubscriptions.length}`);
    console.log(`Linked Payments: ${linkedPayments.length}`);
    
    console.log('\n✅ Verification complete!');
    
    if (owners.length === 0) {
      console.log('\n⚠️  NEXT STEPS:');
      console.log('   1. Create an owner user account');
      console.log('   2. Login as owner and subscribe to a plan');
      console.log('   3. Check /owner/dashboard?view=payments for payment history');
    } else if (owners.some((o: any) => {
      const ownerPayments = allPayments.filter((p: any) => p.userId === o.id);
      return ownerPayments.length === 0;
    })) {
      console.log('\n💡 TESTING SUGGESTIONS:');
      console.log('   1. Login as owner');
      console.log('   2. Subscribe to a plan via /owner/subscription');
      console.log('   3. Use Stripe test card: 4242 4242 4242 4242');
      console.log('   4. Check /owner/dashboard?view=payments');
      console.log('   5. Verify payment appears within 5 seconds');
    } else {
      console.log('\n✅ PAYMENT HISTORY READY:');
      console.log('   1. Owner users exist');
      console.log('   2. Payment records exist');
      console.log('   3. Ready for testing');
    }

  } catch (error) {
    console.error('\n❌ ERROR during verification:', error);
    console.error('\n💡 Possible issues:');
    console.error('   - Database connection failed');
    console.error('   - Tables not created yet (run migrations)');
    console.error('   - Environment variables not set');
    throw error;
  }
}

// Run verification
verifyPaymentHistorySetup()
  .then(() => {
    console.log('\n✅ Script completed successfully\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error.message);
    process.exit(1);
  });
