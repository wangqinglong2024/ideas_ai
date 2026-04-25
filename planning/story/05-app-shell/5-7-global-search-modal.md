# Story 5.7: 全站搜索 modal

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **一个统一的搜索面板，能搜到课程 / 文章 / 小说 / 词汇**，
以便 **不必进入每个模块各自的搜索框**。

## Acceptance Criteria

1. 基于 `cmdk` 命令面板组件，⌘K（Mac）/ Ctrl+K（Win）/ 顶栏搜索图标 触发打开。
2. 搜索源：课程 `/api/search/courses`、文章 `/api/search/articles`、小说 `/api/search/novels`、词汇 `/api/search/words`，并行调用，分组展示。
3. 输入防抖 300ms；空查询展示「最近搜索」（localStorage 最多 10 条）+ 「推荐」（来自 `/api/search/recommendations`）。
4. 命中项点击 → 跳详情页 + 关闭面板 + 写入「最近搜索」。
5. 键盘上下箭头切换；Enter 触发；Esc 关闭；面板内 Tab 不漏出。
6. 加载态骨架；空结果提示文案；错误兜底。
7. 4 语 i18n（占位文本 / 分组标题 / 空态）。
8. 移动端全屏 sheet；桌面居中 modal（max-w 640）。

## Tasks / Subtasks

- [ ] **集成 cmdk**（AC: 1,5）
  - [ ] 安装 `cmdk`
  - [ ] 全局快捷键监听
  - [ ] 顶栏搜索按钮触发

- [ ] **搜索 API 编排**（AC: 2,3,6）
  - [ ] `useGlobalSearch(query)` 内部 4 个 useApi 并行
  - [ ] 防抖（`use-debounce` 或自实现）
  - [ ] 错误兜底分组级展示

- [ ] **最近 / 推荐**（AC: 3,4）
  - [ ] localStorage `recent-search` 工具
  - [ ] `/api/search/recommendations`（如缺失则 mock 占位）

- [ ] **响应式**（AC: 8）
  - [ ] < 640 全屏 sheet；≥ 640 居中

- [ ] **a11y + 键盘**（AC: 5）
  - [ ] role=combobox / listbox

- [ ] **i18n**（AC: 7）

## Dev Notes

### 关键约束
- 4 个并行搜索可能压垮后端，后端必须实现 rate-limit；前端缓存 30s。
- 中文 / 拼音输入法 composition 期间不触发搜索（监听 `compositionstart/end`）。

### 关联后续 stories
- 5-6 顶栏触发本面板
- E08 课程 / E06 发现 / E11 小说 提供搜索 API

### Project Structure Notes
- `apps/app/src/components/GlobalSearch.tsx`
- `apps/app/src/hooks/use-global-search.ts`
- `apps/app/src/lib/recent-search.ts`

### References
- `planning/epics/05-app-shell.md` ZY-05-07
- cmdk docs

### 测试标准
- 单元：防抖 + 最近搜索写入
- E2E：⌘K 打开；输入 → 命中 → 跳转 → 关闭
- a11y：键盘可达

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
