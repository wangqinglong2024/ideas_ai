# ZY-17-09 · 订单 / 退款 / 推荐应付

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 财务
**I want** 后台查所有订单 / 处理退款工单 / 处理推荐应付提现
**So that** 账目清晰可对外。

## 上下文
- 路由 `/admin/finance`
- 订单：搜索 / 筛选 / 详情 / 导出 CSV
- 退款工作流（接 ZY-13-06）
- 推荐应付提现：列出 commissions.settled (cash) → 标记 paid_off + 备注 channel

## Acceptance Criteria
- [ ] 订单 列表 / 详情 / 导出
- [ ] 退款 flow + 双人复核可选
- [ ] 提现 flow + 标记
- [ ] 审计

## 测试方法
- MCP Puppeteer 退款 1 笔 → 用户钱包/通知更新

## DoD
- [ ] 全财务路径

## 依赖
- 上游：ZY-13-06 / ZY-14
