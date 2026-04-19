interface NavigationBarProps {
  currentIndex: number
  totalCount: number
  canSubmit?: boolean
  onPrev: () => void
  onNext: () => void
  onSubmit?: () => void
}

export const NavigationBar = ({
  currentIndex,
  totalCount,
  canSubmit,
  onPrev,
  onNext,
  onSubmit,
}: NavigationBarProps) => {
  return (
    <div className="flex items-center justify-between mt-6 pt-4 border-t border-white/10">
      <button
        type="button"
        onClick={onPrev}
        disabled={currentIndex === 0}
        className="px-4 py-2 rounded-lg text-sm text-white/60 hover:text-white/90 disabled:opacity-30 disabled:pointer-events-none transition-colors"
      >
        ← 上一题
      </button>
      <div className="flex gap-3">
        {currentIndex < totalCount - 1 ? (
          <button
            type="button"
            onClick={onNext}
            className="px-4 py-2 rounded-lg bg-sky-500/20 border border-sky-400/40 text-sky-300 text-sm hover:bg-sky-500/30 transition-colors"
          >
            下一题 →
          </button>
        ) : onSubmit ? (
          <button
            type="button"
            onClick={onSubmit}
            disabled={!canSubmit}
            className="px-6 py-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm hover:bg-amber-500/30 disabled:opacity-50 transition-colors"
          >
            提交答案
          </button>
        ) : null}
      </div>
    </div>
  )
}
