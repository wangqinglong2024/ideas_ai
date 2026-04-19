import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiFetch } from '../../features/course-learning/services/api'

interface CertificateItem {
  id: string
  certificateNo: string
  certificateType: string
  totalScore: number
  issuedAt: string
  hskLevel: string
  cefrLevel: string
}

export const CertificateListPage = () => {
  const navigate = useNavigate()
  const [certs, setCerts] = useState<CertificateItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiFetch<CertificateItem[]>('/api/v1/certificates')
      .then(setCerts)
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 flex items-center justify-center">
        <div className="text-white/50">加载中...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-xl font-bold text-white/90 mb-6">我的证书</h1>

        {certs.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl mb-4 block">🎓</span>
            <p className="text-white/50">暂无证书</p>
            <p className="text-xs text-white/30 mt-1">通过等级考试后可获得证书</p>
          </div>
        ) : (
          <div className="space-y-3">
            {certs.map(cert => (
              <button
                key={cert.id}
                type="button"
                onClick={() => navigate(`/courses/certificates/${cert.certificateNo}`)}
                className="w-full p-4 rounded-2xl bg-white/10 backdrop-blur-lg border border-white/20 text-left hover:bg-white/15 transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-400 font-bold">{cert.hskLevel}</span>
                      <span className="text-xs text-white/30">{cert.cefrLevel}</span>
                    </div>
                    <p className="text-sm text-white/50 mt-1">
                      综合得分：{Math.round(cert.totalScore)}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-white/30">
                      {new Date(cert.issuedAt).toLocaleDateString('zh-CN')}
                    </p>
                    <span className="text-lg">🏅</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
