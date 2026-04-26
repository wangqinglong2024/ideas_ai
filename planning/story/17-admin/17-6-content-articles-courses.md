# ZY-17-06 · 内容管理：文章 / 课程

> Epic：E17 · 估算：L · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 编辑
**I want** 创建 / 编辑 / 发布 / 下架 文章和课程，含多语翻译界面
**So that** 内容可在线维护。

## 上下文
- 路由 `/admin/content/articles`、`/admin/content/courses`
- 文章富文本：Tiptap，支持标题 / 段 / 列表 / 引用 / 代码 / 图 / 拼音 ruby
- 课程：steps jsonb 编辑器（10 类型，每类专属表单）
- 翻译：右侧抽屉同时编辑 4 语字段

## Acceptance Criteria
- [ ] 文章 CRUD + 富文本 + 草稿 / 发布 / 下架
- [ ] 课程 CRUD + 10 step 表单 + 预览
- [ ] 翻译抽屉
- [ ] 审计 log

## 测试方法
- MCP Puppeteer：创文章 → 4 语翻译 → 发布 → app 端可见

## DoD
- [ ] 全闭环
- [ ] 大富文本不卡

## 依赖
- 上游：ZY-17-04 / ZY-06 / ZY-08
