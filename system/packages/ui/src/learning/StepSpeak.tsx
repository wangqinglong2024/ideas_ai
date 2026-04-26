import { useEffect, useRef, useState, type JSX } from 'react';
import { Button } from '../components/button.js';
import { type StepComponentProps, type StepResult, pickI18n } from './types.js';

export interface SpeakItem {
  question_id: string;
  hanzi: string;
  pinyin?: string;
  reference_audio_url?: string;
}
export interface SpeakPayload {
  items: SpeakItem[];
  asr_adapter?: 'fake' | 'browser' | 'whisper';
}

/**
 * StepSpeak — fake ASR. The user records a clip via MediaRecorder if
 * available, otherwise self-rates with a slider. We never upload audio in
 * this version (E08 spec); confidence is the rating.
 */
export function StepSpeak({ payload, onComplete, title, lang = 'en' }: StepComponentProps<SpeakPayload>): JSX.Element {
  const [idx, setIdx] = useState(0);
  const [recording, setRecording] = useState(false);
  const [confidence, setConfidence] = useState<Record<string, number>>({});
  const recRef = useRef<MediaRecorder | null>(null);
  const item = payload.items[idx]!;
  const total = payload.items.length;

  useEffect(() => {
    return () => {
      try {
        recRef.current?.stop();
      } catch {
        /* noop */
      }
    };
  }, []);

  async function startRec(): Promise<void> {
    if (typeof navigator === 'undefined' || !navigator.mediaDevices?.getUserMedia) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      recRef.current = rec;
      rec.start();
      setRecording(true);
      setTimeout(() => stopRec(), 4000);
    } catch {
      /* permission denied — fallback to slider rating */
    }
  }

  function stopRec(): void {
    try {
      recRef.current?.stop();
    } catch {
      /* noop */
    }
    setRecording(false);
    // Fake ASR: assume "good enough" confidence 0.85.
    setConfidence((c) => ({ ...c, [item.question_id]: 0.85 }));
  }

  function next(): void {
    if (idx < total - 1) setIdx((i) => i + 1);
    else {
      const arr = payload.items.map((q) => confidence[q.question_id] ?? 0.6);
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      onComplete({ passed: avg >= 0.5, score: avg, confidence: avg } satisfies StepResult);
    }
  }

  return (
    <div className="space-y-4" data-testid="step-speak">
      {title && <h3 className="text-h3 text-center">{pickI18n(title, lang)}</h3>}
      <div className="text-sm text-text-secondary text-center">
        {idx + 1} / {total}
      </div>
      <div className="text-center text-3xl">{item.hanzi}</div>
      {item.pinyin && <div className="text-center text-text-secondary">{item.pinyin}</div>}
      <div className="flex justify-center gap-2">
        {item.reference_audio_url && (
          <Button
            variant="secondary"
            onClick={() => {
              try {
                new Audio(item.reference_audio_url!).play().catch(() => undefined);
              } catch {
                /* noop */
              }
            }}
            data-testid="speak-reference"
          >
            ▶ Reference
          </Button>
        )}
        {!recording ? (
          <Button onClick={startRec} data-testid="speak-record">
            🎤 Record
          </Button>
        ) : (
          <Button variant="secondary" onClick={stopRec} data-testid="speak-stop">
            ■ Stop
          </Button>
        )}
      </div>
      <div className="text-center">
        <label className="text-sm">
          Self-rating: {Math.round((confidence[item.question_id] ?? 0.6) * 100)}%
        </label>
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round((confidence[item.question_id] ?? 0.6) * 100)}
          onChange={(e) =>
            setConfidence((c) => ({ ...c, [item.question_id]: Number(e.target.value) / 100 }))
          }
          className="w-full"
          data-testid="speak-rating"
        />
      </div>
      <div className="flex justify-center">
        <Button onClick={next} data-testid="speak-next">
          {idx < total - 1 ? 'Next' : 'Done'}
        </Button>
      </div>
    </div>
  );
}
