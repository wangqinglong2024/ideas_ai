# Story 11.9: 阅读偏好（字号 / 主题 / 行距）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **自定义阅读字号、主题（日 / 夜 / 护眼）、行距并持久化**，
以便 **在长时间阅读中获得舒适体验**。

## Acceptance Criteria

1. 偏好项：`font_size (12-24px 步进 1)` / `line_height (1.4-2.0 步进 0.1)` / `theme (day|night|sepia)` / `font_family (system|serif|sans)`。
2. UI：阅读器右上角"Aa"按钮唤出偏好面板（移动端底抽屉、桌面端浮层）。
3. 持久化：登录用户写 `user_preferences` 表（jsonb），未登录写 localStorage；登录后合并（远程优先）。
4. 实时生效：调整即应用，不刷新页面。
5. 主题：dark/sepia 满足 WCAG AA 对比度。
6. 4 语 UI。
7. 性能：调整 < 16ms 反馈，无闪烁。
8. 跨设备同步：登录后从 API 拉取覆盖本地。

## Tasks / Subtasks

- [ ] 偏好 schema + API（AC: 1,3,8）
- [ ] 偏好面板 UI（AC: 2,4）
- [ ] 主题样式 + 对比度（AC: 5）
- [ ] 本地 / 远程合并（AC: 3）
- [ ] i18n / 测试

## Dev Notes

### 关键约束
- `user_preferences.reading` jsonb；与其他偏好（通知 / 学习）分 key 命名空间。
- 字号 / 行距 通过 CSS 变量驱动，避免重渲染。

### Project Structure Notes
- `apps/api/src/routes/user-preferences.ts`
- `apps/web/src/components/reader/ReadingPrefs.tsx`
- `packages/db/schema/user-preferences.ts`

### References
- [Source: planning/epics/11-novels.md#ZY-11-09]

### 测试标准
- e2e：调整 / 持久化 / 跨设备合并

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
