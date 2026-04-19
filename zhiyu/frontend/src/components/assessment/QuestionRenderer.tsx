import type { QuestionComponentProps } from './types'
import { SingleChoice } from './questions/SingleChoice'
import { MultipleChoice } from './questions/MultipleChoice'
import { ListeningChoice } from './questions/ListeningChoice'
import { PinyinAnnotation } from './questions/PinyinAnnotation'
import { SentenceOrdering } from './questions/SentenceOrdering'
import { FillInBlank } from './questions/FillInBlank'
import { ReadingComprehension } from './questions/ReadingComprehension'

export const QuestionRenderer = (props: QuestionComponentProps) => {
  const { question } = props

  const componentMap = {
    single_choice: SingleChoice,
    multiple_choice: MultipleChoice,
    listening_choice: ListeningChoice,
    pinyin_annotation: PinyinAnnotation,
    sentence_ordering: SentenceOrdering,
    fill_in_blank: FillInBlank,
    reading_comprehension: ReadingComprehension,
  }

  const Component = componentMap[question.questionType]

  if (!Component) {
    return (
      <div className="p-4 rounded-xl bg-rose-500/10 border border-rose-400/30 text-rose-300">
        不支持的题型：{question.questionType}
      </div>
    )
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.1)] p-6">
      <Component {...props} />
    </div>
  )
}
