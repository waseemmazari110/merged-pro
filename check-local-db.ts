import { createClient } from '@libsql/client';

const client = createClient({
  url: 'file:database.db',
});

async function main() {
  try {
    const res = await client.execute("SELECT name FROM sqlite_master WHERE type='table';");
    console.log('Tables in local database.db:', res.rows.map(r => r.name));
  } catch (e) {
    console.error('Error:', e);
  } finally {
    client.close();
  }
}

main();
