-- E08 ZY-08-01..07 — Courses module
-- Extends the E07 stub courses/lessons tables with stage/chapter
-- modelling, pinyin-intro lessons, stage exam tracking, and entitlements
-- mock for the paywall.

-- ---------------------------------------------------------------------------
-- 1. courses: add stage_no, chapter, level, is_premium
-- ---------------------------------------------------------------------------
ALTER TABLE zhiyu.courses
  ADD COLUMN IF NOT EXISTS stage_no   smallint NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS level      smallint NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_premium boolean  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price_zc   integer  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS i18n_description jsonb NOT NULL DEFAULT '{}'::jsonb;

CREATE INDEX IF NOT EXISTS courses_track_stage_idx
  ON zhiyu.courses (track, stage_no, sort_order);

-- ---------------------------------------------------------------------------
-- 2. lessons: add chapter_no, lesson_no, is_free, is_pinyin_intro
-- ---------------------------------------------------------------------------
ALTER TABLE zhiyu.lessons
  ADD COLUMN IF NOT EXISTS chapter_no       smallint NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS lesson_no        smallint NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS is_free          boolean  NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS is_pinyin_intro  boolean  NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS price_zc         integer  NOT NULL DEFAULT 0;

-- ---------------------------------------------------------------------------
-- 3. profiles: add pinyin intro completion mark
-- ---------------------------------------------------------------------------
DO $$ BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables
             WHERE table_schema='zhiyu' AND table_name='profiles') THEN
    ALTER TABLE zhiyu.profiles
      ADD COLUMN IF NOT EXISTS pinyin_intro_completed_at timestamptz;
  END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4. stage_exam_attempts — large stage-end exam (P75% to pass).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zhiyu.stage_exam_attempts (
  id           uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id      uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track        text NOT NULL,
  stage_no     smallint NOT NULL,
  question_ids text[] NOT NULL DEFAULT '{}',
  answers      jsonb NOT NULL DEFAULT '{}'::jsonb,
  score_pct    numeric(5,2) NOT NULL DEFAULT 0,
  passed       boolean NOT NULL DEFAULT false,
  duration_s   integer NOT NULL DEFAULT 0,
  exam_token   text,
  status       text NOT NULL DEFAULT 'in_progress'
               CHECK (status IN ('in_progress','submitted','expired')),
  started_at   timestamptz NOT NULL DEFAULT now(),
  submitted_at timestamptz,
  created_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS stage_exam_user_idx
  ON zhiyu.stage_exam_attempts (user_id, track, stage_no, created_at DESC);
CREATE INDEX IF NOT EXISTS stage_exam_token_idx
  ON zhiyu.stage_exam_attempts (exam_token);

ALTER TABLE zhiyu.stage_exam_attempts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stage_exam_select_self ON zhiyu.stage_exam_attempts;
CREATE POLICY stage_exam_select_self ON zhiyu.stage_exam_attempts
  FOR SELECT TO authenticated USING (user_id = auth.uid());
DROP POLICY IF EXISTS stage_exam_insert_self ON zhiyu.stage_exam_attempts;
CREATE POLICY stage_exam_insert_self ON zhiyu.stage_exam_attempts
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
DROP POLICY IF EXISTS stage_exam_update_self ON zhiyu.stage_exam_attempts;
CREATE POLICY stage_exam_update_self ON zhiyu.stage_exam_attempts
  FOR UPDATE TO authenticated USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 5. stage_unlock — explicit unlock rows (so paywall + stage-exam can write).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zhiyu.stage_unlock (
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  track       text NOT NULL,
  stage_no    smallint NOT NULL,
  unlocked_at timestamptz NOT NULL DEFAULT now(),
  reason      text NOT NULL DEFAULT 'progression', -- progression | exam | purchase | admin
  PRIMARY KEY (user_id, track, stage_no)
);
ALTER TABLE zhiyu.stage_unlock ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS stage_unlock_select_self ON zhiyu.stage_unlock;
CREATE POLICY stage_unlock_select_self ON zhiyu.stage_unlock
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 6. entitlements — minimal mock for paywall (E13 will own this for real).
-- ---------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS zhiyu.entitlements (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  kind        text NOT NULL CHECK (kind IN ('subscription','single_lesson','single_course','zc_unlock')),
  -- Target identifiers; nullable when subscription is global.
  course_id   uuid REFERENCES zhiyu.courses(id) ON DELETE CASCADE,
  lesson_id   uuid REFERENCES zhiyu.lessons(id) ON DELETE CASCADE,
  source      text NOT NULL DEFAULT 'fake',
  expires_at  timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS entitlements_user_idx
  ON zhiyu.entitlements (user_id, kind);
CREATE INDEX IF NOT EXISTS entitlements_user_lesson_idx
  ON zhiyu.entitlements (user_id, lesson_id);
CREATE INDEX IF NOT EXISTS entitlements_user_course_idx
  ON zhiyu.entitlements (user_id, course_id);

ALTER TABLE zhiyu.entitlements ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS entitlements_select_self ON zhiyu.entitlements;
CREATE POLICY entitlements_select_self ON zhiyu.entitlements
  FOR SELECT TO authenticated USING (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- 7. RLS for courses/lessons (published readable by anyone)
-- ---------------------------------------------------------------------------
ALTER TABLE zhiyu.courses ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS courses_select_published ON zhiyu.courses;
CREATE POLICY courses_select_published ON zhiyu.courses
  FOR SELECT TO anon, authenticated USING (status = 'published');

ALTER TABLE zhiyu.lessons ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS lessons_select_via_course ON zhiyu.lessons;
CREATE POLICY lessons_select_via_course ON zhiyu.lessons
  FOR SELECT TO anon, authenticated USING (
    EXISTS (
      SELECT 1 FROM zhiyu.courses c
      WHERE c.id = zhiyu.lessons.course_id AND c.status = 'published'
    )
  );

-- Migration version is recorded by scripts/migrate.ts.
