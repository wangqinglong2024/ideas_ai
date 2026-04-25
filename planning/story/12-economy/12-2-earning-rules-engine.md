# Story 12.2: 获得规则引擎

Status: ready-for-dev

## Story

作为 **平台运营**，
我希望 **可配置的知语币获得规则覆盖学习 / 文章 / 游戏（注意：MVP 期游戏不发币）/ 签到 / 邀请**，
以便 **规则可调、单日上限可控、支持防刷**。

## Acceptance Criteria

1. 规则表 `coins_earning_rules(id, source enum, action_key, base_amount, daily_cap_per_user, cooldown_seconds, enabled, conditions jsonb, updated_at)`。
2. 触发入口：服务事件总线（如完成节 / 完成文章 / 签到 / 邀请兑换）调用 `awardCoins(userId, source, actionKey, refId)`。
3. 单日上限：以 user_id + source + action_key 计窗口（00:00-24:00 用户时区，初版按 UTC，时区按 backlog 处理）。
4. 冷却：cooldown_seconds 内重复触发不发币（不报错）。
5. 条件：`conditions` jsonb 支持简单表达式（如 `min_score: 60`）；MVP 仅校验固定字段，不引入 DSL。
6. 幂等：`(user_id, source, action_key, ref_id)` 同组合只发一次。
7. **E10 MVP 期：游戏完成不调用本接口**（与 E10 解耦原则一致）。
8. 审计：每次 award 写 ledger（source / reason / ref）+ 反作弊钩子（12-10）。

## Tasks / Subtasks

- [ ] 规则表 + seed（学习 / 文章 / 签到 / 邀请）（AC: 1）
- [ ] `awardCoins` service（AC: 2,3,4,6）
- [ ] 事件订阅（lesson_completed / article_completed / checkin / invite_redeemed）（AC: 2）
- [ ] 防刷钩子（AC: 8，12-10）
- [ ] 单元 / 集成测试（覆盖上限 / 冷却 / 幂等）

## Dev Notes

### 关键约束
- 严守"游戏不发币"边界：规则表禁止 source=game 行（迁移强制不 seed）。
- 单日上限初版按 UTC 日，标记 TODO 待时区改造。

### Project Structure Notes
- `apps/api/src/services/coins/award.ts`
- `apps/api/src/events/coins-handlers.ts`
- `packages/db/schema/coins-rules.ts`

### References
- [Source: planning/epics/12-economy.md#ZY-12-02]

### 测试标准
- 单元：上限 / 冷却 / 幂等
- 集成：事件 → 入账

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
