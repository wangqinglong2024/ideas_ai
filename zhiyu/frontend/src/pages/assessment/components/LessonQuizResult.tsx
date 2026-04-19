import { useNavigate } from 'react-router-dom'
import type { QuizFinishResponse } from '../types'
import type { GradingResult, RenderedQuestion } from '../../../components/assessment/types'
import { QuizResultCard } from './QuizResultCard'
import { QuestionRenderer } from '../../../components/assessment/QuestionRenderer'

interface LessonQuizResultProps {
  result: QuizFinishResponse
  questions: RenderedQuestion[]
  gradingResults: GradingResult[]
  answers: Map<string, unknown>
}

export const LessonQuizResult = ({ result, questions, gradingResults, answers }: LessonQuizResultProps) => {
  const navigate = useNavigate()
  const resultMap = new Map(gradingResults.map(r => [r.questionId, r]))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        <QuizResultCard
          totalScore={result.totalScore}
          maxScore={result.maxScore}
          correctCount={result.correctCount}
          totalCount={result.totalCount}
          passed={result.passed}
        />

        {result.srsItemsCreated > 0 && (
          <p className="text-center text-xs text-amber-400/70 mb-6">
            {result.srsItemsCreated} 道错题已加入复习计划
          </p>
        )}

        {/* Question review */}
        <div className="space-y-4 mb-8">
          <h3 className="text-sm font-medium text-white/50">题目回顾</h3>
          {questions.map(q => (
            <QuestionRenderer
              key={q.id}
              question={q}
              mode="review"
              userAnswer={answers.get(q.id)}
              gradingResult={resultMap.get(q.id)}
              onAnswer={() => {}}
              disabled
            />
          ))}
        </div>

        <button
          type="button"
          onClick={() => navigate(-1)}
          className="w-full py-3 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 hover:bg-sky-500/30 transition-colors"
        >
          返回课时
        </button>
      </div>
    </div>
  )
}
