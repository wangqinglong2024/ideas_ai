import { supabaseAdmin } from '../core/supabase'
import type { QuizAttemptRow, QuizAnswerRow, QuizProgressRow } from '../models/quiz-attempt'
import type { CertificateRow } from '../models/certificate'

// ===== Quiz Attempts =====

export async function createAttempt(data: Partial<QuizAttemptRow>): Promise<QuizAttemptRow> {
  const { data: row, error } = await supabaseAdmin
    .from('quiz_attempts')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return row as QuizAttemptRow
}

export async function findAttemptById(id: string): Promise<QuizAttemptRow | null> {
  const { data, error } = await supabaseAdmin
    .from('quiz_attempts')
    .select('*')
    .eq('id', id)
    .maybeSingle()
  if (error) throw error
  return data as QuizAttemptRow | null
}

export async function updateAttempt(id: string, updates: Partial<QuizAttemptRow>): Promise<void> {
  const { error } = await supabaseAdmin
    .from('quiz_attempts')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function findInProgressAttempt(
  userId: string,
  assessmentType: string,
  targetId: string,
  targetField: 'lesson_id' | 'unit_id' | 'level_id',
): Promise<QuizAttemptRow | null> {
  const { data, error } = await supabaseAdmin
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('assessment_type', assessmentType)
    .eq(targetField, targetId)
    .eq('status', 'in_progress')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as QuizAttemptRow | null
}

export async function countAttempts(
  userId: string,
  assessmentType: string,
  levelId: string,
): Promise<number> {
  const { count, error } = await supabaseAdmin
    .from('quiz_attempts')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)
    .eq('assessment_type', assessmentType)
    .eq('level_id', levelId)
  if (error) throw error
  return count ?? 0
}

export async function findLastGradedAttempt(
  userId: string,
  levelId: string,
  assessmentType: string,
): Promise<QuizAttemptRow | null> {
  const { data, error } = await supabaseAdmin
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .eq('assessment_type', assessmentType)
    .eq('status', 'graded')
    .order('submitted_at', { ascending: false })
    .limit(1)
    .maybeSingle()
  if (error) throw error
  return data as QuizAttemptRow | null
}

export async function findAttemptsByLevelExam(
  userId: string,
  levelId: string,
): Promise<QuizAttemptRow[]> {
  const { data, error } = await supabaseAdmin
    .from('quiz_attempts')
    .select('*')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .eq('assessment_type', 'level_exam')
    .in('status', ['graded', 'submitted'])
    .order('created_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as QuizAttemptRow[]
}

// ===== Quiz Answers =====

export async function createAnswer(data: Partial<QuizAnswerRow>): Promise<QuizAnswerRow> {
  const { data: row, error } = await supabaseAdmin
    .from('quiz_answers')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return row as QuizAnswerRow
}

export async function createAnswersBatch(rows: Partial<QuizAnswerRow>[]): Promise<void> {
  if (rows.length === 0) return
  const { error } = await supabaseAdmin
    .from('quiz_answers')
    .insert(rows)
  if (error) throw error
}

export async function findAnswerByAttemptAndQuestion(
  attemptId: string,
  questionId: string,
): Promise<QuizAnswerRow | null> {
  const { data, error } = await supabaseAdmin
    .from('quiz_answers')
    .select('*')
    .eq('attempt_id', attemptId)
    .eq('question_id', questionId)
    .maybeSingle()
  if (error) throw error
  return data as QuizAnswerRow | null
}

export async function findAnswersByAttempt(attemptId: string): Promise<QuizAnswerRow[]> {
  const { data, error } = await supabaseAdmin
    .from('quiz_answers')
    .select('*')
    .eq('attempt_id', attemptId)
    .order('answered_at', { ascending: true })
  if (error) throw error
  return (data ?? []) as QuizAnswerRow[]
}

// ===== Quiz Progress =====

export async function upsertProgress(data: Partial<QuizProgressRow>): Promise<QuizProgressRow> {
  const { data: row, error } = await supabaseAdmin
    .from('quiz_progress')
    .upsert(data, { onConflict: 'user_id,attempt_id' })
    .select()
    .single()
  if (error) throw error
  return row as QuizProgressRow
}

export async function findProgress(
  userId: string,
  attemptId: string,
): Promise<QuizProgressRow | null> {
  const { data, error } = await supabaseAdmin
    .from('quiz_progress')
    .select('*')
    .eq('user_id', userId)
    .eq('attempt_id', attemptId)
    .maybeSingle()
  if (error) throw error
  return data as QuizProgressRow | null
}

// ===== Certificates =====

export async function createCertificate(data: Partial<CertificateRow>): Promise<CertificateRow> {
  const { data: row, error } = await supabaseAdmin
    .from('user_certificates')
    .insert(data)
    .select()
    .single()
  if (error) throw error
  return row as CertificateRow
}

export async function findCertificateByNo(certificateNo: string): Promise<CertificateRow | null> {
  const { data, error } = await supabaseAdmin
    .from('user_certificates')
    .select('*')
    .eq('certificate_no', certificateNo)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data as CertificateRow | null
}

export async function findCertificateByUserAndLevel(
  userId: string,
  levelId: string,
): Promise<CertificateRow | null> {
  const { data, error } = await supabaseAdmin
    .from('user_certificates')
    .select('*')
    .eq('user_id', userId)
    .eq('level_id', levelId)
    .eq('is_active', true)
    .maybeSingle()
  if (error) throw error
  return data as CertificateRow | null
}

export async function findCertificatesByUser(userId: string): Promise<CertificateRow[]> {
  const { data, error } = await supabaseAdmin
    .from('user_certificates')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('issued_at', { ascending: false })
  if (error) throw error
  return (data ?? []) as CertificateRow[]
}

export async function generateCertificateNo(levelNumber: number): Promise<string> {
  const { data, error } = await supabaseAdmin.rpc('generate_certificate_no', {
    p_level_number: levelNumber,
  })
  if (error) throw error
  return data as string
}
