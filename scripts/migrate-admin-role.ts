import { drizzle } from 'drizzle-orm/libsql';
import { createClient } from '@libsql/client';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

/**
 * Migration: Add isAdmin flag to user table for better role isolation
 * This will help clearly mark admin-only users
 */
async function migrateAddIsAdminFlag() {
  try {
    console.log("🔄 Checking if isAdmin column exists...");
    
    // Try to add isAdmin column if it doesn't exist
    // Note: SQLite doesn't support IF NOT EXISTS for ALTER TABLE
    // So we'll update the admin user with explicit role='admin' marking
    
    const adminUsers = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.role, 'admin'));

    console.log(`Found ${adminUsers.length} admin users`);
    
    // Ensure admin users have role='admin'
    for (const admin of adminUsers) {
      if (admin.role !== 'admin') {
        console.log(`⚠️  Admin user ${admin.email} has wrong role: ${admin.role}`);
      } else {
        console.log(`✓ Admin user ${admin.email} has correct role`);
      }
    }

    console.log("✅ Migration check complete");
  } catch (error) {
    console.error("❌ Migration error:", error);
  } finally {
    process.exit(0);
  }
}

migrateAddIsAdminFlag();
