/**
 * E08 ZY-08-07 — Stage exam page.
 *
 * - Calls `stageExam.start` to obtain an attempt token + question pool.
 * - Shows a 60-min countdown; auto-submits at expiry.
 * - Persists draft answers to localStorage for crash safety.
 * - On submit: render result + cooldown info + onward CTA.
 */
import { useEffect, useRef, useState, type JSX } from 'react';
import { Button, Card, Spinner } from '@zhiyu/ui';
import { Link, useParams, useNavigate } from '@tanstack/react-router';
import { stageExam, type StageExamQuestion } from '../lib/api.js';

interface ExamSession {
  token: string;
  ttl_minutes: number;
  pass_pct: number;
  questions: StageExamQuestion[];
  started_at: number;
}

interface ExamResult {
  passed: boolean;
  score_pct: number;
  correct: number;
  total: number;
  pass_pct: number;
  cooldown_days: number;
  next_stage_unlocked: number | null;
}

const DRAFT_PREFIX = 'zhiyu:exam:draft:';

export function StageExamPage(): JSX.Element {
  const { track, stageNo } = useParams({ strict: false }) as { track: string; stageNo: string };
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<ExamSession | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [now, setNow] = useState(Date.now());
  const submitRef = useRef(false);

  const draftKey = `${DRAFT_PREFIX}${track}:${stageNo}`;

  // Load draft & start session.
  useEffect(() => {
    void (async () => {
      try {
        const cd = await stageExam.cooldown(track, Number(stageNo));
        if (cd.in_cooldown) {
          setError(`阶段考试冷却中：还剩 ${Math.ceil(cd.seconds_remaining / 86400)} 天可重考。`);
          setLoading(false);
          return;
        }
        const r = await stageExam.start(track, Number(stageNo));
        const s: ExamSession = {
          token: r.token,
          ttl_minutes: r.ttl_minutes,
          pass_pct: r.pass_pct,
          questions: r.questions,
          started_at: Date.now(),
        };
        setSession(s);
        try {
          const draft = window.localStorage.getItem(draftKey);
          if (draft) setAnswers(JSON.parse(draft) as Record<string, string>);
        } catch { /* noop */ }
      } catch (e) {
        setError((e as Error).message);
      } finally {
        setLoading(false);
      }
    })();
    return () => undefined;
  }, [track, stageNo, draftKey]);

  // Countdown ticker.
  useEffect(() => {
    if (!session) return undefined;
    const t = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(t);
  }, [session]);

  // Persist drafts.
  useEffect(() => {
    if (!session) return;
    try {
      window.localStorage.setItem(draftKey, JSON.stringify(answers));
    } catch { /* noop */ }
  }, [answers, draftKey, session]);

  async function submit(): Promise<void> {
    if (!session || submitRef.current) return;
    submitRef.current = true;
    setSubmitting(true);
    try {
      const duration = Math.floor((Date.now() - session.started_at) / 1000);
      const r = await stageExam.submit(track, Number(stageNo), {
        token: session.token,
        answers,
        duration_s: duration,
      });
      setResult(r);
      try { window.localStorage.removeItem(draftKey); } catch { /* noop */ }
    } catch (e) {
      setError((e as Error).message);
      submitRef.current = false;
    } finally {
      setSubmitting(false);
    }
  }

  // Auto-submit at expiry.
  useEffect(() => {
    if (!session || result) return;
    const expiresAt = session.started_at + session.ttl_minutes * 60 * 1000;
    if (now >= expiresAt && !submitRef.current) {
      void submit();
    }
  }, [now, session, result]);

  if (loading) {
    return <div className="pt-2 flex items-center justify-center min-h-[40vh]"><Spinner /></div>;
  }
  if (error) {
    return (
      <div className="pt-2" data-testid="exam-error">
        <Card className="p-4 space-y-3 text-center">
          <p className="text-body">{error}</p>
          <Link to="/learn/$track/$stageNo" params={{ track, stageNo }} className="underline text-sm">返回</Link>
        </Card>
      </div>
    );
  }
  if (result) {
    return (
      <div className="pt-2 space-y-4" data-testid="exam-result">
        <Card className="p-6 text-center space-y-3">
          <div className="text-6xl">{result.passed ? '🎉' : '💪'}</div>
          <h2 className="text-h2">{result.passed ? '阶段考试通过！' : '再接再厉'}</h2>
          <p className="text-lg">
            {result.score_pct}% （{result.correct}/{result.total}，及格 {result.pass_pct}%）
          </p>
          {result.passed && result.next_stage_unlocked && (
            <p className="text-sm text-emerald-600">已解锁 Stage {result.next_stage_unlocked}！</p>
          )}
          {!result.passed && (
            <p className="text-sm text-text-secondary">{result.cooldown_days} 天后可重考。</p>
          )}
          <div className="flex justify-center gap-2 pt-2">
            <Button onClick={() => void navigate({ to: '/learn/$track', params: { track } })} data-testid="exam-back">
              返回赛道
            </Button>
          </div>
        </Card>
      </div>
    );
  }
  if (!session) return <div className="pt-2"><Spinner /></div>;

  const expiresAt = session.started_at + session.ttl_minutes * 60 * 1000;
  const remainingS = Math.max(0, Math.floor((expiresAt - now) / 1000));
  const m = Math.floor(remainingS / 60);
  const s = String(remainingS % 60).padStart(2, '0');
  const answeredCount = Object.keys(answers).length;
  const total = session.questions.length;

  return (
    <div className="pt-2 space-y-4" data-testid="exam-page">
      <header className="sticky top-0 z-10 bg-bg-primary/95 backdrop-blur py-2 -mt-2 flex items-center justify-between">
        <div>
          <h1 className="text-h2">Stage {stageNo} 阶段考试</h1>
          <p className="text-sm text-text-secondary">
            {answeredCount}/{total} · 及格 {session.pass_pct}%
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-mono ${remainingS < 300 ? 'text-red-600' : ''}`} data-testid="exam-timer">
            {m}:{s}
          </div>
        </div>
      </header>

      <div className="space-y-3">
        {session.questions.map((q, i) => (
          <Card key={q.id} className="p-3 space-y-2" data-testid={`exam-q-${i}`}>
            <div className="text-xs text-text-secondary">
              {i + 1} / {total} · {q.type}
            </div>
            <ExamQuestion q={q} answer={answers[q.id]} onAnswer={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />
          </Card>
        ))}
      </div>

      <div className="sticky bottom-2 flex justify-center">
        <Button onClick={() => void submit()} disabled={submitting} data-testid="exam-submit">
          {submitting ? '提交中…' : `提交 (${answeredCount}/${total})`}
        </Button>
      </div>
    </div>
  );
}

function ExamQuestion({
  q,
  answer,
  onAnswer,
}: {
  q: StageExamQuestion;
  answer: string | undefined;
  onAnswer: (v: string) => void;
}): JSX.Element {
  const payload = q.payload as Record<string, unknown>;
  if (q.type === 'p1' || q.type === 'p2' || q.type === 'p3') {
    const display =
      q.type === 'p1' ? String(payload.hanzi ?? '')
      : q.type === 'p2' ? String(payload.pinyin ?? '')
      : String(payload.pinyin_base ?? '');
    const opts =
      q.type === 'p3'
        ? (['1', '2', '3', '4'] as const).map((t) => ({ id: t, text: t }))
        : (Array.isArray(payload.options) ? (payload.options as string[]) : []).map((o) => ({ id: o, text: o }));
    return (
      <div className="space-y-2">
        <div className="text-3xl text-center">{display}</div>
        <div className={`grid gap-2 ${q.type === 'p3' ? 'grid-cols-4' : 'grid-cols-2'}`}>
          {opts.map((o) => (
            <Button
              key={o.id}
              variant={answer === o.id ? 'primary' : 'secondary'}
              onClick={() => onAnswer(o.id)}
            >
              {o.text}
            </Button>
          ))}
        </div>
      </div>
    );
  }
  // quiz
  const opts = (Array.isArray(payload.options) ? (payload.options as Array<{ id: string; text: string }>) : []);
  return (
    <div className="space-y-2">
      <p className="text-body">
        {typeof payload.prompt === 'string'
          ? payload.prompt
          : (payload.prompt as Record<string, string> | undefined)?.['en'] ??
            (payload.prompt as Record<string, string> | undefined)?.['zh'] ??
            ''}
      </p>
      <div className="grid grid-cols-1 gap-2">
        {opts.map((o) => (
          <Button key={o.id} variant={answer === o.id ? 'primary' : 'secondary'} onClick={() => onAnswer(o.id)}>
            {o.text}
          </Button>
        ))}
      </div>
    </div>
  );
}
