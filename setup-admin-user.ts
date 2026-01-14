import { db } from "./src/db";
import { user, account } from "./src/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";
import { randomUUID } from "crypto";

async function main() {
  const adminEmail = "cswaseem110@gmail.com";
  const adminPassword = "Admin123";
  const adminName = "Admin";

  console.log(`\n🔧 Setting up admin user: ${adminEmail}\n`);

  // Check if user exists
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, adminEmail))
    .get();

  if (existingUser) {
    console.log("✅ User exists");
    console.log(`   Current role: ${existingUser.role}`);

    // Update to admin if not already
    if (existingUser.role !== "admin") {
      console.log("\n📝 Updating role to 'admin'...");
      
      await db
        .update(user)
        .set({ role: "admin" })
        .where(eq(user.email, adminEmail));
      
      console.log("✅ Role updated to 'admin'");
    } else {
      console.log("✅ User is already admin");
    }
  } else {
    console.log("❌ User does not exist. Creating...\n");

    // Hash password
    const hashedPassword = await hashPassword(adminPassword);

    // Create user (without password field - it goes in account table)
    const userId = randomUUID();
    await db
      .insert(user)
      .values({
        id: userId,
        email: adminEmail,
        name: adminName,
        emailVerified: true,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    // Create account with password
    await db
      .insert(account)
      .values({
        id: randomUUID(),
        accountId: userId,
        providerId: "credential",
        userId: userId,
        password: hashedPassword,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

    console.log("✅ Admin user created:");
    console.log(`   Email: ${adminEmail}`);
    console.log(`   Name: ${adminName}`);
    console.log(`   Role: admin`);
  }

  console.log("\n✅ Admin setup complete!\n");
  console.log("📖 You can now login with:");
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   URL: http://localhost:3000/admin/login\n`);
}

main().catch(console.error);
