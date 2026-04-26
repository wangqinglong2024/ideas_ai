# ZY-20-02 · 跨平台冒烟测试（MCP Puppeteer 矩阵）

> Epic：E20 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] MCP Puppeteer 脚本矩阵：iPhone Safari / Android Chrome / iPad / Desktop Chrome
- [ ] 主流程：注册 → 选课 → 完成首节 → 付费墙 → fake checkout → 完成
- [ ] 4 语回归（en/es/zh/ar）
- [ ] 报告输出至 `planning/qa-reports/dev-acceptance.md`

## 测试方法
- 跑全矩阵脚本；失败 issue 记录到报告

## DoD
- [ ] 4×4 = 16 个 case 全绿
