import { useState, useRef } from 'react'
import type { QuestionComponentProps } from '../types'
import { QuestionStem } from '../shared/QuestionStem'
import { ExplanationPanel } from '../shared/ExplanationPanel'

export const PinyinAnnotation = ({
  question,
  mode,
  userAnswer,
  gradingResult,
  onAnswer,
  disabled,
}: QuestionComponentProps) => {
  const chars = (question.targetChars ?? '').split('')
  const [pinyins, setPinyins] = useState<string[]>(
    (userAnswer as { pinyins?: string[] })?.pinyins ?? chars.map(() => '')
  )
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])

  const correctPinyins = mode === 'review' && gradingResult
    ? (gradingResult.correctAnswer as { pinyins?: string[] })?.pinyins ?? []
    : []

  const handleChange = (index: number, value: string) => {
    if (disabled || mode === 'review') return
    const next = [...pinyins]
    next[index] = value
    setPinyins(next)
    onAnswer({ pinyins: next })

    // Auto-advance to next input
    if (value && index < chars.length - 1) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  return (
    <div>
      <QuestionStem
        index={question.index}
        stemZh={question.stemZh}
        stemPinyin={question.stemPinyin}
        scoreValue={question.scoreValue}
      />
      <p className="text-xs text-amber-400/70 mb-4">请为每个汉字标注拼音</p>
      <div className="flex gap-4 flex-wrap justify-center">
        {chars.map((char, i) => {
          const isCorrect = mode === 'review' && correctPinyins[i]?.toLowerCase() === pinyins[i]?.toLowerCase()
          const isWrong = mode === 'review' && !isCorrect && pinyins[i]

          return (
            <div key={i} className="flex flex-col items-center gap-1">
              <input
                ref={el => { inputRefs.current[i] = el }}
                type="text"
                value={pinyins[i]}
                onChange={e => handleChange(i, e.target.value)}
                disabled={disabled || mode === 'review'}
                className={`w-20 h-8 text-center rounded-lg border bg-white/5 text-sm text-white/90 outline-none transition-colors ${
                  isCorrect
                    ? 'border-emerald-400/60'
                    : isWrong
                      ? 'border-rose-400/60'
                      : 'border-white/20 focus:border-sky-400/60'
                }`}
                placeholder="拼音"
              />
              {mode === 'review' && isWrong && (
                <span className="text-xs text-emerald-400">{correctPinyins[i]}</span>
              )}
              <span className="text-2xl text-white/90 font-medium">{char}</span>
            </div>
          )
        })}
      </div>
      {mode === 'review' && gradingResult && (
        <ExplanationPanel result={gradingResult} />
      )}
    </div>
  )
}
