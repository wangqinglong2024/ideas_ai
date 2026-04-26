/**
 * E08 ZY-08-03 — Level 3: lesson list for a stage.
 *
 * Lessons are clickable when free, when the user has any entitlement, or
 * when this is a pinyin onboarding lesson. Locked lessons surface a lock
 * indicator; tapping the lesson on the lesson page itself triggers the
 * 402 paywall flow.
 *
 * "Take stage exam" button at the bottom navigates to the exam route.
 */
import { useEffect, useState, type JSX } from 'react';
import { Card, EmptyState, Spinner, Button } from '@zhiyu/ui';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { tracks, stageExam, type StageDetail } from '../lib/api.js';

function pickI18n(map: Record<string, string> | undefined, lang: string): string {
  if (!map) return '';
  return map[lang] ?? map['en'] ?? Object.values(map)[0] ?? '';
}

export function LearnStagePage(): JSX.Element {
  const { track, stageNo } = useParams({ strict: false }) as { track: string; stageNo: string };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<StageDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [examBusy, setExamBusy] = useState(false);
  const lang = (typeof navigator !== 'undefined' ? navigator.language.slice(0, 2) : 'en') || 'en';

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
        <Link to="/learn/$track" params={{ track }} className="text-sm text-text-secondary">
          ← 返回赛道
        </Link>
        <h1 className="text-h1 mt-1">
          Stage {data.stage_no} · {pickI18n(data.course.i18n_title, lang)}
        </h1>
      </header>

      <div className="space-y-2" data-testid="lesson-list">
        {data.lessons.map((l) => {
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
              <Card className="hover:bg-bg-elevated transition-colors">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 text-xs text-text-secondary">
                      <span>Ch{l.chapter_no}-L{l.lesson_no}</span>
                      {l.is_free && <span className="rounded bg-emerald-200 px-1.5">FREE</span>}
                      {!l.is_free && <span>🔒</span>}
                      {passed && <span className="text-emerald-600">✓ 已通过</span>}
                    </div>
                    <h3 className="text-h3 mt-1">{pickI18n(l.i18n_title, lang)}</h3>
                    {prog && (
                      <div className="mt-2 h-1.5 w-full rounded-full bg-bg-elevated">
                        <div className="h-1.5 rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                      </div>
                    )}
                  </div>
                  <span className="text-2xl text-text-tertiary">›</span>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>

      {track !== 'pinyin' && (
        <div className="mt-8 flex justify-center">
          <Button onClick={() => void takeExam()} disabled={examBusy} data-testid="take-exam">
            {examBusy ? '加载中…' : `参加 Stage ${data.stage_no} 阶段考试 →`}
          </Button>
        </div>
      )}
    </div>
  );
}
