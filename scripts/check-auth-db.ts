import { db } from "../src/db";
import { account, user } from "../src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const users = await db.select().from(user).limit(5);
  console.log("Users:", users);
  
  const accounts = await db.select().from(account).limit(5);
  console.log("Accounts:", accounts.map(a => ({ ...a, password: a.password ? "EXISTS" : "MISSING" })));
}

main().catch(console.error);
