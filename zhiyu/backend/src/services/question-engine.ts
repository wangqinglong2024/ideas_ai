import type { QuestionPickConfig, QuestionRow, QuestionOptionRow, QuestionDifficulty } from '../models/question'
import type { RenderedQuestion, RenderedOption, RenderedReadingPassage } from '../models/rendered-question'
import * as questionRepo from '../repositories/question-repo'

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

function pickByDifficulty(
  questions: QuestionRow[],
  count: number,
  distribution?: { easy: number; medium: number; hard: number },
): QuestionRow[] {
  if (questions.length <= count) return shuffleArray(questions)

  if (!distribution) {
    return shuffleArray(questions).slice(0, count)
  }

  const byDifficulty: Record<QuestionDifficulty, QuestionRow[]> = {
    easy: shuffleArray(questions.filter(q => q.difficulty === 'easy')),
    medium: shuffleArray(questions.filter(q => q.difficulty === 'medium')),
    hard: shuffleArray(questions.filter(q => q.difficulty === 'hard')),
  }

  const easyCount = Math.round(count * distribution.easy)
  const hardCount = Math.round(count * distribution.hard)
  const mediumCount = count - easyCount - hardCount

  const picked: QuestionRow[] = [
    ...byDifficulty.easy.slice(0, easyCount),
    ...byDifficulty.medium.slice(0, mediumCount),
    ...byDifficulty.hard.slice(0, hardCount),
  ]

  // Fill remaining from any difficulty if not enough in a category
  if (picked.length < count) {
    const pickedIds = new Set(picked.map(q => q.id))
    const remaining = shuffleArray(questions.filter(q => !pickedIds.has(q.id)))
    picked.push(...remaining.slice(0, count - picked.length))
  }

  return shuffleArray(picked)
}

function renderOptions(options: QuestionOptionRow[]): RenderedOption[] {
  const shuffled = shuffleArray(options)
  const labels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  return shuffled.map((opt, i) => ({
    id: opt.id,
    label: labels[i] || String.fromCharCode(65 + i),
    contentZh: opt.content_zh,
    contentPinyin: opt.content_pinyin ?? undefined,
    contentEn: opt.content_en ?? undefined,
    contentVi: opt.content_vi ?? undefined,
    imageUrl: opt.image_url ?? undefined,
  }))
}

function renderPassage(passage: { title_zh: string; title_pinyin: string | null; content_zh: string; content_pinyin: string | null; content_en: string | null; content_vi: string | null }): RenderedReadingPassage {
  return {
    titleZh: passage.title_zh,
    titlePinyin: passage.title_pinyin ?? undefined,
    contentZh: passage.content_zh,
    contentPinyin: passage.content_pinyin ?? undefined,
    contentEn: passage.content_en ?? undefined,
    contentVi: passage.content_vi ?? undefined,
  }
}

export async function generate(cfg: QuestionPickConfig): Promise<RenderedQuestion[]> {
  // 1. 从题库查询符合条件的题目
  const candidates = await questionRepo.findQuestionsByConfig(cfg)

  // 2. 按难度分布抽取
  const picked = pickByDifficulty(candidates, cfg.count, cfg.difficultyDistribution)

  if (picked.length === 0) return []

  // 3. 批量加载选项
  const questionIds = picked.map(q => q.id)
  const allOptions = await questionRepo.findOptionsByQuestionIds(questionIds)
  const optionsByQuestion = new Map<string, QuestionOptionRow[]>()
  for (const opt of allOptions) {
    const list = optionsByQuestion.get(opt.question_id) ?? []
    list.push(opt)
    optionsByQuestion.set(opt.question_id, list)
  }

  // 4. 批量加载阅读材料
  const passageIds = picked
    .filter(q => q.reading_passage_id)
    .map(q => q.reading_passage_id!)
  const passages = passageIds.length > 0
    ? await questionRepo.findPassagesByIds([...new Set(passageIds)])
    : []
  const passageMap = new Map(passages.map(p => [p.id, p]))

  // 5. 格式化为渲染态题目
  return picked.map((q, index) => {
    const rendered: RenderedQuestion = {
      id: q.id,
      questionType: q.question_type,
      index,
      stemZh: q.stem_zh,
      stemPinyin: q.stem_pinyin ?? undefined,
      stemEn: q.stem_en ?? undefined,
      stemVi: q.stem_vi ?? undefined,
      audioUrl: q.audio_url ?? undefined,
      imageUrl: q.image_url ?? undefined,
      scoreValue: q.score_value,
    }

    // 选项类题目
    const opts = optionsByQuestion.get(q.id)
    if (opts && opts.length > 0) {
      rendered.options = renderOptions(opts)
    }

    // 排序组句
    if (q.sentence_words) {
      rendered.sentenceWords = shuffleArray(q.sentence_words as string[])
    }

    // 拼音标注
    if (q.target_chars) {
      rendered.targetChars = q.target_chars
    }

    // 填空
    if (q.blank_sentence) {
      rendered.blankSentence = q.blank_sentence
      const matches = q.blank_sentence.match(/___/g)
      rendered.blankCount = matches ? matches.length : 1
    }

    // 阅读理解
    if (q.reading_passage_id) {
      const passage = passageMap.get(q.reading_passage_id)
      if (passage) {
        rendered.readingPassage = renderPassage(passage)
      }
    }

    return rendered
  })
}

export async function generateByIds(questionIds: string[]): Promise<RenderedQuestion[]> {
  if (questionIds.length === 0) return []

  const questions = await questionRepo.findQuestionsByIds(questionIds)
  const idOrder = new Map(questionIds.map((id, i) => [id, i]))
  questions.sort((a, b) => (idOrder.get(a.id) ?? 0) - (idOrder.get(b.id) ?? 0))

  const allOptions = await questionRepo.findOptionsByQuestionIds(questionIds)
  const optionsByQuestion = new Map<string, QuestionOptionRow[]>()
  for (const opt of allOptions) {
    const list = optionsByQuestion.get(opt.question_id) ?? []
    list.push(opt)
    optionsByQuestion.set(opt.question_id, list)
  }

  const passageIds = questions
    .filter(q => q.reading_passage_id)
    .map(q => q.reading_passage_id!)
  const passages = passageIds.length > 0
    ? await questionRepo.findPassagesByIds([...new Set(passageIds)])
    : []
  const passageMap = new Map(passages.map(p => [p.id, p]))

  return questions.map((q, index) => {
    const rendered: RenderedQuestion = {
      id: q.id,
      questionType: q.question_type,
      index,
      stemZh: q.stem_zh,
      stemPinyin: q.stem_pinyin ?? undefined,
      stemEn: q.stem_en ?? undefined,
      stemVi: q.stem_vi ?? undefined,
      audioUrl: q.audio_url ?? undefined,
      imageUrl: q.image_url ?? undefined,
      scoreValue: q.score_value,
    }

    const opts = optionsByQuestion.get(q.id)
    if (opts && opts.length > 0) {
      rendered.options = renderOptions(opts)
    }

    if (q.sentence_words) {
      rendered.sentenceWords = shuffleArray(q.sentence_words as string[])
    }
    if (q.target_chars) {
      rendered.targetChars = q.target_chars
    }
    if (q.blank_sentence) {
      rendered.blankSentence = q.blank_sentence
      const matches = q.blank_sentence.match(/___/g)
      rendered.blankCount = matches ? matches.length : 1
    }
    if (q.reading_passage_id) {
      const passage = passageMap.get(q.reading_passage_id)
      if (passage) {
        rendered.readingPassage = renderPassage(passage)
      }
    }

    return rendered
  })
}
