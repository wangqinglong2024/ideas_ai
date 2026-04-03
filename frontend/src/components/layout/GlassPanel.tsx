/**
 * 毛玻璃面板通用组件
 */
import type { ReactNode } from 'react'

interface Props {
  children: ReactNode
  className?: string
}

export default function GlassPanel({ children, className = '' }: Props) {
  return (
    <div className={`glass-panel ${className}`}>
      {children}
    </div>
  )
}
