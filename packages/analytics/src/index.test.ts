import { describe, expect, it } from 'vitest';

import { createAnalyticsStore } from './index';

describe('analytics store', () => {
  it('tracks local events', () => {
    const store = createAnalyticsStore();
    store.track({ name: 'app_opened', properties: { surface: 'app' } });

    expect(store.all()[0]?.name).toBe('app_opened');
  });
});
