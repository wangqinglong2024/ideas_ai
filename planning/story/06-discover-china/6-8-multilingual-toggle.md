# Story 6.8: 多语言切换

Status: ready-for-dev

## Story

作为 **多语 App 用户**，
我希望 **切换 UI 语言后，文章翻译立即跟随，无需刷新**，
以便 **在多语境下流畅切换学习**。

## Acceptance Criteria

1. UI 语言切换（来自 E04 i18next）会触发文章翻译重渲染。
2. 翻译来源：`sentences.translation_jsonb[lang]`；缺失则 fallback `en`；en 也缺失则不渲染翻译。
3. 切换无 loading flash，无重新拉取（同篇文章数据已在 query cache 中）。
4. 设置页 / 顶栏可访问语言切换控件（已由 E04 提供）。
5. 切换偏好持久化（localStorage `i18nextLng`）。
6. 文章列表（6-2）摘要字段如有 `summary_jsonb` 则同样按 UI 语言渲染。
7. 测试覆盖 4 语切换 → 详情页翻译块同步变化。

## Tasks / Subtasks

- [ ] **翻译选择 hook**（AC: 1,2）
  - [ ] `usePickTranslation(jsonb)` 根据 `i18n.language` + fallback en

- [ ] **集成详情 / 列表**（AC: 1,6）
  - [ ] 6-3 SentenceBlock 替换硬编码取值
  - [ ] 6-2 ArticleCard 摘要替换

- [ ] **测试**（AC: 7）
  - [ ] E2E：切换语言后文本变化

## Dev Notes

### 关键约束
- 切换语言不能触发组件重挂载，避免滚动位置 / 音频状态丢失。
- jsonb 字段如未来扩展更多语，hook 自动支持。

### 关联后续 stories
- E04 i18n 已就位
- 6-3 / 6-2 消费本 hook

### Project Structure Notes
- `apps/app/src/lib/i18n/use-pick-translation.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-08

### 测试标准
- 单元：fallback 链
- E2E：4 语切换正确

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
