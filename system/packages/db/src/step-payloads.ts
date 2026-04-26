/**
 * E08 ZY-08-01 — 10 step payload zod schemas + validateLessonSteps().
 *
 * Each lesson stores a `steps` jsonb array of length 10. Element shape:
 *   { type: StepType, title?: i18n, payload: <step-specific> }
 *
 * The runtime validators here are reused by:
 *  - admin authoring API (POST /admin/lessons)
 *  - the seed loader
 *  - the lesson learning page (FE) for shape-checking before render.
 *
 * Step taxonomy follows planning/spec — 10 base types plus 3 pinyin
 * onboarding types (P1/P2/P3) added by ZY-08-07.
 */
import { z } from 'zod';

// ---------------------------------------------------------------------------
// Base shared building blocks
// ---------------------------------------------------------------------------
const i18nMap = z.record(z.string().min(1).max(8), z.string().min(1).max(2000));

const optionSchema = z.object({
  id: z.string().min(1).max(120),
  text: z.string().min(1).max(500),
  pinyin: z.string().max(120).optional(),
  audio_url: z.string().max(500).optional(),
  is_correct: z.boolean().default(false),
});

const wordCardSchema = z.object({
  hanzi: z.string().min(1).max(60),
  pinyin: z.string().max(120).optional(),
  audio_url: z.string().max(500).optional(),
  meaning: i18nMap.optional(),
  example: z.string().max(500).optional(),
});

// ---------------------------------------------------------------------------
// 10 base step payloads
// ---------------------------------------------------------------------------
const introPayload = z.object({
  body: i18nMap,
  media_url: z.string().max(500).optional(),
  cover_url: z.string().max(500).optional(),
  duration_s: z.number().int().min(0).max(3600).optional(),
});

const wordPayload = z.object({
  words: z.array(wordCardSchema).min(1).max(50),
  pass_threshold: z.number().min(0).max(1).default(0.8),
});

const sentencePayload = z.object({
  sentences: z
    .array(
      z.object({
        hanzi: z.string().min(1).max(500),
        pinyin: z.string().max(1000).optional(),
        translation: i18nMap.optional(),
        audio_url: z.string().max(500).optional(),
      }),
    )
    .min(1)
    .max(20),
});

const pinyinPayload = z.object({
  items: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        hanzi: z.string().min(1).max(40),
        correct_pinyin: z.string().min(1).max(120),
        options: z.array(z.string().min(1).max(120)).min(2).max(8),
      }),
    )
    .min(1)
    .max(20),
});

const listenPayload = z.object({
  items: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        audio_url: z.string().max(500),
        prompt: i18nMap.optional(),
        options: z.array(optionSchema).min(2).max(6),
      }),
    )
    .min(1)
    .max(20),
});

const speakPayload = z.object({
  items: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        hanzi: z.string().min(1).max(200),
        pinyin: z.string().max(400).optional(),
        reference_audio_url: z.string().max(500).optional(),
      }),
    )
    .min(1)
    .max(10),
  // ASR is faked — clients self-rate confidence (0-1).
  asr_adapter: z.enum(['fake', 'browser', 'whisper']).default('fake'),
});

const readPayload = z.object({
  passage: z.object({
    hanzi: z.string().min(1).max(4000),
    pinyin: z.string().max(8000).optional(),
    translation: i18nMap.optional(),
  }),
  questions: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        prompt: z.string().min(1).max(500),
        options: z.array(optionSchema).min(2).max(6),
      }),
    )
    .min(1)
    .max(10),
});

const writePayload = z.object({
  characters: z
    .array(
      z.object({
        hanzi: z.string().length(1),
        // Stroke data lives in self-hosted hanzi-writer JSON, addressed by
        // hanzi only — the FE component does the lookup.
        max_strokes: z.number().int().min(1).max(40).optional(),
      }),
    )
    .min(1)
    .max(10),
});

const practicePayload = z.object({
  // Reuses one of the small games from E10. Fully optional config blob.
  game_slug: z.string().min(1).max(80),
  game_config: z.record(z.string(), z.unknown()).optional(),
  pass_score: z.number().min(0).max(1_000_000).default(0),
});

const quizPayload = z.object({
  items: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        kind: z.enum(['single', 'multi', 'order', 'match']).default('single'),
        prompt: i18nMap.optional(),
        options: z.array(optionSchema).min(2).max(8),
      }),
    )
    .min(1)
    .max(20),
  pass_threshold: z.number().min(0).max(1).default(0.7),
});

// ---------------------------------------------------------------------------
// ZY-08-07 — Pinyin onboarding step types P1/P2/P3
// ---------------------------------------------------------------------------
const p1Payload = z.object({
  // P1 audio → pinyin
  items: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        audio_url: z.string().max(500),
        correct_pinyin: z.string().min(1).max(120),
        options: z.array(z.string().min(1).max(120)).min(2).max(6),
      }),
    )
    .min(1)
    .max(20),
});

const p2Payload = z.object({
  // P2 pinyin → hanzi
  items: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        pinyin: z.string().min(1).max(120),
        correct_hanzi: z.string().min(1).max(20),
        options: z.array(z.string().min(1).max(20)).min(2).max(6),
      }),
    )
    .min(1)
    .max(20),
});

const p3Payload = z.object({
  // P3 tone judging
  items: z
    .array(
      z.object({
        question_id: z.string().min(1).max(120),
        pinyin_no_tone: z.string().min(1).max(120),
        audio_url: z.string().max(500),
        correct_tone: z.union([z.literal(1), z.literal(2), z.literal(3), z.literal(4), z.literal(0)]),
      }),
    )
    .min(1)
    .max(20),
});

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------
export const STEP_PAYLOAD_SCHEMAS = {
  intro: introPayload,
  word: wordPayload,
  sentence: sentencePayload,
  pinyin: pinyinPayload,
  listen: listenPayload,
  speak: speakPayload,
  read: readPayload,
  write: writePayload,
  practice: practicePayload,
  quiz: quizPayload,
  p1: p1Payload,
  p2: p2Payload,
  p3: p3Payload,
} as const;

export type StepKind = keyof typeof STEP_PAYLOAD_SCHEMAS;

export const stepEntrySchema = z.object({
  type: z.enum(Object.keys(STEP_PAYLOAD_SCHEMAS) as [StepKind, ...StepKind[]]),
  title: z.record(z.string().min(1).max(8), z.string().min(1).max(200)).optional(),
  data: z.record(z.string(), z.unknown()).optional(),
  payload: z.record(z.string(), z.unknown()).optional(),
  // Allow extra metadata such as legacy "data" blob from E07 seeds.
});

export const lessonStepsSchema = z.array(stepEntrySchema).min(1).max(20);

export interface ValidateOptions {
  /** When true, every entry's payload (or `data`) is checked against its type-specific schema. */
  strictPayload?: boolean;
}

export interface ValidateIssue {
  index: number;
  type?: string;
  code: string;
  message: string;
}

export interface ValidateResult {
  ok: boolean;
  issues: ValidateIssue[];
  step_count: number;
}

/**
 * Validate a `lessons.steps` jsonb blob.
 *
 * - Always validates shape (must be a 1-20 length array of {type,...}).
 * - When `strictPayload` is true, also validates each step's payload using
 *   the per-type zod schema (used by admin POST/PUT, not the runtime read).
 */
export function validateLessonSteps(input: unknown, opts: ValidateOptions = {}): ValidateResult {
  const issues: ValidateIssue[] = [];
  const parsed = lessonStepsSchema.safeParse(input);
  if (!parsed.success) {
    for (const e of parsed.error.issues) {
      issues.push({
        index: typeof e.path[0] === 'number' ? e.path[0] : -1,
        code: e.code,
        message: e.message,
      });
    }
    return { ok: false, issues, step_count: 0 };
  }
  const steps = parsed.data;
  if (opts.strictPayload) {
    steps.forEach((step, index) => {
      const schema = STEP_PAYLOAD_SCHEMAS[step.type];
      const payload = step.payload ?? step.data ?? {};
      const r = schema.safeParse(payload);
      if (!r.success) {
        for (const e of r.error.issues) {
          issues.push({
            index,
            type: step.type,
            code: e.code,
            message: `step[${index}].${step.type}: ${e.message} @${e.path.join('.')}`,
          });
        }
      }
    });
  }
  return { ok: issues.length === 0, issues, step_count: steps.length };
}

export const STEP_KINDS: readonly StepKind[] = Object.keys(STEP_PAYLOAD_SCHEMAS) as StepKind[];
