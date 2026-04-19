import { type ReactNode } from 'react'

interface OptionCardProps {
  label: string
  children: ReactNode
  selected?: boolean
  correct?: boolean
  wrong?: boolean
  disabled?: boolean
  onClick?: () => void
}

export const OptionCard = ({
  label,
  children,
  selected,
  correct,
  wrong,
  disabled,
  onClick,
}: OptionCardProps) => {
  const baseClasses =
    'flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 cursor-pointer'

  const stateClasses = correct
    ? 'border-emerald-400/60 bg-emerald-500/10'
    : wrong
      ? 'border-rose-400/60 bg-rose-500/10'
      : selected
        ? 'border-sky-400/60 bg-sky-500/10 scale-[1.02]'
        : 'border-white/10 bg-white/5 hover:bg-white/15'

  const disabledClasses = disabled ? 'pointer-events-none opacity-70' : ''

  return (
    <button
      type="button"
      className={`${baseClasses} ${stateClasses} ${disabledClasses}`}
      onClick={onClick}
      disabled={disabled}
    >
      <span
        className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold shrink-0 ${
          correct
            ? 'bg-emerald-500/20 text-emerald-400'
            : wrong
              ? 'bg-rose-500/20 text-rose-400'
              : selected
                ? 'bg-sky-500/20 text-sky-400'
                : 'bg-white/10 text-white/60'
        }`}
      >
        {label}
      </span>
      <span className="text-white/80 text-left flex-1">{children}</span>
      {correct && <span className="text-emerald-400">✓</span>}
      {wrong && <span className="text-rose-400">✗</span>}
    </button>
  )
}
