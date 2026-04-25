import { describe, expect, it } from 'vitest';

import { isMockUrl, loadConfig } from './index';

describe('loadConfig', () => {
  it('uses mock defaults when secrets are missing', () => {
    const config = loadConfig({ APP_ENV: 'test' });

    expect(config.appEnv).toBe('test');
    expect(config.supabaseUrl).toBe('mock://supabase');
    expect(config.redisUrl).toBe('mock://redis');
    expect(config.missingSecrets).toContain('SUPABASE_URL');
  });

  it('detects mock urls', () => {
    expect(isMockUrl('mock://redis')).toBe(true);
    expect(isMockUrl('redis://redis:6379')).toBe(false);
  });
});
