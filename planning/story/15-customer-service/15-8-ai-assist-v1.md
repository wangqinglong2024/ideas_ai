# Story 15.8: AI 辅助 v1（FAQ 智能匹配 + 客服建议回复）

Status: ready-for-dev

## Story

作为 **平台 / 客服**，
我希望 **AI 在用户输入问题时智能匹配 FAQ，并在客服输入框上方提供建议回复**，
以便 **降低客服工作量、缩短用户等待，且首版安全保守（仅推荐，不自动发送）**。

## Acceptance Criteria

1. **嵌入索引**：
   - 离线脚本对所有 published FAQ articles 生成 embedding（OpenAI-compatible / DeepSeek embeddings）写 `faq_embeddings` 表（article_id / lang / vector vector(1536) / model_version / created_at）。
   - 每次 article 更新触发重生（事件订阅）。
2. **FAQ 智能匹配**：
   - `POST /api/faq/match`：入参 `{text, lang, top_k=3}` → embedding query → pgvector cosine 检索（threshold 0.78）→ 返回文章 + score。
   - P95 < 200ms（pgvector ivfflat 索引）。
3. **用户端调用**：
   - 15-4 用户首条消息发出后 2s 调本接口，若有 score≥0.85 命中 → 在 IM 显示「您可能要找：」推荐卡片（最多 3 条）。
4. **客服建议回复**：
   - agent 工作台（15-5）输入框上方显示 3 条 AI 建议：
     a. **FAQ 相关链接**（top_k=2 from /api/faq/match）。
     b. **建议回复草稿**（调 LLM，prompt 注入：会话最近 10 条 + 用户上下文摘要 + 知识库片段 → 生成 ≤200 字回复）。
   - agent 点击「使用」→ 填入输入框（仍需人工确认 / 编辑后发送，**不自动发**）。
5. **LLM 调用**：
   - 路由 `apps/api/src/routes/admin/cs/ai/suggest.ts`，封装 vendor SDK；超时 8s；失败回退仅 FAQ 链接。
   - vendor 选 `DeepSeek` 国内 / `Anthropic Claude Haiku` 海外（按 region 切换）。
6. **隐私 / 合规**：
   - prompt 不含完整邮箱 / 电话 / 订单 ID（脱敏）。
   - 用户 IM 推荐文案附「AI 自动建议」徽章。
7. **质量反馈**：
   - 客服点击「不准确」按钮 → 写 `cs_ai_feedback`（query / suggested / agent_action / created_at）。
   - 用户对推荐文章 thumbs down → 同上反馈链路。
8. **缓存**：
   - 同 query+lang 5min 缓存（Redis）。
9. **配额 / 风控**：
   - 每 agent 每日 LLM 调用 ≤ 1000；超限降级仅 FAQ。
   - 整体 token 月预算可调（admin 可改）。
10. **观测**：命中率 / 采纳率 / token 消耗 / latency；token 月成本看板。

## Tasks / Subtasks

- [ ] **embedding 索引**（AC: 1）
  - [ ] `packages/db/schema/faq-embeddings.ts` (pgvector)
  - [ ] `scripts/ai/embed-faq.ts`（批量 + watch 事件）

- [ ] **匹配 API**（AC: 2,3）
  - [ ] `apps/api/src/routes/faq/match.ts`

- [ ] **建议回复 API**（AC: 4,5,6）
  - [ ] `apps/api/src/routes/admin/cs/ai/suggest.ts`
  - [ ] LLM SDK 封装 + 区域切换
  - [ ] 脱敏管道

- [ ] **前端 UI**（AC: 3,4）
  - [ ] 用户端推荐卡片
  - [ ] agent 工作台建议条

- [ ] **反馈**（AC: 7）
  - [ ] `cs_ai_feedback` 表 + 接口

- [ ] **缓存 + 配额**（AC: 8,9）
  - [ ] Redis layer
  - [ ] 每日计数

- [ ] **观测**（AC: 10）

## Dev Notes

### 关键约束
- v1 不自动发送，仅推荐 / 草稿；避免 hallucination 引发投诉。
- pgvector 索引 ivfflat lists=100；后续可调。
- LLM 输出统一 4 语模板 system prompt（基于用户 lang）。
- token 预算告警：80% 用量发邮件 ops@。

### 关联后续 stories
- 15-4 用户端推荐
- 15-5 agent 建议
- 15-6 ticket 自动分类（同一 LLM 复用 prompt）
- 15-7 FAQ 提供数据源

### Project Structure Notes
- `apps/api/src/routes/faq/match.ts`
- `apps/api/src/routes/admin/cs/ai/suggest.ts`
- `packages/ai/cs/`（prompt + sdk）
- `packages/db/schema/faq-embeddings.ts`

### References
- `planning/epics/15-customer-service.md` ZY-15-08
- `planning/spec/06-ai-factory.md`

### 测试标准
- 单元：脱敏 / 配额
- 集成：embedding query 准确率（标注集 ≥ 80% top1）
- E2E：客服建议 → 采纳 → 反馈
- 成本：日 token 消耗预算监控

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
