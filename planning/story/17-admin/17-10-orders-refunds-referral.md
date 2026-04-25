# Story 17.10: 订单 / 退款 / 分销视图

Status: ready-for-dev

## Story

作为 **运营 / 财务 / 客服**，
我希望 **集中查看订单、执行退款、查看分销关系与佣金**，
以便 **支持财务对账、客服响应、运营决策；并明确 v1 不支持现金提现**。

## Acceptance Criteria

### 订单
1. 路由 `/admin/orders`：列表 / 详情。
2. 列表筛选：status / 网关（paddle / lemonsqueezy）/ 用户 / 日期 / 金额区间。
3. 详情：用户 / 商品 / 金额 / 网关原始 payload（折叠）/ 关联订阅 / 关联充值 ZC。
4. **导出 CSV**（财务月度对账）。

### 退款
5. 路由 `/admin/refunds` 或订单详情内操作：发起退款 → 调用网关退款 API（13-x）。
6. 退款成功 webhook 回调时，**自动触发 14-8 commission_reversed**（写入 `referral_commissions.status='reversed'` + reversal_reason='order_refund'）。
7. **风控**：单笔 > $50 或 1h 内 > 3 笔 → 二次审批（finance role）。
8. 部分退款支持。

### 分销
9. 路由 `/admin/referral`：邀请关系树（用户 + L1 + L2）；佣金列表（按 status 分 pending / confirmed / issued / reversed / frozen）。
10. **以 ZC 为单位显示**，不显示 USD 字段（与 14-x 保持一致）。
11. **不含提现审批**：v1 永远不提供现金提现入口；UI 中明确提示「v1 知语币不可提现」。
12. 异常 / suspicious 关系标红。

### 通用
13. 权限：`orders:read|refund` / `referral:read`；finance role 可二次审批退款。
14. 审计：所有写 audit_logs（severity=high for refund）。
15. e2e 测试覆盖完整退款 → 佣金反向链路。

## Tasks / Subtasks

- [ ] **订单 API + UI**（AC: 1-4）
- [ ] **退款流程 + 二次审批**（AC: 5, 7, 8）
  - [ ] 网关 refund 调用 + 状态机
  - [ ] 二次审批工作流
- [ ] **commission reversed 联通**（AC: 6）
  - [ ] webhook 触发 14-8
  - [ ] 端到端测试
- [ ] **分销视图**（AC: 9-12）
- [ ] **权限 + 审计**（AC: 13, 14）
- [ ] **测试**（AC: 15）

## Dev Notes

### 关键约束
- 退款 idempotency：网关返回 refund_id 持久化，重复调用不重复退。
- 二次审批：状态 `pending_approval` → `approved` → `processing` → `succeeded`/`failed`；超过 7d 未审批自动 expire。
- 部分退款金额校验：sum(refunds.amount) ≤ order.amount。
- 分销 UI 严禁显示 USD / 提现按钮，UI 测试断言不存在 `data-testid="withdraw-btn"`。
- ZC 单位显示：`{coins.toLocaleString()} ZC`。

### 关联后续 stories
- 17-1 ~ 17-4
- E13 payment / E14 referral / E12 economy
- 18-5 audit

### Project Structure Notes
- `apps/admin/src/pages/{orders,refunds,referral}/`
- `apps/api/src/routes/admin/{orders,refunds,referral}/`

### References
- `planning/epics/17-admin.md` ZY-17-10
- `planning/epics/14-referral.md` 14-8

### 测试标准
- e2e：订单 → 退款 → 14-8 commission_reversed 自动触发
- 安全：finance 二次审批必需
- UI 安全：不含 withdraw 按钮断言

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
