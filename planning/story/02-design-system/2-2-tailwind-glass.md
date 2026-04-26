# ZY-02-02 · Tailwind v4 配置 + 玻璃态系统

> Epic：E02 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `tailwind.config.ts` 引用 `@zhiyu/tokens` preset
- [ ] container queries 启用
- [ ] `.glass` / `.glass-strong` / `.glass-soft` utility（backdrop-filter + 半透明 + 边）
- [ ] Safari / 旧浏览器降级（不支持 backdrop-filter 时退化为半透明纯色）
- [ ] 性能预算：单页面最多 3 层 glass 叠加；ESLint 规则警告

## 测试方法
- Storybook 中 glass 三档对比页通过 a11y AA
- 用 Chrome DevTools 模拟 Safari → 自动降级生效
- `docker compose exec zhiyu-app-fe pnpm lint` 通过

## DoD
- [ ] 三档 glass 在 zhiyu-app-fe / zhiyu-admin-fe 通用
- [ ] 不引入第三方 glass 库
