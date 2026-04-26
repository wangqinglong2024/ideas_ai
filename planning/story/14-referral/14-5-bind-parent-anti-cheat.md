# ZY-14-05 · 绑定父子 + 反作弊

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 风控
**I want** 父子绑定时强校验：不可同设备 / 同 IP / 自邀请 / 已绑定 / 黑名单
**So that** 杜绝单人多账号刷邀请。

## 上下文
- bind 接口校验列表：
  1. parent != child
  2. child 未绑定过任何 parent
  3. parent + child 不同 device_id
  4. parent + child IP 不在同 /24（dev 可放宽）
  5. parent 状态非 flagged
- 所有失败原因记录 fraud_signals（接 ZY-12-08）
- 通过后 status='pending'，触发 ZY-14-07 转 confirmed

## Acceptance Criteria
- [ ] bind 接口含全部校验
- [ ] 失败明细返回（i18n key）
- [ ] 单测覆盖每条规则
- [ ] device_id 取自前端 fingerprint（参考 fingerprintjs OSS）

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run referral.bind
```

## DoD
- [ ] 5 校验全过
- [ ] 风控信号入库

## 依赖
- 上游：ZY-14-01..04 / ZY-12-08
