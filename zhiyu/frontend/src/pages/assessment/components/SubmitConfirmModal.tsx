interface SubmitConfirmModalProps {
  open: boolean
  answeredCount: number
  totalCount: number
  onConfirm: () => void
  onCancel: () => void
}

export const SubmitConfirmModal = ({
  open,
  answeredCount,
  totalCount,
  onConfirm,
  onCancel,
}: SubmitConfirmModalProps) => {
  if (!open) return null

  const unanswered = totalCount - answeredCount

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-slate-800/90 backdrop-blur-lg rounded-2xl border border-white/10 p-6 max-w-sm w-full mx-4">
        <h3 className="text-lg font-semibold text-white/90 mb-3">确认提交</h3>
        <div className="space-y-2 mb-6">
          <p className="text-sm text-white/70">
            已答题：<span className="text-emerald-400 font-medium">{answeredCount}</span> / {totalCount}
          </p>
          {unanswered > 0 && (
            <p className="text-sm text-amber-400/80">
              ⚠ 还有 {unanswered} 道题未作答
            </p>
          )}
        </div>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 px-4 py-2 rounded-lg border border-white/10 text-white/60 text-sm hover:bg-white/5 transition-colors"
          >
            继续答题
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 px-4 py-2 rounded-lg bg-amber-500/20 border border-amber-400/40 text-amber-300 text-sm hover:bg-amber-500/30 transition-colors"
          >
            确认提交
          </button>
        </div>
      </div>
    </div>
  )
}
