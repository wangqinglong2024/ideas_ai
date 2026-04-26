# Epic E14 · 分销系统（Referral）

> 阶段：M5-M6 · 优先级：P0 · 估算：3 周
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)

## 摘要
邀请 / 二级分销 / 佣金（以 ZC 发放，**不支持现金提现**） / 反作弊。佣金 confirm 后自动入账知语币。

## 范围
- 邀请码生成（系统生成、用户不可见、不可改）
- 邀请落地页 + 上级关系建立
- 佣金计算（L1=20%, L2=20%）→ 单位 ZC
- 14 天确认期 + 反向（退款扣回）
- 佣金 confirmed → 自动 issue 知语币
- 分销员仪表板（ZC 单位）

## 非范围
- 现金提现（PayPal / Wise / 银行）— 永久不做
- L > 2（v2 评估）
- 团队管理（v2）

## 依赖
- E03 用户账户（注册流程含 ref 绑定）
- E12 经济（economy.issue 入账）
- E13 PaymentAdapter（订单成功 / 退款事件）
- E18 安全（设备指纹、反作弊）

## Stories（按需 9）

### ZY-14-01 · 表与 RLS
**AC**
- [ ] `referral_codes` / `referral_relations` / `referral_commissions` 三表 + 索引
- [ ] RLS：仅本人可看自己 commissions / relations
- [ ] referral_commissions 字段 `amount_coins`（INT，单位 ZC）
- [ ] 不创建 referral_withdrawals / referral_balances
**估**：M

### ZY-14-02 · 注册时邀请码生成
**AC**
- [ ] 注册成功钩子（监听 supabase auth.user.created webhook）→ 生成 6 位无歧义码（排除 0/O/1/I/L）
- [ ] 唯一性冲突重试；不可变；不暴露纯 code 字段 API
**估**：S

### ZY-14-03 · 分享链接与素材中心
**AC**
- [ ] GET `/api/v1/me/referral/share-link` 返回完整 URL（如 `http://115.159.109.23:3100/r/AB3K7Z`）
- [ ] 4 语种邀请文案模板
- [ ] QR 海报生成（PNG，写入 supabase-storage `posters/<uid>.png`）
- [ ] 系统分享调用（Web Share API），无第三方分享 SDK
**估**：M

### ZY-14-04 · 邀请落地页 /r/:code
**AC**
- [ ] 解析 code → 校验存在
- [ ] 显示邀请人头像 + 名（脱敏）
- [ ] 30 天 cookie 写入 ref_code
- [ ] 注册成功后调用 `referralService.bindParent`
**估**：M

### ZY-14-05 · 上级关系建立 + 反作弊拒绑
**AC**
- [ ] 写 `referral_relations(l1, l2, source_ip, source_device_id)`
- [ ] 设备指纹与上级相同 → 拒绑 + 告警
- [ ] 同 IP 24h 内同上级注册 ≥ 4 → 标 suspicious
- [ ] L2 自动派生
**估**：L

### ZY-14-06 · 佣金计算（PaymentAdapter 事件 → pending）
**AC**
- [ ] 订阅 / 一次性付款 `order.succeeded` 事件触发
- [ ] `amount_coins = round(order_amount_usd × 100 × 0.20)`
- [ ] L1 / L2 分别 INSERT pending；幂等（order_id + level 唯一）
- [ ] `order.refunded` → reverseCommission
**估**：L

### ZY-14-07 · 14 天确认 cron + 自动入账 + 退款反向
**AC**
- [ ] daily cron（zhiyu-worker BullMQ repeatable）：14 天前 pending → confirmed
- [ ] 调 `economy.issue(beneficiary, amount_coins, source='referral_commission')`
- [ ] 写 `coins_ledger_id` 回 referral_commissions；status pending → confirmed → issued
- [ ] `reverseCommission`：pending → reversed；confirmed/issued → 写负数 ledger（账户标 owed=true）
- [ ] EmailAdapter（fake）通知用户
**估**：L

### ZY-14-08 · 仪表板 /me/referral
**AC**
- [ ] 累计 / 待确认 / 已发放（ZC）
- [ ] L1 / L2 推荐人数；30 天曲线
- [ ] 邀请链接 + 复制 / 海报按钮（**不显示纯 code**）
- [ ] 推荐人列表（脱敏，时间脱敏到日）
- [ ] P95 < 500ms
**估**：L

### ZY-14-09 · 反作弊监控与后台审计
**AC**
- [ ] 同 IP / 同设备聚集检测；突增告警（小时级 5×中位数）
- [ ] 后台 suspicious 关系列表 + 冻结操作（冻结后不再 confirm/issue）
- [ ] 申诉链接（人工审核）
**估**：L

## 风险
- 反作弊误伤 → 申诉流程
- ZC 通胀 → referral 单户年 ≤ 200,000 ZC（独立上限）

## DoD
- [ ] 邀请→注册→付费（fake）→14 天 confirm→自动 ZC 入账 全链路
- [ ] 退款链路 → 反向扣减不丢
- [ ] 仪表板单位 ZC 准确
- [ ] 任何位置不显示纯 code；旧 withdraw / regenerate / code 端点 404
