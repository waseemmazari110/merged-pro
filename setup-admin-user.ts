import { db } from "./src/db";
import { user } from "./src/db/schema";
import { eq } from "drizzle-orm";
import { hashPassword } from "better-auth/crypto";

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

    // Create user
    const newUser = await db
      .insert(user)
      .values({
        email: adminEmail,
        name: adminName,
        password: hashedPassword,
        role: "admin",
        emailVerified: new Date(),
      })
      .returning();

    console.log("✅ Admin user created:");
    console.log(`   Email: ${newUser[0].email}`);
    console.log(`   Name: ${newUser[0].name}`);
    console.log(`   Role: ${newUser[0].role}`);
  }

  console.log("\n✅ Admin setup complete!\n");
  console.log("📖 You can now login with:");
  console.log(`   Email: ${adminEmail}`);
  console.log(`   Password: ${adminPassword}`);
  console.log(`   URL: http://localhost:3000/admin/login\n`);
}

main().catch(console.error);
