import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  try {
    await client.execute("ALTER TABLE user ADD COLUMN role TEXT DEFAULT 'guest';");
    await client.execute("ALTER TABLE user ADD COLUMN phone_number TEXT;");
    await client.execute("ALTER TABLE user ADD COLUMN property_name TEXT;");
    await client.execute("ALTER TABLE user ADD COLUMN property_website TEXT;");
    await client.execute("ALTER TABLE user ADD COLUMN plan_id TEXT;");
    await client.execute("ALTER TABLE user ADD COLUMN payment_status TEXT DEFAULT 'pending';");
    console.log('Migration successful');
  } catch (e) {
    console.error('Migration failed:', e);
  } finally {
    client.close();
  }
}

main();
