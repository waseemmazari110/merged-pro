/**
 * Create Test Transaction Data
 * This script creates sample payment records for testing the admin transaction dashboard
 */

import 'dotenv/config';
import { db } from './src/db/index';
import { payments, subscriptions, user } from './src/db/schema';
import { eq } from 'drizzle-orm';
import { nowUKFormatted } from './src/lib/date-utils';

// Helper to format dates in UK format
function formatDateUK(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
}

async function createTestTransactions() {
  console.log('\n=== Creating Test Transaction Data ===\n');

  try {
    // 1. Check if we have any users
    const allUsers = await db.select().from(user).limit(10);
    
    if (allUsers.length === 0) {
      console.log('❌ No users found in database. Please create a user first.\n');
      console.log('You can:');
      console.log('  1. Sign up at /owner/signup');
      console.log('  2. Or create a user manually in the database\n');
      return;
    }

    console.log(`✓ Found ${allUsers.length} user(s) in database\n`);

    // Find or use first owner
    let ownerUser = allUsers.find(u => u.role === 'owner');
    if (!ownerUser) {
      ownerUser = allUsers[0];
      console.log(`⚠️  No owner found, using ${ownerUser.name} and upgrading to owner role\n`);
      
      // Update to owner role
      await db.update(user)
        .set({ role: 'owner' })
        .where(eq(user.id, ownerUser.id));
    } else {
      console.log(`✓ Using owner: ${ownerUser.name} (${ownerUser.email})\n`);
    }

    // 2. Create test subscription
    console.log('Creating test subscription...');
    
    const [testSubscription] = await db.insert(subscriptions).values({
      userId: ownerUser.id,
      stripeSubscriptionId: `sub_test_${Date.now()}`,
      stripeCustomerId: `cus_test_${Date.now()}`,
      stripePriceId: 'price_test_basic_monthly',
      planName: 'Professional Plan',
      planType: 'premium',
      status: 'active',
      currentPeriodStart: nowUKFormatted(),
      currentPeriodEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      amount: 29.99,
      currency: 'GBP',
      interval: 'month',
      intervalCount: 1,
      cancelAtPeriodEnd: false,
      createdAt: nowUKFormatted(),
      updatedAt: nowUKFormatted(),
    }).returning();

    console.log(`✓ Created subscription ID ${testSubscription.id}\n`);

    // 3. Create test payment transactions
    console.log('Creating test payment transactions...\n');

    const testPayments = [
      {
        userId: ownerUser.id,
        stripeCustomerId: testSubscription.stripeCustomerId,
        stripePaymentIntentId: `pi_test_${Date.now()}_1`,
        stripeChargeId: `ch_test_${Date.now()}_1`,
        stripeInvoiceId: `in_test_${Date.now()}_1`,
        stripeSubscriptionId: testSubscription.stripeSubscriptionId,
        subscriptionPlan: 'premium-monthly',
        userRole: 'owner',
        amount: 29.99,
        currency: 'GBP',
        paymentStatus: 'succeeded',
        paymentMethod: 'card',
        paymentMethodBrand: 'visa',
        paymentMethodLast4: '4242',
        description: 'Professional Plan - Monthly subscription',
        billingReason: 'subscription_create',
        receiptEmail: ownerUser.email,
        subscriptionId: testSubscription.id,
        metadata: JSON.stringify({ planType: 'premium', interval: 'monthly' }),
        stripeEventId: 'evt_test_1',
        processedAt: nowUKFormatted(),
        createdAt: nowUKFormatted(),
        updatedAt: nowUKFormatted(),
      },
      {
        userId: ownerUser.id,
        stripeCustomerId: testSubscription.stripeCustomerId,
        stripePaymentIntentId: `pi_test_${Date.now()}_2`,
        stripeChargeId: `ch_test_${Date.now()}_2`,
        stripeInvoiceId: `in_test_${Date.now()}_2`,
        stripeSubscriptionId: testSubscription.stripeSubscriptionId,
        subscriptionPlan: 'premium-monthly',
        userRole: 'owner',
        amount: 29.99,
        currency: 'GBP',
        paymentStatus: 'succeeded',
        paymentMethod: 'card',
        paymentMethodBrand: 'mastercard',
        paymentMethodLast4: '5555',
        description: 'Professional Plan - Renewal',
        billingReason: 'subscription_cycle',
        receiptEmail: ownerUser.email,
        subscriptionId: testSubscription.id,
        metadata: JSON.stringify({ planType: 'premium', interval: 'monthly' }),
        stripeEventId: 'evt_test_2',
        processedAt: formatDateUK(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        createdAt: formatDateUK(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
        updatedAt: formatDateUK(new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)),
      },
      {
        userId: ownerUser.id,
        stripeCustomerId: testSubscription.stripeCustomerId,
        stripePaymentIntentId: `pi_test_${Date.now()}_3`,
        subscriptionPlan: 'basic-monthly',
        userRole: 'owner',
        amount: 19.99,
        currency: 'GBP',
        paymentStatus: 'pending',
        paymentMethod: 'card',
        description: 'Basic Plan - Pending payment',
        billingReason: 'subscription_update',
        receiptEmail: ownerUser.email,
        metadata: JSON.stringify({ planType: 'basic', interval: 'monthly' }),
        stripeEventId: 'evt_test_3',
        processedAt: nowUKFormatted(),
        createdAt: nowUKFormatted(),
        updatedAt: nowUKFormatted(),
      },
    ];

    for (let i = 0; i < testPayments.length; i++) {
      const [payment] = await db.insert(payments).values(testPayments[i]).returning();
      console.log(`  ${i + 1}. Created payment ID ${payment.id} - ${payment.paymentStatus} - £${payment.amount}`);
    }

    console.log('\n✅ Test data created successfully!\n');
    console.log('═'.repeat(60));
    console.log('\n📊 SUMMARY:');
    console.log(`   User: ${ownerUser.name} (${ownerUser.email})`);
    console.log(`   Subscription: ${testSubscription.planName}`);
    console.log(`   Payments created: ${testPayments.length}`);
    console.log(`   Total revenue: £${testPayments.filter(p => p.paymentStatus === 'succeeded').reduce((sum, p) => sum + p.amount, 0).toFixed(2)}`);
    console.log('\n═'.repeat(60));
    console.log('\n🎯 NEXT STEPS:\n');
    console.log('1. Login to admin dashboard:');
    console.log('   URL: http://localhost:3000/admin/login\n');
    console.log('2. Navigate to Transactions view');
    console.log('   Click "Transactions" in the sidebar\n');
    console.log('3. You should see the test payments displayed\n');
    console.log('4. To remove test data later, run:');
    console.log('   DELETE FROM payments WHERE stripePaymentIntentId LIKE \'pi_test_%\';');
    console.log('   DELETE FROM subscriptions WHERE stripeSubscriptionId LIKE \'sub_test_%\';\n');

  } catch (error) {
    console.error('❌ Error creating test data:', error);
    process.exit(1);
  }
}

createTestTransactions();
