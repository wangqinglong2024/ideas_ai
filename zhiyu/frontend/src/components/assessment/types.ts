export type QuestionType =
  | 'single_choice'
  | 'multiple_choice'
  | 'listening_choice'
  | 'pinyin_annotation'
  | 'sentence_ordering'
  | 'fill_in_blank'
  | 'reading_comprehension'

export interface RenderedOption {
  id: string
  label: string
  contentZh: string
  contentPinyin?: string
  contentEn?: string
  contentVi?: string
  imageUrl?: string
}

export interface RenderedReadingPassage {
  titleZh: string
  titlePinyin?: string
  contentZh: string
  contentPinyin?: string
  contentEn?: string
  contentVi?: string
}

export interface RenderedQuestion {
  id: string
  questionType: QuestionType
  index: number
  stemZh: string
  stemPinyin?: string
  stemEn?: string
  stemVi?: string
  audioUrl?: string
  imageUrl?: string
  scoreValue: number
  options?: RenderedOption[]
  sentenceWords?: string[]
  targetChars?: string
  blankSentence?: string
  blankCount?: number
  readingPassage?: RenderedReadingPassage
}

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

export interface QuestionComponentProps {
  question: RenderedQuestion
  mode: 'answering' | 'review'
  userAnswer?: unknown
  gradingResult?: GradingResult
  onAnswer: (answer: unknown) => void
  disabled?: boolean
}
