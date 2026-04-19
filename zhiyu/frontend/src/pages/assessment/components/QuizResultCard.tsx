interface QuizResultCardProps {
  totalScore: number
  maxScore: number
  correctCount: number
  totalCount: number
  passed: boolean
  passingScore?: number
}

export const QuizResultCard = ({
  totalScore,
  maxScore,
  correctCount,
  totalCount,
  passed,
  passingScore,
}: QuizResultCardProps) => {
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  return (
    <div className="text-center py-8">
      {/* Score circle */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth="8"
          />
          <circle
            cx="60" cy="60" r="52"
            fill="none"
            stroke={passed ? '#0284c7' : '#e11d48'}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={`${percentage * 3.27} 327`}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{Math.round(totalScore)}</span>
          <span className="text-xs text-white/40">/ {maxScore}</span>
        </div>
      </div>

      {/* Stats */}
      <div className="space-y-2 mb-4">
        <p className="text-white/70 text-sm">
          正确 <span className="text-emerald-400 font-medium">{correctCount}</span> / {totalCount} 题
        </p>
        {passingScore !== undefined && (
          <p className={`text-sm ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
            {passed ? '✓ 通过' : `✗ 未通过（通过线：${passingScore} 分）`}
          </p>
        )}
      </div>
    </div>
  )
}
