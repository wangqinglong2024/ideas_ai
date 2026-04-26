import client from 'prom-client';

client.collectDefaultMetrics({ prefix: 'zhiyu_' });

export const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'HTTP request duration (seconds) by route/method/status',
  labelNames: ['method', 'route', 'status'] as const,
  buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5],
});

export const queueJobsTotal = new client.Counter({
  name: 'queue_jobs_total',
  help: 'Total queue jobs processed by name/result',
  labelNames: ['queue', 'result'] as const,
});

export const registry = client.register;
