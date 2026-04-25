# Sprint S09 · 游戏引擎共享层（Game Engine）

> Epic：[E09](../epics/09-game-engine.md) · 阶段：M3 · 周期：W15-W18 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-9)

## Sprint 目标
PixiJS v8 + Matter + Howler 共享引擎包，为 12 款游戏提供统一接口。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 9-1-game-engine-package-skeleton | packages/game-engine 骨架 | M | S01 1-1 | W15 |
| 2 | 9-2-pixijs-application-wrapper | PixiJS Application 封装 | M | 9-1 | W15 |
| 3 | 9-3-scene-manager | SceneManager + 标准场景 | M | 9-2 | W16 |
| 4 | 9-4-asset-loader | AssetLoader（图/音/Atlas） | M | 9-1 | W16 |
| 5 | 9-5-input-manager | InputManager（键鼠/触屏） | L | 9-2 | W16-W17 |
| 6 | 9-6-audio-manager | AudioManager（Howler） | M | 9-4 | W17 |
| 7 | 9-7-physics-world | PhysicsWorld（Matter） | M | 9-2 | W17 |
| 8 | 9-8-wordpack-pinyin-renderer | WordPack + 拼音 BitmapFont | L | 9-4 | W17-W18 |
| 9 | 9-9-landscape-fullscreen | 强制横屏 + 全屏 API | M | 9-2 | W18 |
| 10 | 9-10-analytics-leaderboard | GameAnalytics + 排行榜 | M | 9-1,S01 1-9 | W18 |

## 风险
- 浏览器 PixiJS WebGL 兼容 → 矩阵测试 (Chrome/Safari/Firefox/Samsung Internet)
- BitmapFont 生成时机 → 预生成 + 增量补充

## DoD
- [ ] demo 游戏（颜色匹配）可玩 60fps 中端机（Snapdragon 6 系）
- [ ] 接口稳定 → 可被 S10 全部 12 游戏复用
- [ ] 测试覆盖 ≥ 70%
- [ ] retrospective 完成
