import * as dotenv from "dotenv";
import * as path from "path";
import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import { eq } from "drizzle-orm";
import { hashPassword, verifyPassword } from "better-auth/crypto";
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

// Load .env
dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

const db = drizzle(client);

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

async function testPassword() {
  try {
    console.log("🧪 Testing password verification...\n");

    // Get the admin account
    const adminAccounts = await db
      .select()
      .from(account)
      .where(eq(account.accountId, "cswaseem110@gmail.com"));

    if (adminAccounts.length === 0) {
      console.log("❌ Admin account not found");
      process.exit(1);
    }

    const adminAccount = adminAccounts[0];
    console.log("📋 Admin Account Found:");
    console.log("   Email:", adminAccount.accountId);
    console.log("   UserId:", adminAccount.userId);
    console.log("   Stored Hash:", adminAccount.password?.substring(0, 40) + "...");

    // Test password verification
    const PASSWORD = "Admin123";
    console.log("\n🔐 Testing Password Verification:");
    console.log("   Input Password:", PASSWORD);

    const isValid = await verifyPassword({ password: PASSWORD, hash: adminAccount.password! });
    console.log("   Result:", isValid ? "✓ VALID" : "✗ INVALID");

    // Test the auth.ts logic
    console.log("\n📝 Testing auth.ts verification logic:");
    const hash = adminAccount.password!;
    
    try {
      const result = await verifyPassword({ password: PASSWORD, hash });
      console.log("   verifyPassword result:", result);
      if (result) {
        console.log("   ✅ Password verification WORKS!");
      } else {
        console.log("   ❌ Password verification FAILED");
      }
    } catch (e) {
      console.log("   ❌ Error during verification:", e);
    }

    if (isValid) {
      console.log("\n✅ Admin should be able to login successfully!");
      console.log("   Try logging in with:");
      console.log("   Email: cswaseem110@gmail.com");
      console.log("   Password: Admin123");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    process.exit(0);
  }
}

testPassword();
