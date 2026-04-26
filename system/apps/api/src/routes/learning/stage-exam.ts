/**
 * E08 ZY-08-07 — Stage exam routes.
 *
 *   POST /api/v1/stage-exam/:track/:stageNo/start
 *   POST /api/v1/stage-exam/:track/:stageNo/submit
 *   GET  /api/v1/stage-exam/:track/:stageNo/cooldown
 *
 * Question pool: built dynamically by sampling quiz/p1/p2/p3 step payloads
 * from every lesson in (track, stageNo). Token tracks one in-flight attempt
 * so resubmits cannot be reordered.
 */
import type { FastifyInstance } from 'fastify';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { randomBytes } from 'node:crypto';
import {
  courses,
  lessons,
  stageExamAttempts,
  stageUnlock,
} from '@zhiyu/db';
import { db } from '../../db.js';
import { requireUser } from '../../auth-mw.js';

const TRACKS = ['daily', 'ecommerce', 'factory', 'hsk', 'pinyin'] as const;

const params = z.object({
  track: z.enum(TRACKS),
  stageNo: z.string().regex(/^\d{1,2}$/),
});

const PASS_PCT = 75;
const COOLDOWN_DAYS = 7;
const EXAM_TTL_MIN = 60;

interface SampledQuestion {
  id: string;
  lesson_slug: string;
  type: string;
  payload: Record<string, unknown>;
  correct_answer: string | string[] | null;
}

function asArray(v: unknown): unknown[] {
  return Array.isArray(v) ? v : [];
}

function sampleQuestionsFromLesson(lesson: { slug: string; steps: unknown }): SampledQuestion[] {
  const steps = asArray(lesson.steps) as Array<{ type?: string; payload?: Record<string, unknown>; data?: Record<string, unknown> }>;
  const out: SampledQuestion[] = [];
  for (const step of steps) {
    const payload = step.payload ?? step.data ?? {};
    if (step.type === 'quiz' || step.type === 'p1' || step.type === 'p2' || step.type === 'p3') {
      const items = asArray((payload as { items?: unknown }).items) as Array<Record<string, unknown>>;
      for (const item of items) {
        const id = `${lesson.slug}::${step.type}::${String(item.question_id ?? randomBytes(4).toString('hex'))}`;
        let correct: string | string[] | null = null;
        if (step.type === 'p1') correct = String(item.correct_pinyin ?? '');
        else if (step.type === 'p2') correct = String(item.correct_hanzi ?? '');
        else if (step.type === 'p3') correct = String(item.correct_tone ?? '');
        else if (step.type === 'quiz') {
          const opts = asArray((item as { options?: unknown }).options) as Array<{ id?: string; is_correct?: boolean }>;
          correct = opts.filter((o) => o.is_correct).map((o) => String(o.id ?? '')).join(',') || null;
        }
        out.push({ id, lesson_slug: lesson.slug, type: step.type, payload: item, correct_answer: correct });
      }
    }
  }
  return out;
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}

function publicPayload(type: string, p: Record<string, unknown>): Record<string, unknown> {
  if (type === 'quiz') {
    const opts = (Array.isArray(p.options) ? (p.options as Array<Record<string, unknown>>) : []).map((o) => {
      const { is_correct: _omit, ...rest } = o;
      void _omit;
      return rest;
    });
    return { ...p, options: opts };
  }
  if (type === 'p1') {
    const { correct_pinyin: _, ...rest } = p as { correct_pinyin?: unknown };
    void _;
    return rest;
  }
  if (type === 'p2') {
    const { correct_hanzi: _, ...rest } = p as { correct_hanzi?: unknown };
    void _;
    return rest;
  }
  if (type === 'p3') {
    const { correct_tone: _, ...rest } = p as { correct_tone?: unknown };
    void _;
    return rest;
  }
  return p;
}

export async function registerStageExamRoutes(app: FastifyInstance): Promise<void> {
  // ---- Cooldown check ------------------------------------------------
  app.get('/api/v1/stage-exam/:track/:stageNo/cooldown', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const p = params.safeParse(req.params);
    if (!p.success) {
      reply.code(400);
      return { error: 'invalid_params' };
    }
    const stageNo = Number(p.data.stageNo);
    const [last] = await db
      .select()
      .from(stageExamAttempts)
      .where(
        and(
          eq(stageExamAttempts.userId, user.id),
          eq(stageExamAttempts.track, p.data.track),
          eq(stageExamAttempts.stageNo, stageNo),
          eq(stageExamAttempts.status, 'submitted'),
          eq(stageExamAttempts.passed, false),
        ),
      )
      .orderBy(desc(stageExamAttempts.submittedAt))
      .limit(1);
    if (!last || !last.submittedAt) {
      return { in_cooldown: false, seconds_remaining: 0 };
    }
    const elapsedMs = Date.now() - new Date(last.submittedAt).getTime();
    const cooldownMs = COOLDOWN_DAYS * 24 * 3600 * 1000;
    if (elapsedMs >= cooldownMs) return { in_cooldown: false, seconds_remaining: 0 };
    return {
      in_cooldown: true,
      seconds_remaining: Math.ceil((cooldownMs - elapsedMs) / 1000),
      last_score_pct: Number(last.scorePct),
    };
  });

  // ---- Start --------------------------------------------------------
  app.post('/api/v1/stage-exam/:track/:stageNo/start', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const p = params.safeParse(req.params);
    if (!p.success) {
      reply.code(400);
      return { error: 'invalid_params' };
    }
    const stageNo = Number(p.data.stageNo);
    // Cooldown: deny if last fail < 7d.
    const cd = await fetchCooldown(user.id, p.data.track, stageNo);
    if (cd.in_cooldown) {
      reply.code(429);
      return { error: 'in_cooldown', ...cd };
    }
    // Build pool from all lessons in this stage.
    const [course] = await db
      .select()
      .from(courses)
      .where(
        and(eq(courses.track, p.data.track), eq(courses.stageNo, stageNo), eq(courses.status, 'published')),
      )
      .limit(1);
    if (!course) {
      reply.code(404);
      return { error: 'stage_not_found' };
    }
    const lessonRows = await db
      .select({ slug: lessons.slug, steps: lessons.steps })
      .from(lessons)
      .where(eq(lessons.courseId, course.id))
      .orderBy(asc(lessons.position));

    const pool: SampledQuestion[] = [];
    for (const l of lessonRows) pool.push(...sampleQuestionsFromLesson(l));
    if (pool.length === 0) {
      reply.code(409);
      return { error: 'no_questions_in_pool' };
    }
    const target = Math.max(80, Math.min(150, Math.min(pool.length, 80 + stageNo * 6)));
    const sampled = shuffle(pool).slice(0, target);
    const token = randomBytes(16).toString('hex');
    await db.insert(stageExamAttempts).values({
      userId: user.id,
      track: p.data.track,
      stageNo,
      questionIds: sampled.map((s) => s.id),
      answers: { pool: sampled },
      examToken: token,
      status: 'in_progress',
      startedAt: new Date(),
    });
    return {
      token,
      ttl_minutes: EXAM_TTL_MIN,
      pass_pct: PASS_PCT,
      questions: sampled.map((s) => ({ id: s.id, type: s.type, payload: publicPayload(s.type, s.payload) })),
    };
  });

  // ---- Submit -------------------------------------------------------
  app.post('/api/v1/stage-exam/:track/:stageNo/submit', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const p = params.safeParse(req.params);
    if (!p.success) {
      reply.code(400);
      return { error: 'invalid_params' };
    }
    const body = z
      .object({
        token: z.string().length(32),
        answers: z.record(z.string(), z.string()),
        duration_s: z.number().int().min(0).max(60 * 60 * 4).optional(),
      })
      .safeParse(req.body ?? {});
    if (!body.success) {
      reply.code(400);
      return { error: 'invalid_payload', issues: body.error.issues };
    }
    const stageNo = Number(p.data.stageNo);
    // Atomic claim: only one submit per attempt.
    const claimed = await db
      .update(stageExamAttempts)
      .set({ status: 'submitted', submittedAt: new Date() })
      .where(
        and(
          eq(stageExamAttempts.userId, user.id),
          eq(stageExamAttempts.examToken, body.data.token),
          eq(stageExamAttempts.status, 'in_progress'),
        ),
      )
      .returning();
    const attempt = claimed[0];
    if (!attempt) {
      reply.code(404);
      return { error: 'exam_not_found_or_finished' };
    }
    const startedMs = new Date(attempt.startedAt).getTime();
    if (Date.now() - startedMs > EXAM_TTL_MIN * 60 * 1000 + 30_000) {
      await db
        .update(stageExamAttempts)
        .set({ status: 'expired' })
        .where(eq(stageExamAttempts.id, attempt.id));
      reply.code(410);
      return { error: 'exam_expired' };
    }
    const pool = ((attempt.answers as { pool?: SampledQuestion[] }).pool ?? []) as SampledQuestion[];
    let correct = 0;
    const breakdown: Array<{ id: string; correct: boolean }> = [];
    for (const q of pool) {
      const ans = body.data.answers[q.id];
      const isCorrect = String(q.correct_answer ?? '') === String(ans ?? '');
      if (isCorrect) correct += 1;
      breakdown.push({ id: q.id, correct: isCorrect });
    }
    const total = pool.length || 1;
    const pct = Math.round((correct / total) * 10000) / 100;
    const passed = pct >= PASS_PCT;
    await db.transaction(async (tx) => {
      await tx
        .update(stageExamAttempts)
        .set({
          answers: { ...(attempt.answers as Record<string, unknown>), submitted: body.data.answers, breakdown },
          scorePct: String(pct),
          passed,
          durationS: body.data.duration_s ?? Math.floor((Date.now() - startedMs) / 1000),
        })
        .where(eq(stageExamAttempts.id, attempt.id));
      if (passed) {
        await tx
          .insert(stageUnlock)
          .values({ userId: user.id, track: p.data.track, stageNo: stageNo + 1, reason: 'exam' })
          .onConflictDoNothing();
      }
    });
    return {
      passed,
      score_pct: pct,
      correct,
      total,
      pass_pct: PASS_PCT,
      cooldown_days: passed ? 0 : COOLDOWN_DAYS,
      next_stage_unlocked: passed ? stageNo + 1 : null,
    };
  });
}

async function fetchCooldown(userId: string, track: string, stageNo: number): Promise<{ in_cooldown: boolean; seconds_remaining: number; last_score_pct?: number }> {
  const [last] = await db
    .select()
    .from(stageExamAttempts)
    .where(
      and(
        eq(stageExamAttempts.userId, userId),
        eq(stageExamAttempts.track, track),
        eq(stageExamAttempts.stageNo, stageNo),
        eq(stageExamAttempts.status, 'submitted'),
        eq(stageExamAttempts.passed, false),
      ),
    )
    .orderBy(desc(stageExamAttempts.submittedAt))
    .limit(1);
  if (!last || !last.submittedAt) return { in_cooldown: false, seconds_remaining: 0 };
  const elapsed = Date.now() - new Date(last.submittedAt).getTime();
  const cd = COOLDOWN_DAYS * 24 * 3600 * 1000;
  if (elapsed >= cd) return { in_cooldown: false, seconds_remaining: 0 };
  return { in_cooldown: true, seconds_remaining: Math.ceil((cd - elapsed) / 1000), last_score_pct: Number(last.scorePct) };
}
