import postgres from 'postgres';
import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { sql } from 'drizzle-orm';
import { loadEnv } from '@zhiyu/config';
import * as schema from '@zhiyu/db';

const env = loadEnv();

const queryClient = postgres(env.DATABASE_URL, {
  max: 10,
  idle_timeout: 30,
  connection: { search_path: 'zhiyu' },
});

export const db: PostgresJsDatabase<typeof schema> = drizzle(queryClient, { schema });
export { sql };
export const rawClient = queryClient;
