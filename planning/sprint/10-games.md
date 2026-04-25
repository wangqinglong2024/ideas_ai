# Sprint S10 · 游戏专区（12 款 · 一次性首发 · MVP 单阶段 · 无限连玩 60s）

> Epic：[E10](../epics/10-games.md) · 阶段：M3 · 优先级：P0
> Story 数：15（A 通用 3 + B 游戏 12）
> 状态：[sprint-status.yaml](./sprint-status.yaml#epic-10)

## Sprint 目标
**12 款 H5 横屏游戏一次性首发上线**，全部 MVP，**不分波次、不切阶段、无 `coming_soon`、不发任何奖励 / 知语币**；**全部游戏遵守同一玩法状态机：60s 单局 · 无限连玩 · 无关卡 / 多波 / 三星**。

## 排期总览

> 不分波次。3-4 周内 12 款全部交付，统一上线。

| 周 | 内容 |
|:---:|---|
| W21 | A1/A2/A3 通用基础设施 + G2/G3/G5（小估算 3 款）启动 |
| W22 | G1/G4/G6/G7/G9/G11 中等估算 6 款 |
| W23 | G8/G10/G12 + 收尾 |
| W24 | 联调 / 性能调优 / 上线 |

---

## Story 列表（无优先级波次，统一 MVP）

| 序 | Story Key | 标题 | 估 |
|:-:|---|---|:-:|
| 1 | 10-a1-games-hub-entry | 游戏中心入口 | S |
| 2 | 10-a2-wordpack-selector | 词包选择器 | S |
| 3 | 10-a3-landscape-force | 横屏强制 + 桌面 16:9 | S |
| 4 | 10-g1-pinyin-shooter | 拼音射击 MVP | M |
| 5 | 10-g2-tone-bubbles | 声调泡泡 MVP | S |
| 6 | 10-g3-whack-hanzi | 打地鼠 MVP | S |
| 7 | 10-g4-hanzi-match3 | 汉字消消乐 MVP | M |
| 8 | 10-g5-memory-match | 翻牌记忆 MVP | S |
| 9 | 10-g6-hanzi-ninja | 汉字忍者 MVP | M |
| 10 | 10-g7-hanzi-tetris | 汉字俄罗斯方块 MVP | M |
| 11 | 10-g8-pinyin-defense | 拼音塔防 MVP | L |
| 12 | 10-g9-hanzi-snake | 汉字贪吃蛇 MVP | M |
| 13 | 10-g10-hanzi-rhythm | 汉字节奏 MVP | M |
| 14 | 10-g11-hanzi-runner | 汉字跑酷 MVP | M |
| 15 | 10-g12-hanzi-slingshot | 汉字弹弓 MVP | M |

---

## 风险

| 风险 | 缓解 |
|---|---|
| 12 款并行交付压力 | MVP 严守最小子集；不发奖励彻底解耦经济模块 |
| E09 引擎滞后 | 引擎裁剪到 MVP 子集，复杂度封顶 |
| 需求蔓延（"再加点东西"） | 一律拒收，写入 `99-post-mvp-backlog.md` |
| 性能 60fps | 资源懒加载 + 子集化字体 + Sprite 合图 |

## DoD（一次性达成）

- [ ] A1/A2/A3 + G1-G12 全部 15 stories `done`
- [ ] 全部 12 款游戏遵守 **60s 单局 / 无限连玩 / 无关卡 / 不发奖励**
- [ ] `/games` 列表 12 卡全部可玩，无 `coming_soon`
- [ ] 所有游戏完全不调用经济 / 奖励 API
- [ ] 60fps 中端 Android 验证
- [ ] 排行榜 / 三星 / 奖励 / 教学 / IAP / 分享 等 100% 迁入 `99-post-mvp-backlog.md`
- [ ] retrospective 完成
