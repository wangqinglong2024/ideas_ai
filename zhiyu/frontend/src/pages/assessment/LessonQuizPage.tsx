import { useEffect, useRef, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLessonQuiz } from './hooks/useLessonQuiz'
import { QuizHeader } from './components/QuizHeader'
import { QuestionRenderer } from '../../components/assessment/QuestionRenderer'
import { LessonQuizResult } from './components/LessonQuizResult'

export const LessonQuizPage = () => {
  const { lessonId } = useParams<{ lessonId: string }>()
  const navigate = useNavigate()
  const quiz = useLessonQuiz(lessonId ?? '')
  const [answerMap] = useState(() => new Map<string, unknown>())
  const startTimeRef = useRef(Date.now())
  const initialized = useRef(false)

  useEffect(() => {
    if (lessonId && !initialized.current) {
      initialized.current = true
      quiz.startQuiz()
    }
  }, [lessonId])

  const handleAnswer = (answer: unknown) => {
    if (!quiz.currentQuestion) return
    const qId = quiz.currentQuestion.id
    answerMap.set(qId, answer)
    const timeSpent = Date.now() - startTimeRef.current
    startTimeRef.current = Date.now()
    quiz.submitAnswer(qId, answer, timeSpent)
  }

  const handleContinue = () => {
    quiz.nextQuestion()
  }

  if (quiz.status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/50">正在加载题目...</div>
      </div>
    )
  }

  if (quiz.status === 'completed' && quiz.finishResult) {
    return (
      <LessonQuizResult
        result={quiz.finishResult}
        questions={quiz.questions}
        gradingResults={quiz.results}
        answers={answerMap}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        <QuizHeader
          title="课时小测验"
          currentIndex={quiz.currentIndex}
          totalCount={quiz.questions.length}
          onExit={() => navigate(-1)}
        />

        {quiz.currentQuestion && (
          <QuestionRenderer
            question={quiz.currentQuestion}
            mode={quiz.status === 'feedback' ? 'review' : 'answering'}
            userAnswer={answerMap.get(quiz.currentQuestion.id)}
            gradingResult={quiz.currentFeedback ?? undefined}
            onAnswer={handleAnswer}
            disabled={quiz.status === 'feedback'}
          />
        )}

        {quiz.status === 'feedback' && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={handleContinue}
              className="px-6 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 hover:bg-sky-500/30 transition-colors"
            >
              {quiz.currentIndex >= quiz.questions.length - 1 ? '查看结果' : '下一题 →'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
