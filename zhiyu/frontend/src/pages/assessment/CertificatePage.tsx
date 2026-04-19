import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { apiFetch } from '../../features/course-learning/services/api'

interface CertificateData {
  id: string
  certificateNo: string
  userId: string
  levelId: string
  certificateType: string
  totalScore: number
  issuedAt: string
  hskLevel: string
  cefrLevel: string
  metadata: Record<string, unknown>
}

export const CertificatePage = () => {
  const { certificateNo } = useParams<{ certificateNo: string }>()
  const [cert, setCert] = useState<CertificateData | null>(null)
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!certificateNo) return
    apiFetch<CertificateData>(`/api/v1/certificates/${certificateNo}`)
      .then(setCert)
      .finally(() => setLoading(false))
  }, [certificateNo])

  useEffect(() => {
    if (!cert || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const W = 1080
    const H = 1440
    canvas.width = W
    canvas.height = H

    // Background
    const grad = ctx.createLinearGradient(0, 0, W, H)
    grad.addColorStop(0, '#0f172a')
    grad.addColorStop(1, '#1e293b')
    ctx.fillStyle = grad
    ctx.fillRect(0, 0, W, H)

    // Border
    ctx.strokeStyle = 'rgba(255,255,255,0.1)'
    ctx.lineWidth = 2
    ctx.strokeRect(40, 40, W - 80, H - 80)

    // Title
    ctx.fillStyle = '#d97706'
    ctx.font = 'bold 48px sans-serif'
    ctx.textAlign = 'center'
    ctx.fillText('知语 · 中文水平证书', W / 2, 200)

    // HSK / CEFR
    ctx.fillStyle = '#0284c7'
    ctx.font = 'bold 64px sans-serif'
    ctx.fillText(`${cert.hskLevel} / ${cert.cefrLevel}`, W / 2, 400)

    // Score
    ctx.fillStyle = 'rgba(255,255,255,0.8)'
    ctx.font = '36px sans-serif'
    ctx.fillText(`综合得分：${Math.round(cert.totalScore)}`, W / 2, 520)

    // Date
    const date = new Date(cert.issuedAt).toLocaleDateString('zh-CN')
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.font = '24px sans-serif'
    ctx.fillText(`颁发日期：${date}`, W / 2, 620)

    // Certificate No
    ctx.fillStyle = 'rgba(255,255,255,0.3)'
    ctx.font = '18px sans-serif'
    ctx.fillText(`证书编号：${cert.certificateNo}`, W / 2, H - 100)
  }, [cert])

  const handleDownload = () => {
    if (!canvasRef.current) return
    const link = document.createElement('a')
    link.download = `certificate-${cert?.certificateNo ?? 'unknown'}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/50">加载证书...</div>
      </div>
    )
  }

  if (!cert) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/50">证书不存在</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        <canvas
          ref={canvasRef}
          className="w-full rounded-2xl border border-white/10 shadow-lg"
        />

        <div className="flex gap-3 mt-6">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-3 rounded-xl bg-amber-500/20 border border-amber-400/40 text-amber-300 hover:bg-amber-500/30 transition-colors"
          >
            下载证书
          </button>
          <button
            type="button"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: `知语中文水平证书 - ${cert.hskLevel}`,
                  text: `我通过了知语${cert.hskLevel}等级考试！`,
                })
              }
            }}
            className="flex-1 py-3 rounded-xl bg-sky-500/20 border border-sky-400/40 text-sky-300 hover:bg-sky-500/30 transition-colors"
          >
            分享证书
          </button>
        </div>
      </div>
    </div>
  )
}
