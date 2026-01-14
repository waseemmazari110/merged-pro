import { db } from './src/db';
import { account, user } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function debugAccount() {
  const email = 'cswaseem110@gmail.com';
  
  // Find user
  const [userRecord] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!userRecord) {
    console.log('User not found');
    return;
  }

  console.log('User:', {
    id: userRecord.id,
    email: userRecord.email,
    emailVerified: userRecord.emailVerified,
  });

  // Find all accounts
  const accounts = await db
    .select()
    .from(account)
    .where(eq(account.userId, userRecord.id));

  console.log(`\nTotal accounts: ${accounts.length}\n`);

  for (const acc of accounts) {
    console.log('Account:', {
      id: acc.id,
      providerId: acc.providerId,
      accountId: acc.accountId,
      passwordHash: acc.password?.substring(0, 60) || 'NULL',
      passwordLength: acc.password?.length || 0,
      createdAt: acc.createdAt,
      updatedAt: acc.updatedAt,
    });
  }
  
  // Test bcrypt verification
  if (accounts.length > 0 && accounts[0].password) {
    const bcrypt = await import('bcryptjs');
    const testPassword = 'Test@123'; // Replace with actual password for testing
    
    try {
      const isValid = await bcrypt.compare(testPassword, accounts[0].password);
      console.log(`\nBcrypt verification with "Test@123": ${isValid ? 'SUCCESS' : 'FAILED'}`);
    } catch (err: any) {
      console.log(`\nBcrypt verification error:`, err.message);
    }
  }
}

debugAccount().then(() => process.exit(0)).catch(console.error);
