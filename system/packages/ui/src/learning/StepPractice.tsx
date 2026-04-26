import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface PracticeItem {
  question_id: string;
  prompt: Record<string, string>;
  expected: string; // accepted lowercased string
  hint?: Record<string, string>;
}
export interface PracticePayload {
  items: PracticeItem[];
}

function norm(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, ' ');
}

export function StepPractice({ payload, onComplete, title, lang = 'en' }: StepComponentProps<PracticePayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [showHint, setShowHint] = useState(false);
  const item = payload.items[idx]!;
  const total = payload.items.length;

  function next(): void {
    if (idx < total - 1) {
      setIdx((i) => i + 1);
      setShowHint(false);
    } else {
      const ok = payload.items.filter((q) => norm(answers[q.question_id] ?? '') === norm(q.expected)).length;
      const score = ok / total;
      onComplete({
        passed: score >= 0.7,
        score,
        answers: payload.items.map((q) => ({
          question_id: q.question_id,
          correct: norm(answers[q.question_id] ?? '') === norm(q.expected),
          chosen: answers[q.question_id],
        })),
      } satisfies StepResult);
    }
  }

  return (
    <div className="space-y-4" data-testid="step-practice">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="text-sm text-text-secondary text-center">
        {idx + 1} / {total}
      </div>
      <Card className="space-y-3">
        <p className="text-body">{pickI18n(item.prompt, lang)}</p>
        <input
          type="text"
          className="w-full rounded border px-3 py-2 bg-bg-secondary text-text-primary"
          value={answers[item.question_id] ?? ''}
          onChange={(e) => setAnswers((a) => ({ ...a, [item.question_id]: e.target.value }))}
          data-testid="practice-input"
        />
        {item.hint && (
          <Button variant="ghost" onClick={() => setShowHint((v) => !v)} data-testid="practice-hint">
            {showHint ? 'Hide' : 'Show'} hint
          </Button>
        )}
        {showHint && item.hint && <p className="text-sm text-text-secondary">{pickI18n(item.hint, lang)}</p>}
      </Card>
      <div className="flex justify-center">
        <Button onClick={next} data-testid="practice-next">
          {idx < total - 1 ? 'Next' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
