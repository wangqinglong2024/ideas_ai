# ZY-20-04 · 启动活动配置就绪

> Epic：E20 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 注册赠 100 ZC（economy 规则配置；接 ZY-12-02）
- [ ] 邀请 3 人解锁 1 月 VIP（referral 规则 + 自动 issue entitlement）
- [ ] 活动月双倍 XP（Feature Flag 控制 ZY-07-05）
- [ ] 活动起止时间可配置

## 测试方法
- 集成：mock 注册 → ZC 100 入账
- 邀请 3 人 → entitlement 出现

## DoD
- [ ] 三活动可配可关
