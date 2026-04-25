import { describe, expect, it } from 'vitest';

import { loadConfig } from '@zhiyu/config';

import { createJobQueue } from './index';

describe('job queue', () => {
  it('enqueues and drains mock jobs', async () => {
    const queue = createJobQueue(loadConfig({ APP_ENV: 'test' }));
    await queue.enqueue('demo', { ok: true });

    await expect(queue.drain()).resolves.toHaveLength(1);
  });
});
