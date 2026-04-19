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
  questionType: string
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
