interface ModuleTabProps {
  modules: { module: string; questions: { id: string }[] }[]
  currentIndex: number
  answers: Map<string, unknown>
  onSelect: (index: number) => void
}

const MODULE_LABELS: Record<string, string> = {
  listening: '听力',
  reading: '阅读',
  vocab_grammar: '词汇语法',
  writing: '写作',
}

export const ModuleTab = ({ modules, currentIndex, answers, onSelect }: ModuleTabProps) => {
  return (
    <div className="flex gap-2 mb-4 overflow-x-auto">
      {modules.map((mod, i) => {
        const answered = mod.questions.filter(q => answers.has(q.id)).length
        const total = mod.questions.length
        const isActive = i === currentIndex

        return (
          <button
            key={mod.module}
            type="button"
            onClick={() => onSelect(i)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive
                ? 'bg-sky-500/20 border border-sky-400/40 text-sky-300'
                : 'bg-white/5 border border-white/10 text-white/50 hover:bg-white/10'
            }`}
          >
            {MODULE_LABELS[mod.module] ?? mod.module}
            <span className="ml-1 text-xs opacity-60">{answered}/{total}</span>
          </button>
        )
      })}
    </div>
  )
}
