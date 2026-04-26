/**
 * E08 ZY-08-02 — Courses module API
 *
 * Adds the catalog endpoints required by the FE three-level navigation:
 *
 *   GET /api/v1/tracks                                 — track summary
 *   GET /api/v1/tracks/:track                          — stages of a track
 *   GET /api/v1/tracks/:track/stages/:stageNo          — stage detail (lessons)
 *   GET /api/v1/me/entitlements                        — current entitlements
 *   GET /api/v1/me/courses                             — my courses summary
 *
 * Lesson and per-step endpoints stay in routes/learning/lessons.ts. This
 * file only adds the higher-level navigation aggregations and entitlement
 * checks; ZY-08-01/02 schema additions back the calls.
 */
import type { FastifyInstance } from 'fastify';
import { and, asc, desc, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import {
  courses,
  enrollments,
  entitlements,
  lessons,
  lessonProgress,
  stageUnlock,
} from '@zhiyu/db';
import { db } from '../../db.js';
import { getOptionalUser, requireUser } from '../../auth-mw.js';

const TRACKS = ['daily', 'ecommerce', 'factory', 'hsk', 'pinyin'] as const;

export async function registerTrackRoutes(app: FastifyInstance): Promise<void> {
  // ---- Track summary --------------------------------------------------
  app.get('/api/v1/tracks', async () => {
    const rows = await db
      .select({
        track: courses.track,
        stages: sql<number>`count(distinct ${courses.stageNo})::int`,
        lessons: sql<number>`coalesce(sum(${courses.lessonCount})::int, 0)`,
      })
      .from(courses)
      .where(eq(courses.status, 'published'))
      .groupBy(courses.track);
    const map = new Map(rows.map((r) => [r.track, r]));
    const items = TRACKS.map((t) => {
      const r = map.get(t);
      return {
        track: t,
        stages: r?.stages ?? 0,
        lessons: r?.lessons ?? 0,
        title_i18n: TRACK_TITLES[t],
      };
    });
    return { items };
  });

  // ---- Stages of one track -------------------------------------------
  app.get('/api/v1/tracks/:track', async (req, reply) => {
    const params = z.object({ track: z.enum(TRACKS) }).safeParse(req.params);
    if (!params.success) {
      reply.code(400);
      return { error: 'invalid_track' };
    }
    const user = await maybeUser(req);
    const stages = await db
      .select({
        id: courses.id,
        slug: courses.slug,
        stage_no: courses.stageNo,
        hsk_level: courses.hskLevel,
        is_premium: courses.isPremium,
        i18n_title: courses.i18nTitle,
        i18n_summary: courses.i18nSummary,
        cover_url: courses.coverUrl,
        sort_order: courses.sortOrder,
        lesson_count: courses.lessonCount,
      })
      .from(courses)
      .where(and(eq(courses.track, params.data.track), eq(courses.status, 'published')))
      .orderBy(asc(courses.stageNo), asc(courses.sortOrder));

    let unlocks = new Set<number>();
    if (user) {
      const rows = await db
        .select({ stage: stageUnlock.stageNo })
        .from(stageUnlock)
        .where(and(eq(stageUnlock.userId, user.id), eq(stageUnlock.track, params.data.track)));
      unlocks = new Set(rows.map((r) => r.stage));
    }

    return {
      track: params.data.track,
      title_i18n: TRACK_TITLES[params.data.track],
      stages: stages.map((s) => ({
        ...s,
        // Stage 1 is always unlocked. Higher stages need an explicit unlock
        // row OR the previous stage to be marked unlocked.
        unlocked: s.stage_no <= 1 || unlocks.has(s.stage_no) || unlocks.has(s.stage_no - 1),
      })),
    };
  });

  // ---- Stage detail (lessons + progress) -----------------------------
  app.get('/api/v1/tracks/:track/stages/:stageNo', async (req, reply) => {
    const params = z
      .object({ track: z.enum(TRACKS), stageNo: z.string().regex(/^\d{1,2}$/) })
      .safeParse(req.params);
    if (!params.success) {
      reply.code(400);
      return { error: 'invalid_params' };
    }
    const stageNo = Number(params.data.stageNo);
    const [course] = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.track, params.data.track),
          eq(courses.stageNo, stageNo),
          eq(courses.status, 'published'),
        ),
      )
      .limit(1);
    if (!course) {
      reply.code(404);
      return { error: 'stage_not_found' };
    }
    const lessonRows = await db
      .select({
        id: lessons.id,
        slug: lessons.slug,
        position: lessons.position,
        chapter_no: lessons.chapterNo,
        lesson_no: lessons.lessonNo,
        i18n_title: lessons.i18nTitle,
        is_free: lessons.isFree,
        is_pinyin_intro: lessons.isPinyinIntro,
        estimated_minutes: lessons.estimatedMinutes,
      })
      .from(lessons)
      .where(eq(lessons.courseId, course.id))
      .orderBy(asc(lessons.position));

    const user = await maybeUser(req);
    let progress: Record<string, { done_steps: number; total_steps: number; passed: boolean }> = {};
    if (user) {
      const rows = await db
        .select({
          lessonId: lessonProgress.lessonId,
          stepIndex: lessonProgress.stepIndex,
          status: lessonProgress.status,
        })
        .from(lessonProgress)
        .where(
          and(
            eq(lessonProgress.userId, user.id),
            sql`${lessonProgress.lessonId} = ANY(${sql.raw(`ARRAY[${lessonRows.map((l) => `'${l.id}'::uuid`).join(',') || 'NULL::uuid'}]`)})`,
          ),
        );
      const grouped = new Map<string, number>();
      for (const r of rows) {
        if (r.status !== 'done') continue;
        grouped.set(r.lessonId, (grouped.get(r.lessonId) ?? 0) + 1);
      }
      progress = Object.fromEntries(
        lessonRows.map((l) => {
          const done = grouped.get(l.id) ?? 0;
          return [l.id, { done_steps: done, total_steps: 10, passed: done >= 10 }];
        }),
      );
    }

    return {
      track: params.data.track,
      stage_no: stageNo,
      course,
      lessons: lessonRows,
      progress,
    };
  });

  // ---- Entitlements --------------------------------------------------
  app.get('/api/v1/me/entitlements', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const rows = await db
      .select()
      .from(entitlements)
      .where(eq(entitlements.userId, user.id))
      .orderBy(desc(entitlements.createdAt));
    return { items: rows };
  });

  // POST /me/entitlements/fake — dev-only paywall fake unlock helper.
  // Guarded by NODE_ENV !== 'production' so it can never be invoked live.
  app.post('/api/v1/me/entitlements/fake', async (req, reply) => {
    if (process.env.NODE_ENV === 'production') {
      reply.code(404);
      return { error: 'not_found' };
    }
    const user = await requireUser(req, reply);
    if (!user) return;
    const body = z
      .object({
        kind: z.enum(['subscription', 'single_lesson', 'single_course', 'zc_unlock']),
        course_id: z.string().uuid().optional(),
        lesson_id: z.string().uuid().optional(),
      })
      .safeParse(req.body ?? {});
    if (!body.success) {
      reply.code(400);
      return { error: 'invalid_payload', issues: body.error.issues };
    }
    const [row] = await db
      .insert(entitlements)
      .values({
        userId: user.id,
        kind: body.data.kind,
        courseId: body.data.course_id ?? null,
        lessonId: body.data.lesson_id ?? null,
        source: 'fake',
        expiresAt:
          body.data.kind === 'subscription'
            ? new Date(Date.now() + 30 * 24 * 3600 * 1000)
            : null,
      })
      .returning();
    return { entitlement: row };
  });

  // ---- My courses (aggregated enrollments) ---------------------------
  app.get('/api/v1/me/courses', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const rows = await db
      .select({
        enrollment: enrollments,
        course: courses,
      })
      .from(enrollments)
      .innerJoin(courses, eq(enrollments.courseId, courses.id))
      .where(eq(enrollments.userId, user.id))
      .orderBy(desc(enrollments.lastActiveAt));
    return {
      items: rows.map((r) => ({
        enrollment_id: r.enrollment.id,
        course_id: r.course.id,
        course_slug: r.course.slug,
        track: r.course.track,
        stage_no: r.course.stageNo,
        i18n_title: r.course.i18nTitle,
        cover_url: r.course.coverUrl,
        progress_percent: Number(r.enrollment.progressPercent),
        status: r.enrollment.status,
        current_lesson_id: r.enrollment.currentLessonId,
        last_active_at: r.enrollment.lastActiveAt,
      })),
    };
  });
}

const TRACK_TITLES: Record<(typeof TRACKS)[number], Record<string, string>> = {
  daily: { en: 'Daily Chinese', zh: '日常汉语' },
  ecommerce: { en: 'E-commerce Chinese', zh: '电商汉语' },
  factory: { en: 'Factory Chinese', zh: '工厂汉语' },
  hsk: { en: 'HSK Bridge', zh: 'HSK 衔接' },
  pinyin: { en: 'Pinyin Onboarding', zh: '拼音入门' },
};

async function maybeUser(req: import('fastify').FastifyRequest) {
  try {
    return await getOptionalUser(req);
  } catch {
    return null;
  }
}

/** Server-side helper used by lesson + paywall to decide if a user can play a lesson. */
export async function userHasLessonEntitlement(
  userId: string,
  lessonId: string,
  courseId: string | null,
): Promise<boolean> {
  const rows = await db
    .select()
    .from(entitlements)
    .where(eq(entitlements.userId, userId));
  const now = Date.now();
  for (const e of rows) {
    if (e.expiresAt && new Date(e.expiresAt).getTime() < now) continue;
    if (e.kind === 'subscription') return true;
    if (e.kind === 'single_lesson' && e.lessonId === lessonId) return true;
    if (e.kind === 'single_course' && courseId && e.courseId === courseId) return true;
    if (e.kind === 'zc_unlock' && e.lessonId === lessonId) return true;
  }
  return false;
}
