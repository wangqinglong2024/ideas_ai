export type AppEnvironment = 'local' | 'test' | 'docker' | 'staging' | 'production';

export interface ServiceHealth {
  service: string;
  status: 'ok' | 'degraded' | 'down';
  checkedAt: string;
  details?: Record<string, string | number | boolean>;
}

export interface ReadinessResult {
  name: string;
  ok: boolean;
  mode: 'real' | 'mock';
  message: string;
}

export interface AnalyticsEvent {
  name: string;
  userId?: string;
  properties: Record<string, string | number | boolean | null>;
  createdAt: string;
}

export interface QueueJob<TPayload extends Record<string, unknown> = Record<string, unknown>> {
  id: string;
  name: string;
  payload: TPayload;
  createdAt: string;
}
