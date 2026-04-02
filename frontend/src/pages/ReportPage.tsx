/**
 * 报告展示页：核心症结 + 三条路径 + 认知升维
 * 底部固定免责声明
 */
import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MeshBackground from '../components/layout/MeshBackground'
import ReportCard from '../components/report/ReportCard'
import Disclaimer from '../components/common/Disclaimer'
import Button from '../components/common/Button'
import { getOrderStatus } from '../api/orders'
import type { ReportData } from '../types/api'
import { useAuth } from '../hooks/useAuth'

export default function ReportPage() {
  useAuth()
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!orderId) return
    getOrderStatus(orderId)
      .then((res) => {
        const data = res.data.data
        if (data?.status === 'completed' && data.report) {
          setReport(data.report as ReportData)
        } else if (data?.status === 'failed') {
          setError('报告生成失败，请联系客服')
        } else {
          setError('报告还未生成，请稍候')
        }
      })
      .catch(() => setError('加载失败，请刷新重试'))
      .finally(() => setLoading(false))
  }, [orderId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <MeshBackground />
        <motion.div
          className="w-8 h-8 border-2 border-t-transparent rounded-full"
          style={{ borderColor: 'var(--gold-base)', borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
        />
      </div>
    )
  }

  return (
    <div className="min-h-screen px-5 pt-12 pb-32 max-w-app mx-auto">
      <MeshBackground />

      {/* 顶部 */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <button
          className="text-sm mb-6"
          style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/profile')}
        >
          ← 我的报告
        </button>

        <div className="mb-8">
          <h1
            className="text-xl font-semibold mb-1"
            style={{ color: 'var(--text-gold)', letterSpacing: '0.12em' }}
          >
            你的认知分析报告
          </h1>
          <p className="text-sm" style={{ color: 'var(--text-muted)' }}>
            由 AI 深度分析生成
          </p>
        </div>

        {error && (
          <p className="text-sm text-center" style={{ color: 'var(--error)' }}>
            {error}
          </p>
        )}

        {report && <ReportCard report={report} />}
      </motion.div>

      {/* 底部操作栏（fixed） */}
      <div
        className="fixed bottom-0 left-0 right-0 px-5 pb-8 pt-4"
        style={{ background: 'linear-gradient(transparent, var(--bg-base) 40%)' }}
      >
        <div className="max-w-app mx-auto flex flex-col gap-3">
          <Button onClick={() => navigate('/')}>再分析一个困境</Button>
          <Disclaimer type="report" />
        </div>
      </div>
    </div>
  )
}
