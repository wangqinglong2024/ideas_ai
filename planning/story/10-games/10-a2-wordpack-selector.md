# Story 10.A2: 词包选择器（统一组件）

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **有一个统一的词包选择器，让 12 款游戏开局前能拉取相同口径的词列表**，
以便 **所有游戏共享 HSK 词库源、避免重复实现、且 MVP 期固定为 HSK1 默认**。

## Acceptance Criteria

1. 提供 React 组件 `<WordpackSelector />` 和 hook `useWordpack(level, opts)`，返回 `{ words: WordItem[], loading, error }`。
2. 默认 `level = 'HSK1'`；MVP 期不暴露错题集 / 自定义词包 / 多词包合并选项（移入 backlog）。
3. `WordItem` 字段：`hanzi / pinyin / translations(zh/en/vi/th/id) / hsk / audioUrl?`，不含释义扩展。
4. 词包数据通过 `GET /api/wordpacks/:level`（API 路由由本 story 提供）；失败时返回兜底 200 词内置静态包。
5. 缓存：浏览器 IndexedDB（`localforage`）+ HTTP `Cache-Control: public, max-age=86400`。
6. 提供 `getRandomBatch(words, n, seed?)` 工具函数，用于游戏每关随机抽词；同 seed 抽样确定性。
7. 组件不渲染任何与奖励 / 经济相关的 UI；不调用任何经济 API。
8. 单元测试覆盖：随机抽样无重复、缓存命中、错误兜底。

## Tasks / Subtasks

- [ ] **API 路由**（AC: 1,4）
  - [ ] `apps/api/src/routes/wordpacks.ts`：从 `packages/db` 读取 `wordpacks` 表（HSK 已在 E07）
  - [ ] 兜底 200 词 JSON：`packages/i18n/wordpacks/hsk1.fallback.json`
- [ ] **共享包**（AC: 1,2,3,6）
  - [ ] `packages/games-shared/src/wordpack/`：`useWordpack.ts` / `WordpackSelector.tsx` / `types.ts` / `random.ts`
  - [ ] 类型导出 `WordItem`
- [ ] **缓存**（AC: 5）
  - [ ] `localforage` 包装：`getCached / setCached`，TTL 24h
- [ ] **i18n**（AC: 3）
  - [ ] WordItem 翻译走通
- [ ] **测试**（AC: 8）
  - [ ] vitest：随机抽样 / 缓存 / 兜底

## Dev Notes

### 关键约束
- MVP 期 12 款游戏统一使用 `level = 'HSK1'`，不暴露 UI 切换选项（隐藏组件，仅 hook 使用）。
- 词库源头由 E07 学习引擎维护；本 story 仅做消费侧。
- `getRandomBatch` 必须支持 seed，便于 e2e 测试断言。

### Project Structure Notes
- `packages/games-shared/src/wordpack/*`
- `apps/api/src/routes/wordpacks.ts`
- `packages/i18n/wordpacks/hsk1.fallback.json`

### References
- [Source: planning/epics/10-games.md#ZY-10-A2]
- [Source: planning/spec/11-game-engine.md]
- [Source: planning/prds/04-games/00-index.md]

### 测试标准
- 单元：抽样 / 缓存 / 兜底
- 集成：API → hook → 组件
- e2e：游戏开局可拉到词

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
