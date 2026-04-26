# ZY-17-02 · admin 登录 + TOTP

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 管理员
**I want** 邮箱+密码 + TOTP 二步验证登录
**So that** 后台账号即使密码泄露也安全。

## 上下文
- 路由 `/login`（admin-fe）
- 第一次登录强制启用 TOTP（otpauth url + 二维码 in-page）
- 失败 5 次锁 15 分钟
- 会话 24h

## Acceptance Criteria
- [ ] BE login + verify-totp + setup-totp
- [ ] FE 二步表单
- [ ] lock 检测
- [ ] 审计 login / logout / totp-setup

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-admin-be pnpm vitest run admin.login
```
- MCP Puppeteer：登录 + TOTP 流

## DoD
- [ ] TOTP 闭环
- [ ] lock 生效

## 依赖
- 上游：ZY-17-01
