import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface P2Item { question_id: string; pinyin: string; correct_hanzi: string; options: string[] }
export interface P2Payload { items: P2Item[]; instruction?: Record<string, string> }

export function StepP2({ payload, onComplete, title, lang = 'en' }: StepComponentProps<P2Payload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const item = payload.items[idx]!;
  const total = payload.items.length;
  function next(): void {
    if (idx < total - 1) setIdx((i) => i + 1);
    else {
      const ok = payload.items.filter((q) => picked[q.question_id] === q.correct_hanzi).length;
      const score = ok / total;
      onComplete({ passed: score >= 0.6, score } satisfies StepResult);
    }
  }
  return (
    <div className="space-y-4" data-testid="step-p2">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      {payload.instruction && <p className="text-center text-sm text-text-secondary">{pickI18n(payload.instruction, lang)}</p>}
      <div className="text-sm text-text-secondary text-center">{idx + 1} / {total}</div>
      <Card className="text-center text-3xl py-8">{item.pinyin}</Card>
      <div className="grid grid-cols-2 gap-2">
        {item.options.map((o) => (
          <Button key={o} variant={picked[item.question_id] === o ? 'primary' : 'secondary'} onClick={() => setPicked((p) => ({ ...p, [item.question_id]: o }))} data-testid={`p2-${o}`}>{o}</Button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button disabled={!picked[item.question_id]} onClick={next} data-testid="p2-next">{idx < total - 1 ? 'Next' : 'Done'}</Button>
      </div>
    </div>
  );
}
