import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

// Load .env FIRST
const envPath = path.resolve(process.cwd(), ".env");
const result = dotenv.config({ path: envPath });

if (result.error) {
  console.error("Error loading .env:", result.error);
  process.exit(1);
}

console.log("✓ .env loaded");

// Now create DB client
const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

import { hashPassword } from "better-auth/crypto";
import { sql, eq } from "drizzle-orm";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import crypto from "crypto";

// Define the tables directly
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
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at"),
  refreshTokenExpiresAt: integer("refresh_token_expires_at"),
  scope: text(),
  password: text(),
  createdAt: integer("created_at").notNull(),
  updatedAt: integer("updated_at").notNull(),
});

const ADMIN_EMAIL = "cswaseem110@gmail.com";
const ADMIN_PASSWORD = "Admin123";

async function setupAdmin() {
  try {
    console.log("\n🔧 Setting up admin account...");

    // 1. Hash the password using better-auth's hashPassword
    console.log("📝 Hashing password with better-auth...");
    const hashedPassword = await hashPassword(ADMIN_PASSWORD);
    console.log("✓ Password hashed successfully");
    console.log("  Hash:", hashedPassword.substring(0, 40) + "...");

    // 2. Create user
    const userId = crypto.randomUUID();
    console.log("\n👤 Creating user...");
    console.log("  ID:", userId);
    console.log("  Email:", ADMIN_EMAIL);

    // Clean up old admin
    try {
      await db.delete(account).where(eq(account.accountId, ADMIN_EMAIL));
      await db.delete(user).where(eq(user.email, ADMIN_EMAIL));
    } catch (e) {}

    const now = Math.floor(Date.now() / 1000);

    await db.insert(user).values({
      id: userId,
      name: "Admin User",
      email: ADMIN_EMAIL,
      emailVerified: 1,
      image: null,
      createdAt: now,
      updatedAt: now,
      role: "admin",
      phone: null,
      companyName: null,
    });
    console.log("  ✓ User created");

    // 3. Create account with hashed password
    console.log("\n🔐 Creating account...");
    const accountId = crypto.randomUUID();

    await db.insert(account).values({
      id: accountId,
      accountId: ADMIN_EMAIL, // Email is the account identifier
      providerId: "credential", // IMPORTANT: Must be "credential" for email/password
      userId: userId, // Reference the user we just created
      refreshToken: null,
      accessToken: null,
      idToken: null,
      accessTokenExpiresAt: null,
      refreshTokenExpiresAt: null,
      scope: null,
      password: hashedPassword,
      createdAt: now,
      updatedAt: now,
    });
    console.log("  ✓ Account created");

    // 4. Verify
    console.log("\n📋 Verifying...");
    const storedAccount = await db
      .select()
      .from(account)
      .where(eq(account.accountId, ADMIN_EMAIL));

    if (storedAccount.length > 0) {
      const acc = storedAccount[0];
      console.log("  ✓ Account found");
      console.log("    accountId:", acc.accountId);
      console.log("    userId:", acc.userId);
      console.log("    providerId:", acc.providerId);
      console.log("    password stored:", !!acc.password);
      console.log("    password hash:", acc.password?.substring(0, 30) + "...");
    } else {
      console.log("  ❌ Account not found after creation");
    }

    console.log("\n✅ Admin setup complete!");
    console.log("\nCredentials:");
    console.log("  Email:", ADMIN_EMAIL);
    console.log("  Password:", ADMIN_PASSWORD);
    console.log("\nLogin URL: http://localhost:3000/auth/admin-login");
  } catch (error) {
    console.error("\n❌ Error:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
