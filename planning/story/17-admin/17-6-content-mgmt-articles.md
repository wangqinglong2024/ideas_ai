# Story 17.6: 内容管理 - 文章

Status: ready-for-dev

## Story

作为 **内容编辑**，
我希望 **在后台管理"探索中国"文章（增删改查 + 多语 + 状态流转 + 预览发布）**，
以便 **不依赖工厂也能稳定地维护文章库（v1 主路径）**。

## Acceptance Criteria

1. 路由 `/admin/content/articles`：列表 / 详情 / 编辑器。
2. 列表筛选：category / status / locale / 创建日期 / 评分；排序：updated desc / published desc。
3. 编辑器：
   - 多语 tab（zh + en/vi/th/id），任意 tab 可独立编辑保存。
   - 富文本（lexical / tiptap）+ 句级标注（句 ID 锁定）。
   - 句级音频上传 / 替换 / 重生（调用 16-8 单句 endpoint，v1 也允许）。
   - 封面上传 R2。
   - 元数据（标题 / 摘要 / 标签 / category / hsk_level / reading_minutes）。
4. **状态流转**：`draft → review → published → archived`；published 后修改自动 fork 为新版本；published 永远只读。
5. **预览**：「预览」按钮在新窗口打开端用户视图（带 admin token，URL 中标 `?preview=1`）。
6. **多语完整性校验**：发布前必填 zh + 至少 1 种外语；缺失外语 warning（不阻止）。
7. **批量**：上下架（published ↔ archived）多选；删除仅允许 draft + archived。
8. **导入**：CSV / JSON 批量导入文章（外部脚本产物），dry-run + commit 两步。
9. **权限**：`articles:read` / `articles:write` / `articles:publish` / `articles:bulk`。
10. **审计**：所有写 audit_logs；published 操作额外标 `severity=high`。
11. e2e：编辑 → 保存 draft → review → publish → 端用户可见。

## Tasks / Subtasks

- [ ] **API**（AC: 1, 4, 7-9）
- [ ] **UI 列表**（AC: 1, 2, 7）
- [ ] **UI 编辑器**（AC: 3, 5, 6）
- [ ] **导入**（AC: 8）
- [ ] **审计**（AC: 10）
- [ ] **测试**（AC: 11）

## Dev Notes

### 关键约束
- published 修改 fork 新版本：article_id 不变，新增 `version` 字段，published 永远指向 max version + status=published。
- 句级标注：句 ID 稳定（基于 hash + index），翻译表通过 sentence_id 关联，重排序时保持翻译对齐。
- 富文本输出：HTML + sanitize；DOMPurify 白名单。
- 预览令牌：JWT 5min 短期 + 仅本文章 scope。
- 多语完整性 warning 通过 toast，不阻塞 publish；可选项 `force=false` 严格模式（v1.5）。

### 关联后续 stories
- 17-1 ~ 17-4
- 16-1 / 16-4 / 16-9 / 16-8（v1.5 联动）
- E06 探索中国 schema

### Project Structure Notes
- `apps/admin/src/pages/content/articles/`
- `apps/api/src/routes/admin/content/articles.ts`
- `packages/editor/`（共享富文本组件）

### References
- `planning/epics/17-admin.md` ZY-17-06

### 测试标准
- e2e：完整生命周期
- 安全：无 publish 权限 → 403
- 数据：fork 后 article_id 稳定、translations 对齐

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
