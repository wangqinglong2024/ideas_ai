import { useEffect, type JSX } from 'react';
import { Button } from '../components/button.js';
import { Card } from '../components/card.js';

export interface LessonCompleteProps {
  scorePct: number;
  passed: boolean;
  xpAwarded?: number;
  zcAwarded?: number;
  onContinue: () => void;
  onReplay?: () => void;
  i18n?: { title?: string; continue?: string; replay?: string; xp?: string; zc?: string };
}

const PARTICLES = 30;

export function LessonComplete({ scorePct, passed, xpAwarded, zcAwarded, onContinue, onReplay, i18n }: LessonCompleteProps): JSX.Element {
  useEffect(() => {
    if (!passed) return;
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(80); } catch { /* noop */ }
    }
  }, [passed]);

  return (
    <div className="relative" data-testid="lesson-complete">
      {passed && (
        <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
          {Array.from({ length: PARTICLES }).map((_, i) => (
            <span
              key={i}
              className="absolute block w-2 h-2 rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                background: `hsl(${Math.floor(Math.random() * 360)}, 80%, 60%)`,
                animation: `zhiyu-confetti ${1 + Math.random() * 1.5}s ease-out forwards`,
                animationDelay: `${Math.random() * 0.4}s`,
              }}
            />
          ))}
          <style>{`@keyframes zhiyu-confetti { 0%{transform:translateY(0) scale(1);opacity:1} 100%{transform:translateY(120%) scale(0.4);opacity:0} }`}</style>
        </div>
      )}
      <Card className="text-center p-6 space-y-3 relative">
        <div className="text-6xl">{passed ? '🎉' : '💪'}</div>
        <h3 className="text-h3">{i18n?.title ?? (passed ? '太棒了！' : '再来一次！')}</h3>
        <div className="text-lg">{Math.round(scorePct * 100)}%</div>
        {(xpAwarded || zcAwarded) && (
          <div className="text-sm text-text-secondary flex justify-center gap-4">
            {xpAwarded ? <span>+{xpAwarded} {i18n?.xp ?? 'XP'}</span> : null}
            {zcAwarded ? <span>+{zcAwarded} {i18n?.zc ?? 'ZC'}</span> : null}
          </div>
        )}
        <div className="flex justify-center gap-2 pt-2">
          {onReplay && (
            <Button variant="secondary" onClick={onReplay} data-testid="complete-replay">
              {i18n?.replay ?? '再做一遍'}
            </Button>
          )}
          <Button onClick={onContinue} data-testid="complete-continue">
            {i18n?.continue ?? '继续'}
          </Button>
        </div>
      </Card>
    </div>
  );
}
