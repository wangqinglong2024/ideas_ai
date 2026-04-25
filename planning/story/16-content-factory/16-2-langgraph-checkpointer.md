# Story 16.2: LangGraph 集成 + PG checkpointer

Status: ready-for-dev

## Story

作为 **AI 工程师**，
我希望 **在 monorepo 中集成 LangGraph 并以 Postgres 作为 checkpointer**，
以便 **所有内容生成工作流具备断点续跑、状态可观察、长任务可中断恢复的能力**。

## Acceptance Criteria

1. 新建包 `packages/factory/`（TypeScript），依赖 `@langchain/langgraph`、`@langchain/langgraph-checkpoint-postgres`、`@langchain/core`，固定到当前 LTS 版本（PR 中记录版本）。
2. PG checkpointer 接入 Supabase 主库（schema `factory`，独立连接池，最大 10 连接，避免影响业务）。
3. checkpointer 表自动迁移由专用 migration 注册，DBA 可见 schema。
4. 提供 `createGraphRuntime()` 工厂：注入 checkpointer / tracer（LangSmith 可选 env 开关）/ 默认超时 / 重试策略（指数 0.5/1/2/4s，max 3）。
5. 演示 graph：`hello_graph`（two nodes：greet → translate），可 `invoke` / `stream` / `resume(threadId)`，重启进程后能从中断点恢复。
6. CLI：`pnpm factory:run hello --thread <id>` 可触发与恢复。
7. **可观测性**：每个节点 begin/end 写 `factory_tasks.events` 字段（jsonb 数组），含 nodeId / latency_ms / tokens_in / tokens_out / cost_usd（由 16-3 客户端报上来）。
8. LangSmith：env `LANGSMITH_API_KEY` 存在则上报 trace，否则 no-op，不阻塞流程。
9. 失败处理：节点抛错时 → 记录 error → checkpointer 保留状态 → graph 状态转为 `failed`；允许人工 `resume` 或 `retry`。
10. 单元测试：mock 节点抛错 / kill 进程 / resume 流程；集成测试：PG checkpointer 重启恢复成功。

## Tasks / Subtasks

- [ ] **包初始化**（AC: 1）
  - [ ] `packages/factory/package.json` 依赖 + tsconfig
  - [ ] export `createGraphRuntime`、类型 `GraphState`
- [ ] **Checkpointer + 连接池**（AC: 2-3）
  - [ ] 独立 pg pool（pg.Pool max 10）
  - [ ] migration `20260920_factory_checkpoints.sql`（langgraph 自带 schema 适配）
  - [ ] schema `factory`，避免污染 public
- [ ] **Runtime 工厂**（AC: 4, 7-9）
  - [ ] tracer 注入（LangSmith opt-in）
  - [ ] 默认重试 + 超时
  - [ ] 节点 hook：写 events 到 factory_tasks
- [ ] **Demo graph + CLI**（AC: 5, 6）
  - [ ] `examples/hello_graph.ts`
  - [ ] `bin/factory.ts` (commander)
- [ ] **测试**（AC: 10）
  - [ ] resume 进程恢复
  - [ ] 错误重试 + 人工 resume

## Dev Notes

### 关键约束
- LangGraph checkpointer 只用于 graph 状态，不用于业务事实数据；业务事实写入 `generations` / 各内容表。
- 连接池独立：避免 BullMQ / API Worker 资源争用。
- LangSmith 默认关闭，生产环境通过 doppler 注入；本地开发 no-op。
- 重试策略：仅 transient（5xx / network），4xx 立即失败转人审。
- 时序：本 story 完成后才解锁 16-4/5/6/7 工作流。

### 关联后续 stories
- 16-3 客户端：节点内调用，向 hook 报告成本
- 16-4 ~ 16-7：基于 createGraphRuntime 实现具体 graph
- 16-11 人审 UI：读取 factory_tasks.events 渲染时间线
- 16-12 仪表板：聚合 events

### Project Structure Notes
- `packages/factory/src/runtime.ts`
- `packages/factory/src/checkpointer.ts`
- `packages/factory/src/hooks/events.ts`
- `packages/factory/examples/hello_graph.ts`
- `packages/factory/bin/factory.ts`

### References
- `planning/epics/16-content-factory.md` ZY-16-02
- `planning/spec/06-ai-factory.md` § 3
- LangGraph 文档：https://langchain-ai.github.io/langgraphjs/

### 测试标准
- 单元：runtime mock，节点抛错重试 → 第 4 次失败标 failed
- 集成：PG checkpointer 真实库；进程 kill 后 `resume(threadId)` 完成 graph
- 性能：hello_graph 端到端 < 3s（本地）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
