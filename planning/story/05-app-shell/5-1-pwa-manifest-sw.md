# ZY-05-01 · PWA Manifest + Service Worker

> Epic：E05 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `manifest.webmanifest` 完整（含 maskable icons、shortcuts）
- [ ] iOS splash screen 全尺寸生成脚本（容器内 sharp）
- [ ] vite-plugin-pwa + Workbox：静态 cache-first、GET API stale-while-revalidate
- [ ] 离线兜底页 `/offline.html`
- [ ] 自动更新提示（有新版 → toast → reload）
- [ ] 推送频道：subscribe `notification:user:<uid>` supabase-realtime 频道（占位）

## 测试方法
- MCP Puppeteer：DevTools 离线 → 访问 `/` → 显示兜底
- Lighthouse PWA score ≥ 95（zhiyu-app-fe 容器内 lh-cli）

## DoD
- [ ] PWA score ≥ 95
- [ ] 不引入任何 push SaaS（OneSignal / FCM SDK）
