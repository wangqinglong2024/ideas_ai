import { describe, expect, it } from 'vitest';

import { createZhiyuClient } from './index';

describe('createZhiyuClient', () => {
  it('reads service health with an injected fetcher', async () => {
    const client = createZhiyuClient({
      baseUrl: 'http://api.test/',
      fetcher: async () =>
        new Response(
          JSON.stringify({ service: 'api', status: 'ok', checkedAt: new Date(0).toISOString() }),
          { status: 200 },
        ),
    });

    await expect(client.health()).resolves.toMatchObject({ service: 'api', status: 'ok' });
  });
});
