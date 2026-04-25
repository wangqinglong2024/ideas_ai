# Story 4.9: RTL 准备

Status: ready-for-dev

## Story

As a 设计系统 / 前端开发者,
I want 在所有自有组件中改用 CSS logical properties，并支持 `dir="rtl"` 切换不破图,
so that 未来扩展阿拉伯 / 希伯来语时无需重写组件，本期保持视觉零变化。

## Acceptance Criteria

1. `packages/ui` 与 app/admin 的样式中：`margin-left/right` → `margin-inline-start/end`、`padding-*` 同理；`left/right` → `inset-inline-start/end`；`text-align: left/right` → `start/end`。
2. Tailwind v4 配置开启 logical 工具类（`ms-*` / `me-*` / `ps-*` / `pe-*` / `start-*` / `end-*`）；在 PR 中引导使用。
3. 提供 `<DirProvider dir="ltr|rtl">`，自动同步 `<html dir>`。
4. 现有 4 语下 `dir="rtl"` 强制开启时，关键页面（登录 / 发现 / 课程详情 / 商店）截图与 ltr 镜像一致，无破图。
5. ESLint 规则 `no-physical-css-properties`（自定义）警告物理属性使用，CI 红线 = 0。
6. Storybook 切换 RTL toolbar 全部组件能正确镜像。
7. 文档：`packages/ui/docs/rtl.md` 写明开发者注意事项。

## Tasks / Subtasks

- [ ] Task 1: Tailwind logical 工具开启（AC: #2）
  - [ ] `tailwind.preset.cjs` 加 `@plugin "tailwindcss-logical"` 或自定义 plugin
- [ ] Task 2: 组件改造（AC: #1, #4, #6）
  - [ ] 全局 codemod jscodeshift：`marginLeft → marginInlineStart` 等
  - [ ] Storybook RTL toolbar：`@storybook/addon-rtl-direction`
- [ ] Task 3: DirProvider（AC: #3）
  - [ ] 监听语言变化（4-1 emits）→ 设 `<html dir>`
  - [ ] 当前 4 语全 ltr，预留 ar/he
- [ ] Task 4: ESLint 规则（AC: #5, #7）
  - [ ] 自定义 `eslint-plugin-zhiyu/no-physical-css`
  - [ ] CI 集成；md 写文档

## Dev Notes

### 关键架构约束
- **不在本期启用 RTL 语言**，仅做基建。dir="rtl" 仅在测试/Storybook 中切换。
- **全局 CSS 文件** 也要扫一遍（`apps/*/src/**/*.css`）。
- **图片镜像**：方向相关图标（如返回箭头）需 `style="transform: scaleX(var(--rtl, 1))"` 处理。

### 关联后续 stories
- 4-1 暴露的 language change 事件
- E02 设计系统已落地组件需要迁移

### 测试标准
- Chromatic：核心组件 ltr / rtl 双截图
- ESLint CI：违规 = 0

### Project Structure Notes

```
packages/ui/
  src/dir/DirProvider.tsx
  src/styles/*.css      # codemod 改造
  docs/rtl.md
packages/eslint-plugin-zhiyu/rules/no-physical-css.ts
codemods/physical-to-logical.ts
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-09](../../epics/04-i18n.md)
- [Source: planning/story/02-design-system/2-2-tailwind-v4-config.md](../02-design-system/2-2-tailwind-v4-config.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
