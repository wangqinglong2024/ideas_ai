interface QuestionStemProps {
  index: number
  stemZh: string
  stemPinyin?: string
  stemEn?: string
  scoreValue: number
}

export const QuestionStem = ({ index, stemZh, stemPinyin, scoreValue }: QuestionStemProps) => {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-sky-400/80">
          第 {index + 1} 题
        </span>
        <span className="text-xs text-white/40">
          {scoreValue} 分
        </span>
      </div>
      <h3 className="text-lg font-semibold text-white/90 leading-relaxed">
        {stemZh}
      </h3>
      {stemPinyin && (
        <p className="text-sm text-white/50 mt-1">{stemPinyin}</p>
      )}
    </div>
  )
}
