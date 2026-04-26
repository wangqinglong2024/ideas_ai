import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface PinyinPayload {
  items: Array<{ question_id: string; hanzi: string; correct_pinyin: string; options: string[] }>;
}

export function StepPinyin({ payload, onComplete, title, lang = 'en' }: StepComponentProps<PinyinPayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const item = payload.items[idx]!;
  const total = payload.items.length;

  function pick(opt: string): void {
    setPicked((p) => ({ ...p, [item.question_id]: opt }));
  }
  function next(): void {
    if (idx < total - 1) setIdx((i) => i + 1);
    else {
      const correct = payload.items.filter((q) => picked[q.question_id] === q.correct_pinyin).length;
      const score = correct / total;
      onComplete({ passed: score >= 0.8, score, answers: payload.items.map((q) => ({ question_id: q.question_id, correct: picked[q.question_id] === q.correct_pinyin, chosen: picked[q.question_id] })) } satisfies StepResult);
    }
  }
  const chosen = picked[item.question_id];
  return (
    <div className="space-y-4" data-testid="step-pinyin">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="text-sm text-text-secondary text-center">
        {idx + 1} / {total}
      </div>
      <div className="text-center text-6xl">{item.hanzi}</div>
      <div className="grid grid-cols-2 gap-2">
        {item.options.map((opt) => (
          <Button
            key={opt}
            variant={chosen === opt ? 'primary' : 'secondary'}
            onClick={() => pick(opt)}
            data-testid={`pinyin-opt-${opt}`}
            className={
              chosen
                ? opt === item.correct_pinyin
                  ? 'border-green-500 border-2'
                  : opt === chosen
                    ? 'border-red-500 border-2'
                    : ''
                : ''
            }
          >
            {opt}
          </Button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button disabled={!chosen} onClick={next} data-testid="pinyin-next">
          {idx < total - 1 ? 'Next' : 'Done'}
        </Button>
      </div>
    </div>
  );
}
