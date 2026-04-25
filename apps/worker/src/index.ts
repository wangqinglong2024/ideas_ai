import { pathToFileURL } from 'node:url';

import { loadConfig } from '@zhiyu/config';
import { createJobQueue } from '@zhiyu/jobs';
import { createLogger } from '@zhiyu/observability';

export async function runWorkerOnce(): Promise<number> {
  const config = loadConfig();
  const logger = createLogger('worker');
  const queue = createJobQueue(config);

  await queue.enqueue('foundation.demo', { source: 'worker' });
  const jobs = await queue.drain();
  logger.info('worker drained jobs', { count: jobs.length, mode: queue.mode });
  return jobs.length;
}

const isDirectRun = process.argv[1]
  ? pathToFileURL(process.argv[1]).href === import.meta.url
  : false;

if (isDirectRun) {
  await runWorkerOnce();
}
