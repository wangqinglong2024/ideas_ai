# Story 10.A1: 游戏中心入口 `/games`

Status: ready-for-dev

## Story

作为 **学习者**，
我希望 **在 `/games` 看到 12 款游戏的入口卡片并直接点击进入**，
以便 **不被"敬请期待"占位干扰，开箱即玩**。

## Acceptance Criteria

1. 路由 `/games` 渲染 12 张游戏卡片，**全部可点击**，**严禁出现 `coming_soon` 状态**。
2. 每卡片含：游戏图标 / 名称 / 简介 / 类型标签 / 推荐角标（可选）；不显示星数 / 排行 / 奖励。
3. 推荐排序：当前 HSK 等级匹配优先（默认 HSK1），其次按 `recommend_weight` 降序，最后按代号升序。
4. 桌面：4 列网格 16:9；移动：2 列，竖屏点击触发 A3 横屏强制。
5. 列表数据来自前端静态注册表（`apps/web/src/games/registry.ts`），不依赖远端 API（MVP 阶段）。
6. 4 语 i18n key 全部就位（`games.<id>.title` / `games.<id>.summary`）。
7. 列表 LCP < 1.5s（移动端 4G）；交互 INP < 200ms。
8. 不调用经济 / 奖励 / 排行榜任何 API。

## Tasks / Subtasks

- [ ] **游戏注册表**（AC: 1,2,5）
  - [ ] 新建 `apps/web/src/games/registry.ts`，导出 12 款元数据数组
  - [ ] 每项含 `id / slug / titleKey / summaryKey / icon / type / hskTags / recommendWeight / route`
- [ ] **`/games` 页面**（AC: 1,2,3,4）
  - [ ] `apps/web/src/app/games/page.tsx`
  - [ ] 排序逻辑：HSK 匹配 → recommendWeight desc → id asc
  - [ ] 响应式 grid：`grid-cols-2 md:grid-cols-3 lg:grid-cols-4`
- [ ] **GameCard 组件**（AC: 2,4）
  - [ ] `apps/web/src/components/games/GameCard.tsx`
  - [ ] 严格无奖励 / 星级 / 排行 UI
- [ ] **i18n key**（AC: 6）
  - [ ] `packages/i18n/locales/{zh,en,vi,th,id}/games.json`：12 款 title + summary
- [ ] **性能**（AC: 7）
  - [ ] 图标 SVG sprite 内联 / 字体子集
  - [ ] 列表卡片懒渲染 + `priority` 仅前 4 张
- [ ] **回归断言**（AC: 1,8）
  - [ ] e2e：`/games` 12 卡可点 → 进入对应路由
  - [ ] 单元：注册表无 `coming_soon` 字段断言

## Dev Notes

### 关键约束
- 卡片严禁渲染奖励 / 知语币 / 排行 / 三星图标（与 E10 经济解耦原则一致）。
- 所有跳转必须是真实路由（如 `/games/pinyin-shooter`），不允许 disabled 卡。
- HSK 匹配：从用户 profile（E03）读取当前等级；未登录默认 HSK1。

### Project Structure Notes
- `apps/web/src/games/registry.ts`
- `apps/web/src/app/games/page.tsx`
- `apps/web/src/components/games/GameCard.tsx`
- `packages/i18n/locales/*/games.json`

### References
- [Source: planning/epics/10-games.md#ZY-10-A1]
- [Source: planning/sprint/10-games.md]
- [Source: planning/prds/04-games/00-index.md]
- [Source: planning/spec/11-game-engine.md]

### 测试标准
- 单元：注册表完整性（12 项、无 coming_soon、字段齐）
- e2e：列表渲染 + 点击跳转 + i18n 切换
- 性能：Lighthouse mobile 4G LCP < 1.5s

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
