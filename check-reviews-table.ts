import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table' AND name='reviews';");
    if (res.rows.length === 0) {
      console.log('Reviews table does not exist. Creating it...');
      await client.execute(`
        CREATE TABLE reviews (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          guest_name TEXT NOT NULL,
          rating INTEGER NOT NULL,
          comment TEXT NOT NULL,
          property_id INTEGER REFERENCES properties(id),
          review_date TEXT NOT NULL,
          guest_image TEXT,
          is_approved INTEGER DEFAULT 0,
          is_published INTEGER DEFAULT 0,
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
      `);
      console.log('Reviews table created successfully.');
    } else {
      console.log('Reviews table exists. Checking columns...');
      const columns = await client.execute("PRAGMA table_info(reviews);");
      console.log('Columns:', columns.rows.map(r => r.name));
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    client.close();
  }
}

main();
