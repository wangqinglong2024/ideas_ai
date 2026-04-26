/**
 * E08 ZY-08-03 — Level 2: stage list for a track.
 *
 * Shows up to 12 stage cards. Locked stages render dimmed with a 🔒. The
 * topmost unlocked stage is auto-highlighted. A small SVG progress ring
 * summarises completion per stage when known.
 */
import { useEffect, useState, type JSX } from 'react';
import { Card, EmptyState, Grid, Spinner } from '@zhiyu/ui';
import { Link, useParams } from '@tanstack/react-router';
import { tracks, pinyinIntro, type TrackStage } from '../lib/api.js';

function pickI18n(map: Record<string, string> | undefined, lang: string): string {
  if (!map) return '';
  return map[lang] ?? map['en'] ?? Object.values(map)[0] ?? '';
}

function ProgressRing({ pct, size = 40 }: { pct: number; size?: number }): JSX.Element {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const off = c * (1 - Math.max(0, Math.min(1, pct)));
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth="3" fill="none" className="text-bg-elevated" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        strokeDasharray={`${c} ${c}`}
        strokeDashoffset={off}
        className="text-emerald-500"
        transform={`rotate(-90 ${size / 2} ${size / 2})`}
      />
    </svg>
  );
}

const CACHE_PREFIX = 'zhiyu:learn:track:';
function readCache(track: string): { stages: TrackStage[]; title_i18n: Record<string, string> } | null {
  if (typeof window === 'undefined') return null;
  try {
    const v = window.localStorage.getItem(CACHE_PREFIX + track);
    return v ? (JSON.parse(v) as { stages: TrackStage[]; title_i18n: Record<string, string> }) : null;
  } catch {
    return null;
  }
}
function writeCache(track: string, data: { stages: TrackStage[]; title_i18n: Record<string, string> }): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(CACHE_PREFIX + track, JSON.stringify(data));
  } catch { /* quota */ }
}

export function LearnTrackPage(): JSX.Element {
  const { track } = useParams({ strict: false }) as { track: string };
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState<TrackStage[]>([]);
  const [titleI18n, setTitleI18n] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pinyinDone, setPinyinDone] = useState<boolean | null>(null);
  const lang = (typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'en') || 'en';

  useEffect(() => {
    const c = readCache(track);
    if (c) {
      setStages(c.stages);
      setTitleI18n(c.title_i18n);
      setLoading(false);
    }
    void (async () => {
      try {
        const r = await tracks.detail(track);
        setStages(r.stages);
        setTitleI18n(r.title_i18n);
        writeCache(track, { stages: r.stages, title_i18n: r.title_i18n });
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
    if (track !== 'pinyin') {
      void pinyinIntro
        .status()
        .then((p) => setPinyinDone(p.all_done))
        .catch(() => undefined);
    }
  }, [track]);

  if (loading) {
    return (
      <div className="pt-2 flex items-center justify-center min-h-[40vh]" data-testid="track-loading">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="pt-2" data-testid="track-page">
      <header className="mb-6">
        <Link to="/learn" className="text-sm text-text-secondary">
          ← 全部赛道
        </Link>
        <h1 className="text-h1 mt-1">{pickI18n(titleI18n, lang)}</h1>
      </header>

      {pinyinDone === false && (
        <div className="mb-4 rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-950/40 dark:border-amber-700 p-3 text-sm" data-testid="track-pinyin-warning">
          🔤 该赛道需要先完成拼音入门。
          <Link to="/learn/$track" params={{ track: 'pinyin' }} className="ml-2 underline">
            前往拼音课
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700" data-testid="track-error">
          {error}
        </div>
      )}

      {stages.length === 0 ? (
        <EmptyState illustration="search" title="暂无阶段" description="此赛道尚未发布。" />
      ) : (
        <Grid cols={2} gap={4} data-testid="stage-grid">
          {stages.map((st) => {
            const locked = !st.unlocked;
            return (
              <Link
                key={st.id}
                to={locked ? '/learn/$track' : '/learn/$track/$stageNo'}
                params={{ track, stageNo: String(st.stage_no) }}
                disabled={locked}
                data-testid={`stage-${st.stage_no}`}
                className={locked ? 'pointer-events-none opacity-60' : ''}
              >
                <Card className="h-full">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 text-xs text-text-secondary">
                        <span>Stage {st.stage_no}</span>
                        {st.is_premium && <span className="rounded bg-amber-200 px-1.5">PREMIUM</span>}
                        {locked && <span>🔒</span>}
                      </div>
                      <h3 className="text-h3 mt-1">{pickI18n(st.i18n_title, lang)}</h3>
                      <p className="mt-1 text-sm text-text-secondary line-clamp-2">{pickI18n(st.i18n_summary, lang)}</p>
                      <p className="mt-2 text-micro text-text-tertiary">
                        HSK {st.hsk_level} · {st.lesson_count} 节
                      </p>
                    </div>
                    <ProgressRing pct={0} />
                  </div>
                </Card>
              </Link>
            );
          })}
        </Grid>
      )}
    </div>
  );
}
