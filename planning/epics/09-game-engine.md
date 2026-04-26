# Epic E09 · 游戏引擎共享层（Game Engine）

> 阶段：M3 · 优先级：P0
> 估算：MVP 子集 2 周（W15-W16）+ V1 增强 2 周（W17-W18）
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)；与 E10 一致采用 MVP 优先；**60s 单局 / 无关卡 / 无奖励**。

## 摘要
PixiJS v8 + Matter + Howler 共享引擎包。先交付足以驱动 G1-G12 十二款 MVP 游戏的最小子集，再迭代到完整能力。

> engine `Round` 默认 `durationMs = 60_000`，提供统一的 **60s 倒计时 + 「再玩一局」状态机**，**不**提供 Victory / NextLevel 场景。

## 范围
- `packages/game-engine`（MVP 子集 → V1 完整）
- 强制横屏 / 输入抽象 / 资源加载 / 共享 UI
- 词包加载与抽词
- 排行榜 / 分析埋点（埋点写入自建 `events` 表，**不**走 PostHog）
- 引擎 demo 游戏

## MVP / V1 切分

### MVP 子集（W15-W16，必须满足 G1-G5 MVP 上线）
- ZY-09-01 packages 骨架
- ZY-09-02 PixiJS Application 封装
- ZY-09-03 SceneManager（仅 Loading / Game / GameOver 三场景）
- ZY-09-04 AssetLoader（图 / 音 基础）
- ZY-09-05-MVP InputManager（仅键盘 + 屏幕拼音键盘）
- ZY-09-09 强制横屏 + 全屏 API

### V1 增强（W17-W18）
- ZY-09-05-V1 InputManager（触屏 / 多指 / 虚拟摇杆）
- ZY-09-06 AudioManager 完整（BGM / SFX / Word）
- ZY-09-07 PhysicsWorld（Matter）
- ZY-09-08 WordPackLoader + PinyinRenderer（BitmapFont 子集）
- ZY-09-10 GameAnalytics（写 `events`） + 排行榜 API

## Stories

### ZY-09-01 · 骨架（MVP）
**AC**：包结构按 spec/11 §3；入口导出；tsup build；容器内 `pnpm --filter @zhiyu/game-engine build` 通。
**估**：M

### ZY-09-02 · PixiJS Application 封装（MVP）
**AC**：初始化 + canvas 挂载；letterbox resize；DPR + antialias；destroy 清理。
**估**：M

### ZY-09-03 · SceneManager（MVP 子集）
**AC**：push / pop / replace；MVP 仅 Loading / Game / GameOver；**无** Victory / NextLevel。V1 期可补 Pause。
**估**：M

### ZY-09-04 · AssetLoader（MVP）
**AC**：图 / 音；进度回调；失败重试；cache。V1 期补 Atlas / BitmapFont。
**估**：M

### ZY-09-05-MVP · InputManager（MVP 子集）
**AC**：键盘 typed/tap；屏幕拼音键盘组件。
**估**：S

### ZY-09-05-V1 · InputManager（V1）
**AC**：触屏 tap / drag / swipe / pinch；虚拟摇杆；多指；设备自动检测。
**估**：M

### ZY-09-06 · AudioManager（V1）
**AC**：Howler；BGM / SFX / Word audio 分类音量；静音；淡入淡出。
**估**：M

### ZY-09-07 · PhysicsWorld（V1）
**AC**：Matter world + step；Pixi 同步位置；调试渲染（dev）。
**估**：M

### ZY-09-08 · WordPackLoader + PinyinRenderer（V1）
**AC**：远程加载词包（来源：`/api/v1/wordpacks/:id`）；BitmapFont 子集生成；拼音 / 声调色彩。
**估**：L

### ZY-09-09 · 强制横屏 + 全屏 API（MVP）
**AC**：检测竖屏 → 提示；iOS 提示手动旋转；全屏 API + 退出。
**Tech**：ux/13
**估**：M

### ZY-09-10 · GameAnalytics（自建 events 表） + 排行榜 API
**AC**
- 埋点 hook 写入 BE `/api/v1/_telemetry/event`，落 `zhiyu.events(ts, user_id, name, props jsonb)`
- 排行榜 API `/api/v1/games/:slug/leaderboard?range=daily|weekly|all`，从 `game_runs` 表聚合
- **禁用 PostHog SaaS**
**估**：M

## DoD

### MVP（W16 末）
- [ ] 09-01/02/03/04/05-MVP/09 完成
- [ ] G1-G5 MVP 可基于引擎 MVP 起步开发

### V1（W18 末）
- [ ] 全部 stories 完成
- [ ] demo 游戏 60fps 中端机
- [ ] 接口稳定 → S10 全部 12 游戏复用
- [ ] 测试覆盖 ≥ 70%（vitest 在容器内跑）
