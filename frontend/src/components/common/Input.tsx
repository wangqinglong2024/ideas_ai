/**
 * 底部下划线输入框（登录页专用）
 */
import type { InputHTMLAttributes } from 'react'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export default function Input({ label, className = '', ...props }: Props) {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>
          {label}
        </label>
      )}
      <input className={`input-underline ${className}`} {...props} />
    </div>
  )
}
