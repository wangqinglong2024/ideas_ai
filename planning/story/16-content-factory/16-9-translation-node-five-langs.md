# Story 16.9: 翻译节点（5 语统一接口）

Status: ready-for-dev

## Story

作为 **AI 工程师**，
我希望 **提供统一的翻译子工作流，支持 zh → en / vi / th / id 5 语**，
以便 **文章 / 课程 / 小说 / 词包等内容生成时一致地批量翻译，并享受缓存与质量校验**。

## Acceptance Criteria

1. 模块 `packages/factory/src/flows/translate/`：导出 `translate(text, targetLangs)` 与 `translateBatch(texts[], targetLangs)`。
2. 路由：
   - `en` → Claude（claude-sonnet-4，质量优先）
   - `vi` / `th` / `id` → DeepSeek-chat（成本优先）
   - `zh` → pass-through（不调用 LLM）
3. **句级缓存**：Redis key=sha256(text + lang)，TTL 30d；命中跳过 LLM。
4. **批量**：单次最多 20 句拼成 prompt（数组返回数组），减少 API 调用次数；DeepSeek 用 JSON mode 严格输出。
5. **结果校验**：返回结构与输入条目数完全一致；任何条目缺失 → 重试 max 2，仍缺失 → 抛错。
6. **占位符保护**：原文 `{{var}}` / `{0}` / `<keep>...</keep>` 必须保留不译；prompt 中明示规则；译后 regex 验证占位符完整。
7. **术语表**：可选 `glossary: Record<string,string>` 注入（"知语"→"Zhiyu"），prompt 中作为约束。
8. **成本上报**：写 `translation_call_logs`（langs / chars / cost_usd / cache_hit）。
9. **质量监控**：每天抽样 1% 走"反向回译"检查（en→zh），与原文相似度 < 0.7 写 `translation_quality_warnings`。
10. **失败处理**：4xx 立即失败；5xx 退避重试；JSON 解析失败重试 max 2。
11. 单元 + 集成测试：占位符保留、批量返回数量、缓存命中、回译抽样。

## Tasks / Subtasks

- [ ] **接口 + 路由**（AC: 1, 2）
- [ ] **批量 prompt + JSON mode**（AC: 4, 5）
- [ ] **缓存**（AC: 3）
- [ ] **占位符 / 术语表**（AC: 6, 7）
- [ ] **成本与抽检**（AC: 8, 9）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- 输入文本预处理：trim、去重；空字符串直接 pass-through。
- 占位符 regex：`/\{\{[\w.]+\}\}|\{\d+\}|<keep>[\s\S]*?<\/keep>/g`。
- DeepSeek JSON mode 必须 schema 严格：`{ items: [{ id, text }] }`，避免幻觉漏 id。
- 5 语并发：lang 维度 Promise.all；同 lang 内 batch 串行（避免限速冲突）。
- 缓存 key 包含 model 版本（升级模型时缓存失效）。

### 关联后续 stories
- 16-4 / 16-5 / 16-6 / 16-7 调用方
- 4-7 translation-admin（人审入口）
- 4-10 translation-quality-monitor（消费 quality_warnings）

### Project Structure Notes
- `packages/factory/src/flows/translate/index.ts`
- `packages/factory/src/flows/translate/router.ts`
- `packages/factory/src/flows/translate/cache.ts`
- `packages/db/schema/factory.ts` (translation_call_logs, translation_quality_warnings)

### References
- `planning/epics/16-content-factory.md` ZY-16-09
- `planning/epics/04-i18n.md` 4-10

### 测试标准
- 单元：占位符 regex；批量返回 id 完整性
- 集成：mock Claude / DeepSeek，批量 20 句返回 100% 一致
- 边界：超长文本（> 单次预算）→ 自动二次切片

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
