/**
 * Test script to create sample transactions in the database
 * Run with: npx tsx test-transaction.ts
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables before importing db
config({ path: resolve(__dirname, '.env') });

import { db } from './src/db';
import { payments, user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function createTestTransactions() {
  console.log('Creating test transactions...');

  try {
    // Get an admin or owner user
    const users = await db.select().from(user).where(eq(user.role, 'owner')).limit(1);
    
    let testUser = users[0];
    
    if (!testUser) {
      // Get any user
      const allUsers = await db.select().from(user).limit(1);
      testUser = allUsers[0];
    }

    if (!testUser) {
      console.error('No users found in database. Please create a user first.');
      return;
    }

    console.log('Using user:', testUser.email);

    const now = new Date().toLocaleString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    }).replace(',', '');

    // Create sample transactions
    const sampleTransactions = [
      {
        userId: testUser.id,
        stripeCustomerId: 'cus_test_123456',
        stripePaymentIntentId: `pi_test_${Date.now()}_1`,
        stripeChargeId: `ch_test_${Date.now()}_1`,
        amount: 19.99,
        currency: 'GBP',
        paymentStatus: 'succeeded',
        paymentMethod: 'card',
        paymentMethodBrand: 'visa',
        paymentMethodLast4: '4242',
        description: 'Basic Plan - Monthly subscription',
        billingReason: 'subscription_create',
        receiptUrl: 'https://stripe.com/receipt/test',
        receiptEmail: testUser.email,
        createdAt: now,
        updatedAt: now,
        processedAt: now,
      },
      {
        userId: testUser.id,
        stripeCustomerId: 'cus_test_123456',
        stripePaymentIntentId: `pi_test_${Date.now()}_2`,
        stripeChargeId: `ch_test_${Date.now()}_2`,
        amount: 39.99,
        currency: 'GBP',
        paymentStatus: 'succeeded',
        paymentMethod: 'card',
        paymentMethodBrand: 'mastercard',
        paymentMethodLast4: '5555',
        description: 'Premium Plan - Monthly subscription',
        billingReason: 'subscription_cycle',
        receiptUrl: 'https://stripe.com/receipt/test2',
        receiptEmail: testUser.email,
        createdAt: now,
        updatedAt: now,
        processedAt: now,
      },
      {
        userId: testUser.id,
        stripeCustomerId: 'cus_test_123456',
        stripePaymentIntentId: `pi_test_${Date.now()}_3`,
        amount: 29.99,
        currency: 'GBP',
        paymentStatus: 'pending',
        paymentMethod: 'card',
        paymentMethodBrand: 'visa',
        paymentMethodLast4: '4000',
        description: 'Silver Plan - Monthly subscription',
        billingReason: 'subscription_create',
        receiptEmail: testUser.email,
        createdAt: now,
        updatedAt: now,
        processedAt: now,
      },
    ];

    for (const transaction of sampleTransactions) {
      const [created] = await db.insert(payments).values(transaction).returning();
      console.log('✅ Created transaction:', created.id, '-', transaction.description, '-', transaction.paymentStatus);
    }

    console.log('\n✅ Test transactions created successfully!');
    console.log('You can now view them in the admin dashboard at /admin/dashboard (Transactions tab)');

  } catch (error) {
    console.error('❌ Error creating test transactions:', error);
  }

  process.exit(0);
}

createTestTransactions();
