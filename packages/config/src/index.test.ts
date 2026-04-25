import { describe, expect, it } from 'vitest';

import { isMockUrl, loadConfig } from './index';

describe('loadConfig', () => {
  it('uses mock defaults when secrets are missing', () => {
    const config = loadConfig({ APP_ENV: 'test' });

    expect(config.appEnv).toBe('test');
    expect(config.databaseUrl).toBe('mock://database');
    expect(config.redisUrl).toBe('mock://redis');
    expect(config.missingSecrets).toContain('DATABASE_URL');
  });

  it('detects mock urls', () => {
    expect(isMockUrl('mock://redis')).toBe(true);
    expect(isMockUrl('redis://redis:6379')).toBe(false);
  });
});
