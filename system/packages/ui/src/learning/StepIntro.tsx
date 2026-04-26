import { useEffect, useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface IntroPayload {
  body: Record<string, string>;
  media_url?: string;
  cover_url?: string;
  duration_s?: number;
}

export function StepIntro({ payload, onComplete, title, lang = 'en' }: StepComponentProps<IntroPayload>): JSX.Element {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setSeen(true), Math.max(800, (payload.duration_s ?? 1) * 1000));
    return () => clearTimeout(t);
  }, [payload.duration_s]);
  function complete(): void {
    const result: StepResult = { passed: true, score: 1 };
    onComplete(result);
  }
  return (
    <div className="space-y-4 text-center" data-testid="step-intro">
      {title && <h3 className="text-h3">{pickI18n(title, lang)}</h3>}
      {payload.cover_url && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={payload.cover_url} alt="" className="mx-auto rounded-lg max-h-48" />
      )}
      <p className="text-body whitespace-pre-line">{pickI18n(payload.body, lang)}</p>
      {payload.media_url && (
        <video src={payload.media_url} controls className="mx-auto w-full max-w-md rounded-lg" />
      )}
      <Button onClick={complete} disabled={!seen} data-testid="step-intro-next">
        {seen ? 'Continue' : 'Reading…'}
      </Button>
    </div>
  );
}
