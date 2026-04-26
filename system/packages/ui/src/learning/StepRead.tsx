import { useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface ReadPayload {
  passage: { hanzi: string; pinyin?: string; translation?: Record<string, string> };
  questions: Array<{
    question_id: string;
    prompt: string;
    options: Array<{ id: string; text: string; is_correct?: boolean }>;
  }>;
}

export function StepRead({ payload, onComplete, title, lang = 'en' }: StepComponentProps<ReadPayload>): JSX.Element {
  const [picked, setPicked] = useState<Record<string, string>>({});
  const [showTranslation, setShowTranslation] = useState(false);

  function submit(): void {
    const correct = payload.questions.filter(
      (q) => q.options.find((o) => o.id === picked[q.question_id])?.is_correct,
    ).length;
    const score = correct / payload.questions.length;
    onComplete({
      passed: score >= 0.7,
      score,
      answers: payload.questions.map((q) => ({
        question_id: q.question_id,
        correct: !!q.options.find((o) => o.id === picked[q.question_id])?.is_correct,
        chosen: picked[q.question_id],
      })),
    } satisfies StepResult);
  }

  const allPicked = payload.questions.every((q) => picked[q.question_id]);

  return (
    <div className="space-y-4" data-testid="step-read">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <Card className="space-y-2">
        <div className="text-lg leading-relaxed">{payload.passage.hanzi}</div>
        {payload.passage.pinyin && (
          <div className="text-sm text-text-secondary">{payload.passage.pinyin}</div>
        )}
        {payload.passage.translation && (
          <Button variant="ghost" onClick={() => setShowTranslation((v) => !v)} data-testid="read-translate">
            {showTranslation ? 'Hide' : 'Show'} translation
          </Button>
        )}
        {showTranslation && payload.passage.translation && (
          <div className="text-body italic">{pickI18n(payload.passage.translation, lang)}</div>
        )}
      </Card>
      {payload.questions.map((q) => (
        <Card key={q.question_id} className="space-y-2" data-testid={`read-q-${q.question_id}`}>
          <div className="font-medium">{q.prompt}</div>
          <div className="grid grid-cols-1 gap-1">
            {q.options.map((o) => (
              <Button
                key={o.id}
                variant={picked[q.question_id] === o.id ? 'primary' : 'secondary'}
                onClick={() => setPicked((p) => ({ ...p, [q.question_id]: o.id }))}
              >
                {o.text}
              </Button>
            ))}
          </div>
        </Card>
      ))}
      <div className="flex justify-center">
        <Button disabled={!allPicked} onClick={submit} data-testid="read-submit">
          Submit
        </Button>
      </div>
    </div>
  );
}
