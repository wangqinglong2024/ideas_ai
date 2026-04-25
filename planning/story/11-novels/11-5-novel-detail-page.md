# Story 11.5: 小说详情页

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **进入小说详情页查看封面 / 简介 / 作者 / 章节列表，并能收藏 / 追更**，
以便 **决定是否开始阅读以及订阅更新**。

## Acceptance Criteria

1. 路由 `/novels/[slug]` 渲染元数据 + 章节列表 + 主操作（开始阅读 / 收藏 / 追更）。
2. 章节列表：编号 / 标题 / 免费 or 付费标记 / 已读标记。
3. 收藏：登录用户调用 `POST /v1/novels/:slug/collect`；未登录引导登录。
4. 追更：收藏后默认开启；可在通知偏好关闭。
5. 阅读进度：显示用户最后阅读章节，"继续阅读"按钮直跳。
6. 付费章节标记 + 整本订阅入口（接 E12 商品）。
7. SEO + 4 语 i18n + structured data。
8. LCP < 1.8s。

## Tasks / Subtasks

- [ ] 路由 + 页面（AC: 1,2）
- [ ] 收藏 / 追更 API + UI（AC: 3,4）
- [ ] 进度查询（AC: 5）
- [ ] 整本订阅入口（AC: 6）
- [ ] i18n / SEO / 测试

## Dev Notes

### 关键约束
- 章节列表懒加载（>100 章时分段）。
- 整本订阅按钮仅在存在对应商品时显示。

### Project Structure Notes
- `apps/web/src/app/novels/[slug]/page.tsx`
- `apps/web/src/components/novels/ChapterList.tsx`

### References
- [Source: planning/epics/11-novels.md#ZY-11-05]

### 测试标准
- e2e：收藏 / 追更 / 继续阅读

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
