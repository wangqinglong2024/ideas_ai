import { type JSX } from 'react';

export interface ProgressSegmentsProps {
  total: number;
  current: number;
  passed: boolean[];
  className?: string;
}

export function ProgressSegments({ total, current, passed, className }: ProgressSegmentsProps): JSX.Element {
  return (
    <div className={`flex gap-1 ${className ?? ''}`} data-testid="progress-segments" aria-label={`progress ${current}/${total}`}>
      {Array.from({ length: total }).map((_, i) => {
        const isDone = passed[i];
        const isCurrent = i === current;
        return (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              isDone ? 'bg-emerald-500' : isCurrent ? 'bg-amber-400' : 'bg-bg-tertiary/60'
            }`}
            data-state={isDone ? 'done' : isCurrent ? 'current' : 'idle'}
          />
        );
      })}
    </div>
  );
}
