# Story 4.7: 翻译管理后台

Status: ready-for-dev

## Story

As a 翻译协作者 / 内容管理员,
I want 在管理后台 `/admin/content/translations` 提供双栏对照编辑界面,
so that 翻译人员可以左源（zh）右译，按状态（待译 / 译中 / 待审 / 已发）流转，节省外部工具切换。

## Acceptance Criteria

1. 路由 `/admin/content/translations`，列表页支持按 content_type / lang / status / 搜索关键字过滤。
2. 详情页双栏：左侧固定源语言（默认 zh，可切 en）、右侧目标语言 textarea / 富文本（按字段类型）。
3. 状态机 `draft → in_progress → review → published` 4 状态，按钮按角色显示（translator / reviewer / admin）。
4. ICU 占位符与源语言一致性校验：保存前提示 `{name}` 等是否对齐，差异处红框。
5. 长度溢出告警（如按钮文案 > 30 字符）。
6. 自动保存草稿（debounce 1.5 s），断网恢复后从本地草稿继续。
7. 操作审计：每次保存写 `audit_log`（user / from / to / fields_changed）。
8. 列表 P95 < 500 ms（10 万条数据，分页 50/页）。

## Tasks / Subtasks

- [ ] Task 1: 列表页（AC: #1, #8）
  - [ ] `apps/admin/src/routes/content/translations/index.tsx`
  - [ ] 复用 `<DataTable>` + 服务端分页 / 过滤
  - [ ] 状态徽标 + 进度条
- [ ] Task 2: 详情页（AC: #2, #3, #4, #5）
  - [ ] 双栏布局，左只读 / 右可写
  - [ ] 字段类型（plaintext / markdown / html）选择对应编辑器
  - [ ] ICU lint：`packages/i18n/src/icu-lint.ts` 复用
  - [ ] 长度规则集中在 `field-rules.ts`
- [ ] Task 3: 自动保存与审计（AC: #6, #7）
  - [ ] react-hook-form + debounce + IndexedDB 草稿
  - [ ] PUT 请求触发审计（4-6 已在 service 层）
- [ ] Task 4: 权限（AC: #3）
  - [ ] 按 role gate 状态切换按钮
  - [ ] 后端二次校验

## Dev Notes

### 关键架构约束
- **不重新发明编辑器**：plaintext 用 `<textarea>`，markdown 用 packages/ui 的 `<MarkdownEditor>`，html 用 TipTap（已存在于 admin）。
- **草稿存储**：IndexedDB key `tr:draft:{content_type}:{content_id}:{lang}`；提交成功后清。
- **状态机校验**：合法转移在 `service.ts` 强制；前端按钮只是 UX 层。
- **依赖 4-6 的 PUT API**。

### 关联后续 stories
- 4-6 API 已就位
- 4-8 导入导出共用同一 status 枚举与权限
- 17-* admin epic 的 RBAC

### 测试标准
- Storybook：列表页 / 详情页 各 3 状态截图
- Playwright：登录 translator → 编辑 vi → 提交 review → admin publish 全链路 1 个

### Project Structure Notes

```
apps/admin/src/routes/content/translations/
  index.tsx          # 列表
  $contentType.$contentId.$lang.tsx   # 详情
packages/i18n/src/icu-lint.ts
packages/admin-shared/field-rules.ts
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-07](../../epics/04-i18n.md)
- [Source: planning/story/04-i18n/4-6-content-translations-api.md](./4-6-content-translations-api.md)
- [Source: planning/spec/03-frontend.md](../../spec/03-frontend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
