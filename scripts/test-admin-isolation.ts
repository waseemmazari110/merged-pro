import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq, sql } from "drizzle-orm";
import * as schema from "@/db/schema";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

async function testAdminIsolation() {
  try {
    console.log("🧪 Testing Admin Isolation Setup...\n");
    console.log("=" .repeat(60) + "\n");

    // 1. Check database schema
    console.log("📋 Step 1: Database Schema Verification");
    console.log("-".repeat(60));
    
    let hasIsAdminColumn = false;
    try {
      const tableInfo = await client.execute("PRAGMA table_info(user);");
      const columns = (tableInfo.rows as any[]).map((row: any) => row.name);
      console.log("✅ User table columns:", columns);
      
      hasIsAdminColumn = columns.includes("isAdmin");
      if (hasIsAdminColumn) {
        console.log("✅ Column 'isAdmin' found in user table\n");
      } else {
        console.log("⚠️  Column 'isAdmin' NOT found - run migration first\n");
      }
    } catch (error) {
      console.log("⚠️  Could not verify schema:", error, "\n");
    }

    // 2. Check for admin users
    console.log("📋 Step 2: Admin Users Verification");
    console.log("-".repeat(60));
    
    const adminUsers = await db
      .select()
      .from(schema.user)
      .where(eq(schema.user.role, "admin"));

    if (adminUsers.length === 0) {
      console.log("❌ NO ADMIN USER FOUND!");
      console.log("   → Admin Isolation cannot work without an admin user");
      console.log("   → Create an admin user with role='admin' and isAdmin=1\n");
    } else {
      console.log(`✅ Found ${adminUsers.length} admin user(s):\n`);
      for (const admin of adminUsers) {
        const isAdminFlag = (admin as any).isAdmin;
        const adminStatus = (isAdminFlag === 1 || isAdminFlag === true) ? "✅" : "❌";
        console.log(`   ${adminStatus} ${admin.email}`);
        console.log(`      - role: ${admin.role}`);
        console.log(`      - isAdmin: ${isAdminFlag}`);
        console.log(`      - emailVerified: ${admin.emailVerified}\n`);
      }
    }

    // 3. Check total users by role
    console.log("📋 Step 3: User Distribution");
    console.log("-".repeat(60));
    
    const allUsers = await db.select().from(schema.user);
    const byRole = {} as Record<string, number>;
    
    for (const user of allUsers) {
      byRole[user.role] = (byRole[user.role] || 0) + 1;
    }
    
    for (const [role, count] of Object.entries(byRole)) {
      console.log(`   - ${role}: ${count} user(s)`);
    }
    console.log("");

    // 4. Check session data
    console.log("📋 Step 4: Session Validation");
    console.log("-".repeat(60));
    
    const sessions = await db.select().from(schema.session);
    console.log(`✅ Active sessions: ${sessions.length}\n`);

    // 5. Summary
    console.log("📋 Step 5: Admin Isolation Status");
    console.log("-".repeat(60));
    
    const hasAdmins = adminUsers.length > 0;
    const allAdminsHaveFlag = adminUsers.every((u: any) => u.isAdmin === 1 || u.isAdmin === true);
    
    console.log("Status Summary:");
    console.log(`   Database Schema: ${hasIsAdminColumn ? "✅" : "❌"}`);
    console.log(`   Admin Users Found: ${hasAdmins ? "✅" : "❌"}`);
    console.log(`   Admin Flag Set: ${allAdminsHaveFlag ? "✅" : "❌"}`);
    console.log(`   Overall: ${hasAdmins && allAdminsHaveFlag ? "✅ READY" : "❌ NEEDS SETUP"}\n`);

    // 6. Setup instructions
    console.log("📋 Step 6: Setup Instructions");
    console.log("-".repeat(60));
    
    if (!hasIsAdminColumn) {
      console.log("⚠️  Migration Needed:");
      console.log("   Run: npm run script scripts/add-isadmin-column.ts\n");
    }
    
    if (!hasAdmins) {
      console.log("⚠️  Create Admin User:");
      console.log("   Go to /auth/admin-login and sign up");
      console.log("   Or run: npm run script scripts/create-admin.ts\n");
    }

    if (hasAdmins && !allAdminsHaveFlag) {
      console.log("⚠️  Update Admin Flags:");
      console.log("   Run: npm run script scripts/add-isadmin-column.ts\n");
    }

    // 7. Testing checklist
    console.log("📋 Step 7: Testing Checklist");
    console.log("-".repeat(60));
    
    console.log("After setup, test the following:");
    console.log("   1. [ ] Admin login at http://localhost:3000/auth/admin-login");
    console.log("   2. [ ] Verify redirect to /admin/dashboard");
    console.log("   3. [ ] Try accessing / (home) - should redirect to admin dashboard");
    console.log("   4. [ ] Try accessing /booking - should redirect to admin dashboard");
    console.log("   5. [ ] Try accessing /account/dashboard - should redirect");
    console.log("   6. [ ] Check browser console for isolation warnings");
    console.log("   7. [ ] Test customer login still works\n");

    console.log("=" .repeat(60));
    console.log("✅ Admin Isolation Test Complete\n");

  } catch (error) {
    console.error("❌ Test Failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

testAdminIsolation();
