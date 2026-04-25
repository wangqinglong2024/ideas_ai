# Story 2.10: Storybook + 视觉回归

Status: ready-for-dev

## Story

As a 设计系统维护者,
I want Storybook 完整覆盖所有组件 + 视觉回归集成 Chromatic（或 Loki）,
so that 每个 PR 都自动检测 UI 漂移，并自动部署 storybook.zhiyu.io 给设计 / 产品评审。

## Acceptance Criteria

1. Storybook v8 集成 monorepo（`apps/storybook` 或 `packages/ui` 内自带）。
2. 全部 2-3 / 2-6 / 2-7 / 2-8 / 2-9 组件 stories 100% 覆盖（≥ 80 stories 起步）。
3. addons：`@storybook/addon-essentials` + `addon-a11y`（axe）+ `addon-themes`（亮暗 toolbar）+ `addon-interactions`。
4. `@storybook/test` interaction tests，关键组件（Modal/Drawer/Form）含 play function。
5. 视觉回归 **Chromatic** 集成（GitHub PR）：仅 PR diff 跑；月度配额监控；baseline 在 main 自动更新。
6. CI 集成（依赖 1-4）：PR 自动跑 Chromatic + a11y；失败阻塞 merge。
7. 自动部署 `storybook.zhiyu.io`：main push → Cloudflare Pages 部署；PR 预览 URL。
8. 文档站点：MDX 包含 设计原则（ux/01）/ tokens 索引 / 玻璃态指南 / 主题。
9. 性能：Storybook 主页加载 ≤ 3s；single story ≤ 1s（中端 Mac）。

## Tasks / Subtasks

- [ ] Task 1: Storybook 安装与配置（AC: #1, #3）
  - [ ] `apps/storybook/.storybook/{main.ts, preview.tsx}`
  - [ ] vite-builder
  - [ ] ThemeProvider decorator
- [ ] Task 2: 全组件 stories 整理（AC: #2, #4）
  - [ ] 引用各 package 的 stories（autodocs）
  - [ ] play function 给 Modal/Drawer/Form
- [ ] Task 3: Chromatic 集成（AC: #5, #6）
  - [ ] `chromatic.config.json` + GitHub Action
  - [ ] 月度配额报告 → BetterStack
- [ ] Task 4: 部署（AC: #7）
  - [ ] Cloudflare Pages 项目
  - [ ] DNS storybook.zhiyu.io
- [ ] Task 5: 设计文档 MDX（AC: #8）

## Dev Notes

### 关键约束
- Chromatic free tier 月度 5000 snapshot；监控避免超
- Storybook v8 用 vite-builder（与 app 一致）
- a11y addon 出现 violation → CI fail（除非 story 显式 skip）

### Project Structure Notes
```
apps/storybook/
  .storybook/
    main.ts
    preview.tsx
    manager.ts
  src/
    docs/
      01-principles.mdx
      02-tokens.mdx
      03-glass.mdx
      04-theme.mdx
.github/workflows/chromatic.yml
```

### 依赖链
- 依赖：2-1 ~ 2-9 全部 + S01 1-4 / 1-5
- 被依赖：所有后续 epic（持续视觉回归）

### References
- [Source: planning/epics/02-design-system.md#ZY-02-10](../../epics/02-design-system.md)
- [Source: planning/sprint/02-design-system.md](../../sprint/02-design-system.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
