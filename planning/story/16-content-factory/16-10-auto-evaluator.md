# Story 16.10: 自动评估器（4 维度评分）

Status: ready-for-dev

## Story

作为 **AI 工程师**，
我希望 **构建统一的自动评估节点，对 4 类生成产物进行多维度评分**，
以便 **过滤低质内容，触发自动重跑或转人审，提升整体内容质量底线**。

## Acceptance Criteria

1. 模块 `packages/factory/src/flows/evaluator/`：导出 `evaluate(channel, payload)` → `EvalReport`。
2. 4 维度（每维度 0-1，加权综合）：
   - **准确性**（accuracy）：拼音 / 翻译 / 事实
   - **流畅性**（fluency）：语言自然度
   - **教学性**（pedagogy）：HSK 难度匹配 / 教学闭环（仅 lesson / wordpack）
   - **风格**（style）：与频道风格指南一致
3. 综合分 = `0.4*accuracy + 0.3*fluency + 0.2*pedagogy + 0.1*style`（lesson / wordpack）；article / novel：0.4 / 0.3 / 0.0 / 0.3，pedagogy 维度用 `coherence` 替换。
4. 阈值：综合分 ≥ 0.7 通过；< 0.7 触发重跑（由上游 graph 决定）；连续 2 次 < 0.7 → 转人审。
5. **执行方式**：调用 Claude（claude-sonnet-4，结构化输出 JSON schema），单次 evaluator 成本 < $0.05。
6. **抽样校验**（防止 LLM 自评幻觉）：每 100 次 evaluator 中 5 次走"双 evaluator 投票"（Claude + DeepSeek 各评一次取均值），偏差 > 0.2 写 `eval_disputes` 表。
7. **rubric 配置**：每 channel 的 rubric prompt 由 16-1 prompt_templates 维护（`evaluator.{channel}.rubric`）。
8. **可观察**：evaluator 报告写入 `factory_tasks.eval_history`（jsonb 数组），含 dimensions / overall / explanation。
9. **结构化输出**：返回 `{ overall, dimensions: {accuracy, fluency, pedagogy|coherence, style}, explanation: string, suggestions: string[] }`，Zod 严格校验。
10. **失败降级**：evaluator 自身失败 3 次后 → 默认综合分 0.5（强制人审），写 warning。
11. 单元 + 集成测试：fixture 输入 → 输出 JSON 结构正确；阈值边界。

## Tasks / Subtasks

- [ ] **接口 + 4 channel rubric**（AC: 1-3, 7）
- [ ] **执行 + 结构化输出**（AC: 5, 9）
- [ ] **抽样双投票**（AC: 6）
- [ ] **状态记录**（AC: 8）
- [ ] **失败降级**（AC: 10）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- evaluator 不能修改产物，仅打分 + 建议；产物修改由上游节点决定。
- rubric prompt 必须包含明确的"差例"与"好例"，减少 LLM 主观波动。
- 双投票仅抽样，避免成本翻倍；抽样比例可配置 env。
- Zod 校验失败时不写 db，先重试 LLM 调用 max 2。
- 阈值与权重必须与 sprint-16 / spec-06 § 8 严格一致；任何修改走 PR + 文档同步更新。

### 关联后续 stories
- 16-4 / 16-5 / 16-6 / 16-7 消费方
- 16-11 人审 UI 显示 eval explanation
- 16-12 仪表板：dispute / 平均分 / 通过率

### Project Structure Notes
- `packages/factory/src/flows/evaluator/index.ts`
- `packages/factory/src/flows/evaluator/rubrics.ts`
- `packages/factory/src/flows/evaluator/dual-vote.ts`
- `packages/db/schema/factory.ts` (eval_disputes)

### References
- `planning/epics/16-content-factory.md` ZY-16-10
- `planning/spec/06-ai-factory.md` § 8

### 测试标准
- 单元：Zod schema、加权计算
- 集成：mock Claude → 不同输入触发不同综合分
- 抽样：mock 100 次 → 5 次 dual vote

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
