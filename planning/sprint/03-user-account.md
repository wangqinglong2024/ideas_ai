# Sprint S03 · 用户账户体系

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/03-user-account.md](../epics/03-user-account.md) · 阶段：M1 · 周期：W5-W7 · 优先级：P0
> Story 数：6 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周内：profiles 表 + RLS + handle_new_user 触发；OTP 注册 + 密码 / OAuth 登录 + 5 失败 15 分锁；用户资料 + 头像 + user_settings；GDPR 导出 / 30 日延迟删除。

## 排期（3 周）
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W5 | D1-D2 | ZY-03-01 profiles + RLS + trigger | RLS 测试通；trigger 自动建 profile |
| W5 | D2-D5 | ZY-03-02 OTP register | 60s/邮箱、5/IP/5min 限频 |
| W6 | D6-D8 | ZY-03-03 password+OAuth+reset | 5-fail-15min lock 表 login_attempts |
| W6 | D8-D10 | ZY-03-04 profile+avatar | webp ≤2MB；username 免费一次后 100 ZC |
| W7 | D11-D12 | ZY-03-05 user_settings + sessions | 主题/locale/push/tts/a11y + 撤销会话 |
| W7 | D12-D15 | ZY-03-06 GDPR export+delete | BullMQ zip + 30d pending_delete + cancel |

## 依赖与并行
- 依赖 S01（Supabase + Redis + BullMQ）
- 与 S04 / S05 并行
- 下游：S08 / S11 / S12 / S13 / S14 / S15

## 退出标准
- 注册→登录→OTP→改密→登出 全闭环
- 5 fail lock 验证；OTP 重发限频；OAuth fake provider 通
- GDPR 导出 zip 完整 + delete 30d 后真删 cascade
- 全表 RLS 通过 / Supabase MCP 校验

## 风险
- OAuth provider key dev 缺：fake provider + 文档列出 .env 缺失项
- 邮件发送：缺 SMTP key → console adapter
