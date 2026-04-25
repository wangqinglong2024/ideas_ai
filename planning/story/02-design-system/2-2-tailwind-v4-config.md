# Story 2.2: Tailwind v4 配置

Status: ready-for-dev

## Story

As a 前端开发者,
I want 全项目共用一份基于 design tokens 的 Tailwind v4 配置,
so that 所有 app / admin / web / Storybook 都能引用统一调色板、间距、容器查询，并在生产构建时正确 PurgeCSS。

## Acceptance Criteria

1. 创建 `packages/config/tailwind`，导出 `preset.cjs`（包装 `@zhiyu/tokens` 的 tailwind preset）。
2. `apps/app`、`apps/admin`、`apps/web`、`packages/ui` 全部 `tailwind.config.ts` `presets: [require('@zhiyu/config/tailwind')]`。
3. Cosmic Refraction palette 通过 token 注入；**校验配置中无 `violet/purple`** 颜色键。
4. Container queries 启用：`@container/*` 工具类可用（v4 内置）。
5. PurgeCSS（v4 `content`）配置覆盖所有 apps + packages 的 `**/*.{ts,tsx,html,mdx}`。
6. dark mode 选用 `selector` 模式 `[data-theme="dark"]`，与 2-4 主题切换一致。
7. 自定义工具类 `glass / glass-strong / glass-soft`（占位声明，实际 CSS 在 2-3 story 实现）。
8. 验证：在 `apps/app` 写一个 `<div class="bg-bg-base text-fg-base @container">` demo 渲染正常；生产构建后 CSS ≤ 60 KB（gzip）。

## Tasks / Subtasks

- [ ] Task 1: config 包（AC: #1）
  - [ ] `packages/config/tailwind/preset.cjs` 引入 `@zhiyu/tokens/tailwind`
  - [ ] 暴露 `darkMode: ['selector', '[data-theme="dark"]']`
- [ ] Task 2: 四端引用（AC: #2, #5）
  - [ ] 各 app/package 的 `tailwind.config.ts` 应用 preset + content
  - [ ] PostCSS plugin 接 v4 `@tailwindcss/postcss`
- [ ] Task 3: 校验（AC: #3, #4, #6, #7）
  - [ ] vitest 检查 preset config 不含 `violet|purple`
  - [ ] container query demo 通过
  - [ ] dark mode selector 正确
  - [ ] 占位 utility class 声明
- [ ] Task 4: 性能验收（AC: #8）
  - [ ] `pnpm --filter=@zhiyu/app build` 输出 css 体积报告 ≤ 60 KB gzip

## Dev Notes

### 关键约束
- **Tailwind v4** 用 `@import "tailwindcss"` 直接导入，不再需要 `@tailwind base/components/utilities`。
- 配置走 `tailwind.config.ts`（CSS-first 也可，但 monorepo 多端复用 TS 配置更稳）。
- container queries：v4 默认启用，无需插件。
- `@zhiyu/config/tailwind` 同时为 Storybook 复用（2-10）。

### 依赖链
- 依赖：2-1 design-tokens 包
- 被依赖：2-3 / 2-4 / 2-6 / 2-8 / 2-10

### Project Structure Notes

```
packages/config/
  tailwind/
    preset.cjs
    index.ts
  package.json
apps/{app,admin,web}/tailwind.config.ts
packages/ui/tailwind.config.ts
```

### Testing Standards
- vitest 校验 preset config
- 端到端体积 budget 由 CI 检查

### References
- [Source: planning/epics/02-design-system.md#ZY-02-02](../../epics/02-design-system.md)
- [Source: planning/ux/02-design-tokens.md](../../ux/02-design-tokens.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
