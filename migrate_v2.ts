import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  const columns = [
    "ALTER TABLE user ADD COLUMN property_website TEXT;",
    "ALTER TABLE user ADD COLUMN plan_id TEXT;",
    "ALTER TABLE user ADD COLUMN payment_status TEXT DEFAULT 'pending';"
  ];

  for (const sql of columns) {
    try {
      await client.execute(sql);
      console.log(`Executed: ${sql}`);
    } catch (e) {
      console.error(`Failed: ${sql}`, e instanceof Error ? e.message : String(e));
    }
  }
  client.close();
}

main();
