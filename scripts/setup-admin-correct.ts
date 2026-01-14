import 'dotenv/config';
import { db } from './src/db/index';
import { user, account } from './src/db/schema';
import { eq } from 'drizzle-orm';
import { scryptAsync } from '@noble/hashes/scrypt.js';
import { bytesToHex } from '@noble/hashes/utils.js';
import crypto from 'crypto';

// Simple UUID generator
function generateId(): string {
  return crypto.randomUUID();
}

// Hash password using scrypt (better-auth format)
async function hashPasswordScrypt(password: string): Promise<string> {
  const config = {
    N: 16384,
    r: 16,
    p: 1,
    dkLen: 64,
  };

  const saltBytes = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex(saltBytes);

  const keyBytes = await scryptAsync(
    password.normalize("NFKC"),
    saltHex,
    {
      N: config.N,
      p: config.p,
      r: config.r,
      dkLen: config.dkLen,
      maxmem: 128 * config.N * config.r * 2,
    }
  );

  const keyHex = bytesToHex(keyBytes);
  return `${saltHex}:${keyHex}`;
}

async function setupAdminAccount() {
  try {
    console.log('Setting up admin account with proper better-auth format...\n');

    const adminEmail = 'cswaseem110@gmail.com';
    const adminName = 'Dan';
    const adminPassword = 'Admin123';

    // 1. Check if admin already exists
    console.log(`1. Checking if admin with email "${adminEmail}" already exists...`);
    const existingAdmin = await db.select().from(user).where(eq(user.email, adminEmail));
    
    if (existingAdmin.length > 0) {
      console.log(`   Found existing admin, deleting...`);
      await db.delete(account).where(eq(account.userId, existingAdmin[0].id));
      await db.delete(user).where(eq(user.id, existingAdmin[0].id));
    }

    // 2. Create new user
    console.log(`\n2. Creating admin user...`);
    const userId = generateId();
    const now = new Date();
    
    await db.insert(user).values({
      id: userId,
      name: adminName,
      email: adminEmail,
      emailVerified: true,
      role: 'admin',
      createdAt: now,
      updatedAt: now,
    });
    
    console.log(`   ✓ Admin user created`);
    console.log(`   User ID: ${userId}`);

    // 3. Create account with proper format (accountId should be userId, not email)
    console.log(`\n3. Creating account with scrypt password...`);
    const accountId = generateId();
    const hashedPassword = await hashPasswordScrypt(adminPassword);
    
    await db.insert(account).values({
      id: accountId,
      accountId: userId,  // Use userId as accountId (matching owner signup pattern)
      providerId: 'credential',
      userId: userId,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
    
    console.log(`   ✓ Account created`);
    console.log(`   Account ID: ${accountId}`);

    // 4. Verify
    console.log(`\n4. Verifying account...`);
    const verifyUser = await db.select().from(user).where(eq(user.id, userId));
    const verifyAccounts = await db.select().from(account).where(eq(account.userId, userId));
    
    if (verifyUser.length > 0 && verifyAccounts.length > 0) {
      console.log(`   ✓ Account verification successful`);
      console.log(`\n✅ Admin account setup complete!\n`);
      console.log(`Login credentials:`);
      console.log(`   Email: ${adminEmail}`);
      console.log(`   Password: ${adminPassword}`);
      console.log(`\nYou can now login at /admin/login`);
    } else {
      console.log(`   ❌ Verification failed`);
    }

  } catch (error) {
    console.error('Error setting up admin account:', error);
    process.exit(1);
  }
}

setupAdminAccount();
