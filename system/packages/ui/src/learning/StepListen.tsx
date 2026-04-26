import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface ListenItem {
  question_id: string;
  audio_url: string;
  prompt?: Record<string, string>;
  options: Array<{ id: string; text: string; is_correct?: boolean }>;
}
export interface ListenPayload {
  items: ListenItem[];
}

function play(url: string): void {
  if (typeof Audio === 'undefined') return;
  try {
    const a = new Audio(url);
    a.play().catch(() => undefined);
  } catch {
    /* noop */
  }
}

export function StepListen({ payload, onComplete, title, lang = 'en' }: StepComponentProps<ListenPayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const item = payload.items[idx]!;
  const total = payload.items.length;

  function next(): void {
    if (idx < total - 1) setIdx((i) => i + 1);
    else {
      const correct = payload.items.filter(
        (q) => q.options.find((o) => o.id === picked[q.question_id])?.is_correct,
      ).length;
      const score = correct / total;
      onComplete({
        passed: score >= 0.7,
        score,
        answers: payload.items.map((q) => ({
          question_id: q.question_id,
          correct: !!q.options.find((o) => o.id === picked[q.question_id])?.is_correct,
          chosen: picked[q.question_id],
        })),
      } satisfies StepResult);
    }
  }

  return (
    <div className="space-y-4" data-testid="step-listen">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="text-sm text-text-secondary text-center">
        {idx + 1} / {total}
      </div>
      <div className="flex justify-center">
        <Button onClick={() => play(item.audio_url)} data-testid="listen-play">
          ▶ Play audio
        </Button>
      </div>
      {item.prompt && <p className="text-center text-body">{pickI18n(item.prompt, lang)}</p>}
      <div className="grid grid-cols-2 gap-2">
        {item.options.map((opt) => (
          <Button
            key={opt.id}
            variant={picked[item.question_id] === opt.id ? 'primary' : 'secondary'}
            onClick={() => setPicked((p) => ({ ...p, [item.question_id]: opt.id }))}
            data-testid={`listen-opt-${opt.id}`}
          >
            {opt.text}
          </Button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button disabled={!picked[item.question_id]} onClick={next} data-testid="listen-next">
          {idx < total - 1 ? 'Next' : 'Done'}
        </Button>
      </div>
    </div>
  );
}
