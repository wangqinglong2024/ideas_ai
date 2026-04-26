import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface WordCard {
  hanzi: string;
  pinyin?: string;
  audio_url?: string;
  meaning?: Record<string, string>;
  example?: string;
}

export interface WordPayload {
  words: WordCard[];
  pass_threshold?: number;
}

export function StepVocab({ payload, onComplete, title, lang = 'en' }: StepComponentProps<WordPayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [knownCount, setKnownCount] = useState(0);
  const total = payload.words.length;
  const card = payload.words[idx]!;

  function rate(known: boolean): void {
    if (known) setKnownCount((n) => n + 1);
    if (idx < total - 1) {
      setIdx((i) => i + 1);
      setRevealed(false);
    } else {
      const score = (knownCount + (known ? 1 : 0)) / total;
      const result: StepResult = { passed: score >= (payload.pass_threshold ?? 0.6), score };
      onComplete(result);
    }
  }

  function playAudio(): void {
    if (card.audio_url && typeof Audio !== 'undefined') {
      try {
        const a = new Audio(card.audio_url);
        a.play().catch(() => undefined);
      } catch {
        /* ignore */
      }
    }
  }

  return (
    <div className="space-y-4" data-testid="step-vocab">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="flex justify-between text-sm text-text-secondary">
        <span>
          {idx + 1} / {total}
        </span>
        <span>known: {knownCount}</span>
      </div>
      <Card className="text-center min-h-[200px] flex flex-col justify-center gap-3">
        <div className="text-5xl">{card.hanzi}</div>
        {revealed && (
          <>
            {card.pinyin && <div className="text-lg text-text-secondary">{card.pinyin}</div>}
            {card.meaning && <div className="text-body">{pickI18n(card.meaning, lang)}</div>}
            {card.example && <div className="text-sm">{card.example}</div>}
          </>
        )}
        <div className="flex justify-center gap-2 mt-3">
          {card.audio_url && (
            <Button variant="secondary" onClick={playAudio} data-testid="vocab-audio">
              ▶ Play
            </Button>
          )}
          {!revealed ? (
            <Button onClick={() => setRevealed(true)} data-testid="vocab-flip">
              Flip
            </Button>
          ) : (
            <>
              <Button variant="secondary" onClick={() => rate(false)} data-testid="vocab-unknown">
                Don&apos;t know
              </Button>
              <Button onClick={() => rate(true)} data-testid="vocab-known">
                I know
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
}
