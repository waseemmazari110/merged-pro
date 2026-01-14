/**
 * Check if there are any payments in the database
 */

import { config } from 'dotenv';
import { resolve } from 'path';

// Load environment variables
config({ path: resolve(__dirname, '.env') });

import { db } from './src/db';
import { payments } from './src/db/schema';

async function checkPayments() {
  try {
    console.log('Checking payments in database...\n');
    
    const allPayments = await db.select().from(payments);
    
    console.log(`Total payments found: ${allPayments.length}\n`);
    
    if (allPayments.length > 0) {
      console.log('Recent payments:');
      allPayments.slice(0, 10).forEach((payment, index) => {
        console.log(`\n${index + 1}. Payment ID: ${payment.id}`);
        console.log(`   User ID: ${payment.userId}`);
        console.log(`   Amount: ${payment.amount} ${payment.currency}`);
        console.log(`   Status: ${payment.paymentStatus}`);
        console.log(`   Stripe Payment Intent: ${payment.stripePaymentIntentId}`);
        console.log(`   Description: ${payment.description}`);
        console.log(`   Created: ${payment.createdAt}`);
      });
    } else {
      console.log('❌ No payments found in database!');
      console.log('\nThis means either:');
      console.log('1. No payments have been made yet');
      console.log('2. Stripe webhook is not configured');
      console.log('3. Webhook events are not being processed');
      console.log('4. Payment tracking is not working');
    }
    
  } catch (error) {
    console.error('Error checking payments:', error);
  }
}

checkPayments();
