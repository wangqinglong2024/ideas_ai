# Story 20.7: 启动活动准备

Status: ready-for-dev

## Story

作为 **增长 / 运营**，
我希望 **上线月有可执行的启动活动：注册赠 100 知语币、邀请 3 人解锁 1 月 VIP、启动月双倍 XP**，
以便 **加速冷启动、放大病毒系数、提升首月 DAU / 付费**。

## Acceptance Criteria

1. **注册赠 100 知语币**：
   - 新用户注册成功（含 OAuth）即记 ledger `+100 type=welcome_bonus`
   - 仅一次（user.welcome_bonus_at 标记）
   - 4+1 语欢迎弹窗 + 入账动画
2. **邀请 3 人解锁 1 月 VIP**：
   - 当用户 invitee 中 ≥ 3 人完成首课（lesson_completed_count ≥ 1）→ 自动发放 30d VIP
   - 与 E14 推荐机制整合，**不可重复领取**（user.vip_invite_unlocked_at 唯一）
   - 进度条：账户中心实时显示 `0/3 已邀请`
3. **启动月双倍 XP**：
   - 时间窗口：上线日 D-day 至 D+30，UTC
   - 学习引擎结算 XP 时若在窗口期 ×2，并显示「双倍中」
   - Feature Flag 控制（提前 / 延后 / 紧急关闭）
4. **活动横幅**：
   - app 顶部横幅 4+1 语，可关闭，关闭记忆 7d
   - 营销站 hero 增加活动 CTA
5. **PostHog 漏斗**：注册→欢迎币入账→首课→邀请发出→邀请接受→VIP 解锁。
6. **客服 / KB 培训**（与 20-8 联动）：FAQ 4+1 语；客服话术。
7. **风控**：
   - 同 IP / 同设备指纹注册数限制（与 12-10 反作弊联动）
   - 邀请关系不可循环（A→B→A）
   - 双倍 XP 不影响经济平衡（max XP per day 上限保留）
8. **可观测**：每日活动数据 → 19-5 业务仪表板（welcome_bonus_count / vip_unlock_count / 2x_xp_distributed）。
9. **回滚**：每个子活动独立 Feature Flag；30 天后自动关闭无须发版。

## Tasks / Subtasks

- [ ] **注册赠币**（AC: 1）
  - [ ] post-signup hook → ledger `welcome_bonus`
  - [ ] 欢迎弹窗组件
- [ ] **邀请解锁 VIP**（AC: 2）
  - [ ] referrals 表关联校验
  - [ ] cron 30min 扫描达标 → 发 VIP
  - [ ] 进度组件
- [ ] **双倍 XP**（AC: 3）
  - [ ] FF + 学习引擎 XP 中间件
  - [ ] UI 标识
- [ ] **横幅 + i18n**（AC: 4）
  - [ ] 4+1 语 messages
- [ ] **风控**（AC: 7）
  - [ ] 与 12-10 / 14 推荐反作弊接入
- [ ] **观测**（AC: 5, 8）
  - [ ] 事件 + 仪表板
- [ ] **运维**（AC: 9）
  - [ ] FF 总开关 + 三子开关

## Dev Notes

### 关键约束
- **欢迎币幂等**：同 user 重发必须返回原 ledger 记录；幂等键 `user_id::welcome_bonus`。
- VIP 月需可叠加付费 VIP（叠加生效，按结束时间晚的为准）。
- 双倍 XP 在 streak / 任务等其他奖励之上**乘 2**，但仍受 daily cap；产品确认默认 cap 不调整。
- 邀请 3 人按「首课完成」计，非「注册」，避免刷号。
- 活动文案需法务审签：避免「保证收益」「100% 解锁」等违规措辞（联动 20-9）。

### 关联后续 stories
- E12 经济：ledger / 双倍 XP 中间件
- E14 推荐：邀请关系 / 反作弊
- 20-1 营销站 CTA
- 20-8 客服培训

### Project Structure Notes
- `apps/api/src/routes/economy/welcome-bonus.ts`
- `apps/cron/jobs/invite-vip-unlock.ts`
- `apps/web/components/LaunchBanner.tsx`
- `packages/economy/src/xp-multiplier.ts`

### References
- [planning/epics/20-launch.md ZY-20-07](../../epics/20-launch.md)
- [planning/epics/12-economy.md](../../epics/12-economy.md)
- [planning/epics/14-referral.md](../../epics/14-referral.md)

### 测试标准
- 单元：幂等 / 防循环 / cap 边界
- 集成：注册→邀请→首课→VIP 解锁全链路
- 风控：刷号场景拦截率 ≥ 95%

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
