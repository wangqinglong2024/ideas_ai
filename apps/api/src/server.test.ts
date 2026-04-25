import type { AddressInfo } from 'node:net';

import { afterEach, describe, expect, it } from 'vitest';

import { createApiServer } from './server';

const servers: ReturnType<typeof createApiServer>[] = [];

async function startTestServer(): Promise<string> {
  const server = createApiServer();
  servers.push(server);
  await new Promise<void>((resolve) => server.listen(0, resolve));
  const address = server.address() as AddressInfo;
  return `http://127.0.0.1:${address.port}`;
}

afterEach(async () => {
  await Promise.all(
    servers.splice(0).map((server) => new Promise((resolve) => server.close(resolve))),
  );
});

describe('api server', () => {
  it('returns health and readiness payloads', async () => {
    const baseUrl = await startTestServer();

    await expect(
      fetch(`${baseUrl}/health`).then((response) => response.json()),
    ).resolves.toMatchObject({
      service: 'api',
      status: 'ok',
    });
    await expect(
      fetch(`${baseUrl}/ready`).then((response) => response.json()),
    ).resolves.toMatchObject({
      ok: true,
    });
  });

  it('accepts analytics events locally', async () => {
    const baseUrl = await startTestServer();
    const response = await fetch(`${baseUrl}/v1/events`, {
      method: 'POST',
      body: JSON.stringify({ name: 'test_event' }),
    });

    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toMatchObject({ accepted: true });
  });

  it('returns a local event id for malformed requests', async () => {
    const baseUrl = await startTestServer();
    const response = await fetch(`${baseUrl}/v1/events`, {
      method: 'POST',
      body: '{',
    });

    expect(response.status).toBe(500);
    await expect(response.json()).resolves.toMatchObject({
      error: 'internal_error',
      eventId: expect.stringMatching(/^local-/),
    });
  });
});
