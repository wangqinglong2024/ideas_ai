import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

describe('ink porcelain tokens', () => {
  it('defines required brand tokens without old palette names', () => {
    const css = readFileSync(new URL('../src/styles/tokens.css', import.meta.url), 'utf8');
    for (const token of ['--surface-paper', '--text-ink', '--brand-cinnabar', '--brand-jade', '--brand-celadon']) {
      expect(css).toContain(token);
    }
    expect(css).not.toMatch(/rose|sky|amber/i);
  });
});