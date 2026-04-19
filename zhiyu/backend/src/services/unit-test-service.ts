import * as questionEngine from './question-engine'
import * as gradingEngine from './grading-engine'
import * as assessmentRepo from '../repositories/assessment-repo'
import type { RenderedQuestion } from '../models/rendered-question'
import type { GradingResult } from '../models/grading-result'
import { hmacSign, hmacVerify } from '../utils/hmac-signer'
import { BadRequest, Forbidden, NotFound } from '../core/exceptions'

const UNIT_TEST_PASS_SCORE = 70
const UNIT_TEST_QUESTION_COUNT = 15

interface StartTestResult {
  attemptId: string
  questions: RenderedQuestion[]
  totalCount: number
  timeLimit: null
  passingScore: number
}

interface SaveProgressResult {
  savedAt: string
  dataSignature: string
}

interface RestoreProgressResult {
  currentIndex: number
  answers: Record<string, unknown>
  savedAt: string
  questions: RenderedQuestion[]
}

interface SubmitTestResult {
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

export async function startTest(userId: string, unitId: string, levelId: string): Promise<StartTestResult> {
  // Check for existing in-progress attempt
  const existing = await assessmentRepo.findInProgressAttempt(userId, 'unit_test', unitId, 'unit_id')
  if (existing) {
    const questions = await questionEngine.generateByIds(existing.question_ids)
    return {
      attemptId: existing.id,
      questions,
      totalCount: existing.total_questions,
      timeLimit: null,
      passingScore: UNIT_TEST_PASS_SCORE,
    }
  }

  const questions = await questionEngine.generate({
    levelId,
    unitId,
    assessmentType: 'unit_test',
    count: UNIT_TEST_QUESTION_COUNT,
    difficultyDistribution: { easy: 0.4, medium: 0.4, hard: 0.2 },
  })

  const questionIds = questions.map(q => q.id)
  const attemptCount = await assessmentRepo.countAttempts(userId, 'unit_test', levelId)

  const attempt = await assessmentRepo.createAttempt({
    user_id: userId,
    assessment_type: 'unit_test',
    level_id: levelId,
    unit_id: unitId,
    status: 'in_progress',
    total_questions: questions.length,
    question_ids: questionIds,
    pass_score: UNIT_TEST_PASS_SCORE,
    attempt_number: attemptCount + 1,
    is_retake: attemptCount > 0,
  })

  return {
    attemptId: attempt.id,
    questions,
    totalCount: questions.length,
    timeLimit: null,
    passingScore: UNIT_TEST_PASS_SCORE,
  }
}

export async function saveProgress(
  userId: string,
  attemptId: string,
  currentIndex: number,
  answers: Record<string, unknown>,
  elapsedSeconds: number,
): Promise<SaveProgressResult> {
  const attempt = await assessmentRepo.findAttemptById(attemptId)
  if (!attempt) throw NotFound('考核记录不存在')
  if (attempt.user_id !== userId) throw Forbidden('无权操作此考核')
  if (attempt.status !== 'in_progress') throw BadRequest('考核已结束')

  const dataSignature = hmacSign({ attemptId, currentIndex, answers, elapsedSeconds })
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()

  await assessmentRepo.upsertProgress({
    user_id: userId,
    attempt_id: attemptId,
    current_index: currentIndex,
    answers_snapshot: answers,
    elapsed_seconds: elapsedSeconds,
    data_signature: dataSignature,
    expires_at: expiresAt,
  })

  return {
    savedAt: new Date().toISOString(),
    dataSignature,
  }
}

export async function restoreProgress(
  userId: string,
  attemptId: string,
): Promise<RestoreProgressResult> {
  const attempt = await assessmentRepo.findAttemptById(attemptId)
  if (!attempt) throw NotFound('考核记录不存在')
  if (attempt.user_id !== userId) throw Forbidden('无权操作此考核')
  if (attempt.status !== 'in_progress') throw BadRequest('考核已结束')

  const progress = await assessmentRepo.findProgress(userId, attemptId)
  if (!progress) throw NotFound('无保存的进度')

  // Verify signature
  const expected = hmacSign({
    attemptId,
    currentIndex: progress.current_index,
    answers: progress.answers_snapshot,
    elapsedSeconds: progress.elapsed_seconds,
  })
  if (!hmacVerify({ attemptId, currentIndex: progress.current_index, answers: progress.answers_snapshot, elapsedSeconds: progress.elapsed_seconds }, expected)) {
    throw BadRequest('进度数据签名验证失败，请重新开始')
  }

  const questions = await questionEngine.generateByIds(attempt.question_ids)

  return {
    currentIndex: progress.current_index,
    answers: progress.answers_snapshot,
    savedAt: progress.updated_at,
    questions,
  }
}

export async function submitTest(
  userId: string,
  attemptId: string,
  answers: { questionId: string; userAnswer: unknown; timeSpentMs: number }[],
): Promise<SubmitTestResult> {
  const attempt = await assessmentRepo.findAttemptById(attemptId)
  if (!attempt) throw NotFound('考核记录不存在')
  if (attempt.user_id !== userId) throw Forbidden('无权操作此考核')
  if (attempt.status !== 'in_progress') throw BadRequest('考核已提交或已结束')

  if (answers.length < attempt.total_questions) {
    throw BadRequest('请完成所有题目后再提交')
  }

  // Grade all answers
  const gradingResults = await gradingEngine.gradeBatch(
    answers.map(a => ({ questionId: a.questionId, userAnswer: a.userAnswer })),
  )

  // Save answers to DB
  const answerRows = answers.map((a, i) => ({
    attempt_id: attemptId,
    question_id: a.questionId,
    user_answer: a.userAnswer as Record<string, unknown>,
    is_correct: gradingResults[i].isCorrect,
    score_earned: gradingResults[i].scoreEarned,
    score_max: gradingResults[i].scoreMax,
    time_spent_ms: a.timeSpentMs,
    knowledge_tags: gradingResults[i].knowledgeTags,
  }))
  await assessmentRepo.createAnswersBatch(answerRows)

  const totalScore = gradingResults.reduce((s, r) => s + r.scoreEarned, 0)
  const maxScore = gradingResults.reduce((s, r) => s + r.scoreMax, 0)
  const normalizedScore = maxScore > 0 ? (totalScore / maxScore) * 100 : 0
  const correctCount = gradingResults.filter(r => r.isCorrect).length
  const passed = normalizedScore >= UNIT_TEST_PASS_SCORE
  const wrongResults = gradingResults.filter(r => !r.isCorrect)
  const wrongQuestionIds = wrongResults.map(r => r.questionId)

  // Update attempt
  await assessmentRepo.updateAttempt(attemptId, {
    status: 'graded',
    total_score: normalizedScore,
    pass_score: UNIT_TEST_PASS_SCORE,
    is_passed: passed,
    submitted_at: new Date().toISOString(),
    graded_at: new Date().toISOString(),
    answered_count: answers.length,
  })

  // SRS: write wrong answers
  let srsItemsCreated = 0
  try {
    const srsService = await import('./srs-service')
    for (const wrong of wrongResults) {
      try {
        await srsService.addReviewItem(userId, {
          source_type: 'wrong_answer',
          source_id: wrong.questionId,
          card_front: { type: 'unit_test', questionId: wrong.questionId },
          card_back: { tags: wrong.knowledgeTags },
        })
        srsItemsCreated++
      } catch {
        // SRS write failure should not block
      }
    }
  } catch {
    // SRS not available
  }

  // Unlock next unit if passed
  const unitUnlocked: string | null = null
  // TODO: integrate with course-progress-service when unlockNextUnit is implemented

  return {
    totalScore: normalizedScore,
    maxScore: 100,
    passingScore: UNIT_TEST_PASS_SCORE,
    passed,
    correctCount,
    totalCount: attempt.total_questions,
    results: gradingResults,
    wrongQuestionIds,
    srsItemsCreated,
    unitUnlocked,
  }
}
