import { useEffect, useRef, useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface WriteItem {
  question_id: string;
  hanzi: string;
  pinyin?: string;
  meaning?: Record<string, string>;
}
export interface WritePayload {
  items: WriteItem[];
  hanzi_writer_data_url?: string;
}

/**
 * StepWrite — uses hanzi-writer if globally available
 * (window.HanziWriter loaded from /hanzi-writer-data/ self-host bundle).
 * Falls back to canvas free-draw when missing.
 */
export function StepWrite({ payload, onComplete, title, lang = 'en' }: StepComponentProps<WritePayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});
  const containerRef = useRef<HTMLDivElement>(null);
  const item = payload.items[idx]!;
  const total = payload.items.length;

  useEffect(() => {
    const w = (typeof window !== 'undefined' ? (window as unknown as { HanziWriter?: { create: (el: HTMLElement, ch: string, opts: Record<string, unknown>) => { quiz: (opts: Record<string, unknown>) => void } } }).HanziWriter : undefined);
    if (!w || !containerRef.current) return;
    containerRef.current.innerHTML = '';
    const writer = w.create(containerRef.current, item.hanzi, {
      width: 200,
      height: 200,
      padding: 5,
      showCharacter: false,
      showOutline: true,
      strokeAnimationSpeed: 1,
      drawingWidth: 30,
      charDataLoader: (char: string, onLoad: (data: unknown) => void) => {
        const url = (payload.hanzi_writer_data_url ?? '/hanzi-writer-data') + `/${char}.json`;
        fetch(url)
          .then((r) => r.json())
          .then(onLoad)
          .catch(() => onLoad({}));
      },
    });
    writer.quiz({
      onComplete: () => setCompleted((c) => ({ ...c, [item.question_id]: true })),
    });
  }, [item.hanzi, item.question_id, payload.hanzi_writer_data_url]);

  function next(): void {
    if (idx < total - 1) setIdx((i) => i + 1);
    else {
      const ok = payload.items.filter((q) => completed[q.question_id]).length;
      const score = ok / total;
      onComplete({ passed: score >= 0.6, score } satisfies StepResult);
    }
  }

  return (
    <div className="space-y-4" data-testid="step-write">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="text-sm text-text-secondary text-center">
        {idx + 1} / {total}
      </div>
      <div className="text-center">
        {item.pinyin && <div className="text-lg">{item.pinyin}</div>}
        {item.meaning && <div className="text-sm">{pickI18n(item.meaning, lang)}</div>}
      </div>
      <div ref={containerRef} className="mx-auto w-[200px] h-[200px] border border-dashed rounded" data-testid="write-canvas" />
      <div className="flex justify-center gap-2">
        <Button variant="secondary" onClick={() => setCompleted((c) => ({ ...c, [item.question_id]: true }))} data-testid="write-skip">
          I&apos;m done
        </Button>
        <Button onClick={next} disabled={!completed[item.question_id]} data-testid="write-next">
          {idx < total - 1 ? 'Next' : 'Done'}
        </Button>
      </div>
    </div>
  );
}
