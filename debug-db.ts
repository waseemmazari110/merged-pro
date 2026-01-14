
import { db } from "./src/db";
import { user, properties } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "danharley2006@yahoo.co.uk";
  console.log(`Checking user: ${email}`);
  
  const foundUsers = await db.select().from(user).where(eq(user.email, email));
  console.log("Found Users:", JSON.stringify(foundUsers, null, 2));

  if (foundUsers.length > 0) {
    const foundProperties = await db.select().from(properties).where(eq(properties.ownerId, foundUsers[0].id));
    console.log("Found Properties:", JSON.stringify(foundProperties, null, 2));
  }
}

main().catch(console.error);
