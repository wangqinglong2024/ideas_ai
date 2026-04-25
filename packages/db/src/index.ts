import { isMockUrl, type AppConfig } from '@zhiyu/config';
import type { ReadinessResult } from '@zhiyu/types';

export interface DatabaseClient {
  mode: 'real' | 'mock';
  ready(): Promise<ReadinessResult>;
  query<T>(sql: string): Promise<{ rows: T[]; sql: string }>;
}

export function createDatabaseClient(config: AppConfig): DatabaseClient {
  const mode = isMockUrl(config.supabaseUrl) ? 'mock' : 'real';

  return {
    mode,
    async ready() {
      return {
        name: 'database',
        ok: true,
        mode,
        message: mode === 'mock' ? 'mock database adapter active' : 'supabase url configured',
      };
    },
    async query<T>(sql: string) {
      return { rows: [] as T[], sql };
    },
  };
}
