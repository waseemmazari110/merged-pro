import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@libsql/client";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function migrateAdminField() {
  try {
    console.log("🔄 Migrating admin field to user table...\n");

    // Check if column already exists
    const checkColumnQuery = await client.execute(
      "PRAGMA table_info(user);"
    );

    const hasIsAdminColumn = (checkColumnQuery.rows as any[]).some(
      (row: any) => row.name === "isAdmin"
    );

    if (hasIsAdminColumn) {
      console.log("✅ Column 'isAdmin' already exists in user table");
    } else {
      console.log("➕ Adding 'isAdmin' column to user table...");
      
      // Add the isAdmin column
      await client.execute(
        `ALTER TABLE user ADD COLUMN isAdmin INTEGER DEFAULT 0 NOT NULL;`
      );
      
      console.log("✅ Column 'isAdmin' successfully added");
    }

    // Update admin users to have isAdmin = 1
    console.log("\n🔄 Updating admin users...");
    const updateResult = await client.execute(
      `UPDATE user SET isAdmin = 1 WHERE role = 'admin';`
    );
    
    console.log(`✅ Updated admin users (${updateResult.rowsAffected} rows affected)`);

    // Verify the changes
    console.log("\n📋 Verification:");
    const adminUsers = await client.execute(
      `SELECT id, email, role, isAdmin FROM user WHERE isAdmin = 1;`
    );
    
    console.log(`   Admin users with isAdmin=1: ${adminUsers.rows.length}`);
    for (const row of adminUsers.rows as any[]) {
      console.log(`   - ${row.email} (role: ${row.role}, isAdmin: ${row.isAdmin})`);
    }

    console.log("\n✅ Migration complete!");
    console.log("\n📝 Schema Update:");
    console.log("   - Added 'isAdmin' INTEGER column to user table");
    console.log("   - Default value: 0 (false)");
    console.log("   - Admin users automatically set to isAdmin=1");
    console.log("   - This provides faster filtering for admin-only queries");

  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

migrateAdminField();
