/**
 * 支付等待页：轮询订单状态，检测到 paid 后跳转到生成中页面
 * 用户从支付宝/微信回跳后落地此页
 */
import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MeshBackground from '../components/layout/MeshBackground'
import { useOrderStatus } from '../hooks/useOrderStatus'
import { useAuth } from '../hooks/useAuth'

export default function PayingPage() {
  useAuth()
  const { orderId } = useParams<{ orderId: string }>()
  const navigate = useNavigate()
  const { data, error } = useOrderStatus(orderId)

  useEffect(() => {
    if (!data) return
    if (data.status === 'paid' || data.status === 'generating') {
      navigate(`/generating/${orderId}`, { replace: true })
    } else if (data.status === 'completed') {
      navigate(`/report/${orderId}`, { replace: true })
    }
  }, [data, orderId, navigate])

  return (
    <div className="min-h-screen flex items-center justify-center px-5 max-w-app mx-auto">
      <MeshBackground />
      <motion.div
        className="text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.35 }}
      >
        <motion.div
          className="w-12 h-12 border-2 border-t-transparent rounded-full mx-auto mb-6"
          style={{ borderColor: 'var(--gold-base)', borderTopColor: 'transparent' }}
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, ease: 'linear', repeat: Infinity }}
        />
        <h2 className="text-lg font-medium mb-2" style={{ color: 'var(--text-primary)' }}>
          正在确认支付
        </h2>
        <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {error || '请稍候，支付确认通常在 10 秒内完成'}
        </p>
        {error && (
          <button
            className="mt-6 text-sm"
            style={{ color: 'var(--text-gold)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => window.location.reload()}
          >
            点击刷新
          </button>
        )}
      </motion.div>
    </div>
  )
}
