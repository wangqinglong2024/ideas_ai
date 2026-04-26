/**
 * E08 ZY-08-03 — 节列表页（按章分组）。
 *
 * 严格遵循 PRD 03-courses：
 *  - CR-FR-005：章节总览，lesson 按 chapter 分组展示
 *  - CR-FR-009：阶段考入口（底部按钮）
 *  - CR-FR-014：跳过提示
 *  - 数据结构：Track > Stage > Chapter > Lesson
 */
import { useEffect, useMemo, useState, type JSX } from 'react';
import { Card, EmptyState, Spinner, Button, Badge, HStack } from '@zhiyu/ui';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { useT } from '@zhiyu/i18n/client';
import { tracks, stageExam, type StageDetail } from '../lib/api.js';

function pickI18n(map: Record<string, string> | undefined, lang: string): string {
  if (!map) return '';
  return map[lang] ?? map['en'] ?? Object.values(map)[0] ?? '';
}

/* 按 chapter_no 分组 */
interface ChapterGroup {
  chapterNo: number;
  lessons: StageDetail['lessons'];
}

function groupByChapter(lessons: StageDetail['lessons']): ChapterGroup[] {
  const map = new Map<number, StageDetail['lessons']>();
  for (const l of lessons) {
    const ch = l.chapter_no ?? 1;
    if (!map.has(ch)) map.set(ch, []);
    map.get(ch)!.push(l);
  }
  return Array.from(map.entries())
    .sort((a, b) => a[0] - b[0])
    .map(([chapterNo, lessons]) => ({ chapterNo, lessons }));
}

export function LearnStagePage(): JSX.Element {
  const { track, stageNo } = useParams({ strict: false }) as { track: string; stageNo: string };
  const navigate = useNavigate();
  const { i18n } = useT('common');
  const lang = i18n.language ?? 'en';
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examBusy, setExamBusy] = useState(false);

  useEffect(() => {
    void (async () => {
      setLoading(true);
      try {
        const r = await tracks.stage(track, Number(stageNo));
        setData(r);
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
  }, [track, stageNo]);

  const chapters = useMemo(
    () => (data ? groupByChapter(data.lessons) : []),
    [data],
  );

  async function takeExam(): Promise<void> {
    setExamBusy(true);
    try {
      const cd = await stageExam.cooldown(track, Number(stageNo));
      if (cd.in_cooldown) {
        const days = Math.ceil(cd.seconds_remaining / 86400);
        alert(`阶段考试冷却中：还剩 ${days} 天可重考。`);
        return;
      }
      await navigate({ to: '/learn/$track/$stageNo/exam', params: { track, stageNo } });
    } catch (e) {
      alert((e as Error).message);
    } finally {
      setExamBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="pt-2 flex items-center justify-center min-h-[40vh]" data-testid="stage-loading">
        <Spinner />
      </div>
    );
  }
  if (error || !data) {
    return (
      <div className="pt-2" data-testid="stage-error-page">
        <EmptyState illustration="search" title="加载失败" description={error ?? 'Unknown'} />
      </div>
    );
  }

  return (
    <div className="pt-2" data-testid="stage-page">
      <header className="mb-6">
        <Link to="/learn/$track" params={{ track }} className="text-small text-text-secondary hover:text-text-primary transition-colors">
          ← 返回��道
        </Link>
        <h1 className="text-h1 mt-1 text-text-primary">
          Stage {data.stage_no} · {pickI18n(data.course.i18n_title, lang)}
        </h1>
      </header>

      {/* ── 按章分组的课时列表 CR-FR-005 ── */}
      <div className="space-y-6" data-testid="chapter-list">
        {chapters.map((ch) => (
          <section key={ch.chapterNo}>
            <h2 className="text-title font-semibold mb-3 text-text-primary">
              Chapter {ch.chapterNo}
            </h2>
            <div className="space-y-2">
              {ch.lessons.map((l) => {
                const prog = data.progress[l.id];
                const pct = prog ? Math.round((prog.done_steps / Math.max(1, prog.total_steps)) * 100) : 0;
                const passed = prog?.passed ?? false;
                return (
                  <Link
                    key={l.id}
                    to="/lesson/$lessonId"
                    params={{ lessonId: l.id }}
                    data-testid={`lesson-${l.slug}`}
                    className="block"
                  >
                    <Card className="hover:shadow-sm transition-shadow">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <HStack gap={2} className="mb-1 flex-wrap">
                            <span className="text-micro text-text-tertiary">L{l.lesson_no}</span>
                            {l.is_free && <Badge tone="success" variant="soft">FREE</Badge>}
                            {!l.is_free && <span className="text-micro">🔒</span>}
                            {passed && <Badge tone="success" variant="soft">✓ 已通过</Badge>}
                          </HStack>
                          <h3 className="text-body-lg font-medium text-text-primary truncate">{pickI18n(l.i18n_title, lang)}</h3>
                          {prog && pct > 0 && (
                            <div className="mt-2 h-1.5 w-full rounded-full bg-border-default">
                              <div className="h-1.5 rounded-full bg-emerald-500 transition-all" style={{ width: `${pct}%` }} />
                            </div>
                          )}
                        </div>
                        <span className="text-xl text-text-tertiary">›</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </section>
        ))}
      </div>

      {/* ── 阶段考入口 CR-FR-009 ── */}
      {track !== 'pinyin' && (
        <div className="mt-8 flex justify-center">
          <Button onClick={() => void takeExam()} disabled={examBusy} data-testid="take-exam">
            {examBusy ? '加载中...' : `参加 Stage ${data.stage_no} 阶段考试 →`}
          </Button>
        </div>
      )}
    </div>
  );
}
