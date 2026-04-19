import { useState } from 'react'
import type { QuestionComponentProps } from '../types'
import { QuestionStem } from '../shared/QuestionStem'
import { OptionCard } from '../shared/OptionCard'
import { ExplanationPanel } from '../shared/ExplanationPanel'

export const MultipleChoice = ({
  question,
  mode,
  userAnswer,
  gradingResult,
  onAnswer,
  disabled,
}: QuestionComponentProps) => {
  const [selectedIds, setSelectedIds] = useState<string[]>(
    (userAnswer as { optionIds?: string[] })?.optionIds ?? []
  )

  const correctIds = mode === 'review' && gradingResult
    ? (gradingResult.correctAnswer as { optionIds?: string[] })?.optionIds ?? []
    : []

  const toggleOption = (optionId: string) => {
    if (disabled || mode === 'review') return
    const next = selectedIds.includes(optionId)
      ? selectedIds.filter(id => id !== optionId)
      : [...selectedIds, optionId]
    setSelectedIds(next)
    onAnswer({ optionIds: next })
  }

  return (
    <div>
      <QuestionStem
        index={question.index}
        stemZh={question.stemZh}
        stemPinyin={question.stemPinyin}
        scoreValue={question.scoreValue}
      />
      <p className="text-xs text-amber-400/70 mb-3">多选题 — 请选择所有正确答案</p>
      <div className="flex flex-col gap-3">
        {question.options?.map(option => (
          <OptionCard
            key={option.id}
            label={option.label}
            selected={selectedIds.includes(option.id)}
            correct={mode === 'review' && correctIds.includes(option.id)}
            wrong={mode === 'review' && selectedIds.includes(option.id) && !correctIds.includes(option.id)}
            disabled={disabled || mode === 'review'}
            onClick={() => toggleOption(option.id)}
          >
            {option.contentZh}
          </OptionCard>
        ))}
      </div>
      {mode === 'review' && gradingResult && (
        <ExplanationPanel result={gradingResult} />
      )}
    </div>
  )
}
