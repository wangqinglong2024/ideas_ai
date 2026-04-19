import { useState, useCallback } from 'react'
import type { RenderedQuestion, GradingResult } from '../../../components/assessment/types'
import type { QuizStartResponse, SubmitAnswerResponse, QuizFinishResponse } from '../types'
import { apiFetch } from '../../../features/course-learning/services/api'

type QuizStatus = 'loading' | 'answering' | 'feedback' | 'completed'

export function useLessonQuiz(lessonId: string) {
  const [status, setStatus] = useState<QuizStatus>('loading')
  const [questions, setQuestions] = useState<RenderedQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [attemptId, setAttemptId] = useState<string>('')
  const [results, setResults] = useState<GradingResult[]>([])
  const [finishResult, setFinishResult] = useState<QuizFinishResponse | null>(null)
  const [currentFeedback, setCurrentFeedback] = useState<GradingResult | null>(null)

  const startQuiz = useCallback(async () => {
    setStatus('loading')
    const res = await apiFetch<QuizStartResponse>(`/api/v1/lessons/${lessonId}/quiz`, {
      method: 'POST',
    })
    setAttemptId(res.attemptId)
    setQuestions(res.questions)
    setCurrentIndex(0)
    setResults([])
    setStatus('answering')
  }, [lessonId])

  const submitAnswer = useCallback(async (questionId: string, answer: unknown, timeSpentMs: number) => {
    const res = await apiFetch<SubmitAnswerResponse>(`/api/v1/assessments/${attemptId}/answers`, {
      method: 'POST',
      body: JSON.stringify({ questionId, userAnswer: answer, timeSpentMs }),
    })
    setResults(prev => [...prev, res])
    setCurrentFeedback(res)
    setStatus('feedback')
    return res
  }, [attemptId])

  const nextQuestion = useCallback(() => {
    setCurrentFeedback(null)
    if (currentIndex >= questions.length - 1) {
      // All questions answered
      void finishQuiz()
    } else {
      setCurrentIndex(prev => prev + 1)
      setStatus('answering')
    }
  }, [currentIndex, questions.length])

  const finishQuiz = useCallback(async () => {
    const res = await apiFetch<QuizFinishResponse>(`/api/v1/assessments/${attemptId}/submit`, {
      method: 'POST',
    })
    setFinishResult(res)
    setStatus('completed')
    return res
  }, [attemptId])

  return {
    status,
    questions,
    currentIndex,
    currentQuestion: questions[currentIndex] ?? null,
    attemptId,
    results,
    finishResult,
    currentFeedback,
    startQuiz,
    submitAnswer,
    nextQuestion,
    finishQuiz,
  }
}
