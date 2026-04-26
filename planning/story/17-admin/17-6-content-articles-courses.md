# ZY-17-06 · 内容管理 - 文章 / 课程

> Epic：E17 · 估算：L · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 文章：列表 + 多语编辑器 + 发布预览（reuse 阅读器组件）
- [ ] 课程：树形（轨道 → 阶段 → 章 → 节）+ 步骤编辑器 + 拖拽排序
- [ ] 步骤编辑器按 step_type 分发（10 种）
- [ ] 草稿自动保存

## 测试方法
- MCP Puppeteer：新建文章 → 发布 → 前台可见
- 课程拖拽排序持久化

## DoD
- [ ] 文章 + 课程 CRUD 全通
