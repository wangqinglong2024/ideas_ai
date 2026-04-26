# ZY-15-02 · 实时分发 / 消息推送

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户 / 客服
**I want** 消息毫秒级到达，多端在线时实时同步
**So that** 沟通如同现代 IM。

## 上下文
- supabase-realtime broadcast `cs:conv:<id>`（new_msg / typing / read）
- 服务端在 cs_messages insert 后通过 realtime 推 channel
- 客户端无连接时 → push 通知（PushAdapter fake → 写 notifications）
- typing 事件 throttle 1 / 2s

## Acceptance Criteria
- [ ] BE realtime hook
- [ ] FE 用户端 / 客服端订阅 channel
- [ ] typing / read receipt
- [ ] 离线 → push 通知

## 测试方法
- 双窗口：用户发 → 客服窗口 < 1s 收到

## DoD
- [ ] 实时延迟 ≤ 500ms

## 依赖
- 上游：ZY-15-01 / ZY-05-06
