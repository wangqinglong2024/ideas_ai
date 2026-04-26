# ZY-20-03 · 增长接入占位（feature flag）

> Epic：E20 · 估算：S · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `<GrowthPixel id="…" provider="ga|meta|tiktok" />` 组件
- [ ] 默认 flag 关闭 → 空 render
- [ ] 开启后注入 stub 脚本（不实际发请求）
- [ ] **禁止**预装 GTM / 任何 SaaS SDK
- [ ] 用户填 id 后启用真实 pixel（自行处理）

## 测试方法
- 单元：flag 关 → DOM 无 pixel
- flag 开 → stub 出现

## DoD
- [ ] 占位组件 + flag 控制
