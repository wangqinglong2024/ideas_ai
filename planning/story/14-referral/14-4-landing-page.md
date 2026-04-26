# ZY-14-04 · 邀请落地页

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 被邀请用户
**I want** 打开邀请链接看到推荐人头像 + 双方奖励说明 + 注册按钮
**So that** 我有信任感和动机注册。

## 上下文
- 路由 `/r/:code` SSR 渲染推荐人摘要（脱敏 nickname + avatar）
- 写 cookie `zy_ref=<code>` (30d, httpOnly:false 让 FE 在注册时读取)
- 注册成功后 FE 调 `POST /api/v1/referral/bind` { code }
- 同设备 / 同 IP 校验在 ZY-14-05

## Acceptance Criteria
- [ ] SSR 落地页 4 语
- [ ] code 不存在 → 友好 404
- [ ] cookie 写入 + 30 天过期
- [ ] 注册流走 bind

## 测试方法
- MCP Puppeteer：访问 /r/ABC123 → 看到推荐人 → 注册

## DoD
- [ ] cookie 持久
- [ ] 4 语正常

## 依赖
- 上游：ZY-14-01..03 / ZY-05-05
