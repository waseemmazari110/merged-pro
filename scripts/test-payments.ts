import { config } from 'dotenv';
config();

import { stripe } from '@/lib/stripe-billing';
import { db } from '@/db';
import { payments } from '@/db/schema';

async function testPayments() {
  console.log('\n═══════════════════════════════════════════════');
  console.log('PAYMENT TRACKING TEST');
  console.log('═══════════════════════════════════════════════\n');

  try {
    // 1. Get database payment count
    const dbPaymentsResult = await db.select().from(payments);
    console.log(`📊 Database Payments: ${dbPaymentsResult.length}`);
    
    if (dbPaymentsResult.length > 0) {
      console.log('   Sample payments:');
      dbPaymentsResult.slice(0, 3).forEach((p, i) => {
        console.log(`   ${i+1}. Amount: £${p.amount}, Status: ${p.paymentStatus}, User: ${p.userId}`);
      });
    }

    // 2. Get recent Stripe charges
    console.log('\n💳 Stripe Charges (Last 5):');
    const charges = await stripe.charges.list({ limit: 5 });
    if (charges.data.length === 0) {
      console.log('   ⚠️  No charges found in Stripe');
    } else {
      charges.data.forEach((c, i) => {
        console.log(`   ${i+1}. Amount: £${(c.amount/100).toFixed(2)}, Status: ${c.status}, Intent: ${c.payment_intent}`);
      });
    }

    // 3. Get recent payment intents
    console.log('\n🔗 Stripe Payment Intents (Last 5):');
    const intents = await stripe.paymentIntents.list({ limit: 5 });
    if (intents.data.length === 0) {
      console.log('   ⚠️  No payment intents found');
    } else {
      intents.data.forEach((intent, i) => {
        console.log(`   ${i+1}. Amount: £${(intent.amount/100).toFixed(2)}, Status: ${intent.status}, Metadata: ${JSON.stringify(intent.metadata)}`);
      });
    }

    // 4. Analysis
    console.log('\n═══════════════════════════════════════════════');
    console.log('ANALYSIS');
    console.log('═══════════════════════════════════════════════');
    console.log(`\nDatabase Payments: ${dbPaymentsResult.length}`);
    console.log(`Stripe Charges: ${charges.data.length}`);
    console.log(`Stripe Intents: ${intents.data.length}`);

    if (charges.data.length > 0 && dbPaymentsResult.length === 0) {
      console.log('\n⚠️  ISSUE: Charges exist in Stripe but NOT in database!');
      console.log('   This means the webhook is NOT recording payments.');
      console.log('   Possible causes:');
      console.log('   1. Webhook is not being called by Stripe');
      console.log('   2. Webhook signature verification is failing');
      console.log('   3. Payment metadata is missing userId');
      console.log('   4. Database insert is failing silently\n');
    } else if (dbPaymentsResult.length > 0) {
      console.log('\n✅ Payments ARE being tracked in the database!\n');
    } else {
      console.log('\n⚠️  No payments found anywhere yet.');
      console.log('   Make a test payment to verify the system.\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', (error as Error).message);
  }
  
  process.exit(0);
}

testPayments();
