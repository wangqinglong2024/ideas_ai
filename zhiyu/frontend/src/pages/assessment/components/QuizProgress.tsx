interface QuizProgressProps {
  totalCount: number
  currentIndex: number
  answeredIndices: Set<number>
  onSelect?: (index: number) => void
}

export const QuizProgress = ({ totalCount, currentIndex, answeredIndices, onSelect }: QuizProgressProps) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {Array.from({ length: totalCount }, (_, i) => {
        const isActive = i === currentIndex
        const isAnswered = answeredIndices.has(i)

        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect?.(i)}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all ${
              isActive
                ? 'bg-sky-500/30 border-2 border-sky-400 text-sky-300'
                : isAnswered
                  ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                  : 'bg-white/5 border border-white/10 text-white/40'
            }`}
          >
            {i + 1}
          </button>
        )
      })}
    </div>
  )
}
