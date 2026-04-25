import { describe, expect, it } from 'vitest';

import { translate } from './index';

describe('translate', () => {
  it('falls back to the key when a message is missing', () => {
    expect(translate('zh-CN', 'missing')).toBe('missing');
  });
});
