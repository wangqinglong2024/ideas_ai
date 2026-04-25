# Story 6.3: 文章详情（沉浸阅读）

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **在文章详情页以句子级方式阅读，可切换拼音 / 翻译 / 字号**，
以便 **按自己的水平自定义沉浸式阅读体验**。

## Acceptance Criteria

1. 路由：`/discover/article/:slug`；进入时调用 `GET /api/articles/:slug` 获取文章 + sentences。
2. 句子级渲染：每个句子展示原文 / 拼音（可隐藏）/ 翻译（可隐藏，按当前 UI 语言取自 translation_jsonb）。
3. 顶部工具栏：拼音开关、翻译开关、字号 -/+（XS/S/M/L/XL，默认 M）、收藏按钮（接 6-6）。
4. 字号偏好持久化 localStorage `reader-font-size`。
5. 行高、段间距随字号缩放，保持可读性。
6. 翻译缺失时回退到 en；en 也缺失时不显示翻译占位文字。
7. 顶栏（5-6）显示文章标题；返回保留滚动位置（5-3）。
8. 4 语 UI 文本。

## Tasks / Subtasks

- [ ] **页面结构**（AC: 1,3,7）
  - [ ] `routes/_app/discover/article/$slug.tsx`
  - [ ] router loader `ensureQueryData`

- [ ] **句子渲染**（AC: 2,5,6）
  - [ ] `<SentenceBlock>` 组件
  - [ ] 翻译 fallback 工具

- [ ] **工具栏**（AC: 3,4）
  - [ ] `<ReaderToolbar>` 含拼音 / 翻译 / 字号
  - [ ] 偏好持久化 hook

- [ ] **样式**（AC: 5）
  - [ ] 字号 css var 驱动

- [ ] **i18n**（AC: 8）

## Dev Notes

### 关键约束
- 拼音渲染需要中文字体覆盖；与 4-4 字体策略对齐。
- 长文章（>200 句）虚拟滚动暂不引入；MVP 下保持简单 DOM 渲染。

### 关联后续 stories
- 6-4 句子点击播放音频
- 6-5 单字长按弹窗
- 6-6 收藏按钮
- 6-7 阅读进度 / 时长
- 6-8 翻译切换无重载

### Project Structure Notes
- `apps/app/src/routes/_app/discover/article/$slug.tsx`
- `apps/app/src/features/reader/SentenceBlock.tsx`
- `apps/app/src/features/reader/ReaderToolbar.tsx`
- `apps/app/src/hooks/use-reader-prefs.ts`

### References
- `planning/epics/06-discover-china.md` ZY-06-03
- `planning/ux/09-*`

### 测试标准
- 单元：翻译 fallback
- E2E：开关拼音 / 翻译 / 字号生效；偏好持久化
- 视觉：字号缩放各档对比

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
