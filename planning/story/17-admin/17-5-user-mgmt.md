# ZY-17-05 · 用户管理

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 管理员 / 客服
**I want** 搜索 / 筛选 app 用户、看详情、封禁 / 解封 / 重置密码 / 模拟登录
**So that** 高效处理用户问题。

## 上下文
- 路由 `/admin/users`
- 详情 tab：基本信息 / 订阅 / 钱包 / 推荐 / 工单 / 审计
- 操作：suspend / unsuspend / reset-password / impersonate（仅 admin / cs，需二次确认 + 审计）

## Acceptance Criteria
- [ ] 列表 + 多条件搜索
- [ ] 详情 6 tab
- [ ] 4 操作 + 审计
- [ ] impersonate 进 app 显示 banner "客服模拟"

## 测试方法
- MCP Puppeteer：搜索 + 操作 + impersonate

## DoD
- [ ] 操作可审计
- [ ] impersonate banner 不可隐藏

## 依赖
- 上游：ZY-17-04 / ZY-03 / ZY-15
