import type { AnalyticsEvent } from '@zhiyu/types';

export interface AnalyticsStore {
  track(event: Omit<AnalyticsEvent, 'createdAt'>): AnalyticsEvent;
  identify(userId: string, properties?: Record<string, string | number | boolean>): AnalyticsEvent;
  all(): AnalyticsEvent[];
}

export function createAnalyticsStore(initialEvents: AnalyticsEvent[] = []): AnalyticsStore {
  const events = [...initialEvents];

  return {
    track(event) {
      const stored: AnalyticsEvent = { ...event, createdAt: new Date().toISOString() };
      events.push(stored);
      return stored;
    },
    identify(userId, properties = {}) {
      return this.track({ name: 'identify', userId, properties });
    },
    all() {
      return [...events];
    },
  };
}
