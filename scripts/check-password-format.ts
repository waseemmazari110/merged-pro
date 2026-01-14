// Script to check what password format better-auth uses
import { db } from './src/db';
import { account } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function checkPasswordFormat() {
  // Get a credential account
  const accounts = await db
    .select()
    .from(account)
    .where(eq(account.providerId, 'credential'))
    .limit(5);

  console.log('Found accounts:', accounts.length);
  
  for (const acc of accounts) {
    console.log('\nAccount:', acc.accountId);
    console.log('Password hash:', acc.password?.substring(0, 60) || 'NULL');
    console.log('Password length:', acc.password?.length || 0);
    
    if (acc.password) {
      // Check format
      if (acc.password.startsWith('$2a$') || acc.password.startsWith('$2b$')) {
        console.log('Format: bcrypt');
        const parts = acc.password.split('$');
        console.log('Algorithm:', parts[1]);
        console.log('Cost:', parts[2]);
      } else if (acc.password.includes(':')) {
        console.log('Format: salt:hash (scrypt?)');
      } else {
        console.log('Format: unknown');
      }
    }
  }
}

checkPasswordFormat().catch(console.error);
