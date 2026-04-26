# ZY-07-06 · HSK 自评 + 自动评估占位

> Epic：E07 · 估算：S · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 注册引导 10 题问卷 → 推荐 HSK 1-6 起始等级
- [ ] 个人页可重测；写 `profiles.hsk_level`
- [ ] 自动评估接口占位：`/api/v1/me/hsk/auto`，返回当前等级（不调 LLM）
- [ ] 收集列：答题正确率、时长、词汇覆盖（为未来训练）

## 测试方法
- MCP Puppeteer：完成问卷 → 等级写入
- 单元：评分映射

## DoD
- [ ] 自评可用；自动评估接口预留
