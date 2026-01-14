/**
 * Check Payments Data Script
 * Verifies payment records in database and displays statistics
 */

import 'dotenv/config';
import { db } from './src/db/index';
import { payments, subscriptions, user } from './src/db/schema';
import { desc, eq } from 'drizzle-orm';

async function checkPaymentsData() {
  console.log('\n=== Checking Payments Data ===\n');

  try {
    // 1. Get all payments
    const allPayments = await db
      .select({
        payment: payments,
        subscription: subscriptions,
        user: user,
      })
      .from(payments)
      .leftJoin(subscriptions, eq(payments.subscriptionId, subscriptions.id))
      .leftJoin(user, eq(payments.userId, user.id))
      .orderBy(desc(payments.createdAt));

    console.log(`Total Payments in Database: ${allPayments.length}\n`);

    if (allPayments.length === 0) {
      console.log('⚠️  No payments found in database!\n');
      console.log('This could mean:');
      console.log('1. No subscriptions have been purchased yet');
      console.log('2. Webhook events were not processed correctly');
      console.log('3. Payment intents do not have userId metadata\n');
      return;
    }

    // 2. Display payment statistics
    const succeeded = allPayments.filter(p => p.payment.paymentStatus === 'succeeded');
    const pending = allPayments.filter(p => p.payment.paymentStatus === 'pending');
    const failed = allPayments.filter(p => p.payment.paymentStatus === 'failed');
    const refunded = allPayments.filter(p => p.payment.paymentStatus === 'refunded');

    console.log('Payment Statistics:');
    console.log(`✓ Succeeded: ${succeeded.length}`);
    console.log(`⏱ Pending: ${pending.length}`);
    console.log(`✗ Failed: ${failed.length}`);
    console.log(`↩ Refunded: ${refunded.length}\n`);

    // 3. Group by user role
    const ownerPayments = allPayments.filter(p => p.user?.role === 'owner' || p.payment.userRole === 'owner');
    const guestPayments = allPayments.filter(p => p.user?.role === 'guest' || p.payment.userRole === 'guest');
    const adminPayments = allPayments.filter(p => p.user?.role === 'admin' || p.payment.userRole === 'admin');

    console.log('Payments by User Role:');
    console.log(`👤 Owner: ${ownerPayments.length}`);
    console.log(`🎫 Guest: ${guestPayments.length}`);
    console.log(`👨‍💼 Admin: ${adminPayments.length}\n`);

    // 4. Display recent payments
    console.log('Recent Payments (Last 10):');
    console.log('─'.repeat(120));
    console.log(
      'ID'.padEnd(5) +
      'User'.padEnd(25) +
      'Amount'.padEnd(12) +
      'Status'.padEnd(12) +
      'Plan'.padEnd(20) +
      'Created At'.padEnd(25)
    );
    console.log('─'.repeat(120));

    allPayments.slice(0, 10).forEach((p) => {
      const userName = p.user?.name || p.payment.receiptEmail || 'Unknown';
      const amount = `${p.payment.currency} ${p.payment.amount.toFixed(2)}`;
      const plan = p.payment.subscriptionPlan || p.subscription?.planName || 'N/A';
      const status = p.payment.paymentStatus;
      const createdAt = p.payment.createdAt || 'N/A';

      console.log(
        String(p.payment.id).padEnd(5) +
        userName.substring(0, 23).padEnd(25) +
        amount.padEnd(12) +
        status.padEnd(12) +
        plan.substring(0, 18).padEnd(20) +
        createdAt.padEnd(25)
      );
    });
    console.log('─'.repeat(120));

    // 5. Check for payments without subscription plan
    const paymentsWithoutPlan = allPayments.filter(
      p => !p.payment.subscriptionPlan && !p.subscription?.planName
    );

    if (paymentsWithoutPlan.length > 0) {
      console.log(`\n⚠️  Warning: ${paymentsWithoutPlan.length} payments found without subscription plan info`);
      console.log('\nPayments without plan:');
      paymentsWithoutPlan.forEach((p) => {
        console.log(`  - ID ${p.payment.id}: User ${p.user?.name || 'Unknown'}, ${p.payment.currency} ${p.payment.amount}`);
      });
    }

    // 6. Check for subscriptions without payments
    const allSubscriptions = await db.select().from(subscriptions);
    console.log(`\n\nTotal Subscriptions: ${allSubscriptions.length}`);

    const subscriptionsWithPayments = allPayments
      .filter(p => p.subscription)
      .map(p => p.subscription!.id);
    
    const uniqueSubsWithPayments = [...new Set(subscriptionsWithPayments)];
    const subscriptionsWithoutPayments = allSubscriptions.filter(
      s => !uniqueSubsWithPayments.includes(s.id)
    );

    if (subscriptionsWithoutPayments.length > 0) {
      console.log(`\n⚠️  Warning: ${subscriptionsWithoutPayments.length} subscriptions found without payment records`);
      console.log('\nSubscriptions without payments:');
      subscriptionsWithoutPayments.forEach((s) => {
        console.log(`  - ID ${s.id}: User ${s.userId}, Plan ${s.planName}, Status ${s.status}`);
        console.log(`    Stripe Subscription: ${s.stripeSubscriptionId}`);
      });
    } else {
      console.log('\n✓ All subscriptions have payment records');
    }

    console.log('\n=== Check Complete ===\n');

  } catch (error) {
    console.error('Error checking payments:', error);
    process.exit(1);
  }
}

checkPaymentsData();
