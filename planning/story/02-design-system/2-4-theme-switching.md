# Story 2.4: 主题切换（亮 / 暗 / 系统）

Status: ready-for-dev

## Story

As a 用户,
I want 应用支持亮色 / 暗色 / 跟随系统三种主题，并能在切换时无闪烁、跨刷新持久化,
so that 学习时根据环境光选择最舒适视觉，同时保留偏好。

## Acceptance Criteria

1. `packages/ui/src/theme/ThemeProvider.tsx` 实现 React Context：`{ theme: 'light' | 'dark' | 'system', resolved: 'light' | 'dark', setTheme }`。
2. `useTheme()` hook 暴露当前与 setter；可在任何组件读取。
3. 持久化到 `localStorage['zy-theme']`，刷新后恢复；user 偏好（E03 settings）覆盖 localStorage。
4. `system` 模式实时跟随 `prefers-color-scheme` 媒体查询变化。
5. **无 FOUC**：在 `<head>` 中注入内联 IIFE 脚本（SSR 与 SPA 均生效），先于首屏 paint 设置 `data-theme` attr。
6. 切换动画：`transition: background-color 250ms, color 250ms var(--zy-ease-out)`；尊重 `prefers-reduced-motion`。
7. 与 design tokens（2-1）联动：仅切换 `<html data-theme>` attr，所有 CSS 变量自动重映射。
8. 单元测试：JSDOM 模拟 `matchMedia`；切换三档；持久化；reduce-motion。
9. Storybook `Foundations/Theme`：三档切换 demo + a11y 检查。

## Tasks / Subtasks

- [ ] Task 1: Provider + hook（AC: #1, #2, #3, #4）
  - [ ] `ThemeProvider`、`useTheme`
  - [ ] localStorage + matchMedia 监听
- [ ] Task 2: FOUC 防护（AC: #5）
  - [ ] `packages/ui/src/theme/inline-script.ts` 输出 IIFE 字符串
  - [ ] 各 app `index.html` `<head>` 注入；vite plugin 简单 inject
- [ ] Task 3: 切换动画（AC: #6）
  - [ ] 全局 `:root { transition: ... }` + reduce-motion 媒体查询
- [ ] Task 4: 测试（AC: #8）
  - [ ] vitest + @testing-library/react
  - [ ] mock matchMedia
- [ ] Task 5: Storybook（AC: #9）
  - [ ] decorator 提供 ThemeProvider
  - [ ] toolbar 切换三档

## Dev Notes

### 关键约束
- inline script 体积 ≤ 600 字节，避免 minify 问题
- system 模式监听 `change` 事件务必 cleanup，防内存泄漏
- 与 E03 user settings：`useTheme` 内部检测是否登录 → 优先用 `me.preferences.theme`

### Project Structure Notes
```
packages/ui/src/theme/
  ThemeProvider.tsx
  useTheme.ts
  inline-script.ts
  index.ts
  __tests__/ThemeProvider.test.tsx
```

### 依赖链
- 依赖：2-1（CSS 变量）、2-2（dark selector）
- 被依赖：所有组件 stories；E03 用户设置

### Testing Standards
- vitest + JSDOM
- a11y: axe 检查双主题对比度 ≥ AA（2-10 视觉回归补强）

### References
- [Source: planning/epics/02-design-system.md#ZY-02-04](../../epics/02-design-system.md)
- [Source: planning/ux/04-theme-system.md](../../ux/04-theme-system.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
