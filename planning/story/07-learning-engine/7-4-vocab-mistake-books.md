# ZY-07-04 · 生词本 + 错题本

> Epic：E07 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 生词页：来源（文章 / 课程 / 游戏）筛选；按 HSK 等级分组
- [ ] 错题页：按来源 / 类型分组；重做模式（重做正确则移出）
- [ ] 操作：手动掌握 / 重新加入 SRS
- [ ] 列表分页 + 搜索

## 测试方法
- MCP Puppeteer：从文章加生词 → 生词页可见 → 重做掌握 → 移出
- 单元：分组逻辑

## DoD
- [ ] 双本可用 + SRS 联动
