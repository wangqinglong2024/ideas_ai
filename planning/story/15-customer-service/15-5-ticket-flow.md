# ZY-15-05 · 工单流程

> Epic：E15 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户
**I want** 复杂问题转工单（带分类 / 截图 / 优先级），并能跟进进度
**So that** 不丢失 issue。

## 上下文
- 用户 `/support/ticket/new` 创建：选 category / priority / subject / body / 附件
- 自动产生 sla_due_at（ZY-15-01）
- 客服在工作台分配 / 处理 / 关闭
- 用户列表 `/support/tickets` 看全部，详情可加备注

## Acceptance Criteria
- [ ] BE CRUD endpoints + 状态机
- [ ] FE 用户端创建 / 列表 / 详情
- [ ] FE 客服端工单管理 tab
- [ ] 状态变更通过 notification 推送

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run tickets
```

## DoD
- [ ] 全状态机 + 通知

## 依赖
- 上游：ZY-15-01..04 / ZY-05-06
