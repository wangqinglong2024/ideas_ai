# Story 8.2: 步骤类型规范（10 种 step type 的 payload schema）

Status: ready-for-dev

## Story

作为 **后端 + 前端开发者**，
我希望 **明确并锁定 10 种步骤类型的 payload schema、校验逻辑、UI 契约**，
以便 **运营 / 内容工厂能产出合规内容，组件渲染稳定**。

## Acceptance Criteria

1. 在 `packages/shared/types/step.ts` 定义 10 种 step：
   `sentence` / `word_card` / `choice` / `order` / `match` / `listen` / `read` / `translate` / `type_pinyin` / `dialog`。
2. 每种类型有 zod schema：
   - 输入 payload schema
   - 用户响应 response schema
   - 校验函数签名（`(payload, response) => { is_correct, expected, explanation }`）
3. 文档 `docs/step-types.md` 含每种类型的：
   - 用途说明
   - payload 示例
   - response 示例
   - UI 渲染要点
4. 提供 `mock-content` 工具：根据 schema 自动生成 1 个示例 step，便于 8-7 / 8-8 联调。
5. 与 7-3 step-progression-api 共享 schema（同一 npm 包导入）。
6. lint：所有 step 必有 `kp_id` 字段（知识点关联）。

## Tasks / Subtasks

- [ ] **Schema**（AC: 1,2,5）
  - [ ] `packages/shared/types/step.ts`
  - [ ] 10 个 zod schema
- [ ] **校验函数**（AC: 2）
  - [ ] `packages/shared/validators/step/*.ts`（10 文件）
- [ ] **文档**（AC: 3）
- [ ] **Mock 工具**（AC: 4）
  - [ ] `packages/shared/mocks/step-mocks.ts`

## Dev Notes

### 关键约束
- 这是「契约 story」，输出给后端 + 前端 + 内容工厂消费，schema 一旦发布不得轻易变更。
- step_type 字符串作枚举常量，集中导出。
- listen / read 在 MVP 用文本判等，未来扩展到 ASR。

### 关联后续 stories
- 7-3 校验消费
- 8-8 10 步骤组件渲染
- E16 内容工厂依赖

### Project Structure Notes
- `packages/shared/types/step.ts`
- `packages/shared/validators/step/*.ts`
- `packages/shared/mocks/step-mocks.ts`
- `docs/step-types.md`

### References
- `planning/epics/08-courses.md` ZY-08-02
- `planning/spec/05-*` § 6

### 测试标准
- 单元：每个 validator ≥ 3 测试
- 集成：mock → validator → 期望 is_correct

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
