# Story 16.3: Anthropic + DeepSeek 客户端封装

Status: ready-for-dev

## Story

作为 **AI 工程师**，
我希望 **统一封装 Anthropic（Claude）与 DeepSeek 的 LLM 客户端**，
以便 **所有 LangGraph 节点通过同一接口调用、获得成本上报、限速、重试与缓存能力**。

## Acceptance Criteria

1. 新模块 `packages/factory/src/llm/`：导出 `LLMClient` 接口（`generate(req)` / `stream(req)`），实现 `AnthropicClient` 与 `DeepSeekClient`。
2. 请求结构统一：`{ model, system, messages, temperature, max_tokens, stop?, response_format?, tools?, cache_key? }`。
3. **成本上报**：每次调用结束写一条 `llm_call_logs`（factory schema）：`call_id / vendor / model / prompt_tokens / completion_tokens / cost_usd / latency_ms / cache_hit / status / created_at`，并通过 16-2 hook 累计到 `factory_tasks.cost_usd`。
4. **限速**：基于 token bucket（Redis）—— Anthropic 默认 50 RPM / 200k TPM，DeepSeek 默认 120 RPM / 1M TPM；可由 env 覆盖；超限后按 `retry-after` 自动等待。
5. **重试**：5xx / 429 / network → 指数退避（0.5/1/2/4s），max 3；4xx 立即失败。
6. **缓存**：key = sha256(`vendor:model:system:messages:temperature:max_tokens`)，TTL 7d（Redis），命中返回 + `cache_hit=true`，可由 `cache:false` 关闭。
7. **流式**：`stream` 返回 AsyncIterable<string>，结束时合并写日志一次。
8. **模型枚举**：白名单 `claude-3-5-sonnet-latest` / `claude-sonnet-4` / `deepseek-chat` / `deepseek-reasoner`，外部模型名校验失败抛错。
9. **价目表**：内置每模型 input/output 单价（USD per 1M tokens），由 env 覆盖；定价更新走 PR + changelog。
10. **可观测**：所有调用上报 PostHog（事件 `factory_llm_call`）+ Sentry（仅 error）+ LangSmith（trace）。
11. 单元 + 集成测试：限速触发等待、429 重试、缓存命中率、成本计算误差 < 1%。

## Tasks / Subtasks

- [ ] **接口与基类**（AC: 1, 2, 8）
  - [ ] `LLMClient` 接口 + `BaseLLMClient`（限速 / 重试 / 缓存通用逻辑）
  - [ ] 模型白名单 + 价目表常量
- [ ] **Anthropic 实现**（AC: 1, 7）
  - [ ] `@anthropic-ai/sdk` 接入
  - [ ] tools / response_format 适配
- [ ] **DeepSeek 实现**（AC: 1, 7）
  - [ ] OpenAI 兼容协议（fetch / openai-sdk）
  - [ ] 流式 SSE 解析
- [ ] **限速 / 缓存 / 日志**（AC: 3-6, 10）
  - [ ] Redis token bucket
  - [ ] 缓存 key + TTL
  - [ ] llm_call_logs 表 + 写入
  - [ ] PostHog / Sentry / LangSmith hooks
- [ ] **测试**（AC: 11）
  - [ ] 限速等待断言
  - [ ] 429 重试成功
  - [ ] 缓存命中跳过 API
  - [ ] 成本计算精度

## Dev Notes

### 关键约束
- 所有密钥通过 doppler 注入，禁止硬编码。
- `cache_key` 显式提供时优先；隐式自动 hash。
- 价目表（截至 2026-04，单位 USD/1M tokens）：
  - claude-3-5-sonnet-latest: in=3.00 out=15.00
  - claude-sonnet-4: in=3.00 out=15.00
  - deepseek-chat: in=0.27 out=1.10
  - deepseek-reasoner: in=0.55 out=2.19
- 单笔调用 max_tokens 默认上限：Claude 8192、DeepSeek 8192；超限抛错（保护成本）。
- 重要：限速器 Redis key 按 `vendor:model:rpm` / `vendor:model:tpm` 双桶，原子 lua 脚本。

### 关联后续 stories
- 所有生成工作流（16-4/5/6/7）都通过本客户端调用
- 16-9 翻译节点选择 vendor by lang
- 16-10 评估器调用 Claude
- 16-12 仪表板聚合 llm_call_logs

### Project Structure Notes
- `packages/factory/src/llm/index.ts`
- `packages/factory/src/llm/anthropic.ts`
- `packages/factory/src/llm/deepseek.ts`
- `packages/factory/src/llm/rate-limit.ts`
- `packages/factory/src/llm/cache.ts`
- `packages/db/schema/factory.ts` (llm_call_logs)

### References
- `planning/epics/16-content-factory.md` ZY-16-03
- `planning/spec/07-integrations.md` § 4
- Anthropic API: https://docs.anthropic.com
- DeepSeek API: https://api-docs.deepseek.com

### 测试标准
- 单元：限速器 lua 原子性、缓存命中分支、成本计算
- 集成：mock fetch 模拟 429 → 重试成功
- 性能：缓存命中 < 5ms 返回

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
