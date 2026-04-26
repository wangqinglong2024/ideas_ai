# ZY-17-03 · RBAC 中间件

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 后端工程师
**I want** 基于角色的接口拦截 + 菜单可见控制
**So that** 编辑只能改内容、客服只看会话、财务只看订单。

## 上下文
- 中间件 `requireRole(...)` decorator
- 5 角色权限矩阵 → 配置 ts 常量
- 前端读 `/api/v1/admin/me` → 渲染菜单

## Acceptance Criteria
- [ ] requireRole 中间件 + 单测
- [ ] 权限矩阵 const + 文档生成
- [ ] FE menu hide / disable
- [ ] 越权返回 403

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-admin-be pnpm vitest run rbac
```

## DoD
- [ ] 5 角色场景全测

## 依赖
- 上游：ZY-17-01 / 02
