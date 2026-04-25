# Story 2.6: 核心组件（Button/Input/Card/Modal/Toast/Drawer 等 12 件）

Status: ready-for-dev

## Story

As a 业务开发者,
I want `packages/ui` 提供 12 件常用基础组件，全部基于 shadcn/ui 二次封装并应用玻璃态、主题、动效,
so that 三端业务页可零摩擦组合，可访问性达到 AA。

## Acceptance Criteria

1. 实现 12 件组件：`Button / IconButton / Input / Textarea / Select / Checkbox / Radio / Switch / Card / Modal / Toast / Drawer / Tabs / Tooltip`（含 Tabs/Tooltip 共 14 件，留 2 件 buffer）。
2. 每件均基于 shadcn/ui 源码二次封装到 `packages/ui/src/components/<name>/`，**禁止**直接 re-export shadcn。
3. 视觉上接入 2-3 玻璃态 + 2-1 tokens：颜色、间距、阴影、圆角全引用 token。
4. 全部支持亮 / 暗主题，对比度通过 axe AA。
5. 全键盘可达：Tab 顺序合理；Modal/Drawer 内焦点陷阱；ESC 关闭；ARIA 属性正确。
6. 每件组件 TS 类型完善：variant / size / loading / disabled / 受控-非受控双模式。
7. 每件组件至少 4 个 Storybook stories：默认 / hover / disabled / loading；亮暗各一组。
8. 单元测试 ≥ 80% 覆盖：使用 vitest + @testing-library/react；至少含交互（点击 / 键盘 / 受控）。
9. Bundle 体积：tree-shake 后单组件 import ≤ 5KB（minified）。
10. 文档：每件组件 `<name>.stories.mdx` 含 props 表 + 用法 + a11y 注意。

## Tasks / Subtasks

- [ ] Task 1: 包结构（AC: #1, #2）
  - [ ] `packages/ui/src/components/<name>/{index.tsx, <name>.tsx, <name>.stories.tsx, <name>.test.tsx}`
  - [ ] 集中 barrel export `packages/ui/src/index.ts`
- [ ] Task 2: Button / IconButton（AC: #3-#9）
  - [ ] variant: solid/outline/ghost/glass
  - [ ] size: sm/md/lg
  - [ ] loading state（spinner from feedback 2-7）
- [ ] Task 3: Form 组件 Input/Textarea/Select/Checkbox/Radio/Switch
  - [ ] Form 集成 react-hook-form 兼容（forwardRef）
  - [ ] error state + helper text 槽
- [ ] Task 4: Card
  - [ ] variant: default/glass/outline
  - [ ] header/body/footer slot
- [ ] Task 5: Modal / Drawer
  - [ ] 基于 Radix Dialog
  - [ ] focus trap + ESC + 点击外部
  - [ ] mobile: Drawer 默认 bottom sheet
- [ ] Task 6: Toast
  - [ ] 基于 sonner 二次封装
  - [ ] 4 类（success/error/warning/info）+ position
- [ ] Task 7: Tabs / Tooltip（AC: #1）
  - [ ] Tabs Radix；Tooltip Radix delay 350ms
- [ ] Task 8: 测试 + Storybook + 体积报告（AC: #7-#9）

## Dev Notes

### 关键约束
- **不 re-export shadcn**：复制源码到本仓便于改样式，保持可控
- 受控-非受控双模式：内部 `useControllableState`
- a11y：每个交互组件先看 Radix 文档；使用 ARIA 时勿覆盖 Radix 内置
- 视觉一致：所有 component 默认 `glass` variant 优先

### Project Structure Notes
```
packages/ui/src/components/
  button/
  icon-button/
  input/
  textarea/
  select/
  checkbox/
  radio/
  switch/
  card/
  modal/
  drawer/
  toast/
  tabs/
  tooltip/
```

### 依赖链
- 依赖：2-1, 2-2, 2-3, 2-4, 2-5
- 被依赖：所有页面 stories；E03 / E05 / E06+ 全部业务

### Testing Standards
- vitest ≥ 80% per component
- Storybook play function 做交互回归
- axe-core a11y 自动跑

### References
- [Source: planning/epics/02-design-system.md#ZY-02-06](../../epics/02-design-system.md)
- [Source: planning/ux/07-components-core.md](../../ux/07-components-core.md)
- [Source: planning/ux/13-accessibility.md](../../ux/13-accessibility.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
