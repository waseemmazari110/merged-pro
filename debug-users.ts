
import { db } from "./src/db";
import { user } from "./src/db/schema";

async function main() {
    try {
        const users = await db.select().from(user);
        console.log("Users in database:");
        users.forEach(u => {
            console.log(`- ID: ${u.id}, Email: ${u.email}, Role: ${u.role}, Name: ${u.name}`);
        });
    } catch (error) {
        console.error("Error fetching users:", error);
    }
}

main();
