/**
 * 输入困境页：文本域 + 字数统计 + 付款按钮
 */
import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MeshBackground from '../components/layout/MeshBackground'
import Button from '../components/common/Button'
import Disclaimer from '../components/common/Disclaimer'
import { createOrder } from '../api/orders'
import { useAuth } from '../hooks/useAuth'

const CATEGORY_LABEL: Record<string, string> = {
  career: '职场困境',
  emotion: '情感困境',
}

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

export default function AnalyzePage() {
  useAuth()
  const { category = 'career' } = useParams<{ category: string }>()
  const navigate = useNavigate()
  const [content, setContent] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handlePay = async () => {
    if (content.trim().length < 20) {
      setError('请至少输入 20 个字符描述你的困境')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await createOrder(category, content.trim())
      const { order_id, pay_url } = res.data.data!
      // 跳转到支付页面
      window.location.href = pay_url
      // 支付完成后商家页面会回跳到 /paying/:orderId
    } catch (e: any) {
      setError(e.response?.data?.message || '下单失败，请稍后重试')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen px-5 pt-12 pb-8 max-w-app mx-auto flex flex-col">
      <MeshBackground />
      <motion.div
        className="flex flex-col flex-1"
        variants={pageVariants}
        initial="initial"
        animate="animate"
      >
        {/* 返回 */}
        <button
          className="text-sm mb-8 self-start"
          style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
          onClick={() => navigate('/')}
        >
          ← 返回
        </button>

        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {CATEGORY_LABEL[category] || '深度分析'}
        </h2>
        <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>
          请详细描述你正在面对的困境。越具体，分析越精准。
        </p>

        {/* 文本域 */}
        <div className="relative flex-1 flex flex-col">
          <textarea
            className="glass-panel w-full flex-1 min-h-[220px] p-4 text-base resize-none outline-none"
            style={{
              color: 'var(--text-primary)',
              background: 'var(--surface-1)',
              caretColor: 'var(--gold-base)',
            }}
            placeholder="例如：我在公司做了三年，感觉一直没有晋升机会，和直属领导关系也很紧张..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={2000}
          />
          <p
            className="text-xs text-right mt-2 font-num"
            style={{ color: content.length < 20 ? 'var(--error)' : 'var(--text-muted)' }}
          >
            {content.length} / 2000
          </p>
        </div>

        {error && (
          <p className="text-sm mt-2" style={{ color: 'var(--error)' }}>
            {error}
          </p>
        )}

        {/* 付款按钮 */}
        <div className="mt-6">
          <Button onClick={handlePay} loading={loading} disabled={content.trim().length < 20}>
            支付 ¥28.8 · 生成我的报告
          </Button>
          <Disclaimer type="input" className="mt-3" />
        </div>
      </motion.div>
    </div>
  )
}
