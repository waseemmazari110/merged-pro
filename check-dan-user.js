const Database = require('better-sqlite3');
const db = new Database('./database.db', { readonly: true });

console.log("=== Checking user table schema ===");
const schema = db.prepare("PRAGMA table_info(user)").all();
console.log("User table columns:", JSON.stringify(schema, null, 2));

console.log("\n=== Searching for Dan's user ===");
const users = db.prepare("SELECT * FROM user WHERE email LIKE ?").all('%yahoo%');
console.log("Users with yahoo email:", JSON.stringify(users, null, 2));

console.log("\n=== All users (first 10) ===");
const allUsers = db.prepare("SELECT * FROM user LIMIT 10").all();
console.log(JSON.stringify(allUsers, null, 2));

db.close();
