# Story 9.1: 游戏引擎 package 骨架（@zy/game-engine）

Status: ready-for-dev

## Story

作为 **前端 / 游戏开发者**，
我希望 **建立可被 12 款 MVP 游戏统一引用的 `@zy/game-engine` monorepo 包**，
以便 **共用 PixiJS 渲染器、场景管理、输入、音频、物理、词包等基础能力**。

## Acceptance Criteria

1. 在 `packages/game-engine/` 下创建 npm 包：tsconfig / vite / vitest / package.json。
2. 入口 `src/index.ts` 暴露：`createApp`、`SceneManager`、`AssetLoader`、`InputManager`、`AudioManager`、`PhysicsWorld`、`WordPack`、`PinyinRenderer`、`Round`。
3. 依赖：`pixi.js@^8`、`matter-js`、`howler`、`pinyin-pro`。
4. 构建产物：ESM only，types 自动生成。
5. 在 `apps/mobile` 与 `apps/games-host` 中可 import（pnpm workspace 链接）。
6. 添加 README：包结构、版本约定、12 款游戏使用示例骨架。
7. CI lint / typecheck / test 全绿。
8. **MVP 范围内禁止引入排行榜 / 三星 / 关卡 SDK 模块**（与全局 60s 单局 / 无关卡规则一致）。

## Tasks / Subtasks

- [ ] **包初始化**（AC: 1,3,4,5）
  - [ ] tsconfig / package.json
  - [ ] vite + vitest 配置
- [ ] **入口导出**（AC: 2）
  - [ ] src/index.ts placeholder 后续 story 填充
- [ ] **README**（AC: 6）
- [ ] **CI**（AC: 7）

## Dev Notes

### 关键约束
- 包独立可发布，便于未来抽离。
- 不直接依赖 react-native；引擎纯 web canvas 通过 WebView 嵌入移动端（games-host 应用）。
- 60s 单局 / 无限连玩规则在 9-3 SceneManager 强制；本 story 不放 Round 默认值（在 9-3）。

### 关联后续 stories
- 9-2 ~ 9-10 全部填充本包

### Project Structure Notes
- `packages/game-engine/`
- `apps/games-host/`（webview 容器 app，复用此包）

### References
- `planning/epics/09-game-engine.md` ZY-09-01
- `planning/sprint/09-game-engine.md`

### 测试标准
- 单元：vitest sanity（导出存在）
- 构建：tsup / vite build 通过

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
