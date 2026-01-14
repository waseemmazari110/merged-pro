import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  try {
    console.log('Starting migration v3...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS saved_properties (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        property_id INTEGER NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
      );
    `);
    console.log('Table saved_properties created');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS saved_quotes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        quote_payload TEXT NOT NULL,
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE
      );
    `);
    console.log('Table saved_quotes created');

    await client.execute(`
      CREATE TABLE IF NOT EXISTS enquiries (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        type TEXT NOT NULL,
        property_id INTEGER,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        recipient_email TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'sent',
        created_at TEXT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
        FOREIGN KEY (property_id) REFERENCES properties(id)
      );
    `);
    console.log('Table enquiries created');

    console.log('Migration v3 successful');
  } catch (e) {
    console.error('Migration v3 failed:', e);
  } finally {
    client.close();
  }
}

main();
