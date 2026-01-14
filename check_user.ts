
import { db } from "./src/db";
import { user, account } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const users = await db.select().from(user).where(eq(user.email, "danharley2006@yahoo.co.uk"));
  console.log("User:", JSON.stringify(users, null, 2));

  if (users.length > 0) {
    const accounts = await db.select().from(account).where(eq(account.userId, users[0].id));
    console.log("Account:", JSON.stringify(accounts, null, 2));
  }
}

main().catch(console.error);
