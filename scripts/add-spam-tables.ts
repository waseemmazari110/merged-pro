import { createClient } from '@libsql/client';
import dotenv from 'dotenv';
dotenv.config();

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL || 'file:database.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function main() {
  try {
    console.log('🚀 Creating spam protection tables...');
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS spam_blacklist (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        type TEXT NOT NULL,
        value TEXT NOT NULL UNIQUE,
        reason TEXT,
        expires_at TEXT,
        created_at TEXT NOT NULL
      );
    `);
    
    await client.execute(`
      CREATE TABLE IF NOT EXISTS spam_submissions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        ip TEXT,
        email TEXT,
        form_type TEXT,
        reason TEXT,
        user_agent TEXT,
        payload TEXT,
        created_at TEXT NOT NULL
      );
    `);
    
    console.log('✅ Spam protection tables created successfully');
  } catch (e) {
    console.error('❌ Migration failed:', e);
  } finally {
    client.close();
  }
}

main();
