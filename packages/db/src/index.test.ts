import { describe, expect, it } from 'vitest';

import { loadConfig } from '@zhiyu/config';

import { createDatabaseClient } from './index';

describe('database client', () => {
  it('uses mock mode without credentials', async () => {
    const client = createDatabaseClient(loadConfig({ APP_ENV: 'test' }));

    await expect(client.ready()).resolves.toMatchObject({ ok: true, mode: 'mock' });
  });
});
