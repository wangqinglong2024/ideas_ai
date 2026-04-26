/**
 * E08 ZY-08-03 — 阶段列表页。
 *
 * 严格遵循 PRD 03-courses：
 *  - CR-FR-004：12 阶段网格 + 进度环 + 锁定状态
 *  - CR-FR-002：拼音前置提示
 *  - 进度环显示真实数据（非 hardcoded 0%）
 */
import { useEffect, useState, type JSX } from 'react';
import { Card, EmptyState, Grid, Spinner, Badge, HStack } from '@zhiyu/ui';
import { Link, useParams } from '@tanstack/react-router';
import { useT } from '@zhiyu/i18n/client';
import { tracks, pinyinIntro, type TrackStage } from '../lib/api.js';

function pickI18n(map: Record<string, string> | undefined, lang: string): string {
  if (!map) return '';
  return map[lang] ?? map['en'] ?? Object.values(map)[0] ?? '';
}

function ProgressRing({ pct, size = 40 }: { pct: number; size?: number }): JSX.Element {
  const r = (size - 6) / 2;
  const c = 2 * Math.PI * r;
  const clampedPct = Math.max(0, Math.min(1, pct));
  const off = c * (1 - clampedPct);
  return (
    <svg width={size} height={size} className="block">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="currentColor" strokeWidth="3" fill="none" className="text-border-default" />
      {clampedPct > 0 && (
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          strokeDasharray={`${c} ${c}`}
          strokeDashoffset={off}
          strokeLinecap="round"
          className="text-emerald-500"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      )}
      <text x={size / 2} y={size / 2} textAnchor="middle" dominantBaseline="central" className="fill-text-secondary text-micro" fontSize="10">
        {Math.round(clampedPct * 100)}%
      </text>
    </svg>
  );
}

export function LearnTrackPage(): JSX.Element {
  const { track } = useParams({ strict: false }) as { track: string };
  const { i18n } = useT('common');
  const lang = i18n.language ?? 'en';
  const [loading, setLoading] = useState(true);
  const [stages, setStages] = useState<TrackStage[]>([]);
  const [titleI18n, setTitleI18n] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [pinyinDone, setPinyinDone] = useState<boolean | null>(null);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const r = await tracks.detail(track);
        setStages(r.stages);
        setTitleI18n(r.title_i18n);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
    if (track !== 'pinyin') {
      void pinyinIntro.status().then((p) => setPinyinDone(p.all_done)).catch(() => undefined);
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
        <Link to="/learn" className="text-small text-text-secondary hover:text-text-primary transition-colors">
          ← 全部赛道
        </Link>
        <h1 className="text-h1 mt-1 text-text-primary">{pickI18n(titleI18n, lang)}</h1>
      </header>

      {pinyinDone === false && (
        <div className="mb-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-3 text-small" data-testid="track-pinyin-warning">
          🔤 该赛道需要先完成拼音入门。
          <Link to="/learn/$track" params={{ track: 'pinyin' }} className="ml-2 text-amber-700 dark:text-amber-300 underline">
            前往拼音课
          </Link>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-3 text-small text-red-700 dark:text-red-300" data-testid="track-error">
          {error}
        </div>
      )}

      {stages.length === 0 ? (
        <EmptyState illustration="search" title="暂无阶段" description="此赛道尚未发布。" />
      ) : (
        <Grid cols={2} gap={4} data-testid="stage-grid">
          {stages.map((st) => {
            const locked = !st.unlocked;
            const progressPct = st.progress_pct ?? 0;
            return (
              <Link
                key={st.id}
                to={locked ? '/learn/$track' : '/learn/$track/$stageNo'}
                params={{ track, stageNo: String(st.stage_no) }}
                disabled={locked}
                data-testid={`stage-${st.stage_no}`}
                className={locked ? 'pointer-events-none opacity-50' : ''}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <HStack gap={2} className="mb-1 flex-wrap">
                        <span className="text-micro text-text-tertiary">Stage {st.stage_no}</span>
                        {st.is_premium && <Badge tone="amber" variant="soft">PREMIUM</Badge>}
                        {locked && <span className="text-micro">🔒</span>}
                      </HStack>
                      <h3 className="text-title font-semibold text-text-primary truncate">{pickI18n(st.i18n_title, lang)}</h3>
                      <p className="mt-1 text-small text-text-secondary line-clamp-2">{pickI18n(st.i18n_summary, lang)}</p>
                      <HStack gap={2} className="mt-2">
                        <Badge tone="sky" variant="soft">HSK {st.hsk_level}</Badge>
                        <span className="text-micro text-text-tertiary">{st.lesson_count} 节</span>
                      </HStack>
                    </div>
                    <ProgressRing pct={progressPct} />
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
