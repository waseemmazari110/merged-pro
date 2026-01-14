import { config } from 'dotenv';
import { createClient } from '@libsql/client';
import Stripe from 'stripe';

// Load environment variables
config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const stripe = new Stripe(process.env.STRIPE_TEST_KEY!, {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
});

async function runDiagnostics() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('🔍 STRIPE PAYMENT SYSTEM DIAGNOSTICS');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  try {
    // 1. Check database connection
    console.log('✓ 1. DATABASE CONNECTION');
    const dbTest = await turso.execute('SELECT COUNT(*) as count FROM payments;');
    console.log(`   ✅ Database connected`);
    console.log(`   📊 Total payments in DB: ${dbTest.rows[0]?.count || 0}\n`);

    // 2. Check Stripe API connection
    console.log('✓ 2. STRIPE API CONNECTION');
    const account = await stripe.account.retrieve();
    console.log(`   ✅ Stripe API accessible`);
    console.log(`   🏪 Account: ${account.display_name || 'N/A'}`);
    console.log(`   🌍 Country: ${account.country || 'N/A'}\n`);

    // 3. List recent charges from Stripe
    console.log('✓ 3. RECENT STRIPE CHARGES (Last 10)');
    const charges = await stripe.charges.list({ limit: 10 });
    if (charges.data.length === 0) {
      console.log('   ⚠️  No charges found in Stripe\n');
    } else {
      charges.data.forEach((charge, idx) => {
        console.log(`   ${idx + 1}. Amount: £${(charge.amount / 100).toFixed(2)}`);
        console.log(`      Status: ${charge.status}`);
        console.log(`      Payment Intent: ${charge.payment_intent}`);
        console.log(`      Created: ${new Date(charge.created * 1000).toISOString()}`);
        console.log(`      Customer: ${charge.customer || 'N/A'}`);
      });
      console.log();
    }

    // 4. Check payment intents
    console.log('✓ 4. RECENT PAYMENT INTENTS (Last 10)');
    const intents = await stripe.paymentIntents.list({ limit: 10 });
    if (intents.data.length === 0) {
      console.log('   ⚠️  No payment intents found in Stripe\n');
    } else {
      intents.data.forEach((intent, idx) => {
        console.log(`   ${idx + 1}. Amount: £${(intent.amount / 100).toFixed(2)}`);
        console.log(`      Status: ${intent.status}`);
        console.log(`      ID: ${intent.id}`);
        console.log(`      Metadata: ${JSON.stringify(intent.metadata)}`);
        console.log(`      Created: ${new Date(intent.created * 1000).toISOString()}`);
      });
      console.log();
    }

    // 5. Check invoices
    console.log('✓ 5. RECENT INVOICES (Last 10)');
    const invoices = await stripe.invoices.list({ limit: 10 });
    if (invoices.data.length === 0) {
      console.log('   ⚠️  No invoices found in Stripe\n');
    } else {
      invoices.data.forEach((invoice, idx) => {
        console.log(`   ${idx + 1}. Amount: £${(invoice.amount_paid / 100).toFixed(2)}`);
        console.log(`      Status: ${invoice.status}`);
        console.log(`      ID: ${invoice.id}`);
        console.log(`      Customer: ${invoice.customer}`);
        console.log(`      Created: ${new Date(invoice.created * 1000).toISOString()}`);
      });
      console.log();
    }

    // 6. Check subscriptions
    console.log('✓ 6. RECENT SUBSCRIPTIONS (Last 10)');
    const subscriptions = await stripe.subscriptions.list({ limit: 10 });
    if (subscriptions.data.length === 0) {
      console.log('   ⚠️  No subscriptions found in Stripe\n');
    } else {
      subscriptions.data.forEach((sub, idx) => {
        console.log(`   ${idx + 1}. Status: ${sub.status}`);
        console.log(`      ID: ${sub.id}`);
        console.log(`      Customer: ${sub.customer}`);
        console.log(`      Plan: ${(sub.items.data[0]?.price as any)?.product}`);
        console.log(`      Current Period: ${new Date(sub.current_period_start * 1000).toISOString()} to ${new Date(sub.current_period_end * 1000).toISOString()}`);
      });
      console.log();
    }

    // 7. Check database payments table structure
    console.log('✓ 7. DATABASE PAYMENTS TABLE STRUCTURE');
    const schema = await turso.execute(`PRAGMA table_info(payments);`);
    console.log(`   Total columns: ${schema.rows.length}`);
    console.log('   Columns:');
    schema.rows.forEach((col: any) => {
      console.log(`     - ${col.name} (${col.type})`);
    });
    console.log();

    // 8. Sample data from database
    console.log('✓ 8. SAMPLE PAYMENTS FROM DATABASE (Last 5)');
    const samplePayments = await turso.execute(`
      SELECT 
        id, 
        user_id, 
        stripe_payment_intent_id, 
        amount, 
        currency, 
        payment_status, 
        created_at 
      FROM payments 
      ORDER BY created_at DESC 
      LIMIT 5;
    `);
    
    if (samplePayments.rows.length === 0) {
      console.log('   ⚠️  No payments in database\n');
    } else {
      samplePayments.rows.forEach((payment: any, idx) => {
        console.log(`   ${idx + 1}. Amount: £${payment.amount}`);
        console.log(`      Status: ${payment.payment_status}`);
        console.log(`      User ID: ${payment.user_id}`);
        console.log(`      Payment Intent: ${payment.stripe_payment_intent_id}`);
        console.log(`      Created: ${payment.created_at}`);
      });
      console.log();
    }

    // 9. Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📋 SUMMARY\n');
    
    const totalCharges = charges.data.length;
    const totalIntents = intents.data.length;
    const dbPayments = dbTest.rows[0]?.count || 0;
    
    console.log(`Stripe Charges: ${totalCharges}`);
    console.log(`Stripe Payment Intents: ${totalIntents}`);
    console.log(`Database Payments: ${dbPayments}`);
    
    if (dbPayments === 0 && totalCharges > 0) {
      console.log('\n⚠️  ISSUE DETECTED:');
      console.log('   Charges exist in Stripe but NOT in database!');
      console.log('   Possible causes:');
      console.log('   1. Webhook is not being triggered');
      console.log('   2. Webhook signature verification is failing');
      console.log('   3. Payment metadata does not include userId');
      console.log('   4. Database insert is failing silently');
    } else if (dbPayments === totalCharges) {
      console.log('\n✅ Everything is working correctly!');
    } else if (dbPayments > 0 && totalCharges > 0) {
      console.log('\n✅ Payments are being tracked!');
    }
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (error) {
    console.error('❌ Diagnostic error:', error);
    if (error instanceof Error) {
      console.error('   Message:', error.message);
    }
  }
}

runDiagnostics();
