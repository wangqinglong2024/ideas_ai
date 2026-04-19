export interface GradingResult {
  questionId: string
  isCorrect: boolean
  scoreEarned: number
  scoreMax: number
  correctAnswer: unknown
  explanation?: {
    zh: string
    en?: string
    vi?: string
  }
  knowledgeTags: string[]
}
