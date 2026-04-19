import { z } from 'zod'

// ===== 数据库行类型 =====
export interface QuizAttemptRow {
  id: string
  user_id: string
  assessment_type: 'lesson_quiz' | 'unit_test' | 'level_exam'
  level_id: string
  unit_id: string | null
  lesson_id: string | null
  status: 'in_progress' | 'submitted' | 'graded' | 'expired'
  total_questions: number
  answered_count: number
  current_index: number
  question_ids: string[]
  module_groups: Record<string, string[]> | null
  total_score: number | null
  pass_score: number | null
  is_passed: boolean | null
  module_scores: Record<string, number> | null
  started_at: string
  submitted_at: string | null
  graded_at: string | null
  elapsed_seconds: number
  expires_at: string | null
  is_suspicious: boolean
  suspicious_reason: string | null
  is_retake: boolean
  attempt_number: number
  created_at: string
  updated_at: string
}

export interface QuizAnswerRow {
  id: string
  attempt_id: string
  question_id: string
  user_answer: unknown
  is_correct: boolean | null
  score_earned: number
  score_max: number
  answered_at: string
  time_spent_ms: number
  knowledge_tags: string[]
  created_at: string
}

export interface QuizProgressRow {
  id: string
  user_id: string
  attempt_id: string
  current_index: number
  answers_snapshot: Record<string, unknown>
  elapsed_seconds: number
  active_module: string | null
  data_signature: string
  expires_at: string
  is_expired: boolean
  updated_at: string
}

// ===== Zod 校验 =====
export const SubmitSingleAnswerSchema = z.object({
  questionId: z.string().uuid(),
  userAnswer: z.unknown(),
  timeSpentMs: z.number().int().min(0).default(0),
})

export type SubmitSingleAnswerInput = z.infer<typeof SubmitSingleAnswerSchema>

export const SubmitBatchAnswersSchema = z.object({
  answers: z.array(z.object({
    questionId: z.string().uuid(),
    userAnswer: z.unknown().transform(v => v as unknown),
    timeSpentMs: z.number().int().min(0).default(0),
  }).transform(v => ({ ...v, userAnswer: v.userAnswer as unknown }))).min(1),
})

export type SubmitBatchAnswersInput = z.infer<typeof SubmitBatchAnswersSchema>

export const SaveProgressSchema = z.object({
  currentIndex: z.number().int().min(0),
  answers: z.record(z.string(), z.unknown()),
  elapsedSeconds: z.number().int().min(0).default(0),
  activeModule: z.string().optional(),
})

export type SaveProgressInput = z.infer<typeof SaveProgressSchema>
