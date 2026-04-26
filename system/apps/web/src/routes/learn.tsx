/**
 * E08 ZY-08-03 — Level 1: track grid.
 */
import { useEffect, useState, type JSX } from 'react';
import { Card, EmptyState, Grid, Spinner } from '@zhiyu/ui';
import { Link } from '@tanstack/react-router';
import { useT } from '@zhiyu/i18n/client';
import { tracks, pinyinIntro, type TrackSummary } from '../lib/api.js';

function pickI18n(map: Record<string, string> | undefined, lang: string): string {
  if (!map) return '';
  return map[lang] ?? map['en'] ?? Object.values(map)[0] ?? '';
}

const TRACK_ICON: Record<string, string> = {
  pinyin: '🔤',
  daily: '☕',
  ecommerce: '🛒',
  factory: '🏭',
  hsk: '🎓',
};

export function LearnPage(): JSX.Element {
  const { t, i18n } = useT('common');
  const lang = i18n.language ?? 'en';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<TrackSummary[]>([]);
  const [pinyinDone, setPinyinDone] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const [r, p] = await Promise.all([
          tracks.list(),
          pinyinIntro.status().catch(() => null),
        ]);
        setItems(r.items);
        if (p) setPinyinDone(p.all_done);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="pt-2 flex items-center justify-center min-h-[40vh]" data-testid="learn-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-2" data-testid="learn-page">
      <header className="mb-6">
        <h1 className="text-h1">{t('nav.courses')}</h1>
        <p className="text-body text-text-secondary">选择一个赛道开始学习。</p>
      </header>

      {pinyinDone === false && (
        <Link
          to="/learn/$track"
          params={{ track: 'pinyin' }}
          className="block mb-4 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-700 p-3 text-sm text-amber-900 dark:text-amber-100"
          data-testid="pinyin-banner"
        >
          🔤 还没完成拼音入门？点击先完成 3 节拼音课。
        </Link>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700" data-testid="learn-error">
          {error}
        </div>
      )}

      {items.length === 0 ? (
        <EmptyState illustration="search" title={t('states.coming_soon')} description="尚未发布课程。" />
      ) : (
        <Grid cols={2} gap={4} data-testid="track-grid">
          {items.map((tr) => (
            <Link key={tr.track} to="/learn/$track" params={{ track: tr.track }} data-testid={`track-${tr.track}`}>
              <Card className="hover:bg-bg-elevated cursor-pointer transition-colors h-full">
                <div className="flex items-start gap-3">
                  <div className="text-4xl">{TRACK_ICON[tr.track] ?? '📚'}</div>
                  <div className="flex-1">
                    <h3 className="text-h3">{pickI18n(tr.title_i18n, lang)}</h3>
                    <p className="mt-1 text-sm text-text-secondary">
                      {tr.stages} 个阶段 · {tr.lessons} 节课
                    </p>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </Grid>
      )}
    </div>
  );
}
