import Fastify from 'fastify';
import { nanoid } from 'nanoid';
import pino from 'pino';
import postgres from 'postgres';
import { Redis } from 'ioredis';
import client from 'prom-client';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/postgres-js';
import { loadEnv } from '@zhiyu/config';
import { createServerClient } from '@zhiyu/sdk';

const env = loadEnv();
const startedAt = Date.now();
const VERSION = env.GIT_SHA ?? '0.1.0';

const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: { service: env.SERVICE_NAME, env: env.APP_ENV, version: VERSION },
  timestamp: pino.stdTimeFunctions.isoTime,
  redact: { paths: ['req.headers.authorization', 'req.headers.cookie'], censor: '***' },
});

const queryClient = postgres(env.DATABASE_URL, { max: 5, connection: { search_path: 'zhiyu' } });
const db = drizzle(queryClient);
const redis = new Redis(env.REDIS_URL, { maxRetriesPerRequest: null, enableReadyCheck: true });
client.collectDefaultMetrics({ prefix: 'zhiyu_admin_' });

async function main(): Promise<void> {
  const app = Fastify({
    logger: logger as unknown as boolean,
    genReqId: (req) => (req.headers['x-request-id'] as string | undefined) ?? nanoid(),
    trustProxy: true,
  });

  app.addHook('onRequest', async (_req, reply) => {
    reply.header('x-service', 'zhiyu-admin-be');
  });

  app.get('/health', async () => ({
    status: 'ok',
    service: env.SERVICE_NAME,
    version: VERSION,
    uptime_seconds: Math.round((Date.now() - startedAt) / 1000),
  }));

  app.get('/ready', async (_req, reply) => {
    const checks: Record<string, { ok: boolean; latency_ms: number; error?: string }> = {};
    const t = (name: string, fn: () => Promise<void>) =>
      fn()
        .then(() => (checks[name] = { ok: true, latency_ms: 0 }))
        .catch((e) => (checks[name] = { ok: false, latency_ms: 0, error: (e as Error).message }));
    await Promise.all([
      t('db', async () => {
        await db.execute(sql`select 1`);
      }),
      t('redis', async () => {
        const pong = await redis.ping();
        if (pong !== 'PONG') throw new Error('bad redis');
      }),
      t('supabase_kong', async () => {
        const res = await fetch(`${env.SUPABASE_URL.replace(/\/$/, '')}/`);
        if (res.status >= 500) throw new Error(`status ${res.status}`);
      }),
    ]);
    const ok = Object.values(checks).every((c) => c.ok);
    reply.code(ok ? 200 : 503);
    return { ok, checks };
  });

  app.get('/metrics', async (req, reply) => {
    const ip = req.ip;
    if (!(env.ALLOW_METRICS === true) && !ip.startsWith('10.') && !ip.startsWith('172.') && !ip.startsWith('127.') && ip !== '::1') {
      reply.code(403);
      return { error: 'metrics endpoint restricted' };
    }
    reply.header('content-type', client.register.contentType);
    return client.register.metrics();
  });

  app.get('/api/v1/_ping', async () => ({ ok: true, ts: Date.now(), service: env.SERVICE_NAME }));

  app.get('/api/v1/_admin/users-count', async () => {
    const supa = createServerClient({ url: env.SUPABASE_URL, serviceRoleKey: env.SUPABASE_SERVICE_ROLE_KEY });
    const res = await supa.auth.admin.listUsers({ page: 1, perPage: 1 });
    return { ok: !res.error, users: res.data?.users?.length ?? 0 };
  });

  await app.listen({ host: '0.0.0.0', port: env.PORT });
  logger.info({ port: env.PORT }, 'zhiyu-admin-be listening');

  const stop = async (sig: string) => {
    logger.info({ sig }, 'shutting_down');
    await app.close();
    process.exit(0);
  };
  process.on('SIGINT', () => void stop('SIGINT'));
  process.on('SIGTERM', () => void stop('SIGTERM'));
}

main().catch((err) => {
  logger.error({ err }, 'fatal_boot_error');
  process.exit(1);
});
