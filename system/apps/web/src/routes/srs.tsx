/**
 * E07 — SRS 间隔重复复习页。
 * UI 风格遵循设计系统。
 */
import { useEffect, useState, type JSX } from 'react';
import { Button, Card, EmptyState, Spinner, Badge, HStack, VStack } from '@zhiyu/ui';
import { srs, type SrsCard } from '../lib/api.js';

const GRADES = [
  { v: 1 as const, label: '不会', sublabel: 'Again', cls: 'bg-red-600 hover:bg-red-700' },
  { v: 2 as const, label: '困难', sublabel: 'Hard', cls: 'bg-orange-500 hover:bg-orange-600' },
  { v: 3 as const, label: '一般', sublabel: 'Good', cls: 'bg-emerald-600 hover:bg-emerald-700' },
  { v: 4 as const, label: '简单', sublabel: 'Easy', cls: 'bg-sky-600 hover:bg-sky-700' },
];

export function SrsPage(): JSX.Element {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [queue, setQueue] = useState<SrsCard[]>([]);
  const [stats, setStats] = useState<{ due: number; total: number; lapses: number; due_tomorrow: number } | null>(null);
  const [idx, setIdx] = useState(0);
  const [reveal, setReveal] = useState(false);
  const [busy, setBusy] = useState(false);

  async function load(): Promise<void> {
    setLoading(true);
    setError(null);
    try {
      const [q, s] = await Promise.all([srs.queue(20), srs.stats()]);
      setQueue(q.items);
      setStats(s);
      setIdx(0);
      setReveal(false);
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void load(); }, []);

  async function grade(g: 1 | 2 | 3 | 4): Promise<void> {
    const card = queue[idx];
    if (!card) return;
    setBusy(true);
    try {
      await srs.review(card.id, g);
      if (idx + 1 >= queue.length) {
        await load();
      } else {
        setIdx(idx + 1);
        setReveal(false);
      }
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-6 flex items-center justify-center min-h-[40vh]" data-testid="srs-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-2 max-w-2xl" data-testid="srs-page">
      <header className="mb-6">
        <h1 className="text-h1 text-text-primary">单词记忆 (SRS)</h1>
        {stats && (
          <HStack gap={3} className="mt-2 flex-wrap">
            <Badge tone="rose" variant="soft">待复习 {stats.due}</Badge>
            <Badge tone="sky" variant="soft">累计 {stats.total}</Badge>
            <Badge tone="amber" variant="soft">失误 {stats.lapses}</Badge>
          </HStack>
        )}
      </header>

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-3 text-small text-red-700 dark:text-red-300">{error}</div>
      )}

      {queue.length === 0 ? (
        <EmptyState illustration="success" title="今日已无待复习" description="明天再来吧" />
      ) : (
        <Card>
          <div className="text-center py-8" data-testid="srs-card">
            <p className="text-micro text-text-tertiary">{idx + 1} / {queue.length}</p>
            <p className="mt-4 text-zh-hero font-semibold text-text-primary" data-testid="srs-word">{queue[idx]?.word}</p>
            {reveal ? (
              <VStack gap={2} className="mt-6" data-testid="srs-reveal">
                {queue[idx]?.pinyin && <p className="text-h2 text-text-primary">{queue[idx]?.pinyin}</p>}
                {queue[idx]?.i18n_gloss && (
                  <p className="text-body-lg text-text-secondary">
                    {Object.values(queue[idx]?.i18n_gloss ?? {})[0]}
                  </p>
                )}
              </VStack>
            ) : (
              <Button className="mt-8" onClick={() => setReveal(true)} data-testid="srs-show">
                显示答案
              </Button>
            )}
          </div>

          {reveal && (
            <div className="mt-4 grid grid-cols-2 gap-2" data-testid="srs-grades">
              {GRADES.map((g) => (
                <button
                  key={g.v}
                  className={`${g.cls} text-white rounded-xl px-3 py-3 text-body font-medium disabled:opacity-50 transition-colors`}
                  disabled={busy}
                  onClick={() => void grade(g.v)}
                  data-testid={`srs-grade-${g.v}`}
                >
                  <div>{g.label}</div>
                  <div className="text-micro text-white/70">{g.sublabel}</div>
                </button>
              ))}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
