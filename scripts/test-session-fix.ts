import { db } from "./src/db";
import { user as userTable, session as sessionTable } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function testSession() {
  try {
    // Check user in database
    const users = await db
      .select({
        id: userTable.id,
        email: userTable.email,
        name: userTable.name,
        role: userTable.role,
      })
      .from(userTable)
      .where(eq(userTable.email, "risek290@gmail.com"))
      .limit(1);

    if (users.length === 0) {
      console.log("❌ User not found");
      return;
    }

    const user = users[0];
    console.log("\n✅ User in database:");
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.name}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   ID: ${user.id}`);

    // Check sessions for this user
    const sessions = await db
      .select()
      .from(sessionTable)
      .where(eq(sessionTable.userId, user.id));

    console.log(`\n📊 Active sessions: ${sessions.length}`);
    
    if (sessions.length > 0) {
      console.log("\nSession details:");
      sessions.forEach((session, index) => {
        console.log(`\nSession ${index + 1}:`);
        console.log(`   Token: ${session.token.substring(0, 20)}...`);
        console.log(`   Expires: ${session.expiresAt}`);
      });
    }

    console.log("\n✅ Next steps:");
    console.log("1. Go to http://localhost:3000");
    console.log("2. Login with: risek290@gmail.com");
    console.log("3. The Header will now fetch your role from /api/user/profile");
    console.log("4. Look for 'Owner Dashboard' link in the navigation");
    console.log("5. You should be able to access /owner/dashboard");

  } catch (error) {
    console.error("❌ Error:", error);
  }
}

testSession();
