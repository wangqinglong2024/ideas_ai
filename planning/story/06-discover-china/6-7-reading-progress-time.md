# Story 6.7: 阅读进度 / 时长

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **App 记住我的阅读位置和累计阅读时长**，
以便 **回到原处继续阅读，并看到学习投入度**。

## Acceptance Criteria

1. 滚动位置记忆：每篇文章存储最后滚动 y 与对应句子 anchor，回到详情页自动恢复。
2. 阅读时长统计：以"页面可见 + 用户活跃"为基准（活跃 = 30s 内有 scroll/touch/click），每 30s 增 30s；后台 / 隐藏不计。
3. 累计阅读时长写入用户级 `reading_time_total_sec`，每篇文章写 `articles_read.{article_id}_sec`。
4. 数据上报 API：`POST /api/me/reading-progress`，节流 60s 一次或离开页面 `beforeunload` 兜底。
5. XP 累加：累计阅读时长每 5 分钟 +1 XP（接 E07 学习引擎）；MVP 期可 stub。
6. `/me` 页展示总阅读时长 + 已读文章数。
7. 隐私：未登录用户仅本地记录，不上报。
8. 4 语 i18n。

## Tasks / Subtasks

- [ ] **滚动恢复**（AC: 1）
  - [ ] `useReadingPosition(articleId)` localStorage + 路由进入恢复
  - [ ] 离开时记录最近 anchor

- [ ] **时长统计**（AC: 2,3）
  - [ ] `useReadingTime` hook：visibility + idle 检测
  - [ ] 累计写 localStorage 并节流上报

- [ ] **API**（AC: 4）
  - [ ] `POST /api/me/reading-progress`
  - [ ] 节流 + beforeunload sendBeacon

- [ ] **XP**（AC: 5）
  - [ ] 后端累计满 5 分钟触发 +1 XP（stub 也可）

- [ ] **`/me` 展示**（AC: 6）
  - [ ] `useApi('me-reading-stats')`

- [ ] **未登录**（AC: 7）
  - [ ] 仅本地

## Dev Notes

### 关键约束
- `sendBeacon` 用于卸载时兜底，否则数据可能丢。
- 活跃判定阈值会影响刷量；30s 是合理折中。

### 关联后续 stories
- 6-3 详情页注入 hooks
- E07 XP 系统

### Project Structure Notes
- `apps/app/src/features/reader/use-reading-position.ts`
- `apps/app/src/features/reader/use-reading-time.ts`
- `apps/api/src/routes/me/reading-progress.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-07

### 测试标准
- 单元：活跃判定 / 节流
- 集成：上报与累计正确
- E2E：滚动后离开 → 回来恢复位置

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
