import { describe, expect, it } from 'vitest';

import { captureError, createLogger } from './index';

describe('observability', () => {
  it('stores local log records', () => {
    const logger = createLogger('test');
    logger.info('hello');

    expect(logger.records()).toHaveLength(1);
    expect(logger.records()[0]?.service).toBe('test');
  });

  it('captures errors without external services', () => {
    const logger = createLogger('test');
    const eventId = captureError(logger, new Error('boom'));

    expect(eventId).toMatch(/^local-/);
    expect(logger.records()[0]?.level).toBe('error');
  });
});
