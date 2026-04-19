import { supabaseAdmin } from '../core/supabase'
import type { QuestionRow, QuestionOptionRow, ReadingPassageRow, QuestionPickConfig } from '../models/question'

export async function findQuestionsByConfig(cfg: QuestionPickConfig): Promise<QuestionRow[]> {
  let query = supabaseAdmin
    .from('questions')
    .select('*')
    .eq('is_active', true)
    .eq('level_id', cfg.levelId)
    .contains('assessment_levels', [cfg.assessmentType])

  if (cfg.unitId) {
    query = query.eq('unit_id', cfg.unitId)
  }
  if (cfg.lessonId) {
    query = query.eq('lesson_id', cfg.lessonId)
  }
  if (cfg.examModule) {
    query = query.eq('exam_module', cfg.examModule)
  }
  if (cfg.excludeQuestionIds && cfg.excludeQuestionIds.length > 0) {
    query = query.not('id', 'in', `(${cfg.excludeQuestionIds.join(',')})`)
  }

  const { data, error } = await query
  if (error) throw error
  return (data ?? []) as QuestionRow[]
}

export async function findQuestionsByIds(ids: string[]): Promise<QuestionRow[]> {
  if (ids.length === 0) return []
  const { data, error } = await supabaseAdmin
    .from('questions')
    .select('*')
    .in('id', ids)
  if (error) throw error
  return (data ?? []) as QuestionRow[]
}

export async function findOptionsByQuestionIds(questionIds: string[]): Promise<QuestionOptionRow[]> {
  if (questionIds.length === 0) return []
  const { data, error } = await supabaseAdmin
    .from('question_options')
    .select('*')
    .in('question_id', questionIds)
    .order('sort_order', { ascending: true })
  if (error) throw error
  return (data ?? []) as QuestionOptionRow[]
}

export async function findPassageById(id: string): Promise<ReadingPassageRow | null> {
  const { data, error } = await supabaseAdmin
    .from('reading_passages')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as ReadingPassageRow | null
}

export async function findPassagesByIds(ids: string[]): Promise<ReadingPassageRow[]> {
  if (ids.length === 0) return []
  const { data, error } = await supabaseAdmin
    .from('reading_passages')
    .select('*')
    .in('id', ids)
  if (error) throw error
  return (data ?? []) as ReadingPassageRow[]
}

export async function incrementUsageCount(questionIds: string[]): Promise<void> {
  if (questionIds.length === 0) return
  for (const id of questionIds) {
    const { error } = await supabaseAdmin
      .from('questions')
      .update({ usage_count: 1 })
      .eq('id', id)
    void error
  }
}
