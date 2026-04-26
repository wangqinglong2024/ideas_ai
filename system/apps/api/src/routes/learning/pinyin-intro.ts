/**
 * E08 ZY-08-07 — Pinyin onboarding routes.
 *
 *   POST /api/v1/pinyin-intro/:lessonSlug/complete
 *   GET  /api/v1/me/pinyin-intro/status
 *
 * The 3 onboarding lessons live in the seeded `pinyin-intro` course. Once
 * all 3 are marked done, profiles.pinyin_intro_completed_at is stamped.
 */
import type { FastifyInstance } from 'fastify';
import { and, eq, sql } from 'drizzle-orm';
import { z } from 'zod';
import { courses, lessonProgress, lessons } from '@zhiyu/db';
import { db } from '../../db.js';
import { requireUser } from '../../auth-mw.js';

const PINYIN_SLUGS = ['pinyin-intro-initials', 'pinyin-intro-finals', 'pinyin-intro-tones'] as const;

export async function registerPinyinIntroRoutes(app: FastifyInstance): Promise<void> {
  app.get('/api/v1/me/pinyin-intro/status', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const rows = await db
      .select({ slug: lessons.slug, lessonId: lessons.id })
      .from(lessons)
      .innerJoin(courses, eq(lessons.courseId, courses.id))
      .where(and(eq(courses.track, 'pinyin'), eq(lessons.isPinyinIntro, true)));
    const lessonIds = rows.map((r) => r.lessonId);
    const completedRows = lessonIds.length === 0 ? [] : await db
      .select({ lessonId: lessonProgress.lessonId })
      .from(lessonProgress)
      .where(
        and(
          eq(lessonProgress.userId, user.id),
          eq(lessonProgress.status, 'done'),
          sql`${lessonProgress.lessonId} = ANY(${sql.raw(`ARRAY[${lessonIds.map((id) => `'${id}'::uuid`).join(',') || 'NULL::uuid'}]`)})`,
        ),
      );
    const doneSet = new Set(completedRows.map((r) => r.lessonId));
    const items = rows.map((r) => ({ slug: r.slug, lesson_id: r.lessonId, done: doneSet.has(r.lessonId) }));
    const all_done = items.length > 0 && items.every((i) => i.done);
    return { items, all_done };
  });

  app.post('/api/v1/pinyin-intro/:lessonSlug/complete', async (req, reply) => {
    const user = await requireUser(req, reply);
    if (!user) return;
    const params = z.object({ lessonSlug: z.enum(PINYIN_SLUGS) }).safeParse(req.params);
    if (!params.success) {
      reply.code(400);
      return { error: 'invalid_slug' };
    }
    const [row] = await db
      .select({ id: lessons.id })
      .from(lessons)
      .innerJoin(courses, eq(lessons.courseId, courses.id))
      .where(and(eq(courses.track, 'pinyin'), eq(lessons.slug, params.data.lessonSlug)))
      .limit(1);
    if (!row) {
      reply.code(404);
      return { error: 'pinyin_intro_lesson_missing' };
    }
    // Mark all 10 step slots done so the standard lesson UI considers it complete.
    await db.transaction(async (tx) => {
      for (let i = 0; i < 10; i += 1) {
        await tx
          .insert(lessonProgress)
          .values({
            userId: user.id,
            lessonId: row.id,
            stepIndex: i,
            status: 'done',
            score: '1.00',
            attempts: 1,
            payload: { kind: 'pinyin_intro_complete' },
            updatedAt: new Date(),
          })
          .onConflictDoUpdate({
            target: [lessonProgress.userId, lessonProgress.lessonId, lessonProgress.stepIndex],
            set: { status: 'done', score: '1.00', updatedAt: new Date() },
          });
      }
    });
    // Check if all 3 onboarding lessons are now done; if so, stamp profile.
    const completedSlugs = await db
      .select({ slug: lessons.slug })
      .from(lessonProgress)
      .innerJoin(lessons, eq(lessonProgress.lessonId, lessons.id))
      .innerJoin(courses, eq(lessons.courseId, courses.id))
      .where(
        and(
          eq(lessonProgress.userId, user.id),
          eq(lessonProgress.status, 'done'),
          eq(courses.track, 'pinyin'),
          eq(lessons.isPinyinIntro, true),
          eq(lessonProgress.stepIndex, 9),
        ),
      );
    const allDone = PINYIN_SLUGS.every((s) => completedSlugs.some((c) => c.slug === s));
    if (allDone) {
      try {
        await db.execute(
          sql`UPDATE zhiyu.profiles SET pinyin_intro_completed_at = COALESCE(pinyin_intro_completed_at, now()) WHERE id = ${user.id}`,
        );
      } catch {
        // If profiles table is missing in current env, do not block the call.
      }
    }
    return { ok: true, all_done: allDone };
  });
}
