# Story 5.8: 首屏发现页骨架

Status: ready-for-dev

## Story

作为 **App 新用户**，
我希望 **打开 App 看到一个内容丰富、节奏清晰的发现页**，
以便 **快速找到感兴趣的学习路径与文化内容**。

## Acceptance Criteria

1. 模块自上而下：Hero 横幅 / 推荐课程 / 持续学习 / 文化卡片 / 游戏入口 / 小说入口。
2. 横向滚动模块（推荐课程 / 文化卡片 / 游戏入口）使用 snap 效果，移动端单指滑动流畅。
3. 各模块独立加载，使用 Suspense + 骨架占位（避免整页阻塞）。
4. 错误兜底：单个模块接口失败时仅该模块展示「重试」按钮，不影响其他模块。
5. 持续学习模块：未登录隐藏；已登录展示最近 1 课程（来自 `/api/me/learning/recent`）。
6. Hero 横幅来自后端配置 `/api/banner/active`，支持文案 + 图片 + 跳转 + 排序。
7. 性能：LCP < 2.5s（4G）；首屏只加载 above-fold 模块的资源，below-fold 懒加载。
8. 4 语 i18n。

## Tasks / Subtasks

- [ ] **页面结构**（AC: 1,7）
  - [ ] `routes/_app/index.tsx`
  - [ ] 各模块作为独立组件 + dynamic import below-fold

- [ ] **横向滚动 + snap**（AC: 2）
  - [ ] CSS `scroll-snap-type: x mandatory`
  - [ ] 卡片 `scroll-snap-align: start`
  - [ ] 触摸滑动惯性

- [ ] **数据获取与 Suspense**（AC: 3,4,5,6）
  - [ ] 每个模块用 `useApi` 独立查询
  - [ ] 包 `<ErrorBoundary>` 提供「重试」
  - [ ] Hero `useApi('banner-active')`
  - [ ] 持续学习 `useApi('me-learning-recent', { enabled: isAuthed })`

- [ ] **骨架**（AC: 3）
  - [ ] 每模块 Skeleton 组件

- [ ] **i18n**（AC: 8）

## Dev Notes

### 关键约束
- LCP 目标依赖 Hero 图片 srcset / R2 CDN 缓存。
- 并行接口需控制并发（QueryClient 默认无限制；但浏览器连接数有限）。

### 关联后续 stories
- 5-3 路由 / 5-4 query 已就位
- E08 推荐课程 / E06 文化卡片 / E10 游戏 / E11 小说 各自提供 API；本期未就绪的 API 可 mock

### Project Structure Notes
- `apps/app/src/routes/_app/index.tsx`
- `apps/app/src/features/discover/`（各模块组件）

### References
- `planning/epics/05-app-shell.md` ZY-05-08
- `planning/ux/09-screens-app-discover.md`

### 测试标准
- 单元：模块错误兜底
- E2E：未登录无持续学习；登录后出现
- 性能：Lighthouse LCP < 2.5s（dev profile）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
