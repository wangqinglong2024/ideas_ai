# Story 10 索引 · 游戏专区（Games · 12 款一次性首发 · MVP）

> Epic：[E10 Games](../../epics/10-games.md) · Sprint：[S10](../../sprint/10-games.md) · 阶段：M3

## A · 通用基础设施（3）

| Story | 标题 | 估 | 状态 |
|---|---|:-:|---|
| [10-a1](./10-a1-games-hub-entry.md) | 游戏中心入口 | S | ready-for-dev |
| [10-a2](./10-a2-wordpack-selector.md) | 词包选择器 | S | ready-for-dev |
| [10-a3](./10-a3-landscape-force.md) | 横屏强制 + 桌面 16:9 | S | ready-for-dev |

## B · 12 款游戏 MVP

| Story | 标题 | 估 | 状态 |
|---|---|:-:|---|
| [10-g1](./10-g1-pinyin-shooter.md) | 拼音射击 MVP | M | ready-for-dev |
| [10-g2](./10-g2-tone-bubbles.md) | 声调泡泡 MVP | S | ready-for-dev |
| [10-g3](./10-g3-whack-hanzi.md) | 打地鼠 MVP | S | ready-for-dev |
| [10-g4](./10-g4-hanzi-match3.md) | 汉字消消乐 MVP | M | ready-for-dev |
| [10-g5](./10-g5-memory-match.md) | 翻牌记忆 MVP | S | ready-for-dev |
| [10-g6](./10-g6-hanzi-ninja.md) | 汉字忍者 MVP | M | ready-for-dev |
| [10-g7](./10-g7-hanzi-tetris.md) | 汉字俄罗斯方块 MVP | M | ready-for-dev |
| [10-g8](./10-g8-pinyin-defense.md) | 拼音塔防 MVP | L | ready-for-dev |
| [10-g9](./10-g9-hanzi-snake.md) | 汉字贪吃蛇 MVP | M | ready-for-dev |
| [10-g10](./10-g10-hanzi-rhythm.md) | 汉字节奏 MVP | M | ready-for-dev |
| [10-g11](./10-g11-hanzi-runner.md) | 汉字跑酷 MVP | M | ready-for-dev |
| [10-g12](./10-g12-hanzi-slingshot.md) | 汉字弹弓 MVP | M | ready-for-dev |

## 全局 MVP 约束（所有 12 款必须遵守）
- 玩法：1 难度 / 1 词包（默认 HSK1）/ 60s 单局或 5 关
- 结算：得分 + 用时 + "再玩" + 错题列表
- 错题：通关后批量推 SRS（GM-FR-005 最小子集）
- 横屏强制：竖屏遮罩 + 桌面 16:9 画布（GM-FR-002）
- 性能：60fps 中端 Android
- i18n：4 语 UI key 就位
- **明确排除**：奖励 / 知语币 / 三星 / 排行榜 / 教学 / IAP / 复活 / 自定义词包 / 分享 / 防作弊（HMAC）/ `coming_soon` 占位

## DoD
- A1/A2/A3 + G1-G12 全部 done
- `/games` 列表 12 卡全部可玩，无 `coming_soon`
- 不调用经济 / 奖励 API
- 性能验收通过
- 排行榜 / 三星 / 奖励 / 教学 / IAP / 分享 100% 迁入 `99-post-mvp-backlog.md`
