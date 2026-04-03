/**
 * 邀请落地页：展示邀请人、引导注册
 * 不需要登录即可访问
 */
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MeshBackground from '../components/layout/MeshBackground'
import Button from '../components/common/Button'
import Disclaimer from '../components/common/Disclaimer'

export default function InvitePage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <MeshBackground />
      <motion.div
        className="w-full max-w-app text-center"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div
          className="w-16 h-16 rounded-full flex items-center justify-center text-3xl mx-auto mb-6"
          style={{ background: 'var(--gold-glow)', border: '1px solid var(--border-gold)' }}
        >
          ✦
        </div>

        <h1
          className="text-xl font-semibold mb-3"
          style={{ color: 'var(--text-gold)', letterSpacing: '0.12em' }}
        >
          内观 · AI 认知镜
        </h1>
        <p className="text-base mb-2" style={{ color: 'var(--text-primary)' }}>
          你的朋友邀请你来看清困境
        </p>
        <p className="text-sm mb-10" style={{ color: 'var(--text-secondary)' }}>
          描述你的职场或情感困境，AI 为你生成一份
          <br />
          深度认知分析报告 · 仅需 ¥28.8
        </p>

        <div className="glass-panel p-5 mb-8 text-left">
          <p className="text-sm font-medium mb-3" style={{ color: 'var(--text-gold)' }}>
            报告包含：
          </p>
          <div className="flex flex-col gap-2">
            {['核心症结 — 看清问题本质', '三条路径 — 每条的优劣分析', '认知升维 — 突破思维局限'].map(
              (item) => (
                <div key={item} className="flex items-center gap-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
                  <span style={{ color: 'var(--text-gold)' }}>✓</span>
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <Button onClick={() => navigate(`/login?invite=${code}`)}>
          立即体验
        </Button>

        <Disclaimer type="invite" className="mt-6" />
      </motion.div>
    </div>
  )
}
