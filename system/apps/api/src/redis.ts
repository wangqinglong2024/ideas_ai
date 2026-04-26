import { Redis, type RedisOptions } from 'ioredis';
import { loadEnv } from '@zhiyu/config';

const env = loadEnv();

const opts: RedisOptions = { maxRetriesPerRequest: null, enableReadyCheck: true };
export const redis = new Redis(env.REDIS_URL, opts);
