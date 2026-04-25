import { isMockUrl, type AppConfig } from '@zhiyu/config';
import type { QueueJob, ReadinessResult } from '@zhiyu/types';

export interface JobQueue {
  mode: 'real' | 'mock';
  enqueue<TPayload extends Record<string, unknown>>(
    name: string,
    payload: TPayload,
  ): Promise<QueueJob<TPayload>>;
  drain(): Promise<QueueJob[]>;
  ready(): Promise<ReadinessResult>;
}

export function createJobQueue(config: AppConfig, seed: QueueJob[] = []): JobQueue {
  const jobs = [...seed];
  const mode = isMockUrl(config.redisUrl) ? 'mock' : 'real';

  return {
    mode,
    async enqueue(name, payload) {
      const job = {
        id: `${name}-${jobs.length + 1}`,
        name,
        payload,
        createdAt: new Date().toISOString(),
      };
      jobs.push(job);
      return job;
    },
    async drain() {
      const drained = [...jobs];
      jobs.length = 0;
      return drained;
    },
    async ready() {
      return {
        name: 'queue',
        ok: true,
        mode,
        message: mode === 'mock' ? 'mock queue adapter active' : 'redis url configured',
      };
    },
  };
}
