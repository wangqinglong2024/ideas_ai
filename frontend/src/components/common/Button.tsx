/**
 * 按钮组件：primary（鎏金渐变）/ secondary（透明描边）/ ghost（无边框）
 * Framer Motion 点击弹压动效
 */
import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost'
  disabled?: boolean
  loading?: boolean
  onClick?: () => void
  type?: 'button' | 'submit'
  className?: string
}

export default function Button({
  children,
  variant = 'primary',
  disabled,
  loading,
  onClick,
  type = 'button',
  className = '',
}: Props) {
  const base =
    variant === 'primary'
      ? 'btn-primary'
      : variant === 'secondary'
      ? 'btn-secondary'
      : 'bg-transparent border-none text-[var(--text-secondary)] cursor-pointer text-sm py-2 px-4'

  return (
    <motion.button
      type={type}
      className={`${base} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      whileTap={{ scale: 0.96, transition: { type: 'spring', stiffness: 280, damping: 28 } }}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <motion.span
            className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, ease: 'linear', repeat: Infinity }}
          />
          处理中...
        </span>
      ) : (
        children
      )}
    </motion.button>
  )
}
