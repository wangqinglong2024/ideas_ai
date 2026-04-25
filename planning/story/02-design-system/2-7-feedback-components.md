# Story 2.7: 反馈组件（Skeleton/Empty/Error/Loading 等 8 件）

Status: ready-for-dev

## Story

As a 业务开发者,
I want 8 件反馈类组件统一加载、空、错、提示等状态展示,
so that 各页面情绪化、一致、可访问。

## Acceptance Criteria

1. 实现 8 件：`Skeleton / Spinner / Loading（全屏遮罩）/ Empty / ErrorState / Banner / Alert / Progress`。
2. `Empty` 提供情绪化插画（4 套：搜索无果 / 列表为空 / 网络错 / 权限不足）；插画 SVG ≤ 8KB / 件。
3. `ErrorState` 支持自定义 icon / title / description / action（重试 / 反馈）+ Sentry 错误 ID 展示槽。
4. `Skeleton` 支持 `variant: text/avatar/card/list`，shimmer 动画使用 motion token，尊重 reduce-motion。
5. `Spinner` 三个 size + 颜色随 currentColor；可挂在 Button loading。
6. `Loading` 全屏遮罩组件支持 portal + 玻璃态背景 + 可取消。
7. `Banner` 4 类（info/success/warning/error），可固定顶部，4 语 i18n 兼容。
8. `Alert` inline 提示，支持 dismissible、icon、action。
9. `Progress` 线性 + 圆形两种；可用于上传 / 学习进度。
10. 每件组件：Storybook 4+ stories（亮暗 + 各 variant）；测试覆盖 ≥ 80%；axe AA。

## Tasks / Subtasks

- [ ] Task 1: 插画素材（AC: #2）
  - [ ] 4 套 SVG 插画放 `packages/ui/src/illustrations/`
  - [ ] SVGO 压缩
- [ ] Task 2: Skeleton + Spinner + Loading（AC: #4, #5, #6）
- [ ] Task 3: Empty + ErrorState（AC: #2, #3）
- [ ] Task 4: Banner + Alert（AC: #7, #8）
- [ ] Task 5: Progress（AC: #9）
- [ ] Task 6: Storybook + 测试（AC: #10）

## Dev Notes

### 关键约束
- 插画用 currentColor 可主题化
- shimmer 动画使用 CSS keyframes + `animation-duration: var(--zy-duration-slow)`
- ErrorState `errorId` 可点击复制

### Project Structure Notes
```
packages/ui/src/components/
  skeleton/
  spinner/
  loading/
  empty/
  error-state/
  banner/
  alert/
  progress/
packages/ui/src/illustrations/
  empty-search.svg
  empty-list.svg
  error-network.svg
  error-permission.svg
```

### 依赖链
- 依赖：2-1, 2-3, 2-6（Spinner 给 Button loading 复用）
- 被依赖：所有业务页

### References
- [Source: planning/epics/02-design-system.md#ZY-02-07](../../epics/02-design-system.md)
- [Source: planning/ux/08-components-feedback.md](../../ux/08-components-feedback.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
