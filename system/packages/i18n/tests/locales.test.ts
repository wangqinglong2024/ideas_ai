import { describe, expect, it } from 'vitest';
import { locales, messages } from '../src/index';

describe('i18n coverage', () => {
  it('keeps common keys in all four languages', () => {
    const keys = Object.keys(messages.en);
    for (const locale of locales) expect(Object.keys(messages[locale]).sort()).toEqual(keys.sort());
  });
});