import { useState } from 'react'
import type { QuestionComponentProps } from '../types'
import { QuestionStem } from '../shared/QuestionStem'
import { OptionCard } from '../shared/OptionCard'
import { ExplanationPanel } from '../shared/ExplanationPanel'

export const ReadingComprehension = ({
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
  const [collapsed, setCollapsed] = useState(false)

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
      {/* Reading passage */}
      {question.readingPassage && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium text-amber-400/80">
              阅读材料
            </h4>
            <button
              type="button"
              onClick={() => setCollapsed(!collapsed)}
              className="text-xs text-white/40 hover:text-white/60"
            >
              {collapsed ? '展开 ▾' : '收起 ▴'}
            </button>
          </div>
          {!collapsed && (
            <div className="max-h-[240px] overflow-y-auto p-4 rounded-xl bg-white/5 border border-white/10">
              <h5 className="text-base font-semibold text-white/90 mb-2">
                {question.readingPassage.titleZh}
              </h5>
              {question.readingPassage.titlePinyin && (
                <p className="text-xs text-white/40 mb-2">{question.readingPassage.titlePinyin}</p>
              )}
              <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
                {question.readingPassage.contentZh}
              </p>
              {question.readingPassage.contentPinyin && (
                <p className="text-xs text-white/40 mt-2 leading-relaxed">
                  {question.readingPassage.contentPinyin}
                </p>
              )}
            </div>
          )}
        </div>
      )}

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
          </OptionCard>
        ))}
      </div>
      {mode === 'review' && gradingResult && (
        <ExplanationPanel result={gradingResult} />
      )}
    </div>
  )
}
