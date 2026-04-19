import { useState } from 'react'
import type { QuestionComponentProps } from '../types'
import { QuestionStem } from '../shared/QuestionStem'
import { OptionCard } from '../shared/OptionCard'
import { ExplanationPanel } from '../shared/ExplanationPanel'

export const SingleChoice = ({
  question,
  mode,
  userAnswer,
  gradingResult,
  onAnswer,
  disabled,
}: QuestionComponentProps) => {
  const [selected, setSelected] = useState<string>(
    (userAnswer as { optionId?: string })?.optionId ?? ''
  )

  const correctId = mode === 'review' && gradingResult
    ? (gradingResult.correctAnswer as { optionId?: string })?.optionId
    : undefined

  const handleSelect = (optionId: string) => {
    if (disabled || mode === 'review') return
    setSelected(optionId)
    onAnswer({ optionId })
  }

  return (
    <div>
      <QuestionStem
        index={question.index}
        stemZh={question.stemZh}
        stemPinyin={question.stemPinyin}
        scoreValue={question.scoreValue}
      />
      <div className="flex flex-col gap-3">
        {question.options?.map(option => (
          <OptionCard
            key={option.id}
            label={option.label}
            selected={selected === option.id}
            correct={mode === 'review' && correctId === option.id}
            wrong={mode === 'review' && selected === option.id && correctId !== option.id}
            disabled={disabled || mode === 'review'}
            onClick={() => handleSelect(option.id)}
          >
            {option.contentZh}
            {option.contentPinyin && (
              <span className="text-white/40 text-sm ml-2">{option.contentPinyin}</span>
            )}
          </OptionCard>
        ))}
      </div>
      {mode === 'review' && gradingResult && (
        <ExplanationPanel result={gradingResult} />
      )}
    </div>
  )
}
