import { db } from "./src/db";
import { account } from "./src/db/schema";
import { eq } from "drizzle-orm";

(async () => {
  console.log("\n=== Checking password hashes in database ===\n");

  const accounts = await db
    .select()
    .from(account)
    .where(eq(account.providerId, "credential"))
    .limit(5);

  accounts.forEach((acc) => {
    console.log(`Account: ${acc.accountId}`);
    console.log(`  ID: ${acc.id}`);
    console.log(`  Password Hash: ${acc.password}`);
    console.log(`  Hash Length: ${acc.password?.length || 0}`);
    console.log(`  Hash Prefix: ${acc.password?.substring(0, 7) || "N/A"}`);
    console.log(`  Created: ${acc.createdAt}`);
    console.log("");
  });
})();
