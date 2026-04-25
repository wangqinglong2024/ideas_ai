import { describe, expect, it } from 'vitest';

import { runWorkerOnce } from './index';

describe('worker', () => {
  it('processes the demo queue path', async () => {
    await expect(runWorkerOnce()).resolves.toBe(1);
  });
});
