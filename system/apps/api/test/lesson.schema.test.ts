/**
 * E08 ZY-08-01 — step payload schema unit tests.
 */
import { describe, it, expect } from 'vitest';
import { STEP_PAYLOAD_SCHEMAS, validateLessonSteps } from '@zhiyu/db';

describe('step-payloads', () => {
  it('exports a schema for every documented step type', () => {
    const expected = ['intro', 'word', 'sentence', 'pinyin', 'listen', 'speak', 'read', 'write', 'practice', 'quiz', 'p1', 'p2', 'p3'];
    for (const k of expected) {
      expect(STEP_PAYLOAD_SCHEMAS).toHaveProperty(k);
    }
  });

  it('intro schema accepts minimal i18n body', () => {
    const r = STEP_PAYLOAD_SCHEMAS.intro.safeParse({ body: { en: 'hi', zh: '你好' } });
    expect(r.success).toBe(true);
  });

  it('word schema requires words array', () => {
    expect(STEP_PAYLOAD_SCHEMAS.word.safeParse({}).success).toBe(false);
    const ok = STEP_PAYLOAD_SCHEMAS.word.safeParse({
      words: [{ hanzi: '你好', pinyin: 'nǐ hǎo' }],
    });
    expect(ok.success).toBe(true);
  });

  it('quiz schema requires options for each item', () => {
    const bad = STEP_PAYLOAD_SCHEMAS.quiz.safeParse({ items: [{ question_id: 'q1', options: [{ id: 'a', text: 'a' }] }] });
    expect(bad.success).toBe(false); // min 2 options
  });

  it('p3 schema accepts tone numbers 0..4', () => {
    for (const t of [0, 1, 2, 3, 4]) {
      const r = STEP_PAYLOAD_SCHEMAS.p3.safeParse({
        items: [{ question_id: 'x', pinyin_no_tone: 'ma', audio_url: '/a.mp3', correct_tone: t }],
      });
      expect(r.success).toBe(true);
    }
    const bad = STEP_PAYLOAD_SCHEMAS.p3.safeParse({
      items: [{ question_id: 'x', pinyin_no_tone: 'ma', audio_url: '/a.mp3', correct_tone: 5 }],
    });
    expect(bad.success).toBe(false);
  });

  it('validateLessonSteps shape-only passes for legacy 10-step seed', () => {
    const steps = Array.from({ length: 10 }, (_, i) => ({ type: 'intro', title: { en: `s${i}` } }));
    const r = validateLessonSteps(steps);
    expect(r.ok).toBe(true);
    expect(r.step_count).toBe(10);
  });

  it('validateLessonSteps strictPayload catches bad word payload', () => {
    const r = validateLessonSteps([{ type: 'word', payload: { words: [] } }], { strictPayload: true });
    expect(r.ok).toBe(false);
    expect(r.issues[0]?.type).toBe('word');
  });

  it('validateLessonSteps strictPayload accepts pinyin-intro p1 step', () => {
    const r = validateLessonSteps(
      [
        {
          type: 'p1',
          payload: {
            items: [
              { question_id: 'a', audio_url: '/a.mp3', correct_pinyin: 'b', options: ['b', 'p'] },
            ],
          },
        },
      ],
      { strictPayload: true },
    );
    expect(r.ok).toBe(true);
  });
});
