import { createWorkerRuntime } from '@zhiyu/backend';

const runtime = createWorkerRuntime();
const result = await runtime.smoke();
console.log(JSON.stringify({ service: 'worker', status: 'ready', queues: runtime.queues, result }, null, 2));

setInterval(() => {
  console.log(JSON.stringify({ service: 'worker', status: 'heartbeat', queues: runtime.queues, ts: new Date().toISOString() }));
}, 60_000);