/**
 * Remove Test Transaction Data
 */

import 'dotenv/config';
import { db } from './src/db/index';
import { payments, subscriptions } from './src/db/schema';
import { like } from 'drizzle-orm';

async function removeTestData() {
  console.log('\n=== Removing Test Data ===\n');

  try {
    // Delete test payments
    const deletedPayments = await db
      .delete(payments)
      .where(like(payments.stripePaymentIntentId, 'pi_test_%'))
      .returning();

    console.log(`✓ Removed ${deletedPayments.length} test payment(s)`);

    // Delete test subscriptions
    const deletedSubs = await db
      .delete(subscriptions)
      .where(like(subscriptions.stripeSubscriptionId, 'sub_test_%'))
      .returning();

    console.log(`✓ Removed ${deletedSubs.length} test subscription(s)`);
    console.log('\n✅ Test data removed successfully!\n');

  } catch (error) {
    console.error('❌ Error removing test data:', error);
    process.exit(1);
  }
}

removeTestData();
