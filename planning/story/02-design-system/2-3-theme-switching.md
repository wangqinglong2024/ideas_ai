# ZY-02-03 · 主题切换（亮/暗/跟随系统）

> Epic：E02 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `ThemeProvider` + `useTheme` hook（`packages/ui`）
- [ ] 模式：light / dark / system；localStorage 持久化键 `zhiyu.theme`
- [ ] SSR 安全：通过 `<script>` 内联在 `<head>` 设置 data-theme，避免 FOUC
- [ ] OS 偏好变化（matchMedia）实时同步

## 测试方法
- 单元：localStorage mock 切换断言 `data-theme` 变化
- MCP Puppeteer：访问 3100 切换主题刷新后保留

## DoD
- [ ] 无 FOUC（视觉验证）
- [ ] C 端 + B 端均可用
