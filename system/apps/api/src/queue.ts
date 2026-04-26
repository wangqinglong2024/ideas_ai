import { Queue } from 'bullmq';
import { redis } from './redis.js';

export const NOOP_QUEUE_NAME = 'noop';
export const noopQueue = new Queue(NOOP_QUEUE_NAME, { connection: redis });

export interface NoopJobData {
  origin: string;
  ts: number;
}
