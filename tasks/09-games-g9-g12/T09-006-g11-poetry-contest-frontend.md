# T09-006: G11 诗词大会 — Phaser 游戏前端

> 分类: 09-游戏 G9-G12 (Games G9-G12)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 20+

## 需求摘要

实现 G11 诗词大会的 Phaser 3 前端游戏场景。包括综艺节目风格主舞台（灯光 + 主持人台 + 选手台 + 观众席 + LED 大屏幕）、10+ 混合题型 UI（填空输入、上下句选择、九宫格 3×3 交互式选字、看图猜诗图片展示、听音识诗音频播放器、诗人匹配连线、朝代排序拖拽、鉴赏多选、出处辨识、飞花令接龙输入）、连击火焰特效系统（连击数 + 倍率显示 + 火焰越燃越旺）、抢答倒计时（3-2-1 + 按钮闪烁 + 抢答成功高亮）、多人头像排列 + 淘汰碎裂效果、100 人周赛分区视图 + 排行榜、诗词收藏册翻页浏览。横屏 1920×1080，综艺节目风格 + 中国古典装饰。

## 相关上下文

- 产品需求: `product/apps/08-games-g9-g12/03-g11-poetry-contest.md` — G11 完整 PRD（**核心依据**）
  - §二 混合题型 UI（10+ 种题型各自的展示方式）
  - §三 综艺舞台视觉（灯光/选手台/LED 屏/观众特效）
  - §四 连击系统视觉（火焰/倍率/连击数字）
  - §五 抢答 UI（倒计时 + 按钮 + 结果指示）
  - §六 多人淘汰视觉 + 100 人周赛界面
  - §七 验收标准 G11-AC01 ~ G11-AC10
- 游戏设计: `game/11-poetry-contest.md`
  - §四 视觉与交互（综艺节目风格 + 古典中国装饰）
  - §四.2 横屏布局（舞台 + 题目区 + 选手区 + 分数/连击）
  - §二.2 十大题型交互设计
  - §六 皮肤系统（舞台主题/选手服装/特效包/答题音效包）
- 通用 HUD: `product/apps/05-game-common/08-hud-landscape.md`
- UI 规范: `grules/06-ui-design.md`
- 编码规范: `grules/05-coding-standards.md` §二
- 关联任务: T09-005（G11 后端）→ 本任务 | T06-010（Phaser 容器框架）→ 本任务

## 技术方案

### Phaser 3 场景架构

```
G11PoetryContest/
├── BootScene.ts                # 资源预加载（舞台背景、选手素材、题型 UI 素材、音效）
├── StageScene.ts               # 核心答题主场景（综艺舞台）
│   ├── StageBackground.ts      # 舞台背景（灯光动画 + LED 屏幕 + 古典装饰）
│   ├── HostPanel.ts            # 主持人位（读题动画 + 公布答案动画）
│   ├── ContestantPanel.ts      # 选手台（头像 + 名称 + 当前分数 + 连击状态）
│   ├── QuestionDisplay.ts      # 题目展示管理器（根据题型切换不同 UI 组件）
│   │   ├── FillBlankUI.ts      # 填空题 UI（诗句 + 空格 + 选项/输入）
│   │   ├── UpperLowerUI.ts     # 上下句 UI（给出一句 + 四选一）
│   │   ├── NineGridUI.ts       # 九宫格 UI（3×3 格子 + 点击选字组合诗句）
│   │   ├── ImagePoemUI.ts      # 看图猜诗 UI（图片展示 + 选项）
│   │   ├── AudioPoemUI.ts      # 听音识诗 UI（音频播放器 + 选项）
│   │   ├── PoetMatchUI.ts      # 诗人匹配 UI（左右两列连线交互）
│   │   ├── DynastyOrderUI.ts   # 朝代排序 UI（拖拽排序）
│   │   ├── AppreciationUI.ts   # 鉴赏分析 UI（长文 + 多选项）
│   │   ├── SourceIdentifyUI.ts # 出处辨识 UI（诗句 + 作品名选项）
│   │   └── FeihuaLingUI.ts     # 飞花令 UI（含字提示 + 输入框 + 倒计时）
│   ├── TimerDisplay.ts         # 倒计时显示（圆形倒计时 + 数字 + 紧迫音效）
│   ├── StreakDisplay.ts        # 连击系统显示
│   │   ├── StreakCounter.ts    # 连击数字（放大弹跳动画）
│   │   ├── StreakFire.ts       # 连击火焰特效（粒子系统，越连越旺）
│   │   └── MultiplierBadge.ts  # 倍率徽章（×1.2 / ×1.5 / ×2.0 / ×3.0 / ×5.0）
│   ├── ScoreBoard.ts           # 分数板（当前分数 + 变化动画）
│   └── AnswerResultOverlay.ts  # 答案结果（正确/错误 + 解析 + 诗词原文展示）
├── BuzzInScene.ts              # 抢答场景（多人模式覆盖层）
│   ├── BuzzButton.ts           # 抢答按钮（脉冲闪烁 + 按下反馈）
│   ├── BuzzCountdown.ts        # 3-2-1 开始倒计时
│   └── BuzzResultDisplay.ts    # 抢答结果（谁最快 + 时间差展示）
├── EliminationScene.ts         # 多人淘汰视图
│   ├── PlayerAvatarRing.ts     # 选手头像环形排列（圆形或半圆形）
│   ├── EliminationEffect.ts    # 淘汰碎裂特效（头像破碎 + 灰色化）
│   └── SurvivorHighlight.ts    # 存活选手高亮
├── WeeklyEventScene.ts         # 100 人周赛
│   ├── RegionView.ts           # 分区视图（4 区同时进行 + 各区排名）
│   ├── LiveLeaderboard.ts      # 实时排行榜（Top 10 滚动 + 我的排名）
│   └── FinalStageView.ts       # 总决赛舞台（20 人 + 华丽灯光）
├── CollectionScene.ts          # 诗词收藏册
│   ├── BookView.ts             # 古书翻页浏览（左右翻页动画）
│   ├── PoemCard.ts             # 单首诗词卡片（诗名 + 诗人 + 全文 + 注释）
│   └── CollectionProgress.ts   # 收藏进度（X/210 已解锁）
└── SkinManager.ts              # 皮肤系统（舞台主题/选手服装/特效包/音效包）
```

### 核心交互流程

#### 综艺答题主流程

```
1. StageScene 加载 → 综艺舞台渲染（灯光闪烁开场动画 + 选手台入场）
2. 主持人读题动画 → QuestionDisplay 根据题型切换对应 UI 组件
3. 填空题: 诗句展示 + 空格高亮 → 选项按钮点击
4. 九宫格: 3×3 格子展示 → 点击选字组合诗句 → 确认提交
5. 看图猜诗: 图片淡入展示 → 四选一
6. 听音识诗: 音频播放器 → 播放按钮 → 四选一
7. 诗人匹配: 左列诗句 + 右列诗人 → 拖拽连线
8. 朝代排序: 横向排列卡片 → 拖拽调整顺序 → 确认
9. TimerDisplay 倒计时（圆形 + 最后 5 秒变红 + 滴答音效）
10. 提交答案 → 服务端验证 → AnswerResultOverlay（✓/✗ + 解析）
11. 答对: 连击 +1 → StreakFire 火焰增强 → MultiplierBadge 更新 → 分数跳动增加
12. 答错: 连击归零 → 火焰熄灭 → -50 分动画 → 轻微震屏
```

#### 抢答流程（多人模式）

```
1. 题目出现但选项未展示 → BuzzCountdown "3... 2... 1..."
2. "开始！" → BuzzButton 开始脉冲闪烁
3. 玩家点击抢答 → 发送 buzz_in + 客户端时间戳
4. 服务端裁定 → BuzzResultDisplay 展示抢答结果
5. 抢到者: 头像高亮 + 选项展示 → 答题
6. 未抢到者: 等待 + 观看
```

### 视觉规范

#### 舞台风格

| 元素 | 描述 |
|------|------|
| 主背景 | 综艺舞台 + 中国古典装饰（飞檐/灯笼/竹简） |
| LED 屏幕 | 舞台中央大屏展示题目 |
| 灯光 | 动态聚光灯 + 彩色氛围灯 |
| 选手台 | 半弧形排列，带中国风底座 |
| 观众席 | 底部模糊背景 + 偶尔"好！"弹幕特效 |

#### 连击火焰等级

| 连击数 | 倍率 | 火焰表现 | 颜色 |
|--------|------|---------|------|
| 1 | ×1.0 | 无 | — |
| 2 | ×1.2 | 小火苗 | 橙色 |
| 3 | ×1.5 | 中火焰 | 橙红 |
| 5 | ×2.0 | 大火焰 | 红色 |
| 8 | ×3.0 | 烈焰包围 | 金红 |
| 10+ | ×5.0 | 凤凰涅槃特效 | 金色 + 粒子爆发 |

#### 答题布局（1920×1080 基准）

```
┌────────────────────────────────────────────────────┐
│ ═══════════ 🏮 诗词大会 🏮 ═══════════           │
│                                                    │
│ ┌─────────── LED 大屏幕 ───────────┐              │
│ │                                    │   [⏱ 12s]  │
│ │  春眠不觉晓，____闻啼鸟          │              │
│ │                                    │  [🔥×5 2.0]│
│ │  [A.处处] [B.时时] [C.夜夜] [D.日日]│            │
│ └────────────────────────────────────┘              │
│                                                    │
│  [👤 选手1]  [👤 选手2]  [👤 我]  [👤 选手4]       │
│  [580分]    [420分]    [650分]  [淘汰]            │
│  [🔥×3]    [×1]       [🔥×5]   [💀]              │
│                                                    │
│  得分: 650      连击: 5       排名: 1/4            │
└────────────────────────────────────────────────────┘
```

### 关键动画

| 动画 | 实现 | 时长 |
|------|------|------|
| 舞台开场 | 灯光依次亮起 + 幕布拉开 + 选手入场 | 2000ms |
| 题目切入 | LED 屏幕内容淡入 + 打字机效果 | 800ms |
| 九宫格选字 | 点击格子弹起 → 选中字飞到答案行 | 300ms/字 |
| 连线匹配 | 手指拖拽画线 + 正确连线发光 | 即时 |
| 答对 | 绿色 ✓ + 分数跳动增加 + 连击火焰增强 | 600ms |
| 答错 | 红色 ✗ + 屏幕微震 + 连击火焰熄灭 + "-50" 飘出 | 600ms |
| 连击火焰 | 粒子系统持续燃烧（帧率自适应降级） | 持续 |
| 凤凰涅槃 | 10+ 连击触发：金色凤凰粒子 + 屏幕金光闪烁 | 1500ms |
| 抢答按钮 | 脉冲缩放 + 发光 + 按下缩小回弹 | 循环/200ms |
| 淘汰碎裂 | 头像破碎成碎片飞散 + 灰色半透明化 | 1000ms |
| 翻页（收藏册） | 古书翻页 3D 翻转 + 纸张音效 | 500ms |

## 范围（做什么）

- 实现 BootScene 资源预加载（舞台素材 + 10+ 题型 UI 素材 + 音效）
- 实现 StageScene 综艺舞台（灯光 + LED 屏 + 选手台 + 分数板）
- 实现 QuestionDisplay 10+ 题型切换管理器
- 实现各题型专属 UI 组件：
  - FillBlankUI（填空 + 选项）
  - UpperLowerUI（上下句四选一）
  - NineGridUI（3×3 九宫格交互式选字）
  - ImagePoemUI（图片展示 + 选项）
  - AudioPoemUI（音频播放器 + 选项）
  - PoetMatchUI（左右连线交互）
  - DynastyOrderUI（拖拽排序）
  - AppreciationUI（鉴赏长文 + 多选）
  - SourceIdentifyUI（出处选择）
  - FeihuaLingUI（飞花令输入）
- 实现 StreakDisplay 连击火焰系统（粒子特效 + 倍率徽章）
- 实现 TimerDisplay 圆形倒计时（紧迫音效 + 变色）
- 实现 BuzzInScene 抢答（倒计时 + 按钮 + 结果展示）
- 实现 EliminationScene 淘汰视图（头像环 + 碎裂特效）
- 实现 WeeklyEventScene 100 人周赛（分区 + 排行榜 + 总决赛）
- 实现 CollectionScene 诗词收藏册（古书翻页 + 诗词卡片 + 进度）
- 对接 T09-005 所有 API 和 WebSocket
- 音效集成（答对/答错/连击/抢答/淘汰/翻页）
- 皮肤系统预留（舞台主题/选手服装/特效包）

## 边界（不做什么）

- 不写后端逻辑（T09-005 已完成）
- 不写匹配 UI（T06-009 已完成）
- 不写结算页面（T06-011 已完成）
- 不制作音频/图片素材（使用占位资源）
- 不实现皮肤商店 UI（T06-012 已完成）
- 不实现实时语音互动功能

## 涉及文件

- 新建: `frontend/src/games/g11-poetry-contest/BootScene.ts`
- 新建: `frontend/src/games/g11-poetry-contest/StageScene.ts`
- 新建: `frontend/src/games/g11-poetry-contest/stage/StageBackground.ts`
- 新建: `frontend/src/games/g11-poetry-contest/stage/ContestantPanel.ts`
- 新建: `frontend/src/games/g11-poetry-contest/stage/QuestionDisplay.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/FillBlankUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/UpperLowerUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/NineGridUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/ImagePoemUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/AudioPoemUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/PoetMatchUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/DynastyOrderUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/AppreciationUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/SourceIdentifyUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/questions/FeihuaLingUI.ts`
- 新建: `frontend/src/games/g11-poetry-contest/stage/StreakDisplay.ts`
- 新建: `frontend/src/games/g11-poetry-contest/BuzzInScene.ts`
- 新建: `frontend/src/games/g11-poetry-contest/EliminationScene.ts`
- 新建: `frontend/src/games/g11-poetry-contest/WeeklyEventScene.ts`
- 新建: `frontend/src/games/g11-poetry-contest/CollectionScene.ts`
- 新建: `frontend/src/games/g11-poetry-contest/SkinManager.ts`
- 新建: `frontend/src/games/g11-poetry-contest/types.ts`
- 修改: `frontend/src/games/index.ts` — 注册 G11 游戏场景

## 依赖

- 前置: T09-005（G11 后端 API + WebSocket 就绪）
- 前置: T06-010（Phaser 通用容器框架）
- 前置: T06-009（匹配 UI — 多人模式入口）
- 后续: 无（本任务为 G11 最终任务）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 进入 G11 游戏  
   **WHEN** 舞台场景加载  
   **THEN** 综艺舞台正确渲染（灯光动画 + LED 屏 + 选手台 + 古典装饰）

2. **GIVEN** 填空题  
   **WHEN** 展示题目  
   **THEN** 诗句显示 + 空格高亮 + 四个选项按钮可点击

3. **GIVEN** 九宫格题  
   **WHEN** 交互操作  
   **THEN** 3×3 格子展示，点击选字弹起飞到答案行，可撤销，组合正确诗句后确认

4. **GIVEN** 听音识诗题  
   **WHEN** 展示题目  
   **THEN** 音频播放器可播放/暂停，播放过程有波形动画，四选一

5. **GIVEN** 连续答对 5 题  
   **WHEN** 连击系统更新  
   **THEN** 连击数字 "×5" 放大弹跳 + 倍率 "2.0" 显示 + 大红火焰粒子包围

6. **GIVEN** 连击 10+ 题  
   **WHEN** 凤凰特效触发  
   **THEN** 金色凤凰粒子从角色飞出 + 全屏金光 + "🔥×5.0" 超大显示

7. **GIVEN** 答错一题  
   **WHEN** 连击中断  
   **THEN** 火焰熄灭动画 + "-50" 红色数字飘出 + 轻微震屏 + 连击归零

8. **GIVEN** 多人抢答  
   **WHEN** "开始！" 出现  
   **THEN** 抢答按钮脉冲闪烁，点击后发送抢答，结果显示谁最快 + 时间差

9. **GIVEN** 多人淘汰赛某玩家被淘汰  
   **WHEN** 淘汰动画触发  
   **THEN** 该玩家头像碎裂飞散 + 灰色化 + 剩余人数更新

10. **GIVEN** 诗词收藏册  
    **WHEN** 翻页浏览  
    **THEN** 古书翻页 3D 动画 + 诗词卡片展示（诗名/诗人/全文）+ 进度 X/210

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=30 frontend` — 前端构建成功
4. Browser MCP 导航到 G11 游戏入口
5. 验证综艺舞台渲染（灯光 + LED 屏 + 选手台）
6. 逐一验证 10+ 题型 UI（填空/九宫格/看图/听音/连线/排序等）
7. 验证连击火焰系统（连对 → 火焰增强 → 断连 → 火焰熄灭）
8. 验证抢答交互（倒计时 + 按钮 + 结果）
9. 验证淘汰碎裂特效
10. 验证诗词收藏册翻页
11. 截图记录关键场景

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] Phaser 场景正确加载，无 JS 报错
- [ ] 10+ 题型 UI 全部正确渲染和交互
- [ ] 九宫格选字交互流畅（点击→飞字→撤销→确认）
- [ ] 音频播放器正常工作（播放/暂停/波形）
- [ ] 连击火焰粒子特效流畅，≥ 30fps
- [ ] 凤凰涅槃特效在 10+ 连击时正确触发
- [ ] 抢答按钮响应 < 100ms
- [ ] 淘汰碎裂特效流畅
- [ ] 收藏册翻页动画流畅
- [ ] 横屏 1920×1080 基准布局正确
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

> 任务完成后，必须在 `/tasks/result/09-games-g9-g12/` 下创建同名结果文件

结果文件路径: `/tasks/result/09-games-g9-g12/T09-006-g11-poetry-contest-frontend.md`

## 自检重点

- [ ] 性能: 连击火焰粒子特效 ≥ 30fps（低端设备自动降级）
- [ ] 性能: 10+ 题型切换无闪烁，预加载完整
- [ ] 性能: 100 人周赛排行榜滚动流畅
- [ ] UI: 各题型布局在不同分辨率下自适应
- [ ] UI: 诗词文字渲染清晰，无乱码
- [ ] UI: 九宫格格子点击区域精确（移动端友好）
- [ ] 交互: 连线/拖拽操作手势响应流畅
- [ ] 交互: 抢答按钮足够大，触控友好
- [ ] 音效: 答对/答错/连击/抢答/淘汰音效正确触发
- [ ] 音频: AudioPoemUI 播放器在移动端 H5 兼容
- [ ] 皮肤: SkinManager 预留舞台/服装/特效替换接口
