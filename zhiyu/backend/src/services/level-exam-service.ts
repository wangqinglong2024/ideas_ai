import * as questionEngine from './question-engine'
import * as gradingEngine from './grading-engine'
import * as assessmentRepo from '../repositories/assessment-repo'
import type { RenderedQuestion } from '../models/rendered-question'
import type { GradingResult } from '../models/grading-result'
import type { ExamModule } from '../models/question'
import { hmacSign } from '../utils/hmac-signer'
import { BadRequest, Forbidden, NotFound } from '../core/exceptions'
import { supabaseAdmin } from '../core/supabase'

const LEVEL_EXAM_PASS_SCORE = 85
const MODULE_PASS_SCORE = 60
const COOLDOWN_HOURS = 24

interface ModuleQuestions {
  module: ExamModule
  moduleName: { zh: string; en: string }
  questions: RenderedQuestion[]
  count: number
  passingScore: number
}

interface EligibilityResult {
  eligible: boolean
  reason: string | null
  lastAttemptAt: string | null
  nextAvailableAt: string | null
  completedUnits: number
  totalUnits: number
  hasCertificate: boolean
}

interface StartExamResult {
  attemptId: string
  modules: ModuleQuestions[]
  totalCount: number
  passingScore: number
  timeLimit: null
}

interface ModuleResult {
  module: string
  score: number
  maxScore: number
  passingScore: number
  passed: boolean
  correctCount: number
  totalCount: number
}

interface SubmitExamResult {
  totalScore: number
  maxScore: number
  passingScore: number
  passed: boolean
  moduleResults: ModuleResult[]
  results: GradingResult[]
  wrongQuestionIds: string[]
  srsItemsCreated: number
  certificate: {
    certificateNo: string
    levelName: string
    hskLevel: string
    cefrLevel: string
    issuedAt: string
  } | null
  nextRetakeAt: string | null
}

const MODULE_CONFIG: { module: ExamModule; nameZh: string; nameEn: string; count: number }[] = [
  { module: 'listening', nameZh: '听力', nameEn: 'Listening', count: 10 },
  { module: 'reading', nameZh: '阅读', nameEn: 'Reading', count: 10 },
  { module: 'vocabulary_grammar', nameZh: '词汇语法', nameEn: 'Vocabulary & Grammar', count: 10 },
  { module: 'writing', nameZh: '写作', nameEn: 'Writing', count: 5 },
]

const LEVEL_HSK_MAP: Record<number, string> = {
  1: 'HSK 1', 2: 'HSK 2', 3: 'HSK 3', 4: 'HSK 4', 5: 'HSK 5', 6: 'HSK 6',
  7: 'HSK 7', 8: 'HSK 7', 9: 'HSK 7-9', 10: 'HSK 7-9', 11: 'HSK 7-9', 12: 'HSK 7-9',
}

const LEVEL_CEFR_MAP: Record<number, string> = {
  1: 'A1', 2: 'A2', 3: 'B1', 4: 'B1', 5: 'B2', 6: 'B2',
  7: 'C1', 8: 'C1', 9: 'C2', 10: 'C2', 11: 'C2', 12: 'C2',
}

export async function checkEligibility(userId: string, levelId: string): Promise<EligibilityResult> {
  // Get level info
  const { data: level } = await supabaseAdmin
    .from('levels')
    .select('id, level_number')
    .eq('id', levelId)
    .single()

  // Check completed units
  const { data: units } = await supabaseAdmin
    .from('units')
    .select('id')
    .eq('level_id', levelId)
  const totalUnits = units?.length ?? 0

  // Check if user passed all unit tests for this level
  let completedUnits = 0
  if (units) {
    for (const unit of units) {
      const { data: passedAttempt } = await supabaseAdmin
        .from('quiz_attempts')
        .select('id')
        .eq('user_id', userId)
        .eq('unit_id', unit.id)
        .eq('assessment_type', 'unit_test')
        .eq('is_passed', true)
        .limit(1)
        .maybeSingle()
      if (passedAttempt) completedUnits++
    }
  }

  // Check certificate
  const cert = await assessmentRepo.findCertificateByUserAndLevel(userId, levelId)
  const hasCertificate = !!cert

  // Check cooldown
  const lastAttempt = await assessmentRepo.findLastGradedAttempt(userId, levelId, 'level_exam')
  let lastAttemptAt: string | null = null
  let nextAvailableAt: string | null = null

  if (lastAttempt && !lastAttempt.is_passed) {
    lastAttemptAt = lastAttempt.submitted_at
    const lastTime = new Date(lastAttempt.submitted_at!).getTime()
    const cooldownEnd = lastTime + COOLDOWN_HOURS * 60 * 60 * 1000
    if (Date.now() < cooldownEnd) {
      nextAvailableAt = new Date(cooldownEnd).toISOString()
      return {
        eligible: false,
        reason: '距上次考核不足 24 小时，请稍后再试',
        lastAttemptAt,
        nextAvailableAt,
        completedUnits,
        totalUnits,
        hasCertificate,
      }
    }
  }

  if (completedUnits < totalUnits) {
    return {
      eligible: false,
      reason: '请先完成所有单元测评',
      lastAttemptAt,
      nextAvailableAt: null,
      completedUnits,
      totalUnits,
      hasCertificate,
    }
  }

  void level // used for type checking

  return {
    eligible: true,
    reason: null,
    lastAttemptAt,
    nextAvailableAt: null,
    completedUnits,
    totalUnits,
    hasCertificate,
  }
}

export async function startExam(userId: string, levelId: string): Promise<StartExamResult> {
  // Check eligibility
  const eligibility = await checkEligibility(userId, levelId)
  if (!eligibility.eligible) {
    throw Forbidden(eligibility.reason ?? '暂不满足考核条件')
  }

  // Check existing in-progress attempt
  const existing = await assessmentRepo.findInProgressAttempt(userId, 'level_exam', levelId, 'level_id')
  if (existing && existing.module_groups) {
    const modules = await rebuildModules(existing)
    return {
      attemptId: existing.id,
      modules,
      totalCount: existing.total_questions,
      passingScore: LEVEL_EXAM_PASS_SCORE,
      timeLimit: null,
    }
  }

  // Generate questions per module
  const modules: ModuleQuestions[] = []
  const moduleGroups: Record<string, string[]> = {}
  let totalCount = 0

  for (const mc of MODULE_CONFIG) {
    const questions = await questionEngine.generate({
      levelId,
      assessmentType: 'level_exam',
      examModule: mc.module,
      count: mc.count,
      difficultyDistribution: { easy: 0.3, medium: 0.4, hard: 0.3 },
    })

    const qIds = questions.map(q => q.id)
    moduleGroups[mc.module] = qIds
    totalCount += questions.length

    modules.push({
      module: mc.module,
      moduleName: { zh: mc.nameZh, en: mc.nameEn },
      questions,
      count: questions.length,
      passingScore: MODULE_PASS_SCORE,
    })
  }

  const allQuestionIds = modules.flatMap(m => m.questions.map(q => q.id))
  const attemptCount = await assessmentRepo.countAttempts(userId, 'level_exam', levelId)

  const attempt = await assessmentRepo.createAttempt({
    user_id: userId,
    assessment_type: 'level_exam',
    level_id: levelId,
    status: 'in_progress',
    total_questions: totalCount,
    question_ids: allQuestionIds,
    module_groups: moduleGroups,
    pass_score: LEVEL_EXAM_PASS_SCORE,
    attempt_number: attemptCount + 1,
    is_retake: attemptCount > 0,
  })

  return {
    attemptId: attempt.id,
    modules,
    totalCount,
    passingScore: LEVEL_EXAM_PASS_SCORE,
    timeLimit: null,
  }
}

async function rebuildModules(attempt: { question_ids: string[]; module_groups: Record<string, string[]> | null }): Promise<ModuleQuestions[]> {
  const modules: ModuleQuestions[] = []
  if (!attempt.module_groups) return modules

  for (const mc of MODULE_CONFIG) {
    const qIds = attempt.module_groups[mc.module] ?? []
    const questions = await questionEngine.generateByIds(qIds)
    modules.push({
      module: mc.module,
      moduleName: { zh: mc.nameZh, en: mc.nameEn },
      questions,
      count: questions.length,
      passingScore: MODULE_PASS_SCORE,
    })
  }

  return modules
}

export async function submitExam(
  userId: string,
  attemptId: string,
  answers: { questionId: string; userAnswer: unknown; timeSpentMs: number }[],
): Promise<SubmitExamResult> {
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

  // Save answers
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

  // Calculate module scores
  const moduleResults: ModuleResult[] = []
  const moduleGroups = attempt.module_groups ?? {}
  const resultMap = new Map(gradingResults.map(r => [r.questionId, r]))
  const moduleScores: Record<string, number> = {}

  for (const mc of MODULE_CONFIG) {
    const qIds = moduleGroups[mc.module] ?? []
    const moduleGradings = qIds.map(id => resultMap.get(id)).filter(Boolean) as GradingResult[]
    const earned = moduleGradings.reduce((s, r) => s + r.scoreEarned, 0)
    const max = moduleGradings.reduce((s, r) => s + r.scoreMax, 0)
    const score = max > 0 ? (earned / max) * 100 : 0
    moduleScores[mc.module] = score

    moduleResults.push({
      module: mc.module,
      score,
      maxScore: 100,
      passingScore: MODULE_PASS_SCORE,
      passed: score >= MODULE_PASS_SCORE,
      correctCount: moduleGradings.filter(r => r.isCorrect).length,
      totalCount: moduleGradings.length,
    })
  }

  const totalEarned = gradingResults.reduce((s, r) => s + r.scoreEarned, 0)
  const totalMax = gradingResults.reduce((s, r) => s + r.scoreMax, 0)
  const totalScore = totalMax > 0 ? (totalEarned / totalMax) * 100 : 0
  const allModulesPassed = moduleResults.every(m => m.passed)
  const passed = totalScore >= LEVEL_EXAM_PASS_SCORE && allModulesPassed

  const wrongResults = gradingResults.filter(r => !r.isCorrect)
  const wrongQuestionIds = wrongResults.map(r => r.questionId)

  // Update attempt
  await assessmentRepo.updateAttempt(attemptId, {
    status: 'graded',
    total_score: totalScore,
    pass_score: LEVEL_EXAM_PASS_SCORE,
    is_passed: passed,
    module_scores: moduleScores,
    submitted_at: new Date().toISOString(),
    graded_at: new Date().toISOString(),
    answered_count: answers.length,
  })

  // SRS
  let srsItemsCreated = 0
  try {
    const srsService = await import('./srs-service')
    for (const wrong of wrongResults) {
      try {
        await srsService.addReviewItem(userId, {
          source_type: 'wrong_answer',
          source_id: wrong.questionId,
          card_front: { type: 'level_exam', questionId: wrong.questionId },
          card_back: { tags: wrong.knowledgeTags },
        })
        srsItemsCreated++
      } catch { /* skip */ }
    }
  } catch { /* skip */ }

  // Certificate issuance
  let certificate: SubmitExamResult['certificate'] = null
  if (passed) {
    const existingCert = await assessmentRepo.findCertificateByUserAndLevel(userId, attempt.level_id)
    if (!existingCert) {
      try {
        const { data: level } = await supabaseAdmin
          .from('levels')
          .select('level_number, name_zh, name_en')
          .eq('id', attempt.level_id)
          .single()

        if (level) {
          const { data: profile } = await supabaseAdmin
            .from('profiles')
            .select('nickname')
            .eq('id', userId)
            .maybeSingle()

          const certNo = await assessmentRepo.generateCertificateNo(level.level_number)
          const hskLevel = LEVEL_HSK_MAP[level.level_number] ?? `HSK ${level.level_number}`
          const cefrLevel = LEVEL_CEFR_MAP[level.level_number] ?? 'N/A'

          const cert = await assessmentRepo.createCertificate({
            user_id: userId,
            attempt_id: attemptId,
            level_id: attempt.level_id,
            certificate_no: certNo,
            user_nickname: profile?.nickname ?? 'User',
            level_name_zh: level.name_zh,
            level_name_en: level.name_en,
            level_number: level.level_number,
            hsk_level: hskLevel,
            cefr_level: cefrLevel,
            total_score: totalScore,
            module_scores: moduleScores,
          })

          certificate = {
            certificateNo: cert.certificate_no,
            levelName: level.name_en,
            hskLevel,
            cefrLevel,
            issuedAt: cert.issued_at,
          }
        }
      } catch {
        // Certificate issuance failure should not block exam result
      }
    }
  }

  const nextRetakeAt = !passed
    ? new Date(Date.now() + COOLDOWN_HOURS * 60 * 60 * 1000).toISOString()
    : null

  return {
    totalScore,
    maxScore: 100,
    passingScore: LEVEL_EXAM_PASS_SCORE,
    passed,
    moduleResults,
    results: gradingResults,
    wrongQuestionIds,
    srsItemsCreated,
    certificate,
    nextRetakeAt,
  }
}

export async function getExamReports(userId: string, levelId: string) {
  const attempts = await assessmentRepo.findAttemptsByLevelExam(userId, levelId)
  const cert = await assessmentRepo.findCertificateByUserAndLevel(userId, levelId)

  return {
    attempts: attempts.map(a => ({
      attemptId: a.id,
      totalScore: a.total_score,
      passed: a.is_passed,
      moduleScores: a.module_scores,
      createdAt: a.created_at,
      certificateNo: a.is_passed && cert ? cert.certificate_no : null,
    })),
  }
}

export { hmacSign }
