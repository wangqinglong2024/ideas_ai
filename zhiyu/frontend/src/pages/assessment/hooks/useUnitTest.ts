import { useState, useCallback, useRef } from 'react'
import type { RenderedQuestion } from '../../../components/assessment/types'
import type { UnitTestStartResponse, UnitTestSubmitResponse } from '../types'
import { apiFetch } from '../../../features/course-learning/services/api'

type TestStatus = 'loading' | 'answering' | 'submitting' | 'completed'

export function useUnitTest(unitId: string) {
  const [status, setStatus] = useState<TestStatus>('loading')
  const [questions, setQuestions] = useState<RenderedQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attemptId, setAttemptId] = useState<string>('')
  const [answers, setAnswers] = useState<Map<string, unknown>>(new Map())
  const [submitResult, setSubmitResult] = useState<UnitTestSubmitResponse | null>(null)
  const [passingScore, setPassingScore] = useState(70)
  const answerTimesRef = useRef<Map<string, number>>(new Map())
  const startTimeRef = useRef<number>(0)

  const startTest = useCallback(async () => {
    setStatus('loading')
    const res = await apiFetch<UnitTestStartResponse>(`/api/v1/units/${unitId}/test`, {
      method: 'POST',
    })
    setAttemptId(res.attemptId)
    setQuestions(res.questions)
    setPassingScore(res.passingScore)
    setCurrentIndex(0)
    setAnswers(new Map())
    startTimeRef.current = Date.now()
    setStatus('answering')
  }, [unitId])

  const setAnswer = useCallback((questionId: string, answer: unknown) => {
    setAnswers(prev => {
      const next = new Map(prev)
      next.set(questionId, answer)
      return next
    })
    answerTimesRef.current.set(questionId, Date.now() - startTimeRef.current)

    // Auto-save progress
    void saveProgress()
  }, [])

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index)
    }
  }, [questions.length])

  const saveProgress = useCallback(async () => {
    if (!attemptId) return
    try {
      const answersObj: Record<string, unknown> = {}
      answers.forEach((v, k) => { answersObj[k] = v })
      const elapsed = Math.floor((Date.now() - startTimeRef.current) / 1000)
      await apiFetch(`/api/v1/assessments/${attemptId}/progress`, {
        method: 'PUT',
        body: JSON.stringify({
          currentIndex,
          answers: answersObj,
          elapsedSeconds: elapsed,
        }),
      })
    } catch {
      // Progress save failure should not block user
    }
  }, [attemptId, answers, currentIndex])

  const submitTest = useCallback(async () => {
    setStatus('submitting')
    const answersArr = questions.map(q => ({
      questionId: q.id,
      userAnswer: answers.get(q.id) ?? null,
      timeSpentMs: answerTimesRef.current.get(q.id) ?? 0,
    }))

    const res = await apiFetch<UnitTestSubmitResponse>(`/api/v1/assessments/${attemptId}/submit-test`, {
      method: 'POST',
      body: JSON.stringify({ answers: answersArr }),
    })
    setSubmitResult(res)
    setStatus('completed')
    return res
  }, [attemptId, questions, answers])

  return {
    status,
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] ?? null,
    attemptId,
    answers,
    submitResult,
    passingScore,
    answeredCount: answers.size,
    startTest,
    setAnswer,
    goToQuestion,
    saveProgress,
    submitTest,
  }
}
