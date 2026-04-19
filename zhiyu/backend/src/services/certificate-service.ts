import * as assessmentRepo from '../repositories/assessment-repo'
import { NotFound } from '../core/exceptions'

export async function getCertificateByNo(certificateNo: string) {
  const cert = await assessmentRepo.findCertificateByNo(certificateNo)
  if (!cert) throw NotFound('证书不存在')

  return {
    certificateNo: cert.certificate_no,
    userNickname: cert.user_nickname,
    levelNameZh: cert.level_name_zh,
    levelNameEn: cert.level_name_en,
    levelNumber: cert.level_number,
    hskLevel: cert.hsk_level,
    cefrLevel: cert.cefr_level,
    totalScore: cert.total_score,
    moduleScores: cert.module_scores,
    issuedAt: cert.issued_at,
  }
}

export async function getUserCertificates(userId: string) {
  const certs = await assessmentRepo.findCertificatesByUser(userId)
  return certs.map(cert => ({
    certificateNo: cert.certificate_no,
    levelNameZh: cert.level_name_zh,
    levelNameEn: cert.level_name_en,
    levelNumber: cert.level_number,
    hskLevel: cert.hsk_level,
    cefrLevel: cert.cefr_level,
    totalScore: cert.total_score,
    issuedAt: cert.issued_at,
  }))
}
