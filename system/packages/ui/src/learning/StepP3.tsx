import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface P3Item { question_id: string; pinyin_base: string; audio_url?: string; correct_tone: '1' | '2' | '3' | '4' }
export interface P3Payload { items: P3Item[]; instruction?: Record<string, string> }

const TONE_MARKS: Record<string, string> = { '1': '¯', '2': 'ˊ', '3': 'ˇ', '4': 'ˋ' };

export function StepP3({ payload, onComplete, title, lang = 'en' }: StepComponentProps<P3Payload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [picked, setPicked] = useState<Record<string, string>>({});
  const item = payload.items[idx]!;
  const total = payload.items.length;
  function play(): void {
    if (item.audio_url && typeof Audio !== 'undefined') {
      try { new Audio(item.audio_url).play().catch(() => undefined); } catch { /* noop */ }
    }
  }
  function next(): void {
    if (idx < total - 1) setIdx((i) => i + 1);
    else {
      const ok = payload.items.filter((q) => picked[q.question_id] === q.correct_tone).length;
      const score = ok / total;
      onComplete({ passed: score >= 0.6, score } satisfies StepResult);
    }
  }
  return (
    <div className="space-y-4" data-testid="step-p3">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      {payload.instruction && <p className="text-center text-sm text-text-secondary">{pickI18n(payload.instruction, lang)}</p>}
      <div className="text-sm text-text-secondary text-center">{idx + 1} / {total}</div>
      <Card className="text-center py-6 space-y-3">
        <div className="text-4xl">{item.pinyin_base}</div>
        {item.audio_url && (
          <Button onClick={play} variant="secondary" data-testid="p3-play">▶ Play</Button>
        )}
      </Card>
      <div className="grid grid-cols-4 gap-2">
        {(['1', '2', '3', '4'] as const).map((tone) => (
          <Button key={tone} variant={picked[item.question_id] === tone ? 'primary' : 'secondary'} onClick={() => setPicked((p) => ({ ...p, [item.question_id]: tone }))} data-testid={`p3-tone-${tone}`}>
            {tone}{TONE_MARKS[tone]}
          </Button>
        ))}
      </div>
      <div className="flex justify-center">
        <Button disabled={!picked[item.question_id]} onClick={next} data-testid="p3-next">{idx < total - 1 ? 'Next' : 'Done'}</Button>
      </div>
    </div>
  );
}
