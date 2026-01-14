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
  emailVerified: integer("email_verified").notNull(),
  image: text(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
  role: text().default("guest").notNull(),
  phone: text(),
  companyName: text("company_name"),
});

const account = sqliteTable("account", {
  id: text().primaryKey().notNull(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id").notNull(),
  password: text(),
});

async function checkAdminRole() {
  try {
    console.log("🔍 Checking admin user role...\n");

    // Find user by email
    const users = await db
      .select()
      .from(user)
      .where(eq(user.email, "cswaseem110@gmail.com"));

    if (users.length === 0) {
      console.log("❌ Admin user not found!");
      process.exit(1);
    }

    const adminUser = users[0];
    console.log("📋 Admin User Details:");
    console.log("   ID:", adminUser.id);
    console.log("   Email:", adminUser.email);
    console.log("   Name:", adminUser.name);
    console.log("   Role:", adminUser.role);
    console.log("   Email Verified:", adminUser.emailVerified ? "Yes" : "No");

    // Check if account exists
    const accounts = await db
      .select()
      .from(account)
      .where(eq(account.userId, adminUser.id));

    console.log("\n📋 Account Details:");
    if (accounts.length > 0) {
      const acc = accounts[0];
      console.log("   Account ID:", acc.accountId);
      console.log("   Provider ID:", acc.providerId);
      console.log("   Password Set:", !!acc.password);
    } else {
      console.log("   ❌ No account found!");
    }

    // Check role
    console.log("\n🔐 Role Status:");
    if (adminUser.role === "admin") {
      console.log("   ✅ User has ADMIN role");
    } else if (adminUser.role === "owner") {
      console.log("   ⚠️  User has OWNER role (not admin)");
    } else {
      console.log("   ❌ User has role:", adminUser.role, "(INCORRECT!)");
    }

    if (adminUser.role !== "admin") {
      console.log("\n⚠️  ISSUE FOUND: Admin user does not have 'admin' role!");
      console.log("   Current role:", adminUser.role);
      console.log("   Expected role: admin");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

checkAdminRole();
