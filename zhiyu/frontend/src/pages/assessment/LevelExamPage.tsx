import { useEffect, useRef, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useLevelExam } from './hooks/useLevelExam'
import { QuizHeader } from './components/QuizHeader'
import { ModuleTab } from './components/ModuleTab'
import { QuizProgress } from './components/QuizProgress'
import { NavigationBar } from './components/NavigationBar'
import { SubmitConfirmModal } from './components/SubmitConfirmModal'
import { ExamResultCard } from './components/ExamResultCard'
import { QuestionRenderer } from '../../components/assessment/QuestionRenderer'

export const LevelExamPage = () => {
  const { levelId } = useParams<{ levelId: string }>()
  const navigate = useNavigate()
  const exam = useLevelExam(levelId ?? '')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (levelId && !initialized.current) {
      initialized.current = true
      exam.checkEligibility()
    }
  }, [levelId])

  const moduleQuestions = exam.currentModule?.questions ?? []

  const answeredIndices = useMemo(() => {
    const indices = new Set<number>()
    moduleQuestions.forEach((q, i) => {
      if (exam.answers.has(q.id)) indices.add(i)
    })
    return indices
  }, [moduleQuestions, exam.answers])

  const handleAnswer = (answer: unknown) => {
    if (!exam.currentQuestion) return
    exam.setAnswer(exam.currentQuestion.id, answer)
  }

  const handleSubmit = () => {
    setShowSubmitModal(false)
    exam.submitExam()
  }

  // Eligibility check
  if (exam.status === 'checking') {
    if (!exam.eligible) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
          <div className="max-w-sm text-center p-6">
            <span className="text-4xl mb-4 block">🔒</span>
            <h2 className="text-lg font-semibold text-white/90 mb-2">暂无法参加考试</h2>
            <p className="text-sm text-white/50 mb-6">{exam.eligibilityReason}</p>
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 transition-colors"
            >
              返回
            </button>
          </div>
        </div>
      )
    }
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="max-w-sm text-center p-6">
          <span className="text-4xl mb-4 block">📝</span>
          <h2 className="text-lg font-semibold text-white/90 mb-2">等级考试</h2>
          <p className="text-sm text-white/50 mb-6">考试涵盖听力、阅读、词汇语法和写作四个模块。总分 ≥85 且各模块 ≥60 方可通过。</p>
          <button
            type="button"
            onClick={() => exam.startExam()}
            className="px-6 py-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            开始考试
          </button>
        </div>
      </div>
    )
  }

  if (exam.status === 'loading' || exam.status === 'submitting') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/50">
          {exam.status === 'loading' ? '正在加载考试...' : '正在判分...'}
        </div>
      </div>
    )
  }

  if (exam.status === 'completed' && exam.submitResult) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
        <div className="max-w-lg mx-auto">
          <ExamResultCard
            totalScore={exam.submitResult.totalScore}
            maxScore={exam.submitResult.maxScore}
            passed={exam.submitResult.passed}
            passingScore={exam.submitResult.passingScore}
            moduleScores={exam.submitResult.moduleScores}
            certificateNo={exam.submitResult.certificateNo}
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 transition-colors"
            >
              返回
            </button>
            {exam.submitResult.certificateNo && (
              <button
                type="button"
                onClick={() => navigate(`/courses/certificates/${exam.submitResult!.certificateNo}`)}
                className="flex-1 py-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 transition-colors"
              >
                查看证书
              </button>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        <QuizHeader
          title="等级考试"
          currentIndex={exam.currentQuestionIndex}
          totalCount={moduleQuestions.length}
          onExit={() => navigate(-1)}
        />

        <ModuleTab
          modules={exam.modules}
          currentIndex={exam.currentModuleIndex}
          answers={exam.answers}
          onSelect={exam.goToModule}
        />

        <QuizProgress
          totalCount={moduleQuestions.length}
          currentIndex={exam.currentQuestionIndex}
          answeredIndices={answeredIndices}
          onSelect={exam.goToQuestion}
        />

        {exam.currentQuestion && (
          <QuestionRenderer
            question={exam.currentQuestion}
            mode="answering"
            userAnswer={exam.answers.get(exam.currentQuestion.id)}
            onAnswer={handleAnswer}
          />
        )}

        <NavigationBar
          currentIndex={exam.currentQuestionIndex}
          totalCount={moduleQuestions.length}
          canSubmit={exam.answeredCount >= exam.totalCount}
          onPrev={() => exam.goToQuestion(exam.currentQuestionIndex - 1)}
          onNext={() => exam.goToQuestion(exam.currentQuestionIndex + 1)}
          onSubmit={() => setShowSubmitModal(true)}
        />

        <SubmitConfirmModal
          open={showSubmitModal}
          answeredCount={exam.answeredCount}
          totalCount={exam.totalCount}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      </div>
    </div>
  )
}
