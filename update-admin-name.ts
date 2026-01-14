import { db } from "./src/db";
import { user } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function updateAdminName() {
  console.log("\n🔧 Updating admin user name to 'Dan'\n");

  try {
    // Find admin user (dan@example.com or any admin)
    const adminUser: any = await db
      .select()
      .from(user)
      .where(eq(user.role, "admin"))
      .limit(1)
      .then(results => results[0]);

    if (adminUser) {
      console.log(`📧 Found admin user: ${adminUser.email}`);
      console.log(`📝 Current name: ${adminUser.name}`);

      // Update name to "Dan"
      await db
        .update(user)
        .set({ 
          name: "Dan",
          updatedAt: new Date()
        })
        .where(eq(user.id, adminUser.id));

      console.log("\n✅ Admin name updated to 'Dan'");
    } else {
      console.log("❌ No admin user found");
      console.log("\nYou can create an admin user with:");
      console.log("  - Email: dan@example.com");
      console.log("  - Password: Admin123");
      console.log("  - Role: admin");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
}

updateAdminName();
