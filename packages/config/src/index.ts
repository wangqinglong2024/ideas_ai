import type { AppEnvironment } from '@zhiyu/types';

export interface AppConfig {
  appEnv: AppEnvironment;
  nodeEnv: string;
  port: number;
  publicAppName: string;
  supabaseUrl: string;
  supabaseServiceRoleKey: string;
  redisUrl: string;
  analyticsMode: 'local' | 'disabled';
  observabilityMode: 'local' | 'disabled';
  missingSecrets: string[];
}

export type EnvSource = Record<string, string | undefined>;

const allowedAppEnvironments = new Set<AppEnvironment>([
  'local',
  'test',
  'docker',
  'staging',
  'production',
]);

function readNumber(value: string | undefined, fallback: number): number {
  if (!value) return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function readAppEnvironment(value: string | undefined): AppEnvironment {
  if (value && allowedAppEnvironments.has(value as AppEnvironment)) {
    return value as AppEnvironment;
  }
  return 'local';
}

function readMode(value: string | undefined): 'local' | 'disabled' {
  return value === 'disabled' ? 'disabled' : 'local';
}

function readSecret(
  source: EnvSource,
  key: string,
  fallback: string,
  missingSecrets: string[],
): string {
  const value = source[key];
  if (value && value.trim().length > 0) return value;
  missingSecrets.push(key);
  return fallback;
}

export function loadConfig(source: EnvSource = process.env): AppConfig {
  const missingSecrets: string[] = [];

  return {
    appEnv: readAppEnvironment(source.APP_ENV),
    nodeEnv: source.NODE_ENV ?? 'development',
    port: readNumber(source.PORT, 3000),
    publicAppName: source.PUBLIC_APP_NAME ?? 'Zhiyu',
    supabaseUrl: readSecret(source, 'SUPABASE_URL', 'mock://supabase', missingSecrets),
    supabaseServiceRoleKey: readSecret(
      source,
      'SUPABASE_SERVICE_ROLE_KEY',
      'mock-service-role-key',
      missingSecrets,
    ),
    redisUrl: readSecret(source, 'REDIS_URL', 'mock://redis', missingSecrets),
    analyticsMode: readMode(source.ANALYTICS_MODE),
    observabilityMode: readMode(source.OBSERVABILITY_MODE),
    missingSecrets,
  };
}

export function isMockUrl(value: string): boolean {
  return value.startsWith('mock://');
}
