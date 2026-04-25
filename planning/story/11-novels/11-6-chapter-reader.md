# Story 11.6: 章节阅读器（复用 S06）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **小说章节阅读体验与发现页文章保持一致：句子级 / 单字弹窗 / 翻译切换**，
以便 **沉浸式阅读并复习**。

## Acceptance Criteria

1. 路由 `/novels/[slug]/c/[n]` 渲染章节阅读器。
2. 复用 `packages/reader-shared`（来自 S06 / 6-3）：句子分割 / 拼音切换 / 4 语翻译切换 / 单字弹窗（HanziPopup）。
3. 章节翻页：上一章 / 下一章按钮 + 左右滑动手势；章末可"加入书架"。
4. 进度记忆：滚动到段落保存进度；返回时恢复。
5. 锁章节：调用 11-3 API，若 `locked: true` 渲染付费墙（含解锁按钮：知语币 / VIP）。
6. 字号 / 主题 / 行距 偏好（11-9）实时生效。
7. 60fps；首屏 < 1.5s；切章 < 800ms（预取下一章）。
8. 4 语 UI；i18n。

## Tasks / Subtasks

- [ ] 路由 + 阅读器复用（AC: 1,2）
- [ ] 翻页 / 手势 / 进度（AC: 3,4）
- [ ] 付费墙集成（AC: 5）
- [ ] 偏好集成（AC: 6）
- [ ] 预取 + 性能（AC: 7）
- [ ] i18n / 测试

## Dev Notes

### 关键约束
- 严禁 fork 阅读器组件，必须复用 `reader-shared`；如需扩展加 props。
- 预取下一章使用 `<link rel="prefetch">` + 内存缓存。

### Project Structure Notes
- `apps/web/src/app/novels/[slug]/c/[n]/page.tsx`
- `packages/reader-shared/`（已存在）

### References
- [Source: planning/epics/11-novels.md#ZY-11-06]
- [Source: planning/story/06-discover-china/6-3-article-detail-immersive.md]

### 测试标准
- e2e：免费章 / 付费章 / 切章 / 进度恢复
- 性能：切章 < 800ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
