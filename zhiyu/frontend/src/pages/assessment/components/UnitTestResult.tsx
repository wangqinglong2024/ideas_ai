import { useNavigate } from 'react-router-dom'
import type { UnitTestSubmitResponse } from '../types'
import type { RenderedQuestion } from '../../../components/assessment/types'
import { QuizResultCard } from './QuizResultCard'
import { QuestionRenderer } from '../../../components/assessment/QuestionRenderer'

interface UnitTestResultProps {
  result: UnitTestSubmitResponse
  questions: RenderedQuestion[]
  answers: Map<string, unknown>
}

export const UnitTestResult = ({ result, questions, answers }: UnitTestResultProps) => {
  const navigate = useNavigate()
  const resultMap = new Map(result.results.map(r => [r.questionId, r]))

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        {result.passed && (
          <div className="text-center mb-4">
            <span className="text-4xl">🎉</span>
            <h2 className="text-xl font-bold text-amber-400 mt-2">恭喜通过！</h2>
          </div>
        )}

        <QuizResultCard
          totalScore={result.totalScore}
          maxScore={result.maxScore}
          correctCount={result.correctCount}
          totalCount={result.totalCount}
          passed={result.passed}
          passingScore={result.passingScore}
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

        <div className="flex gap-3">
          {result.passed ? (
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="flex-1 py-3 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 hover:bg-sky-500/30 transition-colors"
            >
              继续下一单元
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 py-3 rounded-xl border border-white/10 text-white/60 hover:bg-white/5 transition-colors"
              >
                先去复习
              </button>
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="flex-1 py-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
              >
                立即重考
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
