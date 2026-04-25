# Sprint S03 · 用户账户体系（User Account）

> Epic：[E03](../epics/03-user-account.md) · 阶段：M1 · 周期：W5-W8 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-3)

## Sprint 目标
完整用户账户：邮箱注册 / 登录 / OAuth / 找回密码 / 设置 / 会话 / GDPR 删除。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 3-1-users-sessions-tables | users / sessions 表 + RLS | M | S01 1-10 | W5 |
| 2 | 3-2-register-email-verification | 注册 + 邮箱验证 | L | 3-1 | W5-W6 |
| 3 | 3-3-login-jwt | 登录 + JWT + 锁定 | M | 3-1 | W6 |
| 4 | 3-5-forgot-password | 找回密码 | M | 3-3 | W6 |
| 5 | 3-4-oauth-google-apple | OAuth Google + Apple | L | 3-3 | W7 |
| 6 | 3-8-device-session-management | 设备 / 会话管理 | S | 3-3 | W7 |
| 7 | 3-6-profile-avatar | 个人资料 + 头像 | M | 3-3 | W7 |
| 8 | 3-7-settings-center | 设置中心 | M | 3-6 | W7 |
| 9 | 3-9-account-deletion-gdpr | 账号删除（GDPR） | L | 3-6 | W8 |
| 10 | 3-10-account-frontend-pages | 前端账户页 | L | 2-6,3-2,3-3,3-5 | W6-W8 |

## 周次计划

- **W5**：3-1 + 3-2（API+邮件）；3-10 启动登录/注册页 UI
- **W6**：3-3 完成登录链路；3-5 找回密码；3-10 推进
- **W7**：3-4 OAuth；3-6/3-7/3-8
- **W8**：3-9 GDPR 软删 + 数据导出；3-10 完成 + 4 语翻译

## 风险
- OAuth 配置复杂（Apple Privacy Email） → 提前申请 + 预留 1 周
- 暴力破解 → token 重放 → 安全测试在 W8 必跑

## DoD
- [ ] 邮箱 + 2 种 OAuth 全流可走
- [ ] 安全测试通过（Burp + 自定义脚本）
- [ ] 4 语翻译完整（依赖 S04 翻译键已配）
- [ ] GDPR 数据导出 / 删除合规
- [ ] retrospective 完成
