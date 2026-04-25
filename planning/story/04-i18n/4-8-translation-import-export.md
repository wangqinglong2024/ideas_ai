# Story 4.8: 翻译 CSV / XLIFF 导入导出

Status: ready-for-dev

## Story

As a 翻译协作者,
I want 从后台批量导出 / 导入 CSV 与 XLIFF 翻译文件,
so that 大批量翻译可发外包平台或离线工具完成，回流时一键覆盖。

## Acceptance Criteria

1. 导出按钮：选择 content_type + 源 lang + 目标 lang + status 范围 → 下载 CSV / XLIFF 1.2。
2. 导入支持 CSV / XLIFF 1.2，自动识别格式；上传后预览差异（新增 / 修改 / 跳过 / 冲突）。
3. 冲突解决：服务器版本较新时显示三方对比，用户选保留服务端 / 覆盖 / 手工合并。
4. 导入完成生成报告：成功 N、失败 M、跳过 K，可下载错误明细 CSV。
5. ICU 占位符校验：源与目标占位符不一致 → 标记为失败行。
6. 任务异步执行（BullMQ），> 10 万行任务后台跑；前端轮询进度条。
7. 大文件处理：流式解析，10 万行 < 60 s 完成；内存峰值 < 200 MB。
8. 操作审计：导入任务写 audit_log（user / file_hash / counts / status）。

## Tasks / Subtasks

- [ ] Task 1: 导出（AC: #1）
  - [ ] `GET /v1/admin/translations/export?...` 流式输出
  - [ ] CSV 与 XLIFF 1.2 双格式 serializer
- [ ] Task 2: 导入解析与预览（AC: #2, #5）
  - [ ] 上传到 R2 → BullMQ enqueue
  - [ ] worker 流式解析，diff vs 服务端
  - [ ] 预览页 React 表格
- [ ] Task 3: 冲突与回写（AC: #3, #4）
  - [ ] 三方对比 UI
  - [ ] 批量 upsert + 错误行收集
  - [ ] 报告 CSV 下载
- [ ] Task 4: 任务调度与审计（AC: #6, #7, #8）
  - [ ] BullMQ queue `translations-import`
  - [ ] 进度 publish 到 Redis pub/sub，前端 SSE 订阅
  - [ ] audit_log 写入

## Dev Notes

### 关键架构约束
- **XLIFF 1.2** 与外包平台兼容性最好；不做 2.0。
- **CSV 列**：`content_type, content_id, field, source_lang, source_text, target_lang, target_text, status`。
- **流式**：CSV 用 `csv-parse`，XLIFF 用 `sax`；禁止一次性 readFile。
- **Worker 隔离**：在 `apps/api-worker` 跑，不阻塞 API 进程。

### 关联后续 stories
- 4-7 后台入口的"批量导入 / 导出"按钮
- 4-6 service 层 upsert 复用

### 测试标准
- vitest：CSV / XLIFF 解析往返；占位符校验
- 集成：模拟 10 万行 import 完成 < 60s（CI 用 1 万行）

### Project Structure Notes

```
apps/api/src/modules/translations-io/
  export.ts
  parse-csv.ts
  parse-xliff.ts
  diff.ts
  controller.ts
apps/api-worker/src/jobs/translations-import.ts
apps/admin/src/routes/content/translations/import.tsx
```

### References

- [Source: planning/epics/04-i18n.md#ZY-04-08](../../epics/04-i18n.md)
- [Source: planning/story/04-i18n/4-7-translation-admin.md](./4-7-translation-admin.md)
- [Source: planning/spec/04-backend.md](../../spec/04-backend.md)

## Dev Agent Record

### Agent Model Used

(Filled by dev agent at execution time)

### Debug Log References

### Completion Notes List

### File List
