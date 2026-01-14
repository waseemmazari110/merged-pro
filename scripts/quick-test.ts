import { config } from 'dotenv';
import { createClient } from '@libsql/client';
import Stripe from 'stripe';

config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const stripe = new Stripe(process.env.STRIPE_TEST_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

async function quickTest() {
  console.log('\n🔍 QUICK PAYMENT SYSTEM CHECK\n');

  try {
    // Database check
    const dbCheck = await turso.execute('SELECT COUNT(*) as count FROM payments;');
    const dbCount = (dbCheck.rows[0] as any)?.count || 0;
    console.log(`📦 Database Payments: ${dbCount}`);

    // Stripe charges check
    const charges = await stripe.charges.list({ limit: 1 });
    const chargeCount = charges.data.length;
    console.log(`💳 Latest Stripe Charge: ${chargeCount > 0 ? `£${(charges.data[0].amount/100).toFixed(2)} - ${charges.data[0].status}` : 'None'}`);

    // Payment intents check
    const intents = await stripe.paymentIntents.list({ limit: 1 });
    const intentCount = intents.data.length;
    console.log(`🔗 Latest Payment Intent: ${intentCount > 0 ? `£${(intents.data[0].amount/100).toFixed(2)} - ${intents.data[0].status}` : 'None'}`);

    console.log('\n' + '═'.repeat(40));
    
    if (chargeCount > 0 && dbCount === 0) {
      console.log('❌ PROBLEM: Charges in Stripe but NOT in DB');
      console.log('   → Webhook not triggered OR not saving');
    } else if (dbCount > 0) {
      console.log('✅ Payments ARE being saved to database!');
    } else {
      console.log('⏳ No payments yet - make a test payment first');
    }
    console.log('═'.repeat(40) + '\n');

  } catch (error) {
    console.error('❌ Error:', (error as Error).message);
  }
  
  process.exit(0);
}

quickTest();
