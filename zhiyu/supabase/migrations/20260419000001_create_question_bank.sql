-- T05-001: 题库 Schema
-- 枚举类型
CREATE TYPE question_type AS ENUM (
  'single_choice',
  'multiple_choice',
  'listening_choice',
  'pinyin_annotation',
  'sentence_ordering',
  'fill_in_blank',
  'reading_comprehension'
);

CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');

CREATE TYPE assessment_level AS ENUM ('lesson_quiz', 'unit_test', 'level_exam');

CREATE TYPE exam_module AS ENUM ('listening', 'reading', 'vocabulary_grammar', 'writing');

-- 阅读理解文章表
CREATE TABLE reading_passages (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id        UUID NOT NULL REFERENCES levels(id),
  title_zh        TEXT NOT NULL,
  title_pinyin    TEXT,
  content_zh      TEXT NOT NULL,
  content_pinyin  TEXT,
  content_en      TEXT,
  content_vi      TEXT,
  word_count      INTEGER NOT NULL DEFAULT 0,
  is_active       BOOLEAN NOT NULL DEFAULT true,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_reading_passages_level ON reading_passages(level_id);

-- 题目主表
CREATE TABLE questions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level_id        UUID NOT NULL REFERENCES levels(id),
  unit_id         UUID REFERENCES units(id),
  lesson_id       UUID REFERENCES lessons(id),
  question_type   question_type NOT NULL,
  difficulty      question_difficulty NOT NULL DEFAULT 'easy',
  exam_module     exam_module,
  assessment_levels assessment_level[] NOT NULL DEFAULT '{lesson_quiz}',
  stem_zh         TEXT NOT NULL,
  stem_pinyin     TEXT,
  stem_en         TEXT,
  stem_vi         TEXT,
  audio_url       TEXT,
  image_url       TEXT,
  correct_answer  JSONB NOT NULL,
  explanation_zh  TEXT,
  explanation_en  TEXT,
  explanation_vi  TEXT,
  sentence_words  JSONB,
  target_chars    TEXT,
  blank_sentence  TEXT,
  reading_passage_id UUID REFERENCES reading_passages(id),
  knowledge_tags  TEXT[] DEFAULT '{}',
  is_active       BOOLEAN NOT NULL DEFAULT true,
  usage_count     INTEGER NOT NULL DEFAULT 0,
  correct_rate    DECIMAL(5,2) DEFAULT 0,
  score_value     INTEGER NOT NULL DEFAULT 5,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_questions_level ON questions(level_id);
CREATE INDEX idx_questions_unit ON questions(unit_id);
CREATE INDEX idx_questions_lesson ON questions(lesson_id);
CREATE INDEX idx_questions_type ON questions(question_type);
CREATE INDEX idx_questions_difficulty ON questions(difficulty);
CREATE INDEX idx_questions_module ON questions(exam_module);
CREATE INDEX idx_questions_active ON questions(is_active) WHERE is_active = true;
CREATE INDEX idx_questions_assessment_levels ON questions USING GIN(assessment_levels);
CREATE INDEX idx_questions_knowledge_tags ON questions USING GIN(knowledge_tags);

-- 选项表
CREATE TABLE question_options (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id     UUID NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  label           CHAR(1) NOT NULL,
  content_zh      TEXT NOT NULL,
  content_pinyin  TEXT,
  content_en      TEXT,
  content_vi      TEXT,
  image_url       TEXT,
  is_correct      BOOLEAN NOT NULL DEFAULT false,
  sort_order      INTEGER NOT NULL DEFAULT 0,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_question_options_question ON question_options(question_id);

-- RLS
ALTER TABLE reading_passages ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE question_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "questions_read_authenticated" ON questions
  FOR SELECT TO authenticated USING (is_active = true);

CREATE POLICY "options_read_authenticated" ON question_options
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "passages_read_authenticated" ON reading_passages
  FOR SELECT TO authenticated USING (is_active = true);
