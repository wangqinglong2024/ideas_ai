import { z } from 'zod'

// ===== 枚举 =====
export const QUESTION_TYPES = [
  'single_choice',
  'multiple_choice',
  'listening_choice',
  'pinyin_annotation',
  'sentence_ordering',
  'fill_in_blank',
  'reading_comprehension',
] as const

export type QuestionType = typeof QUESTION_TYPES[number]

export const QUESTION_DIFFICULTIES = ['easy', 'medium', 'hard'] as const
export type QuestionDifficulty = typeof QUESTION_DIFFICULTIES[number]

export const ASSESSMENT_LEVELS = ['lesson_quiz', 'unit_test', 'level_exam'] as const
export type AssessmentLevel = typeof ASSESSMENT_LEVELS[number]

export const EXAM_MODULES = ['listening', 'reading', 'vocabulary_grammar', 'writing'] as const
export type ExamModule = typeof EXAM_MODULES[number]

// ===== 数据库行类型 =====
export interface QuestionRow {
  id: string
  level_id: string
  unit_id: string | null
  lesson_id: string | null
  question_type: QuestionType
  difficulty: QuestionDifficulty
  exam_module: ExamModule | null
  assessment_levels: AssessmentLevel[]
  stem_zh: string
  stem_pinyin: string | null
  stem_en: string | null
  stem_vi: string | null
  audio_url: string | null
  image_url: string | null
  correct_answer: unknown
  explanation_zh: string | null
  explanation_en: string | null
  explanation_vi: string | null
  sentence_words: string[] | null
  target_chars: string | null
  blank_sentence: string | null
  reading_passage_id: string | null
  knowledge_tags: string[]
  is_active: boolean
  usage_count: number
  correct_rate: number
  score_value: number
  created_at: string
  updated_at: string
}

export interface QuestionOptionRow {
  id: string
  question_id: string
  label: string
  content_zh: string
  content_pinyin: string | null
  content_en: string | null
  content_vi: string | null
  image_url: string | null
  is_correct: boolean
  sort_order: number
  created_at: string
}

export interface ReadingPassageRow {
  id: string
  level_id: string
  title_zh: string
  title_pinyin: string | null
  content_zh: string
  content_pinyin: string | null
  content_en: string | null
  content_vi: string | null
  word_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// ===== 出题配置 =====
export interface QuestionPickConfig {
  levelId: string
  unitId?: string
  lessonId?: string
  assessmentType: AssessmentLevel
  examModule?: ExamModule
  count: number
  difficultyDistribution?: {
    easy: number
    medium: number
    hard: number
  }
  excludeQuestionIds?: string[]
}

// ===== Zod 校验 =====
export const QuestionPickConfigSchema = z.object({
  levelId: z.string().uuid(),
  unitId: z.string().uuid().optional(),
  lessonId: z.string().uuid().optional(),
  assessmentType: z.enum(ASSESSMENT_LEVELS),
  examModule: z.enum(EXAM_MODULES).optional(),
  count: z.number().int().min(1).max(50),
  difficultyDistribution: z.object({
    easy: z.number().min(0).max(1),
    medium: z.number().min(0).max(1),
    hard: z.number().min(0).max(1),
  }).optional(),
  excludeQuestionIds: z.array(z.string().uuid()).optional(),
})
