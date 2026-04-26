import { sql } from 'drizzle-orm';
import { db } from './db.js';
import { redis } from './redis.js';
import { loadEnv } from '@zhiyu/config';

const env = loadEnv();

export interface ReadinessResult {
  ok: boolean;
  checks: Record<string, { ok: boolean; latency_ms: number; error?: string }>;
}

export async function runReadiness(): Promise<ReadinessResult> {
  const checks: ReadinessResult['checks'] = {};

  checks.db = await measure(async () => {
    await db.execute(sql`select 1`);
  });

  checks.redis = await measure(async () => {
    const pong = await redis.ping();
    if (pong !== 'PONG') throw new Error(`unexpected redis reply: ${pong}`);
  });

  checks.supabase_kong = await measure(async () => {
    const url = `${env.SUPABASE_URL.replace(/\/$/, '')}/`;
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), 3000);
    try {
      const res = await fetch(url, { signal: ctrl.signal });
      // kong root may return 401/404 with no auth; we only care it's reachable
      if (res.status >= 500) throw new Error(`status ${res.status}`);
    } finally {
      clearTimeout(timer);
    }
  });

  const ok = Object.values(checks).every((c) => c.ok);
  return { ok, checks };
}

async function measure(fn: () => Promise<void>) {
  const start = Date.now();
  try {
    await fn();
    return { ok: true, latency_ms: Date.now() - start };
  } catch (err) {
    return { ok: false, latency_ms: Date.now() - start, error: (err as Error).message };
  }
}
