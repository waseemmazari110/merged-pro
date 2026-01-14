/**
 * Test database connection and fetch payment data
 */

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

import { db } from '@/db';
import { payments, user } from '@/db/schema';
import { desc } from 'drizzle-orm';

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Try to fetch payments
    const allPayments = await db
      .select()
      .from(payments)
      .orderBy(desc(payments.createdAt))
      .limit(10);

    console.log(`\n✅ Database connection successful!`);
    console.log(`Found ${allPayments.length} payments in database`);
    
    if (allPayments.length > 0) {
      console.log('\nPayment records:');
      allPayments.forEach((payment, idx) => {
        console.log(`\n${idx + 1}. Payment ID: ${payment.id}`);
        console.log(`   User ID: ${payment.userId}`);
        console.log(`   Amount: ${payment.currency} ${payment.amount}`);
        console.log(`   Status: ${payment.paymentStatus}`);
        console.log(`   Created: ${payment.createdAt}`);
        console.log(`   Plan: ${payment.subscriptionPlan || 'N/A'}`);
      });
    } else {
      console.log('\n⚠️  No payment records found in database');
      console.log('This is expected if no payments have been processed yet.');
    }

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Database connection failed:');
    console.error(error);
    process.exit(1);
  }
}

testConnection();
