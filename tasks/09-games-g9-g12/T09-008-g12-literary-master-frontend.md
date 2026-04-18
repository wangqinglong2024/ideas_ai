# T09-008: G12 文豪争霸 — Phaser 游戏前端

> 分类: 09-游戏 G9-G12 (Games G9-G12)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 22+

## 需求摘要

实现 G12 文豪争霸的 Phaser 3 前端游戏场景。包括宏伟大殿主场景（中国古代科举殿试大殿 + 金色灯光 + 龙柱 + 皇座裁判席）、选手环形排列（16 个头像围绕中央舞台 + 存活高亮/淘汰灰化碎裂）、答题面板（题目 + 选项 + 圆形倒计时 + 难度标识 + 知识领域图标）、淘汰碎裂特效（头像/立牌爆碎 + 碎片飞散 + 灰色粒子）、道具 UI（三个道具按钮 + 使用动画 + 冷却/库存显示）、复活特效（金光复生 + 凤凰环绕）、冠军加冕动画（王冠降落 + 金色粒子爆发 + "文豪" 称号飞入）、知识雷达图（12 维度蛛网图 + 动态更新）、赛季锦标赛对阵图（64 人对阵树形展示）、头衔徽章展示。横屏 1920×1080，中国古典宫殿风格 + 金色主调。

## 相关上下文

- 产品需求: `product/apps/08-games-g9-g12/04-g12-literary-master.md` — G12 完整 PRD（**核心依据**）
  - §二 大殿主舞台布局（选手排列、中央题目区、裁判席）
  - §三 淘汰视觉（碎裂特效、灰化、剩余人数）
  - §四 道具 UI（按钮位置、使用效果展示、冷却指示）
  - §五 冠军加冕动画
  - §六 知识雷达图（12 维度蛛网图）
  - §七 赛季锦标赛对阵图
  - §八 验收标准 G12-AC01 ~ G12-AC12
- 游戏设计: `game/12-literary-master.md`
  - §四 视觉与交互（宫殿风格大殿 + 金色主调 + 科举意象）
  - §四.2 横屏布局（环形选手 + 中央题目 + 道具栏 + 信息栏）
  - §二.4 道具使用交互（提示排除、加时动画、复活特效）
  - §六 皮肤系统（大殿主题/选手服装/淘汰特效/加冕特效/座椅）
- 通用 HUD: `product/apps/05-game-common/08-hud-landscape.md`
- UI 规范: `grules/06-ui-design.md`
- 编码规范: `grules/05-coding-standards.md` §二
- 关联任务: T09-007（G12 后端）→ 本任务 | T06-010（Phaser 容器框架）→ 本任务

## 技术方案

### Phaser 3 场景架构

```
G12LiteraryMaster/
├── BootScene.ts                # 资源预加载（大殿背景、选手头像框、道具图标、特效粒子、音效）
├── HallScene.ts                # 核心大殿主场景
│   ├── HallBackground.ts       # 宫殿大殿背景（龙柱 + 灯光 + 皇座 + 匾额）
│   ├── PlayerRing.ts           # 选手环形排列管理器
│   │   ├── PlayerAvatar.ts     # 单个选手头像（头像 + 头衔徽章 + HP/状态指示）
│   │   └── EliminationEffect.ts # 淘汰碎裂特效（爆碎粒子 + 灰色化）
│   ├── CenterStage.ts          # 中央舞台（题目展示区域 + 灯光聚焦）
│   ├── QuestionPanel.ts        # 题目面板
│   │   ├── QuestionText.ts     # 题干文字（含媒体：图片/音频）
│   │   ├── OptionsGrid.ts      # 选项网格（2×2 或 4×1 布局 + 点击反馈）
│   │   ├── TimerCircle.ts      # 圆形倒计时（描边动画 + 颜色渐变 + 数字）
│   │   ├── DifficultyBadge.ts  # 难度标识（星级 + 颜色）
│   │   └── DomainIcon.ts       # 知识领域图标（12 种图标对应 12 领域）
│   ├── ItemBar.ts              # 道具栏
│   │   ├── ItemButton.ts       # 单个道具按钮（图标 + 剩余数量 + 冷却遮罩）
│   │   ├── HintEffect.ts       # 提示道具效果（错误选项灰化 + 划线）
│   │   ├── TimeExtendEffect.ts # 加时效果（倒计时回退 + 绿色光圈）
│   │   └── RevivalEffect.ts    # 复活特效（金光柱 + 凤凰环绕 + 头像复原）
│   ├── SurvivalInfo.ts         # 存活信息（剩余人数 / 当前轮次 / 我的排名）
│   ├── EliminationOverlay.ts   # 被淘汰覆盖层（"你被淘汰了" + 最终名次 + 观战选项）
│   └── ChampionCeremony.ts     # 冠军加冕典礼
│       ├── CrownDrop.ts        # 王冠从天而降动画
│       ├── GoldenParticles.ts  # 金色粒子爆发
│       ├── TitleFlyIn.ts       # 头衔飞入动画（"文豪" / "圣贤"）
│       └── RankingScroll.ts    # 最终排名卷轴展开
├── RadarScene.ts               # 知识雷达图（个人中心覆盖层）
│   ├── RadarChart.ts           # 12 维度蛛网图（Canvas 2D 绘制）
│   ├── DomainDetail.ts         # 单维度详情（点击维度 → 展开掌握度 + 弱项提示）
│   └── RadarAnimation.ts       # 雷达更新动画（数据变化时平滑过渡）
├── TournamentScene.ts          # 赛季锦标赛
│   ├── BracketTree.ts          # 64 人对阵树形图（可缩放 + 平移）
│   ├── MatchCard.ts            # 单场对局卡片（双方头像 + 比分 + 状态）
│   └── SeasonInfo.ts           # 赛季信息（名称 + 倒计时 + 我的排名）
├── ProfileScene.ts             # 个人档案
│   ├── TitleBadge.ts           # 头衔徽章大展示（6 种头衔独特样式）
│   ├── StatsPanel.ts           # 统计面板（胜场/最佳名次/最长存活）
│   └── ItemInventory.ts        # 道具库存展示
├── DailyScene.ts               # 每日挑战入口
└── SkinManager.ts              # 皮肤系统（大殿主题/服装/特效/座椅可替换）
```

### 核心交互流程

#### 大逃杀淘汰主流程

```
1. HallScene 加载 → 宏伟大殿渲染（龙柱灯光亮起 + 匾额显现）
2. PlayerRing 16 个选手头像入场动画（依次从殿门走入 + 环形就位）
3. CenterStage 聚光灯亮起 → "比赛开始！" 全屏文字
4. QuestionPanel 第一题入场 → 题干 + 选项 + 圆形倒计时开始
5. DomainIcon 展示知识领域 + DifficultyBadge 展示难度
6. 玩家点击选项 → 选项高亮 → 发送答案到服务端
7. 结算：
   a. 答对 → 选项变绿 ✓ + 分数跳动增加
   b. 答错 → 选项变红 ✗ + 震屏 → 淘汰判定
8. 淘汰动画：被淘汰者头像爆碎飞散 → 灰色粒子 → 位置空出
9. 复活币使用：金光柱升起 → 凤凰环绕 → 头像复原 → 继续比赛
10. 新一轮开始 → TimerCircle 时间缩短（20s→15s→12s→10s）→ 题目难度提升
11. 最后 2 人 → 决战氛围加强（灯光变红 + 鼓声加速）
12. 最终胜者 → ChampionCeremony：王冠降落 → 金色粒子 → 头衔飞入 → 排名卷轴
```

#### 道具使用交互

```
1. ItemBar 显示 3 个道具按钮（提示 ×2 / 加时 ×1 / 复活币 ×1）
2. 答题中点击"提示" → 2 个错误选项灰化 + 划线 → 剩余数量 -1
3. 答题中点击"加时" → TimerCircle 回退 +10 秒 → 绿色光圈闪烁 → 剩余数量 -1
4. 被淘汰弹窗出现 → "使用复活币？" 按钮 → 点击 → RevivalEffect 特效 → 复活
5. 道具用完 → 按钮灰色 + 锁定图标
```

### 视觉规范

#### 大殿风格

| 元素 | 描述 |
|------|------|
| 主背景 | 中国古代殿试大殿（紫禁城太和殿风格） |
| 龙柱 | 殿内两侧金色盘龙柱 |
| 皇座 | 顶部中央裁判/主持人位 |
| 匾额 | "文豪争霸" 金字匾额 |
| 灯光 | 金色主调 + 聚光灯 + 动态光影 |
| 地面 | 汉白玉地砖 + 红色地毯 |

#### 头衔徽章样式

| 头衔 | 徽章颜色 | 边框 | 特效 |
|------|---------|------|------|
| 书生 | 铜色 | 简朴圆形 | 无 |
| 学士 | 银色 | 方帽造型 | 微光 |
| 翰林 | 金色 | 竹简造型 | 淡金光 |
| 大学士 | 紫金 | 印章造型 | 紫金光晕 |
| 文豪 | 赤金 | 毛笔造型 | 火焰光环 |
| 圣贤 | 七彩 | 太极造型 | 彩虹粒子环绕 |

#### 大殿布局（1920×1080 基准）

```
┌────────────────────────────────────────────────────┐
│     ═══ 🏛️ 文 豪 争 霸 🏛️ ═══                   │
│                                                    │
│  👤  👤  👤  👤      [⏱ 15s]      👤  👤  👤  👤  │
│  翰林 学士 书生 💀                   书生 学士 💀 翰林│
│                                                    │
│  👤            ┌──────────────┐            👤      │
│  大学士        │ 📖 诗词领域    │            书生    │
│               │ ★★★★☆ 难度4  │                    │
│  👤           │              │            👤      │
│  文豪          │ "海上生明月，  │            💀     │
│               │  天涯共此时"  │                    │
│  👤           │ 出自哪位诗人？ │            👤      │
│  书生          │              │            学士    │
│               │ [A.李白] [B.张九龄]│               │
│               │ [C.杜甫] [D.白居易]│               │
│               └──────────────┘                    │
│                                                    │
│  [🔮提示 ×1] [⏰加时 ×1] [🪙复活 ×1]              │
│  剩余: 10/16    轮次: 2/5     我的分: 480          │
└────────────────────────────────────────────────────┘
```

### 关键动画

| 动画 | 实现 | 时长 |
|------|------|------|
| 大殿开场 | 殿门推开 + 灯光依次亮起 + 选手入场 | 3000ms |
| 选手入场 | 16 个头像依次从殿门走入 + 就位 | 2000ms |
| 题目切入 | 卷轴展开 + 题目文字渐现 | 600ms |
| 圆形倒计时 | 描边 SVG 动画 + 颜色渐变（绿→黄→红） | 持续 |
| 答对 | 选项绿色闪烁 + ✓ + 分数跳增 | 500ms |
| 答错 | 选项红色 + ✗ + 震屏 | 500ms |
| 淘汰碎裂 | 头像裂纹→爆碎→碎片飞散→灰色粒子沉降 | 1500ms |
| 复活特效 | 碎片逆流重组→金光柱→凤凰粒子→头像复原 | 2000ms |
| 提示排除 | 2 个选项灰化 + 斜线划过 + 锁定 | 500ms |
| 加时回退 | 倒计时数字回退 + 绿色光圈扩散 | 600ms |
| 决战氛围 | 背景变红 + 鼓声加速 + 灯光闪烁 | 渐变 |
| 王冠降落 | 金色王冠从天而降 + 光线四射 | 1500ms |
| 金色粒子爆发 | 冠军确定瞬间全屏金色粒子 | 2000ms |
| 头衔飞入 | "文豪" 金色大字从远处飞入定位 | 1000ms |
| 排名卷轴 | 古卷轴从上方展开 + 排名依次显现 | 1500ms |
| 雷达图更新 | 蛛网图各维度数据平滑过渡 | 800ms |

## 范围（做什么）

- 实现 BootScene 资源预加载（大殿素材 + 头像框 + 道具图标 + 粒子素材 + 音效）
- 实现 HallScene 大殿主场景（龙柱 + 灯光 + 匾额 + 皇座）
- 实现 PlayerRing 选手环形排列（16 头像 + 头衔徽章 + 状态指示）
- 实现 EliminationEffect 淘汰碎裂特效（爆碎 + 灰色粒子）
- 实现 QuestionPanel 答题面板（题目 + 选项 + 圆形倒计时 + 难度 + 领域图标）
- 实现 ItemBar 道具栏（3 按钮 + 使用动画 + 库存）
- 实现 HintEffect / TimeExtendEffect / RevivalEffect 三种道具视觉效果
- 实现 ChampionCeremony 冠军加冕（王冠 + 粒子 + 头衔 + 排名卷轴）
- 实现 RadarScene 知识雷达（12 维度蛛网图 + 详情 + 动画）
- 实现 TournamentScene 锦标赛对阵图（64 人树形 + 缩放平移）
- 实现 ProfileScene 个人档案（头衔徽章 + 统计 + 道具库存）
- 实现 EliminationOverlay 被淘汰层（名次 + 观战选项）
- 实现头衔徽章 6 种独特样式
- 实现决战氛围增强（最后 2 人时视觉升级）
- 对接 T09-007 所有 API 和 WebSocket
- 音效集成（答题/淘汰/复活/加冕/鼓声/决战紧张感）
- 皮肤系统预留（大殿主题/服装/特效/座椅可替换）

## 边界（不做什么）

- 不写后端逻辑（T09-007 已完成）
- 不写匹配 UI（T06-009 已完成）
- 不写结算页面（T06-011 已完成）
- 不制作美术素材（使用占位图或 CC0 素材）
- 不实现皮肤商店 UI（T06-012 已完成）
- 不实现观战模式聊天功能

## 涉及文件

- 新建: `frontend/src/games/g12-literary-master/BootScene.ts`
- 新建: `frontend/src/games/g12-literary-master/HallScene.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/HallBackground.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/PlayerRing.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/PlayerAvatar.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/EliminationEffect.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/CenterStage.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/QuestionPanel.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/TimerCircle.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/ItemBar.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/RevivalEffect.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/SurvivalInfo.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/ChampionCeremony.ts`
- 新建: `frontend/src/games/g12-literary-master/hall/EliminationOverlay.ts`
- 新建: `frontend/src/games/g12-literary-master/RadarScene.ts`
- 新建: `frontend/src/games/g12-literary-master/radar/RadarChart.ts`
- 新建: `frontend/src/games/g12-literary-master/TournamentScene.ts`
- 新建: `frontend/src/games/g12-literary-master/tournament/BracketTree.ts`
- 新建: `frontend/src/games/g12-literary-master/ProfileScene.ts`
- 新建: `frontend/src/games/g12-literary-master/profile/TitleBadge.ts`
- 新建: `frontend/src/games/g12-literary-master/SkinManager.ts`
- 新建: `frontend/src/games/g12-literary-master/types.ts`
- 修改: `frontend/src/games/index.ts` — 注册 G12 游戏场景

## 依赖

- 前置: T09-007（G12 后端 API + WebSocket 就绪）
- 前置: T06-010（Phaser 通用容器框架）
- 前置: T06-009（匹配 UI — 多人模式入口）
- 后续: 无（本任务为 G12 最终任务，也是全项目最终游戏任务）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 进入 G12 游戏  
   **WHEN** 大殿场景加载  
   **THEN** 宫殿大殿正确渲染（龙柱 + 灯光 + 匾额），16 个选手头像环形入场

2. **GIVEN** 大殿场景中  
   **WHEN** 第一题下发  
   **THEN** 卷轴展开 + 题目渐现 + 选项展示 + 圆形倒计时开始 + 领域图标 + 难度标识

3. **GIVEN** 答题中  
   **WHEN** 点击"提示"道具  
   **THEN** 2 个错误选项灰化 + 斜线划过 + 道具数量 -1 + 按钮如已用完则灰色锁定

4. **GIVEN** 某选手答错被淘汰  
   **WHEN** 淘汰动画触发  
   **THEN** 该选手头像裂纹→爆碎→碎片飞散→灰色粒子→位置空出

5. **GIVEN** 被淘汰的选手使用复活币  
   **WHEN** 复活动画触发  
   **THEN** 碎片逆流重组 + 金光柱 + 凤凰粒子 + 头像复原 + 继续比赛

6. **GIVEN** 只剩最后 2 人  
   **WHEN** 决战氛围启动  
   **THEN** 背景灯光变红 + 鼓声加速 + 选手头像放大 + 紧张感音效

7. **GIVEN** 最终冠军产生  
   **WHEN** 加冕典礼  
   **THEN** 王冠从天降落 → 金色粒子爆发 → 头衔飞入 → 排名卷轴展开

8. **GIVEN** 查看知识雷达  
   **WHEN** 雷达图展示  
   **THEN** 12 维度蛛网图正确渲染，各维度数据对应正确，可点击查看详情

9. **GIVEN** 赛季锦标赛  
   **WHEN** 对阵图展示  
   **THEN** 64 人树形对阵正确渲染，可缩放平移，进行中高亮，已淘汰灰色

10. **GIVEN** 不同头衔的选手  
    **WHEN** 头衔徽章展示  
    **THEN** 6 种头衔各有独特徽章样式（铜/银/金/紫金/赤金/七彩 + 对应造型）

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=30 frontend` — 前端构建成功
4. Browser MCP 导航到 G12 游戏入口
5. 验证大殿场景渲染（龙柱 + 灯光 + 匾额 + 选手环形）
6. 验证答题 UI（题目 + 选项 + 圆形倒计时 + 领域/难度）
7. 验证道具使用（提示排除 + 加时回退 + 库存变化）
8. 验证淘汰碎裂特效
9. 验证复活特效（金光 + 凤凰 + 复原）
10. 验证冠军加冕动画（王冠 + 粒子 + 头衔 + 卷轴）
11. 验证知识雷达蛛网图
12. 验证锦标赛对阵图
13. 截图记录关键场景

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] Phaser 场景正确加载，无 JS 报错
- [ ] 大殿场景渲染完整，金色主调视觉统一
- [ ] 16 选手环形排列正确，头衔徽章展示清晰
- [ ] 淘汰碎裂特效流畅，≥ 30fps
- [ ] 复活特效华丽且不卡顿
- [ ] 冠军加冕动画完整（王冠 + 粒子 + 头衔 + 卷轴）
- [ ] 道具 3 种使用效果均正确
- [ ] 12 维度知识雷达蛛网图渲染正确
- [ ] 64 人对阵树形图可缩放平移
- [ ] 横屏 1920×1080 基准布局正确
- [ ] 移动端 H5 横屏自适应
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

> 任务完成后，必须在 `/tasks/result/09-games-g9-g12/` 下创建同名结果文件

结果文件路径: `/tasks/result/09-games-g9-g12/T09-008-g12-literary-master-frontend.md`

## 自检重点

- [ ] 性能: 16 头像 + 粒子特效同屏 ≥ 30fps
- [ ] 性能: 淘汰碎裂粒子数量控制（移动端自动降级）
- [ ] 性能: 冠军加冕全屏粒子帧率稳定
- [ ] UI: 环形排列在不同人数（8/16）下自适应
- [ ] UI: 圆形倒计时颜色渐变平滑
- [ ] UI: 6 种头衔徽章视觉区分明显
- [ ] UI: 12 维度雷达图标签不重叠
- [ ] UI: 64 人对阵树形图缩放平移流畅
- [ ] 交互: 选项按钮点击区域足够大（移动端友好）
- [ ] 交互: 道具按钮不误触（有确认或冷却时间）
- [ ] 音效: 淘汰/复活/加冕/决战氛围音效正确
- [ ] 皮肤: SkinManager 预留大殿/服装/特效替换接口
