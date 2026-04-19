import { useState } from 'react'
import type { QuestionComponentProps } from '../types'
import { QuestionStem } from '../shared/QuestionStem'
import { ExplanationPanel } from '../shared/ExplanationPanel'

export const FillInBlank = ({
  question,
  mode,
  userAnswer,
  gradingResult,
  onAnswer,
  disabled,
}: QuestionComponentProps) => {
  const blankCount = question.blankCount ?? 1
  const [answers, setAnswers] = useState<string[]>(
    (userAnswer as { answers?: string[] })?.answers ?? Array(blankCount).fill('')
  )

  const correctAnswers = mode === 'review' && gradingResult
    ? (gradingResult.correctAnswer as { answers?: (string | string[])[] })?.answers ?? []
    : []

  const handleChange = (index: number, value: string) => {
    if (disabled || mode === 'review') return
    const next = [...answers]
    next[index] = value
    setAnswers(next)
    onAnswer({ answers: next })
  }

  // Render sentence with inline blanks
  const renderSentence = () => {
    if (!question.blankSentence) return null
    const parts = question.blankSentence.split('___')

    return (
      <div className="text-white/80 leading-relaxed text-lg flex flex-wrap items-center gap-1 mb-4">
        {parts.map((part, i) => (
          <span key={i} className="contents">
            {part}
            {i < parts.length - 1 && (
              <span className="inline-flex flex-col items-center mx-1">
                <input
                  type="text"
                  value={answers[i] ?? ''}
                  onChange={e => handleChange(i, e.target.value)}
                  disabled={disabled || mode === 'review'}
                  className={`w-24 h-8 text-center rounded border bg-white/5 text-white/90 text-sm outline-none ${
                    mode === 'review' && correctAnswers[i]
                      ? isBlankCorrect(answers[i] ?? '', correctAnswers[i]!)
                        ? 'border-emerald-400/60'
                        : 'border-rose-400/60'
                      : 'border-white/20 focus:border-sky-400/60'
                  }`}
                />
                {mode === 'review' && correctAnswers[i] && !isBlankCorrect(answers[i] ?? '', correctAnswers[i]!) && (
                  <span className="text-xs text-emerald-400 mt-0.5">
                    {Array.isArray(correctAnswers[i])
                      ? (correctAnswers[i] as string[]).join('/')
                      : String(correctAnswers[i])}
                  </span>
                )}
              </span>
            )}
          </span>
        ))}
      </div>
    )
  }

  return (
    <div>
      <QuestionStem
        index={question.index}
        stemZh={question.stemZh}
        stemPinyin={question.stemPinyin}
        scoreValue={question.scoreValue}
      />
      {renderSentence()}
      {mode === 'review' && gradingResult && (
        <ExplanationPanel result={gradingResult} />
      )}
    </div>
  )
}

function isBlankCorrect(userInput: string, correct: string | string[]): boolean {
  const trimmed = (userInput ?? '').trim()
  if (Array.isArray(correct)) {
    return correct.some(s => s.trim() === trimmed)
  }
  return correct.trim() === trimmed
}
