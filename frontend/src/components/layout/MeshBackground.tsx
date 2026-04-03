/**
 * 全局 Mesh Gradient 暗金背景（fixed 定位，z-0）
 * 所有页面统一复用此组件作为底层背景
 */
export default function MeshBackground() {
  return (
    <div
      className="fixed inset-0 -z-10"
      style={{ background: 'var(--bg-mesh)' }}
      aria-hidden="true"
    />
  )
}
