/**
 * AI 生成中页：展示进度动画，轮询到 completed 后跳转报告页
 */
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MeshBackground from '../components/layout/MeshBackground'
import { useOrderStatus } from '../hooks/useOrderStatus'
import { useAuth } from '../hooks/useAuth'

const steps = ['理解你的困境...', '识别核心症结...', '推演三条路径...', '生成认知升维...']

export default function GeneratingPage() {
  useAuth()
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { data } = useOrderStatus(orderId)

  useEffect(() => {
    if (data?.status === 'completed') {
      navigate(`/report/${orderId}`, { replace: true })
    } else if (data?.status === 'failed') {
      navigate(`/analyze/career?retry=${orderId}`, { replace: true })
    }
  }, [data, orderId, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-5 max-w-app mx-auto">
      <MeshBackground />
      <motion.div
        className="text-center w-full"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* 旋转光环 */}
        <div className="relative w-24 h-24 mx-auto mb-8">
          <motion.div
            className="absolute inset-0 rounded-full border-2"
            style={{ borderColor: 'var(--border-gold)', borderTopColor: 'var(--gold-base)' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, ease: 'linear', repeat: Infinity }}
          />
          <div
            className="absolute inset-3 rounded-full"
            style={{ background: 'var(--gold-glow)' }}
          />
          <span
            className="absolute inset-0 flex items-center justify-center text-2xl"
            style={{ color: 'var(--text-gold)' }}
          >
            ✦
          </span>
        </div>

        <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
          AI 正在分析中
        </h2>
        <p className="text-sm mb-8" style={{ color: 'var(--text-secondary)' }}>
          通常需要 30-60 秒，请耐心等待
        </p>

        {/* 步骤指示 */}
        <div className="flex flex-col gap-2 text-left max-w-[280px] mx-auto">
          {steps.map((step, i) => (
            <motion.div
              key={step}
              className="flex items-center gap-3 text-sm"
              initial={{ opacity: 0.3 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 2,
                ease: 'easeInOut',
                repeat: Infinity,
                delay: i * 0.5,
              }}
              style={{ color: 'var(--text-secondary)' }}
            >
              <span style={{ color: 'var(--text-gold)' }}>›</span>
              {step}
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
