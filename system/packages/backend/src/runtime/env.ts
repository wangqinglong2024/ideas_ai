import { z } from 'zod';

const envSchema = z.object({
  APP_ENV: z.literal('dev').default('dev'),
  ROLE: z.string().default('app-api'),
  PORT: z.coerce.number().default(8080),
  PROJECT_NAME: z.string().default('zhiyu'),
  DATABASE_URL: z.string().optional(),
  REDIS_URL: z.string().optional(),
  SUPABASE_URL: z.string().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  JWT_SECRET: z.string().min(24).default('dev-only-change-me-please-32-characters'),
  CORS_ORIGINS: z.string().default('http://localhost:3100,http://localhost:4100,http://127.0.0.1:3100,http://127.0.0.1:4100'),
  METRICS_TOKEN: z.string().optional(),
  ALLOW_FAKE_DATABASE: z.coerce.boolean().default(true),
  ALLOW_FAKE_REDIS: z.coerce.boolean().default(true),
  LOG_LEVEL: z.string().default('info')
});

export type RuntimeEnv = z.infer<typeof envSchema>;

export function loadEnv(): RuntimeEnv {
  const env = envSchema.parse(process.env);
  const warnings: string[] = [];
  if (!env.DATABASE_URL && env.ALLOW_FAKE_DATABASE) warnings.push('DATABASE_URL missing; fake database mode enabled');
  if (!env.REDIS_URL && env.ALLOW_FAKE_REDIS) warnings.push('REDIS_URL missing; memory rate-limit/queue mode enabled');
  if (!env.SUPABASE_URL) warnings.push('SUPABASE_URL missing; Supabase adapter configuration is fixture-only');
  for (const warning of warnings) console.warn(`[env:fallback] ${warning}`);
  return env;
}