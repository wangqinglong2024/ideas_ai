# ZY-20-05 · 客服知识库

> Epic：E20 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 客服
**I want** 内置知识库：FAQ / 操作手册 / 常见 SOP，可全文搜索
**So that** 回复一致专业。

## 上下文
- 文档放 admin CMS，分类：账号 / 学习 / 支付 / 风控 / 内容
- FE `/admin/cs/kb` 浏览 + 搜索（pg FTS）
- 与 ZY-15-06 FAQ 共用底层数据

## Acceptance Criteria
- [ ] CMS schema kb_articles
- [ ] 列表 + 搜索 + 详情
- [ ] 4 语
- [ ] 在客服工作台快捷调起

## 测试方法
- MCP Puppeteer 搜索关键词 → 结果

## DoD
- [ ] 至少 20 篇种子

## 依赖
- 上游：ZY-15-04 / 06 / ZY-17-08
