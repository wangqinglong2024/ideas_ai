# ZY-15-06 · FAQ 自助 + AI 辅助（fake）

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] FAQ 多语 + 全文搜索 + 帮助度评分（👍/👎）
- [ ] LLMAdapter fake：返回最相近 FAQ 标题作为建议
  - 实现：pgvector cosine 检索（向量列由 admin seed 或留空）
  - 留空时退化为 FTS top-1
- [ ] **禁止** import openai / anthropic

## 测试方法
- 集成：搜索 → top-3 列表
- 评分写库可见

## DoD
- [ ] 不真实调用 LLM
