import { db } from "../src/db";
import { account } from "../src/db/schema";
import { desc } from "drizzle-orm";

async function main() {
  const latest = await db.select().from(account).orderBy(desc(account.createdAt)).limit(1);
  if (latest[0]) {
    console.log("Latest Hash:", latest[0].password);
  }
}

main().catch(console.error);
