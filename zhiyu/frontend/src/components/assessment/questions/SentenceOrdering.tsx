import { useState } from 'react'
import type { QuestionComponentProps } from '../types'
import { QuestionStem } from '../shared/QuestionStem'
import { ExplanationPanel } from '../shared/ExplanationPanel'

export const SentenceOrdering = ({
  question,
  mode,
  userAnswer,
  gradingResult,
  onAnswer,
  disabled,
}: QuestionComponentProps) => {
  const words = question.sentenceWords ?? []
  const [ordered, setOrdered] = useState<number[]>(
    (userAnswer as { order?: number[] })?.order ?? []
  )

  const correctOrder = mode === 'review' && gradingResult
    ? (gradingResult.correctAnswer as { order?: number[] })?.order ?? []
    : []

  const availableIndices = words
    .map((_, i) => i)
    .filter(i => !ordered.includes(i))

  const handleAdd = (wordIndex: number) => {
    if (disabled || mode === 'review') return
    const next = [...ordered, wordIndex]
    setOrdered(next)
    onAnswer({ order: next })
  }

  const handleRemove = (position: number) => {
    if (disabled || mode === 'review') return
    const next = ordered.filter((_, i) => i !== position)
    setOrdered(next)
    onAnswer({ order: next })
  }

  return (
    <div>
      <QuestionStem
        index={question.index}
        stemZh={question.stemZh}
        stemPinyin={question.stemPinyin}
        scoreValue={question.scoreValue}
      />
      <p className="text-xs text-amber-400/70 mb-4">请点击词语组成正确的句子</p>

      {/* Answer line */}
      <div className="min-h-[56px] p-3 rounded-xl border border-sky-400/30 bg-sky-500/5 mb-4 flex flex-wrap gap-2">
        {ordered.length === 0 && (
          <span className="text-white/30 text-sm">点击下方词语添加到此处...</span>
        )}
        {ordered.map((wordIdx, pos) => {
          const isCorrectPos = mode === 'review' && correctOrder[pos] === wordIdx
          const isWrongPos = mode === 'review' && correctOrder[pos] !== wordIdx

          return (
            <button
              key={pos}
              type="button"
              onClick={() => handleRemove(pos)}
              disabled={disabled || mode === 'review'}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                isCorrectPos
                  ? 'bg-emerald-500/20 border border-emerald-400/40 text-emerald-300'
                  : isWrongPos
                    ? 'bg-rose-500/20 border border-rose-400/40 text-rose-300'
                    : 'bg-sky-500/20 border border-sky-400/40 text-sky-300 hover:bg-sky-500/30'
              }`}
            >
              {words[wordIdx]}
            </button>
          )
        })}
      </div>

      {/* Word bank */}
      <div className="flex flex-wrap gap-2">
        {availableIndices.map(wordIdx => (
          <button
            key={wordIdx}
            type="button"
            onClick={() => handleAdd(wordIdx)}
            disabled={disabled || mode === 'review'}
            className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 text-sm hover:bg-white/15 transition-all"
          >
            {words[wordIdx]}
          </button>
        ))}
      </div>

      {/* Review: show correct order */}
      {mode === 'review' && correctOrder.length > 0 && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/5 border border-emerald-400/20">
          <p className="text-xs text-emerald-400 mb-1">正确顺序：</p>
          <p className="text-sm text-white/80">
            {correctOrder.map(idx => words[idx]).join(' ')}
          </p>
        </div>
      )}
      {mode === 'review' && gradingResult && (
        <ExplanationPanel result={gradingResult} />
      )}
    </div>
  )
}
