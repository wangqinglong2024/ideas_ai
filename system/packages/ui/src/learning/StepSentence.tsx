import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface SentencePayload {
  sentences: Array<{ hanzi: string; pinyin?: string; translation?: Record<string, string>; audio_url?: string }>;
}

export function StepSentence({ payload, onComplete, title, lang = 'en' }: StepComponentProps<SentencePayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const total = payload.sentences.length;
  const s = payload.sentences[idx]!;

  function next(): void {
    if (idx < total - 1) {
      setIdx((i) => i + 1);
    } else {
      onComplete({ passed: true, score: 1 } satisfies StepResult);
    }
  }

  return (
    <div className="space-y-4" data-testid="step-sentence">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="text-center text-sm text-text-secondary">
        {idx + 1} / {total}
      </div>
      <Card className="text-center space-y-2 min-h-[160px] flex flex-col justify-center">
        <div className="text-3xl font-medium">{s.hanzi}</div>
        {s.pinyin && <div className="text-base text-text-secondary">{s.pinyin}</div>}
        {s.translation && <div className="text-body">{pickI18n(s.translation, lang)}</div>}
      </Card>
      <div className="flex justify-center">
        <Button onClick={next} data-testid="sentence-next">
          {idx < total - 1 ? 'Next' : 'Done'}
        </Button>
      </div>
    </div>
  );
}
