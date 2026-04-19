interface QuizHeaderProps {
  title: string
  currentIndex: number
  totalCount: number
  onExit?: () => void
}

export const QuizHeader = ({ title, currentIndex, totalCount, onExit }: QuizHeaderProps) => {
  const progress = totalCount > 0 ? ((currentIndex + 1) / totalCount) * 100 : 0

  return (
    <div className="flex items-center gap-4 mb-6">
      {onExit && (
        <button
          type="button"
          onClick={onExit}
          className="text-white/40 hover:text-white/70 transition-colors"
        >
          ✕
        </button>
      )}
      <div className="flex-1">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm font-medium text-white/70">{title}</span>
          <span className="text-xs text-white/40">{currentIndex + 1}/{totalCount}</span>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sky-500 to-sky-400 rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  )
}
