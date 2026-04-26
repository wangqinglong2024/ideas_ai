/**
 * E08 ZY-08-05 — 10 step learning components.
 *
 * Each step component takes a typed `payload` and an `onComplete(result)`
 * callback. The lesson page wraps them into a state machine; Storybook
 * stories live next to each component.
 *
 * Implementation strategy: keep components small (<150 LOC each) and free
 * of network calls — the lesson page owns I/O.
 */
export type StepResult = {
  passed: boolean;
  score: number; // 0..1
  answers?: Array<{ question_id: string; correct: boolean; chosen?: string }>;
  confidence?: number;
  duration_ms?: number;
};

export type StepComponentProps<P = Record<string, unknown>> = {
  payload: P;
  onComplete: (result: StepResult) => void;
  /** Optional ribbon for the step header. */
  title?: Record<string, string>;
  /** Locale for i18n payload picks. */
  lang?: string;
};

export function pickI18n(map: Record<string, string> | undefined, lang: string | undefined = 'en'): string {
  if (!map) return '';
  return map[lang] ?? map['en'] ?? Object.values(map)[0] ?? '';
}
