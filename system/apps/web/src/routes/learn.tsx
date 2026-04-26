/**
 * E08 ZY-08-03 — 课程首页：轨道选择 + Dashboard。
 *
 * 严格遵循 PRD 03-courses：
 *  - CR-FR-001：轨道选择（4 赛道卡片）
 *  - CR-FR-002：拼音入门前置提示
 *  - CR-FR-003：Dashboard（继续学习 + 今日任务提示）
 *  - CR-FR-017：支持多轨道并行
 */
import { useEffect, useState, type JSX } from 'react';
import { Card, EmptyState, Grid, Spinner, Badge, Button, HStack, VStack } from '@zhiyu/ui';
import { Link } from '@tanstack/react-router';
import { useT } from '@zhiyu/i18n/client';
import { tracks, pinyinIntro, learning, type TrackSummary } from '../lib/api.js';

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

const TRACK_COLOR: Record<string, string> = {
  pinyin: 'from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20',
  daily: 'from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20',
  ecommerce: 'from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20',
  factory: 'from-slate-50 to-gray-50 dark:from-slate-950/20 dark:to-gray-950/20',
  hsk: 'from-rose-50 to-pink-50 dark:from-rose-950/20 dark:to-pink-950/20',
};

export function LearnPage(): JSX.Element {
  const { t, i18n } = useT('common');
  const lang = i18n.language ?? 'en';
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [items, setItems] = useState<TrackSummary[]>([]);
  const [pinyinDone, setPinyinDone] = useState<boolean | null>(null);
  const [lastLesson, setLastLesson] = useState<{ track: string; title: string; lessonId: string } | null>(null);

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
        /* 尝试获取上次学习位置 CR-FR-003 */
        try {
          const resume = await learning.lastActive();
          if (resume?.lesson_id) {
            setLastLesson({ track: resume.track, title: resume.title ?? '', lessonId: resume.lesson_id });
          }
        } catch { /* ignore */ }
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
        <h1 className="text-h1 text-text-primary">{t('nav.courses')}</h1>
        <p className="mt-1 text-body text-text-secondary">选择一个赛道开始学习，支持同时学习多条赛道。</p>
      </header>

      {/* ── 拼音入门提示 CR-FR-002 ── */}
      {pinyinDone === false && (
        <Link
          to="/learn/$track"
          params={{ track: 'pinyin' }}
          className="block mb-4 rounded-xl border border-amber-300 dark:border-amber-700 bg-amber-50 dark:bg-amber-950/30 p-4 transition-colors hover:bg-amber-100 dark:hover:bg-amber-950/50"
          data-testid="pinyin-banner"
        >
          <HStack gap={3}>
            <span className="text-2xl">🔤</span>
            <VStack gap={1}>
              <p className="text-body font-medium text-amber-900 dark:text-amber-100">还没完成拼音入门？</p>
              <p className="text-small text-amber-700 dark:text-amber-300">建议先完成声母、韵母、声调 3 个模块，掌握发音基础。</p>
            </VStack>
          </HStack>
        </Link>
      )}

      {/* ── 继续学习 CR-FR-003 ── */}
      {lastLesson && (
        <Card className="mb-6 bg-gradient-to-r from-rose-50 to-sky-50 dark:from-rose-950/20 dark:to-sky-950/20" data-testid="continue-learning">
          <HStack gap={4} className="items-center justify-between">
            <VStack gap={1}>
              <p className="text-micro text-text-tertiary uppercase tracking-wider">继续学习</p>
              <p className="text-body-lg font-medium text-text-primary">{lastLesson.title || '上次课程'}</p>
              <p className="text-small text-text-secondary">{lastLesson.track} 赛道</p>
            </VStack>
            <Button asChild>
              <Link to="/lesson/$lessonId" params={{ lessonId: lastLesson.lessonId }}>
                继续 →
              </Link>
            </Button>
          </HStack>
        </Card>
      )}

      {error && (
        <div className="mb-4 rounded-xl border border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30 p-3 text-small text-red-700 dark:text-red-300" data-testid="learn-error">
          {error}
        </div>
      )}

      {/* ── 轨道网格 CR-FR-001 ── */}
      {items.length === 0 ? (
        <EmptyState illustration="search" title={t('states.coming_soon')} description="尚未发布课程。" />
      ) : (
        <Grid cols={2} gap={4} data-testid="track-grid">
          {items.map((tr) => (
            <Link key={tr.track} to="/learn/$track" params={{ track: tr.track }} data-testid={`track-${tr.track}`}>
              <Card className={`h-full hover:shadow-md cursor-pointer transition-all bg-gradient-to-br ${TRACK_COLOR[tr.track] ?? ''}`}>
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{TRACK_ICON[tr.track] ?? '📚'}</div>
                  <div className="flex-1">
                    <h3 className="text-title font-semibold text-text-primary">{pickI18n(tr.title_i18n, lang)}</h3>
                    <p className="mt-1 text-small text-text-secondary">
                      {tr.stages} 个阶段 · {tr.lessons} 节课
                    </p>
                    {tr.track === 'pinyin' && (
                      <Badge tone="amber" variant="soft" className="mt-2">入门推荐</Badge>
                    )}
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
