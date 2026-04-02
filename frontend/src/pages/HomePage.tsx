/**
 * 首页：选择分析类目（职场 / 情感）
 */
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import MeshBackground from '../components/layout/MeshBackground'
import { useAuth } from '../hooks/useAuth'

const categories = [
  {
    id: 'career',
    emoji: '💼',
    title: '职场困境',
    desc: '职业迷茫、晋升卡关、同事关系、职场压力',
  },
  {
    id: 'emotion',
    emoji: '💬',
    title: '情感困境',
    desc: '感情迷茫、关系撕裂、家庭矛盾、自我迷失',
  },
]

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
}

const cardVariants = {
  initial: { opacity: 0, y: 12 },
  animate: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut', delay: i * 0.06 },
  }),
}

export default function HomePage() {
  useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen px-5 pt-16 pb-24 max-w-app mx-auto">
      <MeshBackground />
      <motion.div variants={pageVariants} initial="initial" animate="animate">
        {/* 标题区 */}
        <div className="text-center mb-12">
          <h1
            className="text-2xl font-bold mb-3"
            style={{ color: 'var(--text-gold)', letterSpacing: '0.18em' }}
          >
            内观
          </h1>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>
            描述你的困境，AI 为你生成
            <br />
            一份深度认知分析报告
          </p>
          <p
            className="font-num text-sm mt-4 inline-block px-3 py-1 rounded-full"
            style={{
              color: 'var(--text-gold)',
              background: 'var(--gold-glow)',
              border: '1px solid var(--border-gold)',
            }}
          >
            ¥28.8 / 份
          </p>
        </div>

        {/* 类目卡片 */}
        <div className="flex flex-col gap-4">
          {categories.map((cat, i) => (
            <motion.div
              key={cat.id}
              custom={i}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              whileTap={{ scale: 0.98, transition: { type: 'spring', stiffness: 280, damping: 28 } }}
              className="glass-panel p-6 cursor-pointer"
              style={{ borderColor: 'var(--border-base)' }}
              onClick={() => navigate(`/analyze/${cat.id}`)}
            >
              <div className="flex items-center gap-4">
                <span className="text-3xl">{cat.emoji}</span>
                <div>
                  <h2 className="text-md font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                    {cat.title}
                  </h2>
                  <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                    {cat.desc}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 我的入口 */}
        <div className="text-center mt-8">
          <button
            className="text-sm"
            style={{ color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            onClick={() => navigate('/profile')}
          >
            我的报告与收益 →
          </button>
        </div>
      </motion.div>
    </div>
  )
}
