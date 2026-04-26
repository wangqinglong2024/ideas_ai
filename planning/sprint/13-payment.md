# Sprint S13 · 支付与订阅

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/13-payment.md](../epics/13-payment.md) · 阶段：M5 · 周期：W20-W22 · 优先级：P0
> Story 数：6 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周：plans+orders+entitlements；PaymentAdapter 接口 + Fake；价格页 + Checkout；订阅管理 + 优惠券；续费 + 3 天宽限；财务对账 / 退款。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W20 | D1-D3 | ZY-13-01 tables | 状态机单测 |
| W20 | D3-D5 | ZY-13-02 adapter+fake | webhook 验签 + fake-checkout 通 |
| W21 | D6-D8 | ZY-13-03 pricing+checkout | 4 plan + 优惠券 + 端到端 |
| W21 | D8-D10 | ZY-13-04 sub mgmt+coupon | 取消/恢复/换 plan + coupon 校验 |
| W22 | D11-D12 | ZY-13-05 renewal+grace | active→past_due→expired |
| W22 | D12-D15 | ZY-13-06 reconciliation+refund | daily_revenue + 退款工单 |

## 依赖与并行
- 依赖 S03 / S12
- 与 S12 / S14 并行

## 退出标准
- 完整 fake 支付链路
- 退款撤回 entitlement + 通知
- 续费宽限 3 天逻辑准确

## 风险
- 真实支付供应商 dev 不接：保 Adapter 接口稳定
- 退款不可逆：双人复核可选
