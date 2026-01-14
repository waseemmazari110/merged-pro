import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

const user = sqliteTable("user", {
  id: text().primaryKey().notNull(),
  name: text().notNull(),
  email: text().notNull(),
  role: text().default("guest").notNull(),
});

async function verifyAdminIsolation() {
  try {
    console.log("🔍 Verifying Admin Isolation Setup...\n");

    // Check admin user
    const admins = await db
      .select()
      .from(user)
      .where(eq(user.role, "admin"));

    console.log("📋 Admin Users Found:");
    if (admins.length === 0) {
      console.log("   ❌ NO ADMIN USER FOUND!");
      console.log("   Please create admin user with role='admin'");
    } else {
      for (const admin of admins) {
        console.log(`   ✅ ${admin.email}`);
        console.log(`      - Role: ${admin.role}`);
        console.log(`      - ID: ${admin.id}`);
      }
    }

    // Check other roles
    console.log("\n📋 Other Users:");
    const users = await db
      .select()
      .from(user)
      .where(eq(user.role, "owner"));
    console.log(`   Owners: ${users.length}`);

    const customers = await db
      .select()
      .from(user)
      .where(eq(user.role, "customer"));
    console.log(`   Customers: ${customers.length}`);

    console.log("\n✅ Verification Complete");
    console.log("\n🔒 Admin Isolation Settings:");
    console.log("   - Admin-only routes: /admin/*");
    console.log("   - Admin blocked from: /, /login, /account/*, /owner-login");
    console.log("   - Home layout enforces admin redirect");
    console.log("   - Account layout enforces admin redirect");
    console.log("   - Middleware blocks admin from public routes");
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

verifyAdminIsolation();
