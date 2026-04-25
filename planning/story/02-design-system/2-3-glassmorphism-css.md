# Story 2.3: 玻璃态 CSS 系统

Status: ready-for-dev

## Story

As a UI 工程师,
I want 一组语义化的 `.glass / .glass-strong / .glass-soft` 工具类与可组合 mixin,
so that 各组件可在亮 / 暗主题下一致地呈现毛玻璃效果，并在性能预算与浏览器降级下安全使用。

## Acceptance Criteria

1. 在 `packages/tokens/dist/tokens.css` 之外新增 `packages/ui/src/styles/glass.css`，定义三档 utility：
   - `.glass`：默认毛玻璃（`backdrop-filter: blur(16px) saturate(160%)`）
   - `.glass-strong`：内容卡片用（blur 24px + 高背景透明度）
   - `.glass-soft`：浮层 / Toast 用（blur 8px + 低色饱和）
2. 亮 / 暗主题各自定义透明度 + tint 颜色（引用 `--zy-color-glass-*` token）。
3. 浏览器降级：检测 `@supports not (backdrop-filter)` → 降级为固体 `--zy-color-bg-elevated`。
4. 性能预算：单页面 `glass*` 元素 ≤ 8 个；嵌套 ≤ 3 层（提供 lint 规则注释 + Storybook 警告示例）。
5. 移动端低端机检测（UA + GPU memory hint） → 自动注入 `.glass-fallback` class 跳过 backdrop。
6. 与 motion token 联动：hover 进入 + 焦点态有平滑 200ms transition。
7. 暴露 SCSS / Postcss `@apply` 友好的工具类，可在 Tailwind `class="glass-strong"` 直接使用（2-2 占位 → 本 story 实化）。
8. Storybook 故事 `Foundations/Glass`：三档对照 + 亮暗 + 降级三种状态截图。

## Tasks / Subtasks

- [ ] Task 1: token 扩展（AC: #2）
  - [ ] 在 2-1 tokens 增加 `glass.{base,strong,soft}.{bg,border,shadow}` × light/dark
- [ ] Task 2: CSS 实现（AC: #1, #3, #6, #7）
  - [ ] `packages/ui/src/styles/glass.css` 三档 utility
  - [ ] `@supports` 降级
  - [ ] `transition: backdrop-filter 200ms var(--zy-ease-out)`
- [ ] Task 3: 低端机降级（AC: #5）
  - [ ] `useDeviceCapability` hook（在 `packages/ui/src/hooks`）
  - [ ] 自动加 `.glass-fallback`
- [ ] Task 4: Storybook（AC: #8）
  - [ ] `Foundations/Glass.stories.tsx`
  - [ ] 三档 × 亮暗 × 降级 矩阵展示
- [ ] Task 5: 性能 lint（AC: #4）
  - [ ] eslint custom rule 警告 nested glass-* > 3

## Dev Notes

### 关键约束
- backdrop-filter 在 Safari 需要 `-webkit-backdrop-filter` prefix → autoprefixer 必开。
- 低端 Android（Snapdragon 4 系）建议直接降级。
- 嵌套 backdrop 会导致重复合成层，必须监控。

### Project Structure Notes
```
packages/ui/src/
  styles/
    glass.css
    index.css   // 引用 glass.css + tokens.css
  hooks/
    useDeviceCapability.ts
  __stories__/
    foundations/Glass.stories.tsx
```

### 依赖链
- 依赖：2-1, 2-2
- 被依赖：2-6 / 2-7（核心组件大量使用）

### Testing Standards
- Storybook visual regression（2-10 接入 Chromatic）
- DevTools Performance: 单页 glass 元素帧率 ≥ 55fps 中端机

### References
- [Source: planning/epics/02-design-system.md#ZY-02-03](../../epics/02-design-system.md)
- [Source: planning/ux/03-glassmorphism-system.md](../../ux/03-glassmorphism-system.md)
- [Source: planning/ux/16-performance-quality.md](../../ux/16-performance-quality.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
