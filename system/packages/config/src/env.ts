/**
 * Zhiyu env loader (Zod-validated).
 *
 * Required keys → throw + process.exit(1).
 * Optional keys → undefined; consumers should fall back to mock adapters and WARN once.
 */
import { z } from 'zod';

const REQUIRED_SCHEMA = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  APP_ENV: z.string().default('dev'),
  PORT: z.coerce.number().int().positive().default(8080),
  SERVICE_NAME: z.string().default('zhiyu-app-be'),

  POSTGRES_PASSWORD: z.string().min(1, 'POSTGRES_PASSWORD is required'),
  DATABASE_URL: z.string().url('DATABASE_URL must be a valid postgres URL'),

  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_ANON_KEY: z.string().min(20, 'SUPABASE_ANON_KEY is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20, 'SUPABASE_SERVICE_ROLE_KEY is required'),
  JWT_SECRET: z.string().min(16, 'JWT_SECRET is required (>=16 chars)'),

  REDIS_URL: z.string().min(1, 'REDIS_URL is required'),
});

const OPTIONAL_SCHEMA = z.object({
  RESEND_API_KEY: z.string().optional(),
  ONESIGNAL_KEY: z.string().optional(),
  PADDLE_KEY: z.string().optional(),
  TURNSTILE_SECRET: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  DEEPSEEK_API_KEY: z.string().optional(),
  TAVILY_API_KEY: z.string().optional(),
  ALLOW_METRICS: z
    .enum(['true', 'false'])
    .optional()
    .transform((v) => v === 'true'),
  GIT_SHA: z.string().optional(),
});

const FULL_SCHEMA = REQUIRED_SCHEMA.merge(OPTIONAL_SCHEMA);

export type AppEnv = z.infer<typeof FULL_SCHEMA>;

let cached: AppEnv | undefined;

export function loadEnv(source: NodeJS.ProcessEnv = process.env): AppEnv {
  if (cached) return cached;
  const parsed = FULL_SCHEMA.safeParse(source);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((i) => `  - ${i.path.join('.')}: ${i.message}`).join('\n');
    // eslint-disable-next-line no-console
    console.error(`[zhiyu/config] Environment validation failed:\n${issues}`);
    // Make sure this never gets swallowed in serverless contexts.
    throw new Error('Invalid environment configuration');
  }
  cached = parsed.data;
  return cached;
}

/** Reset cache; tests only. */
export function __resetEnvForTests(): void {
  cached = undefined;
}
