# DC-21 · 对接后台 DC 内容管理闭环

## PRD 原文引用

- `AD-FR-006`：“DC：类目 + 文章 + 句子 CRUD。”
- `AD-FR-006`：“通用功能：批量发布 / 撤回 / 复制 / 版本历史 / 预览。”
- `planning/ux/11-screens-admin.md`：“内容管理 - 文章 `/admin/content/articles`。”

## 需求落实

- 页面：后台 `/admin/content/articles`、`/admin/content/articles/:id/edit`。
- 组件：AdminArticleList、AdminArticleEditor、SentenceEditor、PreviewPane。
- API：`/admin/api/content/discover/*`。
- 数据表：`content_categories`、`content_articles`、`content_sentences`、`admin_audit_logs`。
- 状态逻辑：前台只读 published；后台 draft/review/published/archived 全部可管理。

## 不明确 / 风险

- 风险：后台模块独立任务目录缺失会导致前台无内容入口。
- 处理：本任务依赖 `planning/task/14-admin-discover-china/` 的 ADC 任务闭环实现。

## 技术假设

- 后台写操作必须通过 RBAC 与审计中间件。

## 最终验收清单

- [ ] 后台可新建/编辑/发布/撤回 DC 文章。
- [ ] 句子级编辑支持拼音、翻译、音频。
- [ ] 前台能看到后台发布内容。
- [ ] 所有写操作有审计日志。