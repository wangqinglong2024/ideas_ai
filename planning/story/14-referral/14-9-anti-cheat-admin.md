# ZY-14-09 · 反作弊后台

> Epic：E14 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 风控
**I want** 看到所有可疑邀请关系，可一键置疑、撤销、加黑
**So that** 主动清理刷量账号。

## 上下文
- admin 路由 `/admin/referral`
- 列表：异常分数高的关系（同 IP / 同 device / 邀请爆发期）
- 操作：reject 关系（撤回 pending commission）；flag 父账号
- 全程审计 audit_log

## Acceptance Criteria
- [ ] BE `GET /api/v1/admin/referral/suspicious?cursor`
- [ ] 操作 endpoints：reject / flag / restore
- [ ] FE 列表 + 操作按钮 + 二次确认
- [ ] 仅 RBAC role=fraud / admin 可用

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run admin.referral
```

## DoD
- [ ] 操作链路通
- [ ] 审计日志全

## 依赖
- 上游：ZY-14-01..08 / ZY-17 / ZY-18-04
