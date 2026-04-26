# Sprint S09 · 游戏引擎共享层

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/09-game-engine.md](../epics/09-game-engine.md) · 阶段：M3 · 周期：W12-W15 · 优先级：P0
> Story 数：11 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
4 周：`@zhiyu/game` 包；Engine + PixiRenderer + SceneManager + AssetLoader + Keyboard / Touch Input + AudioManager + PhysicsWorld + WordPack + 横屏全屏 + 排行榜与 game_runs。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W12 | D1-D2 | ZY-09-01 skeleton | tick 单测 |
| W12 | D2-D4 | ZY-09-02 PixiRenderer | DPR / 降级 / 60FPS |
| W12 | D4-D5 | ZY-09-03 SceneManager | push/pop/replace + transition |
| W13 | D6-D7 | ZY-09-04 AssetLoader | 进度 + 错误聚合 |
| W13 | D7-D8 | ZY-09-05 keyboard | isDown/wasJustDown 单测 |
| W13 | D8-D10 | ZY-09-05v1 touch | 5 手势识别 ≥ 95% |
| W14 | D11-D12 | ZY-09-06 audio | 三 group + iOS unlock |
| W14 | D12-D14 | ZY-09-07 physics | 200 body 60FPS |
| W14 | D14-D15 | ZY-09-08 wordpack+pinyin | 500 字 ≤ 100ms |
| W15 | D16-D17 | ZY-09-09 fullscreen | safe area 注入 |
| W15 | D17-D20 | ZY-09-10 leaderboard | 三 scope + realtime |

## 依赖与并行
- 依赖 S01 / S02
- 下游：S10

## 退出标准
- 三示例 scene 互转
- 60 FPS 中等强度场景

## 风险
- Pixi v8 alpha：锁版本
- iOS Safari WebAudio：unlock 流程
