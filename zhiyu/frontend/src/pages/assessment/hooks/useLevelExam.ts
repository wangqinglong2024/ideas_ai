import { useState, useCallback, useRef } from 'react'
import type { RenderedQuestion, GradingResult } from '../../../components/assessment/types'
import { apiFetch } from '../../../features/course-learning/services/api'

type ExamStatus = 'loading' | 'checking' | 'ready' | 'answering' | 'submitting' | 'completed'

interface ExamModule {
  module: string
  questions: RenderedQuestion[]
}

interface EligibilityResponse {
  eligible: boolean
  reason?: string
  nextAvailableAt?: string
}

interface ExamStartResponse {
  attemptId: string
  modules: ExamModule[]
  totalCount: number
  timeLimit: null
}

interface ExamSubmitResponse {
  totalScore: number
  maxScore: number
  passed: boolean
  passingScore: number
  moduleScores: {
    module: string
    score: number
    maxScore: number
    passed: boolean
    passingScore: number
  }[]
  results: GradingResult[]
  certificateNo?: string
}

export function useLevelExam(levelId: string) {
  const [status, setStatus] = useState<ExamStatus>('loading')
  const [eligible, setEligible] = useState(false)
  const [eligibilityReason, setEligibilityReason] = useState('')
  const [modules, setModules] = useState<ExamModule[]>([])
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [attemptId, setAttemptId] = useState('')
  const [answers, setAnswers] = useState<Map<string, unknown>>(new Map())
  const [submitResult, setSubmitResult] = useState<ExamSubmitResponse | null>(null)
  const startTimeRef = useRef(Date.now())
  const answerTimesRef = useRef<Map<string, number>>(new Map())

  const checkEligibility = useCallback(async () => {
    setStatus('checking')
    const res = await apiFetch<EligibilityResponse>(`/api/v1/levels/${levelId}/exam/eligibility`)
    setEligible(res.eligible)
    setEligibilityReason(res.reason ?? '')
    setStatus(res.eligible ? 'ready' : 'checking')
    return res
  }, [levelId])

  const startExam = useCallback(async () => {
    setStatus('loading')
    const res = await apiFetch<ExamStartResponse>(`/api/v1/levels/${levelId}/exam`, {
      method: 'POST',
    })
    setAttemptId(res.attemptId)
    setModules(res.modules)
    setCurrentModuleIndex(0)
    setCurrentQuestionIndex(0)
    setAnswers(new Map())
    startTimeRef.current = Date.now()
    setStatus('answering')
  }, [levelId])

  const currentModule = modules[currentModuleIndex] ?? null
  const allQuestions = modules.flatMap(m => m.questions)
  const currentQuestion = currentModule?.questions[currentQuestionIndex] ?? null

  const setAnswer = useCallback((questionId: string, answer: unknown) => {
    setAnswers(prev => {
      const next = new Map(prev)
      next.set(questionId, answer)
      return next
    })
    answerTimesRef.current.set(questionId, Date.now() - startTimeRef.current)
  }, [])

  const goToModule = useCallback((index: number) => {
    if (index >= 0 && index < modules.length) {
      setCurrentModuleIndex(index)
      setCurrentQuestionIndex(0)
    }
  }, [modules.length])

  const goToQuestion = useCallback((index: number) => {
    const mod = modules[currentModuleIndex]
    if (mod && index >= 0 && index < mod.questions.length) {
      setCurrentQuestionIndex(index)
    }
  }, [modules, currentModuleIndex])

  const submitExam = useCallback(async () => {
    setStatus('submitting')
    const answersArr = allQuestions.map(q => ({
      questionId: q.id,
      userAnswer: answers.get(q.id) ?? null,
      timeSpentMs: answerTimesRef.current.get(q.id) ?? 0,
    }))

    const res = await apiFetch<ExamSubmitResponse>(`/api/v1/assessments/${attemptId}/submit-exam`, {
      method: 'POST',
      body: JSON.stringify({ answers: answersArr }),
    })
    setSubmitResult(res)
    setStatus('completed')
    return res
  }, [attemptId, allQuestions, answers])

  return {
    status,
    eligible,
    eligibilityReason,
    modules,
    currentModuleIndex,
    currentQuestionIndex,
    currentModule,
    currentQuestion,
    allQuestions,
    attemptId,
    answers,
    submitResult,
    answeredCount: answers.size,
    totalCount: allQuestions.length,
    checkEligibility,
    startExam,
    setAnswer,
    goToModule,
    goToQuestion,
    submitExam,
  }
}
