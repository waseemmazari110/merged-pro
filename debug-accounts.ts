
import { db } from "./src/db";
import { account, user } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
    try {
        const accounts = await db.select({
            id: account.id,
            userId: account.userId,
            email: user.email,
            password: account.password,
            providerId: account.providerId
        })
        .from(account)
        .leftJoin(user, eq(account.userId, user.id));

        console.log("Accounts in database:");
        accounts.forEach(a => {
            console.log(`- ID: ${a.id}, User: ${a.email}, Provider: ${a.providerId}, Password Hash: ${a.password?.substring(0, 32)}...`);
        });
    } catch (error) {
        console.error("Error fetching accounts:", error);
    }
}

main();
