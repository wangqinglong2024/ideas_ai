# Story 6.2: 文章列表页

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **按分类 / HSK 等级浏览中国文化文章**，
以便 **找到与我水平和兴趣匹配的内容**。

## Acceptance Criteria

1. 路由：`/discover`，顶部 12 分类 tab（横向滚动 + snap，激活态高亮）。
2. 二级筛选：HSK 等级 chips（HSK1-6 + 全部）。
3. 列表展示：封面 + 标题 + 摘要 + HSK 标签 + 阅读时长 + view_count。
4. 数据接入 `GET /api/articles?category=&hsk=&page=&size=`，使用 `useInfiniteQuery` 下拉加载更多。
5. 骨架占位 + 空态 + 错误兜底（重试按钮）。
6. 卡片点击 → 跳 `/discover/article/:slug`（路由由 5-3 提供）。
7. 滚动恢复：返回保留位置（依赖 5-3 router scrollRestoration）。
8. 4 语 i18n（分类名 / 筛选标签 / 空态文案）。

## Tasks / Subtasks

- [ ] **页面结构**（AC: 1,2,3）
  - [ ] `routes/_app/discover/index.tsx`
  - [ ] `<CategoryTabs>` + `<HskFilter>` + `<ArticleList>`

- [ ] **数据获取**（AC: 4,5）
  - [ ] `useInfiniteArticles({ category, hsk })`
  - [ ] Skeleton + ErrorBoundary

- [ ] **卡片组件**（AC: 3,6）
  - [ ] `<ArticleCard>` 响应式（容器查询）
  - [ ] 点击跳详情

- [ ] **i18n**（AC: 8）

## Dev Notes

### 关键约束
- 横向 tab snap + 自动滚动到激活项。
- `view_count` 可能滞后（缓存），可接受。

### 关联后续 stories
- 6-1 提供 API
- 6-3 提供详情页

### Project Structure Notes
- `apps/app/src/routes/_app/discover/index.tsx`
- `apps/app/src/features/discover/CategoryTabs.tsx`
- `apps/app/src/features/discover/ArticleCard.tsx`
- `apps/app/src/hooks/use-infinite-articles.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-02
- `planning/ux/09-*`

### 测试标准
- E2E：切分类 → 列表更新；下滑加载更多
- 单元：useInfiniteArticles 参数变化触发重置

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
