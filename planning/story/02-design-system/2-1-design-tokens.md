# ZY-02-01 · Design Tokens 包

> Epic：E02 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 前端工程师 **I want** 一份统一的 design tokens **So that** UI 三端（C/B 端 + Storybook）外观一致且可换主题。

## Acceptance Criteria
- [ ] `packages/tokens` 输出：CSS 变量、TS 常量、Tailwind v4 preset
- [ ] tokens 类别：colors / spacing / radius / shadow / motion / typography / zIndex
- [ ] 亮 / 暗双套（`:root` + `[data-theme="dark"]`）
- [ ] 颜色按 ux/02 Cosmic Refraction（无紫）
- [ ] tsup 构建产物：`dist/tokens.css` / `dist/index.js` / `dist/preset.js`

## 测试方法
```bash
docker compose exec zhiyu-app-fe pnpm --filter @zhiyu/tokens build
docker compose exec zhiyu-app-fe ls packages/tokens/dist
```
- 单元测试：常量值与 CSS 变量值匹配（vitest）

## DoD
- [ ] build 通过；产物完整
- [ ] FE 容器内可通过 import 引用
- [ ] 切换 `data-theme` 颜色立即生效（手测）
