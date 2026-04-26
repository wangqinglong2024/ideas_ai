import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface QuizItem {
  question_id: string;
  prompt: Record<string, string>;
  options: Array<{ id: string; text: string; is_correct?: boolean }>;
  multi_select?: boolean;
}
export interface QuizPayload {
  items: QuizItem[];
  pass_threshold?: number;
}

function arraysEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}

export function StepQuiz({ payload, onComplete, title, lang = 'en' }: StepComponentProps<QuizPayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string[]>>({});
  const item = payload.items[idx]!;
  const total = payload.items.length;
  const isMulti = !!item.multi_select;

  function toggle(optId: string): void {
    setPicked((p) => {
      const cur = p[item.question_id] ?? [];
      if (isMulti) {
        return { ...p, [item.question_id]: cur.includes(optId) ? cur.filter((x) => x !== optId) : [...cur, optId] };
      }
      return { ...p, [item.question_id]: [optId] };
    });
  }

  function next(): void {
    if (idx < total - 1) setIdx((i) => i + 1);
    else {
      const ok = payload.items.filter((q) => {
        const correct = q.options.filter((o) => o.is_correct).map((o) => o.id);
        return arraysEqual(picked[q.question_id] ?? [], correct);
      }).length;
      const score = ok / total;
      onComplete({
        passed: score >= (payload.pass_threshold ?? 0.7),
        score,
        answers: payload.items.map((q) => {
          const correct = q.options.filter((o) => o.is_correct).map((o) => o.id);
          return {
            question_id: q.question_id,
            correct: arraysEqual(picked[q.question_id] ?? [], correct),
            chosen: (picked[q.question_id] ?? []).join(','),
          };
        }),
      } satisfies StepResult);
    }
  }

  const cur = picked[item.question_id] ?? [];

  return (
    <div className="space-y-4" data-testid="step-quiz">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="text-sm text-text-secondary text-center">
        {idx + 1} / {total} {isMulti && '(multi-select)'}
      </div>
      <Card className="space-y-3">
        <p className="text-body font-medium">{pickI18n(item.prompt, lang)}</p>
        <div className="grid grid-cols-1 gap-2">
          {item.options.map((o) => (
            <Button
              key={o.id}
              variant={cur.includes(o.id) ? 'primary' : 'secondary'}
              onClick={() => toggle(o.id)}
              data-testid={`quiz-opt-${o.id}`}
            >
              {o.text}
            </Button>
          ))}
        </div>
      </Card>
      <div className="flex justify-center">
        <Button disabled={cur.length === 0} onClick={next} data-testid="quiz-next">
          {idx < total - 1 ? 'Next' : 'Submit'}
        </Button>
      </div>
    </div>
  );
}
