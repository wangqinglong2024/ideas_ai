# Story 16.1: prompt_templates 表 + 模板管理后台

Status: ready-for-dev

## Story

作为 **内容运营 / Prompt 工程师**，
我希望 **拥有版本化的 prompt 模板表与后台 CRUD 界面**，
以便 **集中维护 4 类生成工作流（article / lesson / novel / wordpack）的 prompt，避免在代码中硬编码，并支持灰度切换与回滚**。

## Acceptance Criteria

1. Drizzle schema：`prompt_templates`（id uuid v7 / key text / version int / locale text default 'zh' / channel enum 'article'|'lesson'|'novel'|'wordpack'|'translate'|'evaluator' / system text / user text / variables jsonb / model text / temperature numeric / max_tokens int / status enum 'draft'|'active'|'archived' / created_by / created_at / updated_at），唯一索引 `(key, version, locale)`。
2. 同 `key + locale` 同时只允许一个 `status='active'`，DB 层 partial unique index 强制。
3. 表已在 E01 平台基建迁移占位（无数据），本 story 仅落实 schema 完整度 + 索引 + RLS（仅 admin service_role 写）。
4. Admin 后台路由 `/admin/factory/prompts`：列表（按 channel / key / status / locale 过滤）、详情、新建、编辑（仅 draft 可编辑，active 必须新建版本）、归档。
5. **变量预览**：编辑器右侧实时渲染 `{variables}` 占位符替换效果（Mustache / Handlebars 子集），含 token 估算（tiktoken 或近似）。
6. **激活流程**：draft → 激活时校验同 key 旧 active 自动 archived；写审计日志（actor / before / after / diff）。
7. **回滚**：从 archived 版本一键 fork 为 draft；不允许直接将 archived 改回 active。
8. RBAC：仅 `factory:write` 权限可编辑，`factory:read` 可查看；E17 RBAC 中间件接入。
9. API：`GET/POST/PUT /api/admin/factory/prompts`，输入 Zod 校验，错误码统一。
10. 单元 + 集成测试覆盖 active 唯一性、版本 fork、审计日志写入。

## Tasks / Subtasks

- [ ] **Schema 完整化**（AC: 1-3）
  - [ ] `packages/db/schema/factory.ts` prompt_templates 完整字段
  - [ ] partial unique index `(key, locale) WHERE status='active'`
  - [ ] RLS：service_role only（用户端 0 访问）
- [ ] **Admin API**（AC: 4, 6, 7, 9）
  - [ ] `apps/api/src/routes/admin/factory/prompts.ts`
  - [ ] 列表 / 详情 / 创建 / 编辑（draft only）/ 激活 / 归档 / fork
  - [ ] Zod schema + 错误码
  - [ ] 审计日志（写 audit_logs）
- [ ] **Admin UI**（AC: 4, 5）
  - [ ] `apps/admin/src/pages/factory/prompts/`：列表 + 编辑器（Monaco）
  - [ ] 变量替换实时预览（防抖 300ms）
  - [ ] token 估算（tiktoken-wasm 或近似 char/4）
- [ ] **RBAC 集成**（AC: 8）
  - [ ] `factory:read` / `factory:write` 权限定义
  - [ ] 路由 + UI 双层校验
- [ ] **测试**（AC: 10）
  - [ ] active 唯一性 race 并发测试
  - [ ] fork → draft 流程
  - [ ] 审计日志断言

## Dev Notes

### 关键约束
- key 命名规范：`<channel>.<step>.<purpose>` 例如 `article.outline.generate`、`lesson.scoring.create`。
- `model` 字段允许：`claude-3-5-sonnet`、`claude-sonnet-4`、`deepseek-chat`、`deepseek-reasoner`，由 16-3 客户端枚举校验。
- `variables` jsonb 形如 `{"topic":{"type":"string","required":true},"hsk_level":{"type":"int","default":3}}`，运行时由生成 flow 校验。
- 工作流读取模板：必须按 `(key, locale, status='active')` 取最新一条，禁止按版本号硬编码。
- v1.0 不上线：本 story 在 v1.0 阶段仅完成 schema + RLS，UI / API 在 v1.5 启动时完成（保持 sprint 口径一致）。

### 关联后续 stories
- 16-2 LangGraph checkpointer：调度器读取模板
- 16-4 / 16-5 / 16-6 / 16-7 各 channel 工作流读取模板
- 16-9 translate / 16-10 evaluator 也依赖
- 17-9 CMS 控制台：prompt 列表入口

### Project Structure Notes
- `packages/db/schema/factory.ts`
- `apps/api/src/routes/admin/factory/prompts.ts`
- `apps/admin/src/pages/factory/prompts/`
- `apps/admin/src/components/PromptEditor.tsx`

### References
- `planning/epics/16-content-factory.md` ZY-16-01
- `planning/spec/06-ai-factory.md` § 4
- `planning/sprint/16-content-factory.md` W1

### 测试标准
- 单元：active 唯一性约束（DB 层 + 应用层双保险）
- 集成：fork archived → draft；激活旧 active 自动归档
- 安全：非 admin 路由 401/403

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
