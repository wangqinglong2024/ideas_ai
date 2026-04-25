import { describe, expect, it } from 'vitest';

import { formatBrandBadge, noop } from './index';

describe('ui primitives', () => {
  it('formats a stable brand badge', () => {
    expect(formatBrandBadge({ productName: 'Zhiyu', environment: 'docker' })).toBe(
      'Zhiyu / docker',
    );
  });

  it('keeps noop callable for cross-package import checks', () => {
    expect(noop()).toBeUndefined();
  });
});
