# ZY-18-01 · 密码 / Token 基线

> Epic：E18 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 安全负责人
**I want** 全站统一密码策略 + 短期 token 策略
**So that** 不会因弱密码 / 长 token 被打穿。

## 上下文
- 密码：argon2id（参数 mem 64MB / time 3 / parallel 1）
- 强度：≥ 8 字符，包含 2 类，≤ 100 字符；前 1000 弱密码黑名单
- token：access 15min / refresh 7 day；refresh rotate；旧 refresh 一次性
- session 表：device + ip + ua

## Acceptance Criteria
- [ ] 密码 hasher util
- [ ] 强度校验中间件
- [ ] refresh rotate
- [ ] session 列表 / 撤销 (复用 ZY-03-05)

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run security.password security.token
```

## DoD
- [ ] argon2 参数确认 + 性能测试

## 依赖
- 上游：ZY-03
