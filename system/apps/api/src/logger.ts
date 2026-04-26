import pino from 'pino';
import { loadEnv } from '@zhiyu/config';

const env = loadEnv();

export const logger = pino({
  level: process.env.LOG_LEVEL ?? 'info',
  base: {
    service: env.SERVICE_NAME,
    env: env.APP_ENV,
    version: env.GIT_SHA ?? '0.1.0',
  },
  redact: {
    paths: [
      'req.headers.authorization',
      'req.headers.cookie',
      '*.password',
      '*.token',
      '*.secret',
      '*.card',
      '*.id_no',
    ],
    censor: '***',
  },
  timestamp: pino.stdTimeFunctions.isoTime,
});

export type Logger = typeof logger;
