# ZY-17-04 · admin 应用骨架

> Epic：E17 · 估算：M · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 管理员
**I want** 现代后台 shell：左侧菜单 / 顶栏 / 面包屑 / 暗黑模式 / 命令面板
**So that** 操作一致、效率高。

## 上下文
- 端口：admin-fe 4100 / admin-be 9100
- 同样使用 `@zhiyu/ui` 设计系统
- 路由 file-based；菜单按 RBAC 过滤
- 命令面板（cmdk）：跳页 + 全局搜索

## Acceptance Criteria
- [ ] AppShell 组件
- [ ] 路由 + 404 + 权限 guard
- [ ] 暗黑模式
- [ ] 命令面板基础

## 测试方法
- MCP Puppeteer：访问 :4100 → 登录 → 浏览各模块

## DoD
- [ ] 5 角色登录后菜单正确

## 依赖
- 上游：ZY-17-02 / 03 / ZY-02 / ZY-05
