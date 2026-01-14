// Test to see what hash format better-auth actually creates
import { db } from './src/db';
import { account, user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function testPasswordFormat() {
  // Find a newly created account that can login successfully
  const accounts = await db
    .select()
    .from(account)
    .where(eq(account.providerId, 'credential'))
    .limit(5);

  console.log(`Found ${accounts.length} credential accounts\n`);

  for (const acc of accounts) {
    if (acc.password) {
      console.log('Account ID:', acc.accountId);
      console.log('Password hash:', acc.password);
      console.log('Hash length:', acc.password.length);
      console.log('Hash format:', acc.password.substring(0, 7));
      
      // Try to identify the format
      if (acc.password.startsWith('$2a$') || acc.password.startsWith('$2b$')) {
        console.log('Type: bcrypt');
        const parts = acc.password.split('$');
        console.log('Version:', parts[1]);
        console.log('Cost:', parts[2]);
      } else if (acc.password.includes(':')) {
        console.log('Type: Possibly scrypt (salt:hash format)');
        const parts = acc.password.split(':');
        console.log('Parts:', parts.length);
      } else {
        console.log('Type: Unknown format');
      }
      
      // Test with bcrypt
      const bcrypt = await import('bcryptjs');
      try {
        // You'll need to know a working password to test
        const testPassword = 'TestPassword123'; // Change this to actual password
        const isValid = await bcrypt.compare(testPassword, acc.password);
        console.log(`Bcrypt verify with "${testPassword}": ${isValid ? 'VALID' : 'INVALID'}`);
      } catch (err: any) {
        console.log('Bcrypt error:', err.message);
      }
      
      console.log('\n---\n');
    }
  }
}

testPasswordFormat().then(() => process.exit(0)).catch(console.error);
