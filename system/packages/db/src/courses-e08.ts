/**
 * E08 — Courses module: stage exam, stage unlock, entitlements (paywall mock).
 * Mirrors apps/api/drizzle/migrations/0008_e08_courses.sql.
 */
import { sql } from 'drizzle-orm';
import {
  boolean,
  index,
  integer,
  jsonb,
  numeric,
  smallint,
  text,
  timestamp,
  uuid,
} from 'drizzle-orm/pg-core';
import { zhiyu } from './schema.js';

export const stageExamAttempts = zhiyu.table(
  'stage_exam_attempts',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id').notNull(),
    track: text('track').notNull(),
    stageNo: smallint('stage_no').notNull(),
    questionIds: text('question_ids').array().notNull().default(sql`'{}'::text[]`),
    answers: jsonb('answers').notNull().default(sql`'{}'::jsonb`),
    scorePct: numeric('score_pct', { precision: 5, scale: 2 }).notNull().default('0'),
    passed: boolean('passed').notNull().default(false),
    durationS: integer('duration_s').notNull().default(0),
    examToken: text('exam_token'),
    status: text('status').notNull().default('in_progress'),
    startedAt: timestamp('started_at', { withTimezone: true }).notNull().defaultNow(),
    submittedAt: timestamp('submitted_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('stage_exam_user_idx').on(t.userId, t.track, t.stageNo, t.createdAt),
    tokenIdx: index('stage_exam_token_idx').on(t.examToken),
  }),
);

export const stageUnlock = zhiyu.table(
  'stage_unlock',
  {
    userId: uuid('user_id').notNull(),
    track: text('track').notNull(),
    stageNo: smallint('stage_no').notNull(),
    unlockedAt: timestamp('unlocked_at', { withTimezone: true }).notNull().defaultNow(),
    reason: text('reason').notNull().default('progression'),
  },
);

export const entitlements = zhiyu.table(
  'entitlements',
  {
    id: uuid('id').primaryKey().default(sql`gen_random_uuid()`),
    userId: uuid('user_id').notNull(),
    kind: text('kind').notNull(),
    courseId: uuid('course_id'),
    lessonId: uuid('lesson_id'),
    source: text('source').notNull().default('fake'),
    expiresAt: timestamp('expires_at', { withTimezone: true }),
    createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  },
  (t) => ({
    userIdx: index('entitlements_user_idx').on(t.userId, t.kind),
    userLessonIdx: index('entitlements_user_lesson_idx').on(t.userId, t.lessonId),
    userCourseIdx: index('entitlements_user_course_idx').on(t.userId, t.courseId),
  }),
);
