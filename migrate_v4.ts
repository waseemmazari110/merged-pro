import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  try {
    console.log('Starting migration v4...');
    await client.execute("ALTER TABLE properties ADD COLUMN stripe_customer_id TEXT;");
    console.log('Added stripe_customer_id');
    await client.execute("ALTER TABLE properties ADD COLUMN stripe_subscription_id TEXT;");
    console.log('Added stripe_subscription_id');
    await client.execute("ALTER TABLE properties ADD COLUMN stripe_price_id TEXT;");
    console.log('Added stripe_price_id');
    await client.execute("ALTER TABLE properties ADD COLUMN stripe_invoice_id TEXT;");
    console.log('Added stripe_invoice_id');
    await client.execute("ALTER TABLE properties ADD COLUMN next_payment_date TEXT;");
    console.log('Added next_payment_date');
    console.log('Migration v4 successful');
  } catch (e) {
    console.error('Migration v4 failed:', e);
  } finally {
    client.close();
  }
}

main();
