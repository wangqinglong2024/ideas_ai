# ZY-19-05 · 业务大盘

> Epic：E19 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 经营层
**I want** 自建业务看板：DAU / WAU / 留存 / 新增 / 收入 / 充值 / ARPU / 留存 cohort
**So that** 不需要付费 BI。

## 上下文
- 物化视图 `zhiyu.mv_dau`、`mv_revenue_daily`、`mv_retention_cohort`，每小时 refresh
- 接口 `GET /api/v1/admin/reports/*`
- 数据来源：events + orders + ledger

## Acceptance Criteria
- [ ] 3 物化视图 + refresh job
- [ ] 5 报表接口
- [ ] 单测 sample 数据 → 已知答案

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-worker pnpm vitest run reports
```

## DoD
- [ ] 5 接口 ≤ 500ms

## 依赖
- 上游：ZY-19-03 / ZY-13 / ZY-12
