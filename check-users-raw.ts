
import { createClient } from "@libsql/client";

const client = createClient({
    url: process.env.TURSO_CONNECTION_URL!,
    authToken: process.env.TURSO_AUTH_TOKEN!,
});

async function main() {
    const rs = await client.execute("SELECT account_id, password FROM account WHERE provider_id = 'email'");
    console.log(JSON.stringify(rs.rows, null, 2));
}

main().catch(console.error);
