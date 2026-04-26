import Fastify from 'fastify';
import { nanoid } from 'nanoid';
import { loadEnv, deriveAdapterFlags } from '@zhiyu/config';
import { logger } from './logger.js';
import { httpRequestDuration } from './metrics.js';
import { registerRoutes } from './routes.js';
import { db } from './db.js';
import { errorEvents } from '@zhiyu/db';

const env = loadEnv();
const adapterFlags = deriveAdapterFlags(env);
for (const [name, mode] of Object.entries(adapterFlags)) {
  if (mode === 'fake') {
    // eslint-disable-next-line no-console
    console.warn(`[zhiyu/adapter] ${name} -> fake (no API key configured)`);
  }
}

async function main(): Promise<void> {
  const app = Fastify({
    logger: logger as unknown as boolean,
    genReqId: (req) => (req.headers['x-request-id'] as string | undefined) ?? nanoid(),
    disableRequestLogging: false,
    trustProxy: true,
  });

  app.addHook('onRequest', async (req, reply) => {
    reply.header('x-request-id', req.id);
    (req as unknown as { _start: number })._start = process.hrtime.bigint
      ? Number(process.hrtime.bigint() / 1_000_000n)
      : Date.now();
  });

  app.addHook('onResponse', async (req, reply) => {
    const start = (req as unknown as { _start: number })._start;
    const ms = Math.max(0, Date.now() - start);
    httpRequestDuration
      .labels(req.method, req.routerPath ?? req.url, String(reply.statusCode))
      .observe(ms / 1000);
  });

  app.setErrorHandler(async (err, req, reply) => {
    req.log.error({ err }, 'unhandled_error');
    try {
      await db.insert(errorEvents).values({
        env: env.APP_ENV,
        service: env.SERVICE_NAME,
        version: env.GIT_SHA ?? '0.1.0',
        level: 'error',
        fingerprint: err.name,
        message: err.message,
        stack: err.stack ?? null,
        context: JSON.stringify({ request_id: req.id, path: req.url, method: req.method }),
      });
    } catch (logErr) {
      req.log.warn({ logErr }, 'failed_to_persist_error_event');
    }
    if (!reply.sent) {
      reply.code(500).send({ error: 'internal_error', request_id: req.id });
    }
  });

  await registerRoutes(app as unknown as Parameters<typeof registerRoutes>[0]);

  const port = env.PORT;
  await app.listen({ host: '0.0.0.0', port });
  logger.info({ port }, 'zhiyu-app-be listening');

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
