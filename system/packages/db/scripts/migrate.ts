import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import postgres from 'postgres';

const databaseUrl = process.env.DATABASE_URL;
const allowFake = process.env.ALLOW_FAKE_DATABASE === 'true';

if (!databaseUrl) {
  if (allowFake) {
    console.warn('[db:migrate] DATABASE_URL missing, fake database mode active.');
    process.exit(0);
  }
  throw new Error('DATABASE_URL is required');
}

const sql = postgres(databaseUrl, { max: 1 });

try {
  const migration = await readFile(join(process.cwd(), 'migrations/0001_foundation_user_admin.sql'), 'utf8');
  await sql.unsafe(migration);
  console.log(JSON.stringify({ status: 'ok', migration: '0001_foundation_user_admin' }));
} catch (error) {
  throw error;
} finally {
  await sql.end({ timeout: 1 });
}