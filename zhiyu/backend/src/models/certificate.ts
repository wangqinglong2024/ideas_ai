export interface CertificateRow {
  id: string
  user_id: string
  attempt_id: string
  level_id: string
  certificate_no: string
  user_nickname: string
  level_name_zh: string
  level_name_en: string
  level_number: number
  hsk_level: string
  cefr_level: string
  total_score: number
  module_scores: Record<string, number> | null
  issued_at: string
  certificate_type: string
  is_active: boolean
  created_at: string
  updated_at: string
}
