import { useEffect, useRef, useMemo, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useUnitTest } from './hooks/useUnitTest'
import { QuizHeader } from './components/QuizHeader'
import { QuizProgress } from './components/QuizProgress'
import { NavigationBar } from './components/NavigationBar'
import { SubmitConfirmModal } from './components/SubmitConfirmModal'
import { QuestionRenderer } from '../../components/assessment/QuestionRenderer'
import { UnitTestResult } from './components/UnitTestResult'

export const UnitTestPage = () => {
  const { unitId } = useParams<{ unitId: string }>()
  const navigate = useNavigate()
  const test = useUnitTest(unitId ?? '')
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const initialized = useRef(false)

  useEffect(() => {
    if (unitId && !initialized.current) {
      initialized.current = true
      test.startTest()
    }
  }, [unitId])

  const answeredIndices = useMemo(() => {
    const indices = new Set<number>()
    test.questions.forEach((q, i) => {
      if (test.answers.has(q.id)) indices.add(i)
    })
    return indices
  }, [test.questions, test.answers])

  const handleAnswer = (answer: unknown) => {
    if (!test.currentQuestion) return
    test.setAnswer(test.currentQuestion.id, answer)
  }

  const handleSubmit = () => {
    setShowSubmitModal(false)
    test.submitTest()
  }

  if (test.status === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/50">正在加载测评...</div>
      </div>
    )
  }

  if (test.status === 'submitting') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/50">正在判分...</div>
      </div>
    )
  }

  if (test.status === 'completed' && test.submitResult) {
    return (
      <UnitTestResult
        result={test.submitResult}
        questions={test.questions}
        answers={test.answers}
      />
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        <QuizHeader
          title="单元测评"
          currentIndex={test.currentIndex}
          totalCount={test.questions.length}
          onExit={() => navigate(-1)}
        />

        <QuizProgress
          totalCount={test.questions.length}
          currentIndex={test.currentIndex}
          answeredIndices={answeredIndices}
          onSelect={test.goToQuestion}
        />

        {test.currentQuestion && (
          <QuestionRenderer
            question={test.currentQuestion}
            mode="answering"
            userAnswer={test.answers.get(test.currentQuestion.id)}
            onAnswer={handleAnswer}
          />
        )}

        <NavigationBar
          currentIndex={test.currentIndex}
          totalCount={test.questions.length}
          canSubmit={test.answeredCount >= test.questions.length}
          onPrev={() => test.goToQuestion(test.currentIndex - 1)}
          onNext={() => test.goToQuestion(test.currentIndex + 1)}
          onSubmit={() => setShowSubmitModal(true)}
        />

        <SubmitConfirmModal
          open={showSubmitModal}
          answeredCount={test.answeredCount}
          totalCount={test.questions.length}
          onConfirm={handleSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      </div>
    </div>
  )
}
