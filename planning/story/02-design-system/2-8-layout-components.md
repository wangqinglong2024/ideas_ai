# Story 2.8: 布局组件（Container/Grid/Stack/Splitter）

Status: ready-for-dev

## Story

As a 页面开发者,
I want 一组响应式布局原子（Container / Grid / Stack / Splitter / Spacer / Center / AspectRatio）,
so that 移动 / 平板 / 桌面三档无缝适配，避免页面手写一次性 flex/grid。

## Acceptance Criteria

1. 实现 7 件布局组件：`Container / Grid / Stack（HStack/VStack）/ Splitter / Spacer / Center / AspectRatio`。
2. 全部使用 Tailwind container queries（`@container`）实现响应式，**不依赖** viewport breakpoints。
3. 三档断点（移动 / 平板 / 桌面）通过 token 暴露：`xs/sm/md/lg/xl`。
4. `Container` 提供 `size: sm/md/lg/xl/full`，居中 + 内边距随 size。
5. `Grid` 接受 `cols / gap / minColWidth`；`minColWidth` 模式自动用 `repeat(auto-fit, minmax)`。
6. `Stack` 支持 `direction / gap / align / justify / wrap / divider`。
7. `Splitter` 双面板可拖拽调整宽度（桌面）/ 上下堆叠（移动）。
8. `AspectRatio` 锁定比例（16/9 / 1/1 / 9/16 等）。
9. 全部 SSR 安全；Storybook stories 覆盖三档容器宽度 demo。
10. 测试 ≥ 70% 覆盖；axe AA。

## Tasks / Subtasks

- [ ] Task 1: Container / Center / Spacer / AspectRatio（AC: #1, #4, #8）
- [ ] Task 2: Grid（AC: #5）
  - [ ] cols 数字 / 'auto-fit' 两模式
- [ ] Task 3: Stack（HStack/VStack）（AC: #6）
  - [ ] divider slot
- [ ] Task 4: Splitter（AC: #7）
  - [ ] 拖拽 hook + a11y key 支持（←→ 调整）
- [ ] Task 5: Storybook + 测试（AC: #9, #10）

## Dev Notes

### 关键约束
- container queries 优先；如确需 viewport 响应，使用 `@media` 但需注释原因
- Splitter 拖拽：捕获 pointer events，移动端 disable
- 全部 polymorphic（`as` prop）支持

### Project Structure Notes
```
packages/ui/src/components/
  container/
  grid/
  stack/
  splitter/
  spacer/
  center/
  aspect-ratio/
```

### 依赖链
- 依赖：2-1, 2-2
- 被依赖：所有业务页

### References
- [Source: planning/epics/02-design-system.md#ZY-02-08](../../epics/02-design-system.md)
- [Source: planning/ux/05-layout-and-responsive.md](../../ux/05-layout-and-responsive.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
