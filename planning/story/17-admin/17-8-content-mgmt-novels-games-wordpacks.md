# Story 17.8: 内容管理 - 小说 + 游戏 + 词包

Status: ready-for-dev

## Story

作为 **内容编辑**，
我希望 **统一管理小说章节、游戏开关与词包关联、词包 CRUD**，
以便 **三类内容完整可运营，覆盖 12 题材小说 + 12 款游戏 + 海量词包**。

## Acceptance Criteria

### 小说
1. 路由 `/admin/content/novels`：小说列表 + 详情 + 章节子列表。
2. 章节编辑器：标题 / 正文（富文本）/ 多语 / 句级音频 / 封面 / 是否付费 / 价格（ZC）。
3. 章节状态：draft / review / published / archived；章节按 chapter_index 顺序，禁止跳号。
4. 小说设定：基本资料 / 角色卡 / 时间线 / 词典（novel_lore）；可手工编辑或导入 16-6 回写。
5. 章节批量导入（外部脚本产物）。

### 游戏
6. 路由 `/admin/content/games`：12 款游戏列表，支持开关（is_active）+ 关联词包（多对多）+ 配置 JSON（难度 / 时长 / 关卡参数）。
7. **取消关卡模式**：游戏不再支持"分关卡"概念；每款游戏只有一个游戏体（与 PRD 04-games 一致）。
8. 游戏配置 JSON Zod 校验；预览按钮启动游戏 demo。

### 词包
9. 路由 `/admin/content/wordpacks`：列表 / 详情 / 编辑器。
10. 词条 CRUD（word / pinyin / pos / def_zh / example / 翻译 / 音频 URL）。
11. 批量导入 CSV / JSON。
12. 与游戏 / 课程关联视图（只读）。

### 通用
13. 权限：`novels:*` / `games:*` / `wordpacks:*` 独立。
14. 审计 + e2e 测试。

## Tasks / Subtasks

- [ ] **小说 API + UI**（AC: 1-5）
  - [ ] novel + chapter + lore CRUD
- [ ] **游戏 API + UI**（AC: 6-8）
  - [ ] is_active 切换 + 词包关联 + 配置编辑
- [ ] **词包 API + UI**（AC: 9-12）
  - [ ] 词条 CRUD + 导入
- [ ] **权限 + 审计**（AC: 13, 14）
- [ ] **测试**

## Dev Notes

### 关键约束
- 小说章节 chapter_index 唯一约束；新增前自动取 max+1，UI 不允许手填越级。
- 关卡模式取消：DB 中如曾存在 `level` / `stage` 字段需迁移移除（已在 PRD 调整时清理）。
- 游戏配置 schema 由 packages/games-config/ 维护，每款游戏一个 Zod schema。
- 词包导入：CSV 头 `word,pinyin,pos,def_zh,en,vi,th,id,example_zh,example_pinyin,audio_url?`，dry-run + commit。
- 与游戏 / 课程关联视图：基于 `wordpack_usages`（关联表），便于影响面查询。

### 关联后续 stories
- 17-1 ~ 17-4
- 16-6 / 16-7 / 11-x / 9-x / 10-x

### Project Structure Notes
- `apps/admin/src/pages/content/{novels,games,wordpacks}/`
- `apps/api/src/routes/admin/content/{novels,games,wordpacks}.ts`
- `packages/games-config/`

### References
- `planning/epics/17-admin.md` ZY-17-08
- `planning/prds/04-games/` （关卡模式取消基线）
- `planning/epics/11-novels.md`

### 测试标准
- e2e：3 种内容主路径
- 数据：游戏配置 schema 校验
- 安全：权限边界

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
