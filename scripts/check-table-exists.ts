import { config } from 'dotenv';
import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';

// Load environment variables
config();

const turso = createClient({
  url: process.env.TURSO_DATABASE_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(turso);

async function checkTableExists() {
  try {
    // Query SQLite's sqlite_master table to check if payments table exists
    const result = await turso.execute(`
      SELECT name 
      FROM sqlite_master 
      WHERE type='table' AND name='payments';
    `);
    
    if (result.rows.length > 0) {
      console.log('✅ SUCCESS: payments table EXISTS in database');
      console.log('Table details:', result.rows[0]);
      
      // Get table schema
      const schema = await turso.execute(`PRAGMA table_info(payments);`);
      console.log('\n📋 Table Schema:');
      console.log('Total columns:', schema.rows.length);
      schema.rows.forEach((col: any) => {
        console.log(`  - ${col.name} (${col.type})`);
      });
      
      // Count any existing records
      const count = await turso.execute(`SELECT COUNT(*) as count FROM payments;`);
      console.log('\n📊 Total payments in database:', count.rows[0].count);
    } else {
      console.log('❌ FAILED: payments table DOES NOT exist in database');
    }
  } catch (error) {
    console.error('Error checking table:', error);
  }
}

checkTableExists();
