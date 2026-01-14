import { db } from "./src/db";
import { user } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const adminEmail = "cswaseem110@gmail.com";
  
  console.log(`\n🔍 Checking for admin user: ${adminEmail}\n`);
  
  const existingUser = await db
    .select()
    .from(user)
    .where(eq(user.email, adminEmail))
    .get();
  
  if (existingUser) {
    console.log("✅ User found:");
    console.log(`   Email: ${existingUser.email}`);
    console.log(`   Name: ${existingUser.name}`);
    console.log(`   Role: ${existingUser.role}`);
    console.log(`   ID: ${existingUser.id}`);
  } else {
    console.log("❌ User NOT found in database");
    console.log("\n📝 Available users:");
    const allUsers = await db.select({
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }).from(user).limit(10);
    console.log(JSON.stringify(allUsers, null, 2));
  }
}

main().catch(console.error);
