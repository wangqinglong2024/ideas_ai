interface ModuleScore {
  module: string
  score: number
  maxScore: number
  passed: boolean
  passingScore: number
}

interface ExamResultCardProps {
  totalScore: number
  maxScore: number
  passed: boolean
  passingScore: number
  moduleScores: ModuleScore[]
  certificateNo?: string
}

const MODULE_LABELS: Record<string, string> = {
  listening: '听力',
  reading: '阅读',
  vocab_grammar: '词汇语法',
  writing: '写作',
}

export const ExamResultCard = ({
  totalScore,
  maxScore,
  passed,
  passingScore,
  moduleScores,
  certificateNo,
}: ExamResultCardProps) => {
  const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0

  return (
    <div className="text-center py-6">
      {passed && (
        <div className="mb-4">
          <span className="text-5xl">🏅</span>
          <h2 className="text-xl font-bold text-amber-400 mt-2">恭喜通过等级考试！</h2>
          {certificateNo && (
            <p className="text-xs text-white/40 mt-1">证书编号：{certificateNo}</p>
          )}
        </div>
      )}

      {/* Overall score */}
      <div className="relative w-32 h-32 mx-auto mb-6">
        <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
          <circle cx="60" cy="60" r="52" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="8" />
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

      <p className={`text-sm mb-6 ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>
        {passed ? '✓ 通过' : `✗ 未通过（通过线：${passingScore} 分）`}
      </p>

      {/* Module scores */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {moduleScores.map(ms => {
          const pct = ms.maxScore > 0 ? Math.round((ms.score / ms.maxScore) * 100) : 0
          return (
            <div
              key={ms.module}
              className={`p-3 rounded-xl border ${
                ms.passed
                  ? 'bg-emerald-500/5 border-emerald-400/20'
                  : 'bg-rose-500/5 border-rose-400/20'
              }`}
            >
              <p className="text-xs text-white/50">{MODULE_LABELS[ms.module] ?? ms.module}</p>
              <p className="text-lg font-bold text-white/90">{Math.round(ms.score)}</p>
              <div className="h-1 bg-white/10 rounded-full mt-1">
                <div
                  className={`h-full rounded-full ${ms.passed ? 'bg-emerald-400' : 'bg-rose-400'}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
