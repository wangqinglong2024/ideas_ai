# Story 4.3: ICU MessageFormat

Status: ready-for-dev

## Story

As a 前端开发者,
I want i18next 接入 ICU MessageFormat 后端, 支持复数 / 性别 / 选择语法,
so that 4 语翻译能精确处理"3 条评论 / 1 条评论"等语言学差异，避免拼字符串导致的可读性与本地化错误。

## Acceptance Criteria

1. 安装 `i18next-icu` + `intl-messageformat` 并在 `createI18n` 中注册插件。
2. 运行时支持以下 ICU 语法：`plural`、`select`、`selectordinal`、`number`、`date`、`time`。
3. 4 语 plural 规则齐全（vi 单数 only / th 单数 only / id 单数 only / en one+other）；正确返回 plural form。
4. 在 `common.json` 提供示例 key `messages.unread`：`{count, plural, =0 {No messages} one {# message} other {# messages}}`。
5. 单元测试：每条 ICU 语法 ≥ 2 个用例，4 语全跑。
6. dev 环境 ICU 语法错误立即抛出 + 上报，prod 环境降级到原 raw 字符串并记录 Sentry breadcrumb。
7. 文档段落：在 `packages/i18n/README.md` 添加 ICU 速查表。

## Tasks / Subtasks

- [ ] Task 1: 插件注册（AC: #1, #2）
  - [ ] `pnpm add i18next-icu intl-messageformat -F @zhiyu/i18n`
  - [ ] `createI18n` 注入 ICU 实例
- [ ] Task 2: 示例 key + 4 语翻译（AC: #3, #4）
  - [ ] `common.json` 各语言补 `messages.unread` 与 `time.relative.minutes`
- [ ] Task 3: 测试（AC: #5）
  - [ ] vitest table-driven，按语言 × 语法 × 用例
- [ ] Task 4: 错误处理与文档（AC: #6, #7）
  - [ ] 自定义 ICU `errorHandler`
  - [ ] README 速查表

## Dev Notes

### 关键架构约束
- **语法保守**：避免 `selectordinal` 在非英语场景使用，避免歧义。
- **数字 / 日期** 优先走 4-5 的 Intl 工具，仅在内嵌情境下用 ICU `number/date`。
- **错误降级**：prod 环境 ICU 解析失败 → 返回最长 literal 部分 + Sentry warning，不允许白屏。

### 关联后续 stories
- 4-2 namespace 结构需先就位
- 4-7 翻译后台需校验 ICU 占位符与源语言一致
- 4-10 CI 校验包含 ICU 语法 lint

### 测试标准
- vitest：每语言 × 每语法 ≥ 2 用例
- 必含极端 case：`count = 0 / 1 / 2 / 100`

### Project Structure Notes
- 新增 `packages/i18n/src/icu.ts` 包装 errorHandler；其余无文件新增

### References

- [Source: planning/epics/04-i18n.md#ZY-04-03](../../epics/04-i18n.md)
- [Source: planning/story/04-i18n/4-1-i18next-integration.md](./4-1-i18next-integration.md)
- [Source: planning/story/04-i18n/4-2-four-language-resources.md](./4-2-four-language-resources.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
