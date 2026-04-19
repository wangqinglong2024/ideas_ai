import { useState, useRef } from 'react'
import type { QuestionComponentProps } from '../types'
import { QuestionStem } from '../shared/QuestionStem'
import { OptionCard } from '../shared/OptionCard'
import { ExplanationPanel } from '../shared/ExplanationPanel'

const MAX_PLAYS = 3

export const ListeningChoice = ({
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
  const [playCount, setPlayCount] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  const correctId = mode === 'review' && gradingResult
    ? (gradingResult.correctAnswer as { optionId?: string })?.optionId
    : undefined

  const handlePlay = () => {
    if (playCount >= MAX_PLAYS || !audioRef.current) return
    audioRef.current.currentTime = 0
    audioRef.current.play()
    setIsPlaying(true)
    setPlayCount(prev => prev + 1)
  }

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

      {/* Audio player */}
      {question.audioUrl && (
        <div className="flex items-center gap-4 mb-6">
          <button
            type="button"
            onClick={handlePlay}
            disabled={playCount >= MAX_PLAYS}
            className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-sky-500/30 border-2 border-sky-400 animate-pulse'
                : playCount >= MAX_PLAYS
                  ? 'bg-white/5 border border-white/10 opacity-50'
                  : 'bg-sky-500/20 border border-sky-400/40 hover:bg-sky-500/30'
            }`}
          >
            <span className="text-sky-400 text-xl">
              {isPlaying ? '◉' : '▶'}
            </span>
          </button>
          <div className="text-sm text-white/50">
            播放次数：{playCount}/{MAX_PLAYS}
          </div>
          <audio
            ref={audioRef}
            src={question.audioUrl}
            onEnded={() => setIsPlaying(false)}
          />
        </div>
      )}

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
