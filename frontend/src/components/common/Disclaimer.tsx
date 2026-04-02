/**
 * 免责声明组件（固定底部或行内）
 */
interface Props {
  type?: 'report' | 'input' | 'invite'
  className?: string
}

const TEXT = {
  report: '本报告由 AI 根据您的描述生成，仅供参考，不构成专业职业、心理或法律建议。',
  input:  'AI生成内容仅供参考，不构成专业职业/心理建议',
  invite: '本平台采用单级分销机制，邀请人仅对直接邀请的用户产生佣金，与多级传销无关。',
}

export default function Disclaimer({ type = 'input', className = '' }: Props) {
  return (
    <p
      className={`text-xs text-center ${className}`}
      style={{ color: 'var(--text-muted)' }}
    >
      {TEXT[type]}
    </p>
  )
}
