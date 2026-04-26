# ZY-14-08 · 推荐数据看板（用户）

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 推荐人
**I want** 在「我」看我的推荐人数 / 待结算 / 已结算 / 收益曲线 / 邀请记录
**So that** 我清楚回报，并知道下一步可做什么。

## 上下文
- 路由：`/me/referral`
- 卡片：累计邀请、待确认、有效、已结算 ZC、应付现金
- 曲线：近 30 天每日新增邀请 + 收益
- 列表：被邀人脱敏 nickname + 状态 + 给我的奖励

## Acceptance Criteria
- [ ] `GET /api/v1/me/referral/dashboard`
- [ ] FE 4 卡 + 1 曲线 + 列表
- [ ] 4 语 + RTL
- [ ] 实时（如 child 新订阅 → realtime 推 dashboard 刷新）

## 测试方法
- MCP Puppeteer：邀请 1 人 → 卡数 +1

## DoD
- [ ] 数字与后台一致

## 依赖
- 上游：ZY-14-01..07
