# Story 6.5: 单字弹窗

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **长按 / 双击单字弹出释义、拼音、例句、音频，并能加入生词本 / 收藏**，
以便 **遇到生字立刻学习并积累词汇**。

## Acceptance Criteria

1. 触发：移动端长按 350ms；桌面双击。
2. 弹窗包含：汉字大字、拼音、释义（按 UI 语言）、词性、例句 1-3 条、音频按钮。
3. 操作按钮：「加入生词本」/「收藏」/「关闭」。
4. 数据接入 `GET /api/words/:char`（已存在或在 E07 词汇本中提供；缺失时返回 404，弹窗显示「未收录」+「提交反馈」入口）。
5. 加入生词本 → POST `/api/me/vocabulary`（依赖 E07）；成功 toast。
6. 收藏 → POST `/api/me/favorites`（依赖 6-6）。
7. 关闭：点击遮罩 / Esc / 关闭按钮。
8. a11y：role=dialog；focus trap；返回时焦点回到原字。

## Tasks / Subtasks

- [ ] **触发交互**（AC: 1）
  - [ ] 长按 hook（pointerdown + 350ms timer + cancel on move > 8px）
  - [ ] 双击监听

- [ ] **弹窗组件**（AC: 2,3,7,8）
  - [ ] `<CharacterPopup>` modal
  - [ ] focus trap

- [ ] **数据获取**（AC: 4）
  - [ ] `useApi('word', char)`
  - [ ] 404 兜底「未收录」UI

- [ ] **操作 mutations**（AC: 5,6）
  - [ ] 生词本 mutation（如 E07 未就绪先 stub）
  - [ ] 收藏 mutation（6-6）

## Dev Notes

### 关键约束
- 长按与文本选择冲突：长按触发后阻止默认选择行为（`user-select: none` 临时切换）。
- 缺词大量时频繁 404 影响后端：前端缓存 5 分钟。

### 关联后续 stories
- 6-3 在句子文本上注入触发监听
- 6-6 收藏 mutation
- E07 生词本

### Project Structure Notes
- `apps/app/src/features/reader/CharacterPopup.tsx`
- `apps/app/src/features/reader/use-long-press.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-05

### 测试标准
- 单元：长按 timer 与移动取消
- E2E：长按弹窗 → 加入生词本 → toast
- a11y：键盘关闭

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
