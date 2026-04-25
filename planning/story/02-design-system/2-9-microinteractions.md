# Story 2.9: 微交互库

Status: ready-for-dev

## Story

As a 用户,
I want 按钮按压、hover 光晕、列表入场等微交互流畅一致,
so that 整个产品有"活的"质感，但保留 reduce-motion 用户的舒适体验。

## Acceptance Criteria

1. 微交互组件 / hook 至少 6 类：
   - `usePressFeedback`（按钮按压回弹）
   - `HoverGlow`（hover 光晕，结合玻璃态）
   - `useListEnter`（列表 stagger 入场）
   - `useReveal`（IntersectionObserver 入场）
   - `useTilt`（卡片 3D 倾斜，桌面 only）
   - `useShake`（错误反馈震动）
2. 所有动画时长 / ease 引用 motion token（2-1）。
3. 全部尊重 `prefers-reduced-motion: reduce`：自动跳过 / 缩短到 ≤ 80ms。
4. Framer Motion 是依赖，但允许后期替换 → 抽象 `motion-driver` 接口。
5. Storybook `Foundations/Motion` 展示全部动效；toolbar 切换 reduce-motion 模拟。
6. 性能：单页面同时活跃微交互 ≤ 30 个；FPS ≥ 55 中端机。
7. 测试覆盖 ≥ 70%（vitest + @testing-library/react）；reduce-motion case 必测。
8. 文档：每个 hook 提供 props 表 + DOM 示例 + 复杂度说明。

## Tasks / Subtasks

- [ ] Task 1: motion-driver 抽象（AC: #4）
  - [ ] `packages/ui/src/motion/driver.ts`
  - [ ] framer-motion 适配
- [ ] Task 2: 6 个 hook / component（AC: #1-#3）
- [ ] Task 3: reduce-motion 全局检测 hook
- [ ] Task 4: Storybook + 测试（AC: #5, #7）

## Dev Notes

### 关键约束
- framer-motion v11；`LazyMotion` + features import 减少体积
- `useTilt` 仅桌面（`pointer: fine`）启用
- intersection observer 必须 unobserve cleanup

### Project Structure Notes
```
packages/ui/src/motion/
  driver.ts
  usePressFeedback.ts
  HoverGlow.tsx
  useListEnter.ts
  useReveal.ts
  useTilt.ts
  useShake.ts
  useReducedMotion.ts
```

### 依赖链
- 依赖：2-1（motion token）、2-3（玻璃态）、2-6（按钮组合）
- 被依赖：业务页 / 游戏 UX 部分

### References
- [Source: planning/epics/02-design-system.md#ZY-02-09](../../epics/02-design-system.md)
- [Source: planning/ux/12-motion.md](../../ux/12-motion.md)
- [Source: planning/ux/13-accessibility.md](../../ux/13-accessibility.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
