import * as questionEngine from './question-engine'
import * as gradingEngine from './grading-engine'
import * as assessmentRepo from '../repositories/assessment-repo'
import type { RenderedQuestion } from '../models/rendered-question'
import type { GradingResult } from '../models/grading-result'
import { BadRequest, Forbidden, NotFound } from '../core/exceptions'

interface StartQuizResult {
  attemptId: string
  questions: RenderedQuestion[]
  totalCount: number
  timeLimit: null
}

interface SubmitAnswerResult extends GradingResult {}

interface FinishQuizResult {
  totalScore: number
  maxScore: number
  correctCount: number
  totalCount: number
  passed: boolean
  wrongQuestionIds: string[]
  srsItemsCreated: number
}

export async function startQuiz(userId: string, lessonId: string, levelId: string): Promise<StartQuizResult> {
  // Check if there's an existing in-progress attempt
  const existing = await assessmentRepo.findInProgressAttempt(userId, 'lesson_quiz', lessonId, 'lesson_id')
  if (existing) {
    // Resume existing attempt
    const questions = await questionEngine.generateByIds(existing.question_ids)
    return {
      attemptId: existing.id,
      questions,
      totalCount: existing.total_questions,
      timeLimit: null,
    }
  }

  // Generate questions for the lesson
  const questions = await questionEngine.generate({
    levelId,
    lessonId,
    assessmentType: 'lesson_quiz',
    count: 5,
    difficultyDistribution: { easy: 0.6, medium: 0.3, hard: 0.1 },
  })

  const questionIds = questions.map(q => q.id)

  // Create quiz attempt
  const attempt = await assessmentRepo.createAttempt({
    user_id: userId,
    assessment_type: 'lesson_quiz',
    level_id: levelId,
    lesson_id: lessonId,
    status: 'in_progress',
    total_questions: questions.length,
    question_ids: questionIds,
  })

  return {
    attemptId: attempt.id,
    questions,
    totalCount: questions.length,
    timeLimit: null,
  }
}

export async function submitAnswer(
  userId: string,
  attemptId: string,
  questionId: string,
  userAnswer: unknown,
  timeSpentMs: number,
): Promise<SubmitAnswerResult> {
  // Validate attempt
  const attempt = await assessmentRepo.findAttemptById(attemptId)
  if (!attempt) throw NotFound('考核记录不存在')
  if (attempt.user_id !== userId) throw Forbidden('无权操作此考核')
  if (attempt.status !== 'in_progress') throw BadRequest('考核已结束')
  if (!attempt.question_ids.includes(questionId)) throw BadRequest('题目不属于此考核')

  // Check duplicate answer
  const existingAnswer = await assessmentRepo.findAnswerByAttemptAndQuestion(attemptId, questionId)
  if (existingAnswer) throw BadRequest('该题已作答，不可重复提交', 40901)

  // Grade the answer
  const result = await gradingEngine.grade(questionId, userAnswer)

  // Save answer
  await assessmentRepo.createAnswer({
    attempt_id: attemptId,
    question_id: questionId,
    user_answer: userAnswer as Record<string, unknown>,
    is_correct: result.isCorrect,
    score_earned: result.scoreEarned,
    score_max: result.scoreMax,
    time_spent_ms: timeSpentMs,
    knowledge_tags: result.knowledgeTags,
  })

  // Update attempt progress
  await assessmentRepo.updateAttempt(attemptId, {
    answered_count: attempt.answered_count + 1,
    current_index: attempt.current_index + 1,
  })

  return result
}

export async function finishQuiz(userId: string, attemptId: string): Promise<FinishQuizResult> {
  const attempt = await assessmentRepo.findAttemptById(attemptId)
  if (!attempt) throw NotFound('考核记录不存在')
  if (attempt.user_id !== userId) throw Forbidden('无权操作此考核')
  if (attempt.status !== 'in_progress') throw BadRequest('考核已结束或已提交')

  // Get all answers
  const answers = await assessmentRepo.findAnswersByAttempt(attemptId)

  const totalScore = answers.reduce((sum, a) => sum + a.score_earned, 0)
  const maxScore = answers.reduce((sum, a) => sum + a.score_max, 0)
  const correctCount = answers.filter(a => a.is_correct).length
  const wrongAnswers = answers.filter(a => !a.is_correct)
  const wrongQuestionIds = wrongAnswers.map(a => a.question_id)

  // Update attempt status
  await assessmentRepo.updateAttempt(attemptId, {
    status: 'graded',
    total_score: totalScore,
    is_passed: true, // Lesson quiz always passes
    submitted_at: new Date().toISOString(),
    graded_at: new Date().toISOString(),
  })

  // Write wrong questions to SRS (fire and forget)
  let srsItemsCreated = 0
  try {
    const srsService = await import('./srs-service')
    for (const wrong of wrongAnswers) {
      try {
        await srsService.addReviewItem(attempt.user_id, {
          source_type: 'wrong_answer',
          source_id: wrong.question_id,
          card_front: { type: 'lesson_quiz', questionId: wrong.question_id },
          card_back: { tags: wrong.knowledge_tags },
        })
        srsItemsCreated++
      } catch {
        // SRS write failure should not block quiz completion
      }
    }
  } catch {
    // SRS service not available, skip
  }

  return {
    totalScore,
    maxScore,
    correctCount,
    totalCount: attempt.total_questions,
    passed: true,
    wrongQuestionIds,
    srsItemsCreated,
  }
}
