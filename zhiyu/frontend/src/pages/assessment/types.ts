import type { RenderedQuestion, GradingResult } from '../../components/assessment/types'

export interface QuizStartResponse {
  attemptId: string
  questions: RenderedQuestion[]
  totalCount: number
  timeLimit: null
}

export interface UnitTestStartResponse {
  attemptId: string
  questions: RenderedQuestion[]
  totalCount: number
  timeLimit: null
  passingScore: number
}

export interface SubmitAnswerResponse extends GradingResult {}

export interface QuizFinishResponse {
  totalScore: number
  maxScore: number
  correctCount: number
  totalCount: number
  passed: boolean
  wrongQuestionIds: string[]
  srsItemsCreated: number
}

export interface UnitTestSubmitResponse {
  totalScore: number
  maxScore: number
  passingScore: number
  passed: boolean
  correctCount: number
  totalCount: number
  results: GradingResult[]
  wrongQuestionIds: string[]
  srsItemsCreated: number
  unitUnlocked: string | null
}

export interface SaveProgressResponse {
  savedAt: string
  dataSignature: string
}

export interface RestoreProgressResponse {
  currentIndex: number
  answers: Record<string, unknown>
  savedAt: string
  questions: RenderedQuestion[]
}
