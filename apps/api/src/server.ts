import http, { type IncomingMessage, type ServerResponse } from 'node:http';
import { pathToFileURL } from 'node:url';

import { createAnalyticsStore } from '@zhiyu/analytics';
import { loadConfig } from '@zhiyu/config';
import { createDatabaseClient } from '@zhiyu/db';
import { createJobQueue } from '@zhiyu/jobs';
import { captureError, createLogger } from '@zhiyu/observability';
import type { ServiceHealth } from '@zhiyu/types';

const config = loadConfig();
const logger = createLogger('api');
const analytics = createAnalyticsStore();
const database = createDatabaseClient(config);
const queue = createJobQueue(config);

function sendJson(response: ServerResponse, statusCode: number, payload: unknown): void {
  response.writeHead(statusCode, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(payload));
}

async function readJson(request: IncomingMessage): Promise<Record<string, unknown>> {
  const chunks: Buffer[] = [];
  for await (const chunk of request) {
    chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
  }
  if (chunks.length === 0) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8')) as Record<string, unknown>;
}

function healthPayload(): ServiceHealth {
  return {
    service: 'api',
    status: 'ok',
    checkedAt: new Date().toISOString(),
    details: {
      appEnv: config.appEnv,
      missingSecrets: config.missingSecrets.length,
    },
  };
}

export function createApiServer() {
  return http.createServer(async (request, response) => {
    try {
      const requestUrl = new URL(request.url ?? '/', 'http://localhost');

      if (request.method === 'GET' && requestUrl.pathname === '/') {
        sendJson(response, 200, { ok: true, service: 'zhiyu-api' });
        return;
      }

      if (request.method === 'GET' && requestUrl.pathname === '/health') {
        sendJson(response, 200, healthPayload());
        return;
      }

      if (request.method === 'GET' && requestUrl.pathname === '/ready') {
        const checks = [await database.ready(), await queue.ready()];
        sendJson(response, 200, {
          ok: checks.every((check) => check.ok),
          checks,
          missingSecrets: config.missingSecrets,
        });
        return;
      }

      if (request.method === 'GET' && requestUrl.pathname === '/v1/config') {
        sendJson(response, 200, {
          appName: config.publicAppName,
          appEnv: config.appEnv,
          analyticsMode: config.analyticsMode,
          observabilityMode: config.observabilityMode,
        });
        return;
      }

      if (request.method === 'POST' && requestUrl.pathname === '/v1/events') {
        const body = await readJson(request);
        const userId = typeof body.userId === 'string' ? body.userId : undefined;
        const event = analytics.track({
          name: String(body.name ?? 'unknown'),
          properties: { source: 'api', accepted: true },
          ...(userId === undefined ? {} : { userId }),
        });
        sendJson(response, 202, { accepted: true, event });
        return;
      }

      sendJson(response, 404, { error: 'not_found' });
    } catch (error) {
      const eventId = captureError(logger, error, { route: request.url });
      sendJson(response, 500, { error: 'internal_error', eventId });
    }
  });
}

export async function startApiServer(port = config.port): Promise<void> {
  const server = createApiServer();
  await new Promise<void>((resolve) => {
    server.listen(port, () => resolve());
  });
  logger.info('api started', { port });
}

const isDirectRun = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isDirectRun) {
  await startApiServer();
}
