import type { GradingResult } from '../types'

interface ExplanationPanelProps {
  result: GradingResult
}

export const ExplanationPanel = ({ result }: ExplanationPanelProps) => {
  if (!result.explanation) return null

  return (
    <div className="mt-4 p-4 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm">
      <div className="flex items-center gap-2 mb-2">
        {result.isCorrect ? (
          <span className="text-emerald-400 font-medium">✓ 回答正确</span>
        ) : (
          <span className="text-rose-400 font-medium">✗ 回答错误</span>
        )}
        <span className="text-xs text-white/40">
          +{result.scoreEarned}/{result.scoreMax} 分
        </span>
      </div>
      <p className="text-sm text-white/70 leading-relaxed">
        {result.explanation.zh}
      </p>
      {result.explanation.en && (
        <p className="text-xs text-white/40 mt-1">{result.explanation.en}</p>
      )}
    </div>
  )
}
