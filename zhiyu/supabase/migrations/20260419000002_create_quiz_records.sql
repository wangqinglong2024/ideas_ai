-- T05-002: 考核记录 Schema
CREATE TYPE quiz_attempt_status AS ENUM ('in_progress', 'submitted', 'graded', 'expired');

-- 考核尝试记录
CREATE TABLE quiz_attempts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  assessment_type assessment_level NOT NULL,
  level_id        UUID NOT NULL REFERENCES levels(id),
  unit_id         UUID REFERENCES units(id),
  lesson_id       UUID REFERENCES lessons(id),
  status          quiz_attempt_status NOT NULL DEFAULT 'in_progress',
  total_questions INTEGER NOT NULL DEFAULT 0,
  answered_count  INTEGER NOT NULL DEFAULT 0,
  current_index   INTEGER NOT NULL DEFAULT 0,
  question_ids    UUID[] NOT NULL DEFAULT '{}',
  module_groups   JSONB,
  total_score     DECIMAL(5,2),
  pass_score      DECIMAL(5,2),
  is_passed       BOOLEAN,
  module_scores   JSONB,
  started_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  submitted_at    TIMESTAMPTZ,
  graded_at       TIMESTAMPTZ,
  elapsed_seconds INTEGER DEFAULT 0,
  expires_at      TIMESTAMPTZ,
  is_suspicious   BOOLEAN NOT NULL DEFAULT false,
  suspicious_reason TEXT,
  is_retake       BOOLEAN NOT NULL DEFAULT false,
  attempt_number  INTEGER NOT NULL DEFAULT 1,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX idx_quiz_attempts_type ON quiz_attempts(assessment_type);
CREATE INDEX idx_quiz_attempts_level ON quiz_attempts(level_id);
CREATE INDEX idx_quiz_attempts_unit ON quiz_attempts(unit_id);
CREATE INDEX idx_quiz_attempts_lesson ON quiz_attempts(lesson_id);
CREATE INDEX idx_quiz_attempts_status ON quiz_attempts(status);
CREATE INDEX idx_quiz_attempts_user_level_type ON quiz_attempts(user_id, level_id, assessment_type);
CREATE INDEX idx_quiz_attempts_retake_check ON quiz_attempts(user_id, level_id, assessment_type, submitted_at DESC);

-- 逐题作答记录
CREATE TABLE quiz_answers (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  question_id     UUID NOT NULL REFERENCES questions(id),
  user_answer     JSONB NOT NULL,
  is_correct      BOOLEAN,
  score_earned    DECIMAL(5,2) DEFAULT 0,
  score_max       DECIMAL(5,2) NOT NULL,
  answered_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  time_spent_ms   INTEGER DEFAULT 0,
  knowledge_tags  TEXT[] DEFAULT '{}',
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_quiz_answers_attempt ON quiz_answers(attempt_id);
CREATE INDEX idx_quiz_answers_question ON quiz_answers(question_id);
CREATE INDEX idx_quiz_answers_incorrect ON quiz_answers(attempt_id) WHERE is_correct = false;

-- 答题进度保存
CREATE TABLE quiz_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID NOT NULL REFERENCES auth.users(id),
  attempt_id      UUID NOT NULL REFERENCES quiz_attempts(id) ON DELETE CASCADE,
  current_index   INTEGER NOT NULL DEFAULT 0,
  answers_snapshot JSONB NOT NULL DEFAULT '{}',
  elapsed_seconds INTEGER NOT NULL DEFAULT 0,
  active_module   TEXT,
  data_signature  TEXT NOT NULL,
  expires_at      TIMESTAMPTZ NOT NULL,
  is_expired      BOOLEAN NOT NULL DEFAULT false,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX idx_quiz_progress_user_attempt ON quiz_progress(user_id, attempt_id);

-- 计算考核分数的函数
CREATE OR REPLACE FUNCTION calculate_attempt_score(p_attempt_id UUID)
RETURNS TABLE(total_score DECIMAL, module_scores JSONB, is_passed BOOLEAN)
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_attempt RECORD;
  v_total DECIMAL(5,2) := 0;
  v_modules JSONB := '{}';
  v_pass_score DECIMAL(5,2);
BEGIN
  SELECT * INTO v_attempt FROM quiz_attempts WHERE id = p_attempt_id;

  SELECT COALESCE(SUM(score_earned), 0) INTO v_total
  FROM quiz_answers WHERE attempt_id = p_attempt_id;

  IF v_attempt.assessment_type = 'lesson_quiz' THEN
    RETURN QUERY SELECT v_total, NULL::JSONB, true;
    RETURN;
  ELSIF v_attempt.assessment_type = 'unit_test' THEN
    v_pass_score := 70;
    RETURN QUERY SELECT v_total, NULL::JSONB, (v_total >= v_pass_score);
    RETURN;
  ELSIF v_attempt.assessment_type = 'level_exam' THEN
    v_pass_score := 85;
    -- Calculate module scores from module_groups
    IF v_attempt.module_groups IS NOT NULL THEN
      DECLARE
        v_module TEXT;
        v_question_ids UUID[];
        v_module_score DECIMAL(5,2);
        v_all_pass BOOLEAN := true;
      BEGIN
        FOR v_module IN SELECT jsonb_object_keys(v_attempt.module_groups)
        LOOP
          SELECT array_agg(value::text::uuid) INTO v_question_ids
          FROM jsonb_array_elements_text(v_attempt.module_groups -> v_module);

          SELECT COALESCE(SUM(score_earned), 0) INTO v_module_score
          FROM quiz_answers
          WHERE attempt_id = p_attempt_id AND question_id = ANY(v_question_ids);

          v_modules := v_modules || jsonb_build_object(v_module, v_module_score);
          IF v_module_score < 60 THEN v_all_pass := false; END IF;
        END LOOP;

        RETURN QUERY SELECT v_total, v_modules, (v_total >= v_pass_score AND v_all_pass);
      END;
    ELSE
      RETURN QUERY SELECT v_total, v_modules, (v_total >= v_pass_score);
    END IF;
    RETURN;
  END IF;
END;
$$;

-- 检查是否可以重考（24h冷却）
CREATE OR REPLACE FUNCTION can_retake_exam(p_user_id UUID, p_level_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql SECURITY DEFINER AS $$
DECLARE
  v_last_submitted TIMESTAMPTZ;
BEGIN
  SELECT submitted_at INTO v_last_submitted
  FROM quiz_attempts
  WHERE user_id = p_user_id
    AND level_id = p_level_id
    AND assessment_type = 'level_exam'
    AND status = 'graded'
    AND is_passed = false
  ORDER BY submitted_at DESC
  LIMIT 1;

  IF v_last_submitted IS NULL THEN
    RETURN true;
  END IF;

  RETURN (now() - v_last_submitted) > INTERVAL '24 hours';
END;
$$;

-- RLS
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "quiz_attempts_user_select" ON quiz_attempts
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "quiz_attempts_user_insert" ON quiz_attempts
  FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);

CREATE POLICY "quiz_answers_user_select" ON quiz_answers
  FOR SELECT TO authenticated
  USING (attempt_id IN (SELECT id FROM quiz_attempts WHERE user_id = auth.uid()));

CREATE POLICY "quiz_progress_user_all" ON quiz_progress
  FOR ALL TO authenticated USING (auth.uid() = user_id);
