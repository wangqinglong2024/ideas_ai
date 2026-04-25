# Story 15.1: conversations / messages / tickets / faq 表 + RLS

Status: ready-for-dev

## Story

作为 **后端开发者**，
我希望 **建立客服 IM 与工单系统的核心数据模型**，
以便 **后续 WS 网关、派单、UI、FAQ、AI 辅助、SLA 等所有 stories 都有数据基座**。

## Acceptance Criteria

1. Drizzle schema 创建表：`conversations`、`messages`、`tickets`、`faq_articles`、`faq_categories`，主键 uuid v7，含审计字段。
2. **`conversations`**：id / user_id (FK users) / agent_id (FK admin_users nullable) / status (open|assigned|waiting|resolved|closed) / channel (im | email_relay) / language / topic_tags (text[]) / last_message_at / opened_at / closed_at / metadata_jsonb。索引：(user_id, last_message_at desc)、(agent_id, status)、(status, last_message_at)。
3. **`messages`**：id / conversation_id (FK) / sender_type (user|agent|system|bot) / sender_id (uuid nullable) / content_type (text|image|emoji|system_event|quick_reply) / content_text / content_payload_jsonb / is_read_by_user / is_read_by_agent / created_at。索引 (conversation_id, created_at)。
4. **`tickets`**：id / user_id / conversation_id (nullable) / category (billing|account|content|bug|feature|other) / subject / description / priority (low|normal|high|urgent) / status (open|in_progress|waiting_user|resolved|closed) / assignee_admin_id / due_at / resolved_at / satisfaction_rating (1-5 nullable) / created_at / updated_at。索引 (user_id, status)、(assignee_admin_id, status, due_at)、(category, status)。
5. **`faq_categories`**：id / slug unique / name_i18n_jsonb / display_order / icon。
6. **`faq_articles`**：id / category_id (FK) / slug unique / title_i18n_jsonb / content_i18n_jsonb (markdown) / search_vector_zh / search_vector_en / search_vector_vi / search_vector_th / search_vector_id (tsvector) / view_count / helpful_count / not_helpful_count / status (draft|published|archived) / published_at。索引 GIN 各 search_vector。
7. **RLS**：
   - `conversations` / `messages`：用户仅能 SELECT 自己 conversation_id 的；agent 通过 service_role；写仅 service_role。
   - `tickets`：用户仅能 SELECT / UPDATE 自己（限有限字段：subject/description before assigned）。
   - `faq_*`：published 公共可读，其他仅 admin。
8. seed：8 个 FAQ 分类 + 30 篇 FAQ（4 语首发，从 `planning/prds/11-customer-service/` 提取）。
9. 状态机文档化（mermaid）：conversation / ticket 各自合法转移。
10. 性能：会话列表 + 历史消息查询 P95 < 100ms（10k 会话 + 1M 消息）。

## Tasks / Subtasks

- [ ] **schema + migration**（AC: 1-6）
- [ ] **RLS**（AC: 7）
- [ ] **状态机文档**（AC: 9）
  - [ ] `packages/db/docs/cs-state-machines.md`
- [ ] **seed**（AC: 8）
  - [ ] `packages/db/seeds/faq.ts`
- [ ] **性能验证**（AC: 10）

## Dev Notes

### 关键约束
- messages.content_text 长度上限 4000；超长走 content_payload_jsonb (chunked)。
- conversations.status 转移：open → assigned → waiting → resolved → closed；resolved 24h 自动 close。
- tickets.priority urgent 必须由 agent 设置，用户提交默认 normal。
- search_vector 多语：分别 lexer (zh: simple_chinese / en: english / vi: simple / th: simple / id: simple)；中文用 zhparser。

### 关联后续 stories
- 15-2 WS 推送 messages
- 15-3 派单写 conversations.agent_id
- 15-6 ticket 流
- 15-7 FAQ 搜索
- 15-8 AI 读 FAQ + messages

### Project Structure Notes
- `packages/db/schema/customer-service.ts`
- `packages/db/seeds/faq.ts`
- `packages/db/docs/cs-state-machines.md`

### References
- `planning/epics/15-customer-service.md` ZY-15-01
- `planning/spec/05-data-model.md` § 4.14
- `planning/prds/11-customer-service/`

### 测试标准
- 单元：状态机非法转移
- 集成：RLS 用户 A 无法读 B
- 性能：1M 消息 P95 100ms

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
