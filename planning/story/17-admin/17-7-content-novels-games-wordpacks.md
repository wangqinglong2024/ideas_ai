# ZY-17-07 · 内容管理：小说 / 游戏 / 词包

> Epic：E17 · 估算：L · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 编辑 / 游戏运营
**I want** 维护小说（含分章 / 上下架）、游戏元数据 / 词包 (HSK 1-6 + 自定义)
**So that** 阅读 / 游戏 / 学习内容统一可控。

## 上下文
- 小说：`/admin/content/novels` 列表 / 详情 / 章节列表 / 章节富文本编辑
- 游戏：`/admin/content/games` 元数据（封面 / 类型 / 难度 / 启用），不上传游戏代码
- 词包：`/admin/content/wordpacks` JSON 批量编辑 + 校验

## Acceptance Criteria
- [ ] 小说+章节双层 CRUD（分页 / 跳页）
- [ ] 游戏元数据 CRUD
- [ ] 词包 JSON 编辑器 + zod 校验
- [ ] 审计

## 测试方法
- MCP Puppeteer 三类各创一条

## DoD
- [ ] 三类闭环

## 依赖
- 上游：ZY-17-04 / ZY-09 / ZY-11
