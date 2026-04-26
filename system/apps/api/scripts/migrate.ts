/* eslint-disable no-console */
/**
 * Idempotent migration runner.
 * 1) Ensure schema `zhiyu` exists.
 * 2) Apply ordered SQL files under ./drizzle/migrations/*.sql, tracking applied
 *    versions inside zhiyu._meta to keep things idempotent without drizzle-kit
 *    metadata at runtime.
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import postgres from 'postgres';
import { loadEnv } from '@zhiyu/config';

const env = loadEnv();
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MIGRATIONS_DIR = path.resolve(__dirname, '../drizzle/migrations');

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1 });
  try {
    await sql`CREATE SCHEMA IF NOT EXISTS zhiyu`;
    await sql`
      CREATE TABLE IF NOT EXISTS zhiyu._meta (
        id          serial PRIMARY KEY,
        version     text NOT NULL UNIQUE,
        applied_at  timestamptz NOT NULL DEFAULT now()
      )
    `;
    const files = (await readdir(MIGRATIONS_DIR))
      .filter((f) => f.endsWith('.sql'))
      .sort();
    const applied = new Set<string>(
      (await sql<{ version: string }[]>`SELECT version FROM zhiyu._meta`).map((r) => r.version),
    );
    for (const file of files) {
      const version = file.replace(/\.sql$/, '');
      if (applied.has(version)) {
        console.info(`[migrate] skip ${version} (already applied)`);
        continue;
      }
      const body = await readFile(path.join(MIGRATIONS_DIR, file), 'utf8');
      console.info(`[migrate] applying ${version}`);
      await sql.begin(async (tx) => {
        await tx.unsafe(body);
        await tx`INSERT INTO zhiyu._meta (version) VALUES (${version}) ON CONFLICT DO NOTHING`;
      });
    }
    console.info('[migrate] done');
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('[migrate] failed', err);
  process.exit(1);
});
