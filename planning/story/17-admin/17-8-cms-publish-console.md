# ZY-17-08 · CMS 发布控制台 + 计划发布

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 编辑
**I want** 在一个发布控制台看到所有"待发布 / 计划发布 / 已发布"内容，可一键发布或定时
**So that** 内容上线节奏可控。

## 上下文
- 路由 `/admin/content/publish`
- 状态：draft / scheduled / published / unpublished
- 计划发布：worker cron 每分钟扫
- 失败重试 3 次 → 标记 fail + 通知

## Acceptance Criteria
- [ ] 控制台列表 + 筛选 / 排序
- [ ] 一键发布（多选）
- [ ] 定时发布 (datetime picker)
- [ ] cron + 重试

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-worker pnpm vitest run publish.cron
```

## DoD
- [ ] 计划发布到点上线

## 依赖
- 上游：ZY-17-06 / 07 / ZY-19
