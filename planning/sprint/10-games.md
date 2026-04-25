# Sprint S10 · 游戏专区（12 款）

> Epic：[E10](../epics/10-games.md) · 阶段：M4（v1=5 款）/ M+3-M+4（v1.5=3 款 + IAP）/ M+8-M+10（v2=4 款）
> Story 数：19 · 优先级：P0/P1/P2 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-10)

## Sprint 目标
分三批交付 12 款 H5 横屏游戏 + 通用能力（中心 / 词包 / 排行榜 / 教学 / 横屏 / IAP）。

---

## 阶段一：M4 · v1 上线（W21-W26，6 周）

| 序 | Story Key | 估 | 周次 |
|:-:|---|:-:|:-:|
| - | 10-6-games-hub-entry · 游戏中心 | M | W21 |
| - | 10-7-wordpack-selector · 词包选择器 | M | W21 |
| - | 10-9-game-tutorial · 教学引导 | M | W21 |
| - | 10-10-landscape-desktop-adapt · 横屏 / 桌面适配 | M | W21 |
| - | 10-18-coming-soon-cards · 7 款占位卡片 | S | W21 |
| 1 | 10-2-tone-bubbles · 声调泡泡 | M | W22 |
| 2 | 10-5-memory-match · 翻牌记忆 | M | W22 |
| 3 | 10-3-whack-hanzi · 打地鼠 | M | W23 |
| 4 | 10-1-pinyin-shooter · 拼音射击 | L | W23-W24 |
| 5 | 10-4-hanzi-match3 · 汉字消消乐 | L | W25-W26 |
| - | 10-8-leaderboard · 排行榜 | M | W26 |

**v1 退出标准**：5 款可玩 + 12 卡 + 排行榜 + 教学 + 横屏 + 60fps 中端 Android

---

## 阶段二：v1.5（M+3 → M+4，6 周）

| 序 | Story Key | 估 |
|:-:|---|:-:|
| 6 | 10-11-hanzi-ninja · 汉字忍者 | L |
| 7 | 10-12-hanzi-tetris · 汉字俄罗斯方块 | L |
| 8 | 10-13-pinyin-defense · 拼音塔防 | L |
| - | 10-19-game-iap · 游戏内购 | M |

**v1.5 退出标准**：8 款可玩 + 内购可用（道具 / 复活 / 解锁）

---

## 阶段三：v2（M+8 → M+10，12 周）

| 序 | Story Key | 估 |
|:-:|---|:-:|
| 9 | 10-14-hanzi-snake · 汉字贪吃蛇 | M |
| 10 | 10-15-hanzi-rhythm · 汉字节奏 | L |
| 11 | 10-16-hanzi-runner · 汉字跑酷 | L |
| 12 | 10-17-hanzi-slingshot · 汉字弹弓 | M |

**v2 退出标准**：12 款全部可玩 + 排行榜联通

---

## 通用能力（W21 优先完成，覆盖 v1 + v1.5 + v2）
- 三星评级、HMAC 防作弊、错题入 SRS、知语币奖励
- 排行榜（日 / 周 / 全时；全球 / 国家 / 好友）
- 教学引导、强制横屏、桌面键鼠映射

## 风险

| 风险 | 缓解 |
|---|---|
| 12 款并行需引擎稳定 | 严格依赖 S09 完成 |
| 难度曲线 | 真人测试 30+ 用户 / 游戏 |
| v2 节奏 / 跑酷资源量大 | 提前 6 周备 sprite + 音效 |
| 游戏作弊 | HMAC 签名 + 服务端校验 + 异常分布检测 |

## DoD（v1）
- [ ] 11 stories 完成（10-1~5 + 10-6~10 + 10-18）
- [ ] 5 款游戏 60fps 中端达标
- [ ] coming_soon 卡片可订阅上线提醒
- [ ] retrospective 完成

## DoD（v1.5）
- [ ] 4 stories 完成（10-11/12/13/19）
- [ ] 内购联通经济 / 支付链路

## DoD（v2）
- [ ] 4 stories 完成（10-14/15/16/17）
- [ ] 12 款排行榜统一展示
