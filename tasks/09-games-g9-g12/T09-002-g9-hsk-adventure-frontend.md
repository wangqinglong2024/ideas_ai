# T09-002: G9 HSK 大冒险 — Phaser 游戏前端

> 分类: 09-游戏 G9-G12 (Games G9-G12)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 20+

## 需求摘要

实现 G9 HSK 大冒险的 Phaser 3 前端游戏场景。包括像素风（16-bit）中国城市主题地图探索（5 层场景 Tilemap + 角色移动 + 遭遇触发）、横版回合制战斗画面（左方角色 vs 右方怪物，HP 条 + 题目区 + 选项区 + 攻击/受伤动画 + 伤害数字飘出）、角色信息面板（等级/经验条/属性/技能树）、装备界面（三槽位 + 背包列表 + 属性预览）、Boss 战多阶段视觉表现（阶段切换特效、狂暴警告）、多人 Boss 战玩家列表 + 伤害统计、竞技场 PK 双人对阵布局。场景封装为独立 Phaser Scene，通过 T06-010 游戏通用框架容器加载。强制横屏 1920×1080，像素风 + 中国风视觉。

## 相关上下文

- 产品需求: `product/apps/08-games-g9-g12/01-g9-hsk-adventure.md` — G9 完整 PRD（**核心依据**）
  - §二 战斗画面布局（左右对阵、HP 条、题目区、选项区）
  - §三 核心交互（地图移动、遇敌动画、战斗答题、掉落展示、角色成长）
  - §四 角色养成界面（属性面板、技能树、装备界面）
  - §五 Boss 战特殊视觉（多阶段切换特效）
  - §六 竞技场布局
  - §七 验收标准 G9-AC01 ~ G9-AC10
- 游戏设计: `game/09-hsk-adventure.md`
  - §四 视觉与交互（像素风中国城市场景、横版战斗布局）
  - §四.2 横屏布局（角色 HP/等级 + 怪物 HP/名称 + 题目区 + 选项区）
  - §二.3 地图与怪物（校园/街市/都市/学府/巅峰 5 层主题）
  - §二.4 角色系统（等级/HP/攻击/防御/技能）
  - §二.5 装备系统（武器笔/防具袍/饰品徽章 + 换装视觉）
  - §六 皮肤系统（角色外观/武器外观/攻击特效/宠物）
- 通用 HUD: `product/apps/05-game-common/08-hud-landscape.md` — 暂停按钮、声音控制、横屏切换
- 前端规范: `grules/01-rules.md` §一 — Cosmic Refraction 设计系统（色彩铁律）
- UI 规范: `grules/06-ui-design.md` — 动效铁律
- 编码规范: `grules/05-coding-standards.md` §二 — React/TS 组件规范
- 关联任务: T09-001（G9 后端）→ 本任务 | T06-010（Phaser 容器框架）→ 本任务

## 技术方案

### Phaser 3 场景架构

```
G9HSKAdventure/
├── BootScene.ts                # 资源预加载（Tilemap、角色/怪物像素图、音效、UI 素材）
├── MapScene.ts                 # 地图探索主场景
│   ├── TileMapManager.ts       # 像素地图层管理（5 层主题 Tilemap 切换）
│   ├── PlayerSprite.ts         # 玩家像素角色（移动动画、换装显示）
│   ├── MonsterSpawner.ts       # 怪物生成与遭遇触发（碰撞检测 → 战斗转场）
│   ├── MapHUD.ts               # 地图 HUD（层数、楼层、体力条、金币）
│   └── ExploreEventManager.ts  # 探索事件管理（遭遇/宝箱/空事件概率分配）
├── BattleScene.ts              # 核心战斗场景
│   ├── BattleArena.ts          # 战斗舞台布局（左右对阵背景）
│   ├── CharacterBattle.ts      # 角色战斗 Sprite（攻击动画、受伤动画、技能特效）
│   ├── MonsterBattle.ts        # 怪物战斗 Sprite（受伤动画、Boss 多阶段变身）
│   ├── HPBar.ts                # HP 条组件（平滑减少动画 + 颜色渐变）
│   ├── QuestionPanel.ts        # 题目面板（题干 + 选项按钮 + 倒计时）
│   ├── DamageNumber.ts         # 伤害数字飘出特效（答对绿色↑ / 答错红色↓）
│   ├── ComboDisplay.ts         # 连击显示（连对特效 + 计数器）
│   ├── BossPhaseOverlay.ts     # Boss 阶段切换全屏特效 + 警告文字
│   └── BattleResultOverlay.ts  # 战斗胜利/失败结算面板（经验 + 金币 + 掉落物展示）
├── CharacterScene.ts           # 角色信息面板（全屏覆盖层）
│   ├── StatsPanel.ts           # 属性面板（等级/经验条/HP/攻击/防御 + 装备加成显示）
│   ├── SkillTreePanel.ts       # 技能树界面（五大题型专精 + 点数分配交互）
│   └── AchievementPanel.ts     # 成就列表
├── EquipmentScene.ts           # 装备界面
│   ├── EquipmentSlots.ts       # 三槽位展示（武器/防具/饰品 + 当前装备信息）
│   ├── InventoryGrid.ts        # 背包网格（拖拽装备 + 稀有度边框颜色）
│   └── EquipmentTooltip.ts     # 装备详情浮层（属性 + 特殊效果 + 对比当前装备）
├── BossBattleScene.ts          # 多人 Boss 战扩展场景
│   ├── TeamHUD.ts              # 队伍成员 HUD（头像 + HP + 伤害贡献条）
│   ├── BossHealthBar.ts        # Boss 大 HP 条（阶段标记线）
│   ├── TurnIndicator.ts        # 轮流答题指示器
│   └── MVPOverlay.ts           # Boss 击败后 MVP 展示
├── ArenaScene.ts               # 竞技场 PK 场景
│   ├── DualPlayerLayout.ts     # 双人对阵布局（左右角色 + 各自 HP）
│   ├── SameQuestionPanel.ts    # 同题答题面板（倒计时 + 先答标记）
│   └── ArenaResultOverlay.ts   # PK 结果面板
├── DailyBossScene.ts           # 每日全服 Boss 展示
└── SkinManager.ts              # 皮肤系统（角色外观/武器外观/攻击特效/宠物可替换）
```

### 核心交互流程

#### 地图探索 → 遭遇战斗

```
1. MapScene 加载 → 渲染像素风 Tilemap（根据 current_map_layer 选择主题）
2. 玩家点击/触摸地图位置 → PlayerSprite 移动动画（A* 寻路）
3. 移动过程中碰撞检测 → MonsterSpawner 触发遭遇概率判定
4. 遭遇触发 → 画面闪烁转场动画 → 切换到 BattleScene
5. BattleScene 初始化 → 左侧角色 + 右侧怪物入场动画
6. 服务端下发第一道题 → QuestionPanel 展示题目和选项
7. 玩家选择答案 → 发送到服务端 → 等待结果
8. 答对 → CharacterBattle 播放攻击动画 → MonsterBattle 受伤 → HPBar 减少 → DamageNumber 飘出
9. 答错 → MonsterBattle 播放攻击动画 → CharacterBattle 受伤 → HPBar 减少 → DamageNumber 飘出
10. 怪物 HP 归零 → 胜利音效 → BattleResultOverlay（经验+金币+掉落）
11. 角色 HP 归零 → 失败音效 → Game Over 面板 → 返回地图（HP 恢复至 50%）
```

#### Boss 战特殊流程

```
1. Boss 入场 → 全屏 Boss 名称 + 震屏特效
2. Boss 多道题 → 每答对一题造成伤害 → HP 条持续减少
3. Boss HP 跌破阶段阈值 → BossPhaseOverlay 全屏闪烁 + "Boss 狂暴！" 警告
4. Boss 击败 → 华丽掉落动画（装备从 Boss 身上飞出）→ 稀有装备必掉展示
```

### 视觉规范

#### 像素风格

| 元素 | 规格 |
|------|------|
| 地图 Tile | 32×32 像素，缩放 ×3 渲染 |
| 角色 Sprite | 48×64 像素，4 方向行走 + 战斗动作帧 |
| 怪物 Sprite | 64×64 ~ 128×128 像素（Boss 更大） |
| 字体 | 像素字体 + 系统中文字体混用 |
| 调色盘 | 限定 32 色中国风调色盘 |

#### 地图层主题

| 层 | 主题 | 视觉元素 |
|----|------|---------|
| 1 | 校园 | 教学楼、操场、图书馆、樱花树 |
| 2 | 街市 | 商铺、牌坊、小吃摊、灯笼 |
| 3 | 都市 | 高楼、地铁站、霓虹灯、现代建筑 |
| 4 | 学府 | 古典书院、竹林、石桥、亭台 |
| 5 | 巅峰 | 云端宫殿、仙鹤、金光、神秘符文 |

#### 战斗布局（1920×1080 基准）

```
┌────────────────────────────────────────────────────┐
│ [Lv.15 书生]  HP ████████░░  180/250   [语法妖] HP ██████░░░░ 51/80  │
│                                                    │
│     🧑‍🎓 (48×64)           ⚔️           👹 (64×64)  │
│  [角色像素图]                          [怪物像素图]  │
│  [装备可视化]                          [怪物动画]    │
│                                                    │
│ ┌────────────────────────────────────────────┐     │
│ │ 听力理解题                                    │     │
│ │ [🔊 播放音频]                                │     │
│ │ 请选择与录音内容最符合的选项：                  │     │
│ │                                              │     │
│ │ [A. 说话人不同意这个观点]  [B. 说话人部分同意]  │     │
│ │ [C. 说话人完全赞成]       [D. 说话人没有表态]  │     │
│ └────────────────────────────────────────────┘     │
│                                                    │
│ [连击 ×3 🔥]           [⏱ 20s]           [💰 1200] │
└────────────────────────────────────────────────────┘
```

### 关键动画

| 动画 | 实现 | 时长 |
|------|------|------|
| 角色攻击 | Sprite 前冲 → 挥笔/剑 → 返回 | 600ms |
| 怪物受伤 | 闪白 2 帧 → 后退抖动 → 复原 | 400ms |
| 怪物攻击 | Sprite 前冲 → 爪击/魔法弹 → 返回 | 600ms |
| 角色受伤 | 闪红 2 帧 → 后退抖动 | 400ms |
| 伤害数字飘出 | 数字从命中点上升 + 淡出 | 800ms |
| HP 条减少 | Tween 线性减少 + 颜色渐变（绿→黄→红） | 500ms |
| 掉落物展示 | 物品从怪物位置弹出 → 落到背包图标 | 1000ms |
| Boss 阶段切换 | 全屏白闪 → 震屏 → Boss 变色/变大 | 1500ms |
| 升级特效 | 金色光柱包围角色 → "Level Up!" 文字弹出 | 1200ms |

## 范围（做什么）

- 实现 BootScene 资源预加载（Tilemap JSON + Spritesheet + 音效 + UI 素材）
- 实现 MapScene 地图探索（5 层主题 Tilemap 渲染 + 角色移动 + 遭遇触发转场）
- 实现 BattleScene 战斗场景（左右对阵布局 + HP 条 + 题目面板 + 攻击/受伤动画 + 伤害数字）
- 实现 QuestionPanel 五大题型展示（听力播放按钮 + 阅读长文 + 选项按钮 + 倒计时）
- 实现 BattleResultOverlay 战斗结算（经验 + 金币 + 掉落物 + 升级动画）
- 实现 CharacterScene 角色面板（属性 + 技能树分配交互 + 成就）
- 实现 EquipmentScene 装备界面（三槽位 + 背包 + 详情浮层 + 穿戴/卸下交互）
- 实现 BossBattleScene 多人 Boss 战（队伍 HUD + Boss HP + 轮流指示 + MVP）
- 实现 ArenaScene 竞技场 PK（双人对阵 + 同题面板 + 结果面板）
- 实现 Boss 阶段切换特效和视觉表现
- 实现皮肤系统预留（角色/武器/特效/宠物 Sprite 可替换）
- 对接 T09-001 后端所有 API 和 WebSocket
- 音效集成（攻击/受伤/胜利/失败/Boss/升级/掉落）

## 边界（不做什么）

- 不写后端游戏逻辑（T09-001 已完成）
- 不写匹配 UI（T06-009 已完成）
- 不写结算页面（T06-011 已完成）
- 不制作像素素材（使用临时占位图或开源像素素材包）
- 不制作音效文件（使用占位音效或 CC0 音效库）
- 不实现皮肤商店 UI（T06-012 已完成）
- 不实现社交/聊天功能

## 涉及文件

- 新建: `frontend/src/games/g9-hsk-adventure/BootScene.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/MapScene.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/map/TileMapManager.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/map/PlayerSprite.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/map/MonsterSpawner.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/BattleScene.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/BattleArena.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/CharacterBattle.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/MonsterBattle.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/HPBar.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/QuestionPanel.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/DamageNumber.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/BossPhaseOverlay.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/battle/BattleResultOverlay.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/CharacterScene.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/EquipmentScene.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/BossBattleScene.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/ArenaScene.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/SkinManager.ts`
- 新建: `frontend/src/games/g9-hsk-adventure/types.ts`
- 修改: `frontend/src/games/index.ts` — 注册 G9 游戏场景

## 依赖

- 前置: T09-001（G9 后端 API + WebSocket 就绪）
- 前置: T06-010（Phaser 通用容器框架）
- 前置: T06-009（匹配 UI — 多人模式入口）
- 后续: 无（本任务为 G9 最终任务）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 进入 G9 游戏  
   **WHEN** 地图场景加载  
   **THEN** 像素风 Tilemap 正确渲染（根据角色当前层选择主题），角色 Sprite 显示在正确位置

2. **GIVEN** 地图场景中  
   **WHEN** 点击/触摸地图某位置  
   **THEN** 角色平滑移动到目标位置，移动过程可能触发遭遇事件

3. **GIVEN** 触发遭遇事件  
   **WHEN** 遭遇怪物  
   **THEN** 画面闪烁转场 → 战斗场景：左侧角色 + HP 条 + 等级，右侧怪物 + HP 条 + 名称，中下部题目区

4. **GIVEN** 战斗场景中  
   **WHEN** 正确回答题目  
   **THEN** 角色播放攻击动画 → 怪物受伤闪白 → HP 条平滑减少 → 绿色伤害数字飘出

5. **GIVEN** 战斗场景中  
   **WHEN** 回答错误  
   **THEN** 怪物播放攻击动画 → 角色受伤闪红 → 角色 HP 条减少 → 红色伤害数字飘出

6. **GIVEN** 怪物 HP 归零  
   **WHEN** 战斗胜利  
   **THEN** 怪物消散动画 → BattleResultOverlay 展示：经验值 + 金币 + 掉落装备（如有）+ 升级特效（如有）

7. **GIVEN** 角色信息面板打开  
   **WHEN** 查看技能树  
   **THEN** 五大题型专精图标正确展示，可分配技能点时高亮可点击，分配后实时刷新数值

8. **GIVEN** 装备界面打开  
   **WHEN** 从背包拖拽装备到槽位  
   **THEN** 装备穿戴成功，属性预览对比展示，角色 Sprite 换装变化（如武器变化）

9. **GIVEN** Boss 战斗中，Boss HP 降至阶段阈值  
   **WHEN** 触发阶段切换  
   **THEN** 全屏白闪 + 震屏 + "Boss 狂暴！" 警告文字 + Boss Sprite 变色或变大

10. **GIVEN** 多人 Boss 战  
    **WHEN** 队伍成员轮流答题  
    **THEN** TeamHUD 显示当前答题者高亮，其他人灰色等待，Boss HP 条实时更新

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=30 frontend` — 前端构建成功
4. Browser MCP 导航到 G9 游戏入口
5. 验证地图场景渲染（像素风 Tilemap + 角色 Sprite）
6. 操作角色移动 → 触发遭遇 → 进入战斗场景
7. 验证战斗 UI 布局（左右对阵 + HP 条 + 题目面板）
8. 验证答对/答错动画流程
9. 验证 Boss 战多阶段视觉
10. 验证装备界面穿戴交互
11. 验证多人 Boss 战 WebSocket 实时同步
12. 截图记录关键场景

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] Phaser 场景正确加载，无 JS 报错
- [ ] 地图 Tilemap 渲染正确，角色移动流畅
- [ ] 战斗场景 UI 布局完整（HP 条 + 题目 + 选项 + 动画）
- [ ] 五大题型面板均正常展示（含听力播放按钮）
- [ ] 攻击/受伤/掉落/升级动画流畅，≥ 30fps
- [ ] Boss 阶段切换特效触发正确
- [ ] 装备穿戴/卸下交互正常
- [ ] 横屏 1920×1080 基准布局正确
- [ ] 移动端 H5 横屏自适应
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

> 任务完成后，必须在 `/tasks/result/09-games-g9-g12/` 下创建同名结果文件

结果文件路径: `/tasks/result/09-games-g9-g12/T09-002-g9-hsk-adventure-frontend.md`

## 自检重点

- [ ] 性能: Phaser Tilemap 渲染 + 角色移动 ≥ 30fps（移动端）
- [ ] 性能: 战斗动画帧率稳定，无卡顿
- [ ] 性能: 资源预加载完整，无运行时加载闪烁
- [ ] UI: 横屏布局 1920×1080，ScaleManager 自适应
- [ ] UI: 题目面板文字不溢出，长文阅读有滚动
- [ ] UI: HP 条颜色渐变（绿→黄→红）平滑过渡
- [ ] UI: 装备稀有度边框颜色（白/绿/蓝/紫/金）正确
- [ ] 交互: 地图移动触控响应 < 100ms
- [ ] 交互: 选项按钮点击区域足够大（移动端友好）
- [ ] 音效: 攻击/受伤/胜利/失败/升级音效正确触发
- [ ] 皮肤: SkinManager 预留 Sprite 替换接口
