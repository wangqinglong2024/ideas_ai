# ZY-17-03 · RBAC 中间件 + useCan

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] BE express middleware：`requirePermission('content.publish')`
- [ ] FE `useCan('user.ban')` hook + `<Can perm="...">` 组件
- [ ] 权限矩阵 markdown 在 `_bmad/`
- [ ] 路由级 + UI 级 双层

## 测试方法
- 单元：缺权限抛 403
- MCP Puppeteer：低权账户看不到按钮

## DoD
- [ ] 100% 后台路由覆盖
