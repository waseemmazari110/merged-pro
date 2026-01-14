import { db } from './src/db';
import { user, account } from './src/db/schema';
import { eq } from 'drizzle-orm';

async function checkAccount() {
  const email = process.argv[2];
  
  if (!email) {
    console.log('Usage: npx tsx test-account.ts <email>');
    process.exit(1);
  }

  console.log(`\n🔍 Checking account for: ${email}\n`);

  // Find user
  const [foundUser] = await db
    .select()
    .from(user)
    .where(eq(user.email, email))
    .limit(1);

  if (!foundUser) {
    console.log('❌ User not found');
    process.exit(1);
  }

  console.log('✅ User found:');
  console.log('  ID:', foundUser.id);
  console.log('  Name:', foundUser.name);
  console.log('  Email:', foundUser.email);
  console.log('  Role:', (foundUser as any).role || 'N/A');

  // Find accounts
  const accounts = await db
    .select()
    .from(account)
    .where(eq(account.userId, foundUser.id));

  console.log(`\n📋 Found ${accounts.length} account(s):\n`);
  
  accounts.forEach((acc, index) => {
    console.log(`Account #${index + 1}:`);
    console.log('  ID:', acc.id);
    console.log('  Provider ID:', acc.providerId);
    console.log('  Account ID:', acc.accountId);
    console.log('  Has Password:', acc.password ? 'Yes' : 'No');
    console.log('  Password Hash:', acc.password ? acc.password.substring(0, 20) + '...' : 'None');
    console.log('');
  });
}

checkAccount().catch(console.error);
