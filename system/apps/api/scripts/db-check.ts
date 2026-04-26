/* eslint-disable no-console */
/**
 * Quick connectivity check used by `pnpm db:check` and ZY-01-05 verification.
 */
import postgres from 'postgres';
import { createServerClient } from '@zhiyu/sdk';
import { loadEnv } from '@zhiyu/config';

const env = loadEnv();

async function main(): Promise<void> {
  const sql = postgres(env.DATABASE_URL, { max: 1 });
  try {
    const schemaRows = await sql<{ schema: string }[]>`SELECT current_schema() AS schema`;
    const schema = schemaRows[0]?.schema ?? 'unknown';
    const countRows = await sql<{ count: number }[]>`SELECT count(*)::int AS count FROM zhiyu._meta`;
    const count = countRows[0]?.count ?? 0;
    console.info(JSON.stringify({ schema, _meta_rows: count }, null, 2));

    const supa = createServerClient({ url: env.SUPABASE_URL, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY });
    const res = await supa.auth.admin.listUsers({ page: 1, perPage: 1 });
    console.info(JSON.stringify({ supabase_kong_ok: !res.error, auth_users: res.data?.users?.length ?? null }, null, 2));
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((err) => {
  console.error('[db:check] failed', err);
  process.exit(1);
});
