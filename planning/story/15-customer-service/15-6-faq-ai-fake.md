# ZY-15-06 · FAQ + AI 助手（fake）

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户
**I want** 在打开客服前，先看到 FAQ / AI 助手，能自助解决大部分问题
**So that** 减少等待时间。

## 上下文
- FAQ：CMS 后台维护（接 ZY-17-08），按分类 + 4 语
- AI 助手：定义 LLMAdapter 接口；缺 OPENAI_API_KEY 时回 fake responder（关键词匹配 FAQ + 转人工提示）
- 4 语；不直接接 OpenAI / Claude SDK，从 sdk 包引

## Acceptance Criteria
- [ ] LLMAdapter 接口 + FakeAdapter
- [ ] FE `/support` 进入页 → FAQ + 搜索 + AI 入口
- [ ] AI 三轮内未解决 → 显示「转人工」按钮
- [ ] FAQ 命中分析（接 ZY-19-03 events）

## 测试方法
- MCP Puppeteer：搜索 → 点 FAQ → 转 AI → 转人工

## DoD
- [ ] 闭环可用
- [ ] 缺 key 不报错

## 依赖
- 上游：ZY-15-01..05
