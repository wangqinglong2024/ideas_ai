# Story 11.4: 小说书架页

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **在 `/novels` 看到 12 类目筛选、推荐 / 热门 / 新书排序、HSK 等级过滤**，
以便 **快速找到适合自己水平的小说**。

## Acceptance Criteria

1. 路由 `/novels` 渲染分类 Tab（12 类）+ HSK 等级过滤（HSK1-6+ 不限）+ 排序选择（推荐 / 热门 / 新书）。
2. 列表卡片：封面 / 标题 / 作者 / HSK 标签 / 简介前 80 字 / 收藏数 / 阅读数。
3. 我的书架（已登录）：单独 Tab，展示用户收藏的小说与最近阅读章节。
4. 无限滚动 / 分页（每页 20）。
5. 移动 2 列 / 桌面 4-5 列响应式。
6. 数据来自 11-2 API；筛选 query 同步到 URL（可分享）。
7. SEO：每分类 / HSK 等级生成静态 / ISR 页；structured data。
8. LCP < 1.8s（移动 4G）。

## Tasks / Subtasks

- [ ] 路由 + 页面（AC: 1,2,4,5）
- [ ] 分类 / HSK / 排序 UI（AC: 1）
- [ ] 我的书架 Tab + 收藏 API（AC: 3）
- [ ] URL 同步 + ISR（AC: 6,7）
- [ ] 性能 / i18n / 测试

## Dev Notes

### 关键约束
- 我的书架未登录时显示空态 + 引导登录。
- 推荐排序基于 `recommend_weight` 字段（11-1 表已含）。

### Project Structure Notes
- `apps/web/src/app/novels/page.tsx`
- `apps/web/src/components/novels/NovelCard.tsx`
- `apps/web/src/components/novels/CategoryTabs.tsx`

### References
- [Source: planning/epics/11-novels.md#ZY-11-04]
- [Source: planning/prds/05-novels/04-v1-launch-titles.md]

### 测试标准
- e2e：筛选组合 / 排序切换 / URL 同步 / 收藏

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
