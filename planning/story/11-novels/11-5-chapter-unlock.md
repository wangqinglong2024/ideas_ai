# ZY-11-05 · 章节解锁（ZC + 订阅）

> Epic：E11 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 解锁页：价格 / ZC 余额；ZC 直接扣或唤起 PaymentAdapter
- [ ] 包月会员（entitlement = `novel:all`）可读全部
- [ ] `novel_unlocks(user_id, chapter_id, source, ts)` 解锁记录表
- [ ] 解锁后立即跳阅读器；幂等

## 测试方法
- 集成：余额不足 / 充足 / 已订阅 三种路径

## DoD
- [ ] 三路径全 OK
