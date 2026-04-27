# ACR-03 · 章节管理与免费试学范围

## PRD 原文引用

- `planning/prds/03-courses/04-data-model-api.md` §1.3：`content_chapters.is_free` `free_reason`。
- `01-structure-content.md` §4.1：“登录用户：每条轨道 Stage 1 前 3 章完全免费试学。”
- 用户裁决：W0 首发生产范围 ≠ 免费权限范围。

## 需求落实

- 页面：`/admin/content/courses/chapters/:id`。
- 组件：ChapterEditForm、IsFreeToggle（带说明）、FreeReasonPicker、ChapterPositionInput、PrerequisiteWarning。
- API：
  - `GET/PATCH /admin/api/content/courses/chapters/:id`
  - `POST /admin/api/content/courses/chapters/:id/publish`
  - `POST /admin/api/content/courses/chapters/bulk-set-free` Body `{chapter_ids, is_free, reason}`（批量设置）。

## 状态逻辑

- 默认每轨 Stage 1 Chapter 1-3 `is_free=TRUE` `free_reason='login_trial'`。
- 后台手动 `is_free=TRUE` 时强制选 `free_reason ∈ {'manual','promo'}`。
- 切换 `is_free` 立即失效相关用户的权限缓存（CR-17）。
- 校验：发布前必须保证 chapter 下 12 lessons 均存在且 published。

## 不明确 / 风险

- 风险：误把全部章节设为免费导致付费墙失效。
- 处理：批量操作需二次确认；超过 50 个章一次性免费需 admin 角色。

## 技术假设

- ChapterPositionInput 限制 1-12，受 stage 唯一约束保护。

## 最终验收清单

- [ ] 默认状态下每轨 Stage 1 Chapter 1-3 显示绿色“免费试学”。
- [ ] 手动改 Chapter 4 为免费需选 reason。
- [ ] 改动 5s 内权限缓存失效，前台立即解锁。
- [ ] 章未填满 12 lessons 时发布按钮 disabled。
- [ ] 写操作 audit_logs。
