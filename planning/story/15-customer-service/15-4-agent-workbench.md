# ZY-15-04 · 客服工作台

> Epic：E15 · 估算：L · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 客服
**I want** 一个工作台同时处理多个会话 + 看用户上下文 + 快捷回复
**So that** 高效响应。

## 上下文
- 路由 `/admin/cs/workbench`
- 三栏：会话列表 / 聊天区 / 用户上下文（账号、订阅、最近订单、最近游戏）
- 快捷回复：模板列表 + 变量插值（{{nickname}} / {{order_id}}）
- 状态切换：claim / resolve / transfer / close
- 多窗口在线（同账号多 tab）共享 claim 状态（realtime）

## Acceptance Criteria
- [ ] 工作台 UI 三栏 + 切换会话
- [ ] 快捷回复 CRUD
- [ ] claim → 写 cs_conversations.agent_id
- [ ] 用户上下文卡集成各表

## 测试方法
- MCP Puppeteer 双客服：一个 claim 后另一个不可重复 claim

## DoD
- [ ] 高并发场景不冲突

## 依赖
- 上游：ZY-15-01..03 / ZY-17
