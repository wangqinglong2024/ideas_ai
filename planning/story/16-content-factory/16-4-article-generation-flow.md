# Story 16.4: 文章生成工作流（article flow）

Status: ready-for-dev

## Story

作为 **内容运营**，
我希望 **一键触发"探索中国"文章的端到端 AI 生成工作流**，
以便 **从主题到可发布稿（含拼音/翻译/音频/封面/评分）全自动产出，节省人工时间并保证质量底线**。

## Acceptance Criteria

1. LangGraph DAG：`outline → draft → polish → split → pinyin → translate → audio → cover → eval`，节点失败按 16-2 重试策略。
2. 输入：`{ topic: string, hsk_level: 1-6, target_chars: 800-2000, category_id, tags?: string[] }`，Zod 校验。
3. 输出：写入 `articles` 表（status=`pending_review`）+ `article_translations`（5 语）+ `article_sentences`（拼音 + 音频 URL）+ `article_assets`（封面）。
4. **outline**：Claude，3-5 段大纲，控制段落主题与字数预算。
5. **draft**：DeepSeek-chat，按大纲产出中文初稿，HSK 控制（生僻字比例 < 配置阈值）。
6. **polish**：Claude，润色 + 风格统一（参考"探索中国"风格指南，prompt 中嵌入示例）。
7. **split**：服务端代码（非 LLM），按句号 / 感叹号 / 问号切句，保留标点；每句 ≤ 80 字符。
8. **pinyin**：本地 pypinyin / hanzi-pinyin npm 库，多音字按上下文 jieba 分词后选音；输出每句 pinyin 数组。
9. **translate**：调用 16-9 翻译节点（5 语）。
10. **audio**：调用 16-8 TTS 节点，句级音频 → R2 → URL。
11. **cover**：调用图像生成（Anthropic vision 或 stub，本 story 允许 stub URL，标 TODO）。
12. **eval**：调用 16-10 评估器，综合分 ≥ 0.7 通过；< 0.7 自动重跑 polish/draft 一次；二次仍失败 → 转人审（status=`needs_review`）。
13. **自动重试 ≤ 2** 次（整体），第 3 次必须人审。
14. 单文成本上限：$0.30（基于 16-3 llm_call_logs 累计），超额自动停止 + 标记 `cost_exceeded`。
15. 端到端延迟目标：P95 ≤ 8 分钟。
16. 入参 / 中间产物 / 最终产物全部进入 `factory_tasks.events` 时间线（16-2）。
17. 单元 + 集成 + 端到端测试（fixture 主题：北京胡同），断言成本 / 评分 / DB 状态。

## Tasks / Subtasks

- [ ] **DAG 定义**（AC: 1）
  - [ ] `packages/factory/src/flows/article/graph.ts`
- [ ] **节点实现**（AC: 4-12）
  - [ ] outline / draft / polish 节点 + prompt key
  - [ ] split / pinyin 服务端代码节点
  - [ ] translate / audio / cover 调用子工作流
  - [ ] eval 节点 + 重跑分支
- [ ] **持久化**（AC: 3）
  - [ ] articles / article_translations / article_sentences / article_assets 写入
  - [ ] 事务包裹 + 失败回滚
- [ ] **预算 / 限额**（AC: 13, 14）
  - [ ] 累计 cost 检查
  - [ ] retry counter
- [ ] **测试**（AC: 17）
  - [ ] e2e fixture
  - [ ] 评分 < 0.7 路径

## Dev Notes

### 关键约束
- 不直接发布；产出永远 status=`pending_review`，由 17-9 CMS 控制台人工发布。
- HSK 控制：在 prompt 中明确"避免 HSK > {level}+1 的生僻字"；polish 节点可二次约束。
- 拼音质量：jieba 分词后逐词查表，多音字优先词典词；句末轻声不强制。
- 翻译并发：5 语并发调用；任一失败重试 3 次后整任务失败转人审。
- TTS 并发：每文章句子数通常 30-60，拆 batch=10 并发；R2 路径 `articles/{article_id}/sentences/{idx}.mp3`。
- `events` 详细记录：每节点 latency / tokens / cost。

### 关联后续 stories
- 16-9 翻译节点（依赖）
- 16-8 TTS（依赖）
- 16-10 评估器（依赖）
- 16-11 人审 UI 渲染本工作流的 events 时间线
- 16-12 仪表板聚合成本与成功率

### Project Structure Notes
- `packages/factory/src/flows/article/`
  - `graph.ts` / `nodes/*.ts` / `prompts.ts`
- `packages/db/schema/articles.ts`（已存在，本 story 可能新增字段）
- `apps/api/src/routes/admin/factory/article-flow.ts`（POST /trigger / resume）

### References
- `planning/epics/16-content-factory.md` ZY-16-04
- `planning/spec/06-ai-factory.md` § 5
- `planning/prds/02-discover-china/`

### 测试标准
- 集成：fixture "北京胡同" → 全流程成功；DB 写入 5 语 + 句级音频
- 失败路径：mock eval < 0.7 → 触发 polish 重跑
- 成本上限：mock 累计成本 → 提前停止
- 性能：本地 P95 ≤ 8min（mock TTS / 翻译 / 图像）

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
