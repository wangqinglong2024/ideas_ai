import type { QuestionRow, QuestionOptionRow } from '../models/question'
import type { GradingResult } from '../models/grading-result'
import * as questionRepo from '../repositories/question-repo'

interface CorrectAnswerSingleChoice {
  optionId: string
}

interface CorrectAnswerMultipleChoice {
  optionIds: string[]
}

interface CorrectAnswerPinyin {
  pinyins: string[]
}

interface CorrectAnswerOrdering {
  order: number[]
}

interface CorrectAnswerFillBlank {
  answers: (string | string[])[]
}

function normalizePinyin(s: string): string {
  return s.trim().toLowerCase()
}

function gradeSingleChoice(
  _question: QuestionRow,
  userAnswer: unknown,
  options: QuestionOptionRow[],
): { isCorrect: boolean; correctAnswer: unknown } {
  const answer = userAnswer as { optionId?: string }
  const correctOpt = options.find(o => o.is_correct)
  const correctAnswer: CorrectAnswerSingleChoice = { optionId: correctOpt?.id ?? '' }
  const isCorrect = answer.optionId === correctAnswer.optionId
  return { isCorrect, correctAnswer }
}

function gradeMultipleChoice(
  _question: QuestionRow,
  userAnswer: unknown,
  options: QuestionOptionRow[],
): { isCorrect: boolean; correctAnswer: unknown } {
  const answer = userAnswer as { optionIds?: string[] }
  const correctIds = options.filter(o => o.is_correct).map(o => o.id).sort()
  const correctAnswer: CorrectAnswerMultipleChoice = { optionIds: correctIds }
  const userIds = [...(answer.optionIds ?? [])].sort()
  const isCorrect = correctIds.length === userIds.length && correctIds.every((id, i) => id === userIds[i])
  return { isCorrect, correctAnswer }
}

function gradePinyinAnnotation(
  question: QuestionRow,
  userAnswer: unknown,
): { isCorrect: boolean; correctAnswer: unknown } {
  const answer = userAnswer as { pinyins?: string[] }
  const correct = question.correct_answer as CorrectAnswerPinyin
  const userPinyins = answer.pinyins ?? []
  const correctPinyins = correct.pinyins ?? []
  const isCorrect =
    userPinyins.length === correctPinyins.length &&
    userPinyins.every((p, i) => normalizePinyin(p) === normalizePinyin(correctPinyins[i]))
  return { isCorrect, correctAnswer: correct }
}

function gradeSentenceOrdering(
  question: QuestionRow,
  userAnswer: unknown,
): { isCorrect: boolean; correctAnswer: unknown } {
  const answer = userAnswer as { order?: number[] }
  const correct = question.correct_answer as CorrectAnswerOrdering
  const userOrder = answer.order ?? []
  const correctOrder = correct.order ?? []
  const isCorrect =
    userOrder.length === correctOrder.length &&
    userOrder.every((v, i) => v === correctOrder[i])
  return { isCorrect, correctAnswer: correct }
}

function gradeFillInBlank(
  question: QuestionRow,
  userAnswer: unknown,
): { isCorrect: boolean; correctAnswer: unknown } {
  const answer = userAnswer as { answers?: string[] }
  const correct = question.correct_answer as CorrectAnswerFillBlank
  const userAnswers = answer.answers ?? []
  const correctAnswers = correct.answers ?? []

  if (userAnswers.length !== correctAnswers.length) {
    return { isCorrect: false, correctAnswer: correct }
  }

  const allCorrect = userAnswers.every((ua, i) => {
    const ca = correctAnswers[i]
    if (Array.isArray(ca)) {
      return ca.some(synonym => synonym.trim() === ua.trim())
    }
    return (ca as string).trim() === ua.trim()
  })

  return { isCorrect: allCorrect, correctAnswer: correct }
}

export async function grade(
  questionId: string,
  userAnswer: unknown,
): Promise<GradingResult> {
  const questions = await questionRepo.findQuestionsByIds([questionId])
  if (questions.length === 0) {
    return {
      questionId,
      isCorrect: false,
      scoreEarned: 0,
      scoreMax: 0,
      correctAnswer: null,
      knowledgeTags: [],
    }
  }

  const question = questions[0]
  let isCorrect = false
  let correctAnswer: unknown = question.correct_answer

  const optionTypes = ['single_choice', 'multiple_choice', 'listening_choice', 'reading_comprehension']

  if (optionTypes.includes(question.question_type)) {
    const options = await questionRepo.findOptionsByQuestionIds([questionId])
    if (question.question_type === 'multiple_choice') {
      const result = gradeMultipleChoice(question, userAnswer, options)
      isCorrect = result.isCorrect
      correctAnswer = result.correctAnswer
    } else {
      const result = gradeSingleChoice(question, userAnswer, options)
      isCorrect = result.isCorrect
      correctAnswer = result.correctAnswer
    }
  } else if (question.question_type === 'pinyin_annotation') {
    const result = gradePinyinAnnotation(question, userAnswer)
    isCorrect = result.isCorrect
    correctAnswer = result.correctAnswer
  } else if (question.question_type === 'sentence_ordering') {
    const result = gradeSentenceOrdering(question, userAnswer)
    isCorrect = result.isCorrect
    correctAnswer = result.correctAnswer
  } else if (question.question_type === 'fill_in_blank') {
    const result = gradeFillInBlank(question, userAnswer)
    isCorrect = result.isCorrect
    correctAnswer = result.correctAnswer
  }

  return {
    questionId,
    isCorrect,
    scoreEarned: isCorrect ? question.score_value : 0,
    scoreMax: question.score_value,
    correctAnswer,
    explanation: question.explanation_zh
      ? {
          zh: question.explanation_zh,
          en: question.explanation_en ?? undefined,
          vi: question.explanation_vi ?? undefined,
        }
      : undefined,
    knowledgeTags: question.knowledge_tags ?? [],
  }
}

export async function gradeBatch(
  answers: { questionId: string; userAnswer: unknown }[],
): Promise<GradingResult[]> {
  const results: GradingResult[] = []
  for (const a of answers) {
    const result = await grade(a.questionId, a.userAnswer)
    results.push(result)
  }
  return results
}
