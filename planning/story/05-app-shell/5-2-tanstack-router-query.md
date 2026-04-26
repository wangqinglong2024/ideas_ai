# ZY-05-02 · TanStack Router + Query

> Epic：E05 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] TanStack Router 文件路由 + 类型生成（vite plugin）
- [ ] `requireAuth` loader：未登录 → `/auth/login?next=`；登录态来自 supabase auth
- [ ] 嵌套布局、滚动恢复
- [ ] TanStack Query：QueryClient + persister（IndexedDB）
- [ ] 全局错误兜底 component；DevTools 仅 dev

## 测试方法
- 单元：路由匹配、loader 守卫
- MCP Puppeteer：未登录访问受保护路由 → 跳登录

## DoD
- [ ] 路由 / 守卫 / 持久化通
