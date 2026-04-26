# ZY-02-05 · 12 个核心组件

> Epic：E02 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 组件清单：Button / Input / Card / Modal / Toast / Drawer / Select / Tabs / Tooltip / Avatar / Badge / Switch
- [ ] shadcn/ui 二次封装 + 玻璃态变体（接 ZY-02-02）
- [ ] 每个组件含 Storybook story + 5 种 variant
- [ ] axe-core 无 WCAG AA 违规
- [ ] 键盘可达性 100%

## 测试方法
- `docker compose exec zhiyu-app-fe pnpm test:ui`（vitest + @testing-library）
- Storybook a11y addon 全绿

## DoD
- [ ] 12 组件 export 自 `@zhiyu/ui`
- [ ] Storybook story 全绿
