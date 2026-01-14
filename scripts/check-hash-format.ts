import { db } from "../src/db";
import { account } from "../src/db/schema";

async function main() {
  const accounts = await db.select().from(account).limit(5);
  accounts.forEach(a => {
    console.log("Email:", a.accountId, "Hash start:", a.password?.substring(0, 10));
  });
}

main().catch(console.error);
