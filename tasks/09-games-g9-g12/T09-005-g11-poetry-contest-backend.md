# T09-005: G11 诗词大会 — 后端题库与游戏逻辑

> 分类: 09-游戏 G9-G12 (Games G9-G12)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 15+

## 需求摘要

实现 G11 诗词大会的后端游戏逻辑：诗词题库管理（5000+ 题，10+ 题型——填空/上下句/九宫格/看图猜诗/听音识诗/诗人匹配/朝代排序/鉴赏分析/出处辨识/飞花令等）、综艺竞赛答题引擎（每轮 8-12 题混合题型 + 限时倒计时 + 抢答计时 + 连对加成计分——2连×1.2 / 3连×1.5 / 5连×2.0 / 8连×3.0 / 10+连×5.0 + 答错扣 50 分）、多人淘汰赛（4-8 人，答错累计 3 次淘汰）、周赛 100 人大乱斗（分区预赛→总决赛）、抢答机制（服务端时间戳 + 200ms 容差防网络延迟）、每日挑战、AI 对手（4 档难度）、防作弊。题库从 L11 课程诗词曲赋素材导入，累计 210 首古诗词覆盖。

## 相关上下文

- 产品需求: `product/apps/08-games-g9-g12/03-g11-poetry-contest.md` — G11 完整 PRD
  - §二 混合题型展示（10+ 种题型轮转）
  - §三 综艺节目风格答题流程
  - §四 连对加成系统（连击倍率表）
  - §五 多人淘汰赛 + 100 人周赛
  - §六 抢答机制（服务端时间戳 + 200ms 容差）
  - §七 验收标准 G11-AC01 ~ G11-AC10
- 游戏设计: `game/11-poetry-contest.md` — G11 完整玩法设计
  - §二 核心玩法（答题竞赛 + 综艺节目包装）
  - §二.2 十大题型详解
  - §二.3 计分规则（基础分 + 连对加成 + 速度奖励 + 答错惩罚）
  - §三 游戏模式（单人/1v1/4-8 人/100 人周赛）
  - §五 上瘾机制（连击追求/每日挑战/段位/成就/诗词收藏册）
  - §七 技术要点（混合题型渲染、计时系统、WebSocket 同步、抢答防延迟）
- 课程内容: `course/level-11.md` — L11 文言文入门（古典诗词 210 首累计、曲赋词调）
- 文学参考: `china/07-classic-literature.md` — 四大名著/诗词经典（题库来源）
- 音乐参考: `china/06-music-opera.md` — 古典音乐/戏曲（听音识诗题型来源）
- 通用系统: `product/apps/05-game-common/` — 匹配/结算/段位
- 编码规范: `grules/05-coding-standards.md` §三 — 后端规范
- API 设计: `grules/04-api-design.md` — 统一响应格式
- 关联任务: T06-013（游戏通用系统）→ 本任务 → T09-006（G11 前端）

## 技术方案

### 数据库设计

#### 1. G11 诗词题库表

```sql
-- 诗词大会题库（5000+ 题）
CREATE TABLE g11_poetry_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_type VARCHAR(30) NOT NULL CHECK (question_type IN (
    'fill_blank',       -- 填空题（诗句补全）
    'upper_lower',      -- 上下句（给上句填下句 / 反之）
    'nine_grid',        -- 九宫格（从 9 个字中选出正确诗句）
    'image_to_poem',    -- 看图猜诗（根据图片选诗句）
    'audio_to_poem',    -- 听音识诗（播放朗诵或音乐 → 选诗）
    'poet_match',       -- 诗人匹配（诗句 ↔ 作者配对）
    'dynasty_order',    -- 朝代排序（按时间排列诗人/作品）
    'appreciation',     -- 鉴赏分析（选择正确的鉴赏解读）
    'source_identify',  -- 出处辨识（诗句出自哪部作品）
    'feihua_ling'       -- 飞花令（含特定字的诗句接龙）
  )),
  question_text TEXT NOT NULL,                -- 题干文本
  question_media JSONB,                       -- 媒体资源 {"image":"url","audio":"url"}
  options JSONB NOT NULL,                     -- 选项 [{"key":"A","text":"...","is_correct":true}]
  correct_answer VARCHAR(10) NOT NULL,        -- 正确答案标识（A/B/C/D 或具体文本）
  poem_source TEXT,                           -- 关联诗词原文
  poet_name VARCHAR(30),                      -- 诗人
  dynasty VARCHAR(20),                        -- 朝代
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  base_score INTEGER NOT NULL DEFAULT 100,    -- 基础分值
  time_limit INTEGER NOT NULL DEFAULT 15,     -- 答题时限（秒）
  tags JSONB DEFAULT '[]',                    -- 标签（唐诗/宋词/元曲/名句等）
  explanation TEXT,                            -- 答案解析
  related_lesson VARCHAR(50),                 -- 关联课程章节
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g11_q_type ON g11_poetry_questions(question_type);
CREATE INDEX idx_g11_q_diff ON g11_poetry_questions(difficulty);
CREATE INDEX idx_g11_q_tags ON g11_poetry_questions USING GIN(tags);

ALTER TABLE g11_poetry_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g11_q_read" ON g11_poetry_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "g11_q_admin" ON g11_poetry_questions FOR ALL TO service_role USING (true);
```

#### 2. G11 诗词收藏册表

```sql
-- 用户诗词收藏册（答对解锁诗词）
CREATE TABLE g11_poetry_collection (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  poem_title VARCHAR(100) NOT NULL,
  poem_text TEXT NOT NULL,
  poet_name VARCHAR(30) NOT NULL,
  dynasty VARCHAR(20),
  unlocked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  times_encountered INTEGER NOT NULL DEFAULT 1,   -- 在题目中遇到次数
  times_correct INTEGER NOT NULL DEFAULT 1,       -- 答对次数
  UNIQUE(user_id, poem_title, poet_name)
);

CREATE INDEX idx_g11_collection_user ON g11_poetry_collection(user_id);

ALTER TABLE g11_poetry_collection ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g11_coll_own" ON g11_poetry_collection FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

#### 3. G11 连击记录表

```sql
-- 用户连击和成绩记录
CREATE TABLE g11_player_stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  max_streak INTEGER NOT NULL DEFAULT 0,          -- 历史最长连击
  total_correct INTEGER NOT NULL DEFAULT 0,       -- 总答对数
  total_wrong INTEGER NOT NULL DEFAULT 0,         -- 总答错数
  favorite_type VARCHAR(30),                      -- 最擅长题型
  weakest_type VARCHAR(30),                       -- 最弱题型
  poems_collected INTEGER NOT NULL DEFAULT 0,     -- 已收藏诗词数
  weekly_score INTEGER NOT NULL DEFAULT 0,        -- 本周积分
  season_score INTEGER NOT NULL DEFAULT 0,        -- 本赛季积分
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE g11_player_stats ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g11_stats_own" ON g11_player_stats FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

#### 4. G11 周赛表

```sql
-- 100 人周赛管理
CREATE TABLE g11_weekly_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_name VARCHAR(100) NOT NULL,
  event_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN (
    'upcoming', 'registration', 'in_progress', 'completed'
  )),
  max_participants INTEGER NOT NULL DEFAULT 100,
  current_participants INTEGER NOT NULL DEFAULT 0,
  question_set JSONB NOT NULL DEFAULT '[]',       -- 比赛题目集（预设 30 题）
  regions INTEGER NOT NULL DEFAULT 4,             -- 分区数
  results JSONB,                                  -- 最终排名结果
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 周赛报名表
CREATE TABLE g11_weekly_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES g11_weekly_events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  region INTEGER NOT NULL,                        -- 分区编号
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  final_score INTEGER,
  final_rank INTEGER,
  eliminated_at_question INTEGER,                 -- 在第几题被淘汰
  UNIQUE(event_id, user_id)
);

CREATE INDEX idx_g11_weekly_reg ON g11_weekly_registrations(event_id, region);

ALTER TABLE g11_weekly_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g11_event_read" ON g11_weekly_events FOR SELECT TO authenticated USING (true);
CREATE POLICY "g11_event_admin" ON g11_weekly_events FOR ALL TO service_role USING (true);

ALTER TABLE g11_weekly_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g11_reg_own" ON g11_weekly_registrations FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "g11_reg_read" ON g11_weekly_registrations FOR SELECT TO authenticated USING (true);
```

### API 设计

#### 1. 开始答题轮次

```
POST /api/v1/games/g11-poetry-contest/sessions/:sessionId/start-round
Headers: Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "data": {
    "round": 1,
    "total_questions": 10,
    "questions": [
      {
        "index": 1,
        "type": "fill_blank",
        "question_text": "春眠不觉晓，____闻啼鸟",
        "options": [
          {"key":"A","text":"处处"},
          {"key":"B","text":"时时"},
          {"key":"C","text":"夜夜"},
          {"key":"D","text":"日日"}
        ],
        "time_limit": 12,
        "base_score": 100,
        "media": null
      }
    ]
  }
}
```

#### 2. 提交答案（含抢答时间戳）

```
POST /api/v1/games/g11-poetry-contest/sessions/:sessionId/answer
Headers: Authorization: Bearer {token}
Body: {
  "question_index": 1,
  "answer": "A",
  "client_timestamp": 1700000000123   // 客户端提交时间戳
}

Response 200:
{
  "code": 0,
  "data": {
    "is_correct": true,
    "correct_answer": "A",
    "base_score": 100,
    "streak": 3,
    "streak_multiplier": 1.5,
    "speed_bonus": 20,                // 速度奖励（越快越多）
    "round_score": 170,               // 100 × 1.5 + 20
    "total_score": 520,
    "explanation": "出自孟浩然《春晓》",
    "poem_unlocked": true,            // 新解锁诗词
    "server_timestamp": 1700000000200
  }
}
```

#### 3. 抢答裁定（多人模式）

```typescript
// WebSocket 抢答消息
interface BuzzInMessage {
  type: 'g11_buzz_in'
  player_id: string
  question_index: number
  client_timestamp: number
  server_receive_timestamp: number    // 服务端收到时间
}

interface BuzzInResult {
  type: 'g11_buzz_result'
  winner_id: string
  all_buzz_times: Array<{
    player_id: string
    adjusted_time: number            // 服务端时间戳（消除网络差异后）
  }>
  tolerance_ms: 200                  // 200ms 容差
  timestamp: number
}
```

#### 4. 淘汰赛消息

```typescript
interface EliminationUpdate {
  type: 'g11_elimination'
  eliminated_player_id: string
  wrong_count: 3                     // 累计 3 次答错
  remaining_players: number
  timestamp: number
}

interface PlayerScoreUpdate {
  type: 'g11_score_update'
  scores: Array<{
    player_id: string
    score: number
    streak: number
    is_eliminated: boolean
  }>
  timestamp: number
}
```

#### 5. 周赛 API

```
POST /api/v1/games/g11-poetry-contest/weekly/register
  — 报名周赛

GET /api/v1/games/g11-poetry-contest/weekly/current
  — 获取当前周赛信息 + 报名人数

GET /api/v1/games/g11-poetry-contest/weekly/:eventId/results
  — 周赛排名结果

// 周赛 WebSocket 消息
interface WeeklyEventStart {
  type: 'g11_weekly_start'
  event_id: string
  region: number
  participants: number
  total_questions: 30
  timestamp: number
}

interface WeeklyRegionResult {
  type: 'g11_weekly_region_result'
  region: number
  qualifiers: string[]               // 晋级总决赛的玩家 ID
  timestamp: number
}
```

#### 6. 其他 API

```
GET /api/v1/games/g11-poetry-contest/collection
  — 用户诗词收藏册

GET /api/v1/games/g11-poetry-contest/stats
  — 用户答题统计（连击记录/擅长题型/弱项等）

GET /api/v1/games/g11-poetry-contest/daily
  — 每日挑战（5 题限定 + 特殊奖励）
```

### 服务端核心逻辑

#### 答题引擎

```typescript
// backend/src/services/games/g11/contest-engine.ts

class G11ContestEngine {
  /**
   * 混合题型出题策略
   * - 每轮 8-12 题，题型随机但保证覆盖 ≥5 种题型
   * - 难度渐进：前 1/3 容易 → 中 1/3 中等 → 后 1/3 困难
   * - 不与用户最近 50 题重复
   */
  generateQuestionSet(
    count: number,
    playerStats: PlayerStats,
    recentQuestionIds: string[]
  ): Promise<Question[]>

  /**
   * 计分引擎
   * base_score × streak_multiplier + speed_bonus
   * 连对倍率: 2连=1.2, 3连=1.5, 5连=2.0, 8连=3.0, 10+=5.0
   * 速度奖励: 剩余时间比例 × 30（满分 30）
   * 答错: -50 分，连击归零
   */
  calculateScore(
    isCorrect: boolean,
    baseScore: number,
    currentStreak: number,
    timeUsed: number,
    timeLimit: number
  ): ScoreResult

  /** 连击倍率查表 */
  getStreakMultiplier(streak: number): number
}
```

#### 抢答裁判

```typescript
// backend/src/services/games/g11/buzzer-judge.ts

class G11BuzzerJudge {
  /**
   * 抢答裁定逻辑
   * 1. 收集所有玩家的 buzz_in 消息
   * 2. 使用服务端接收时间戳（非客户端时间戳）
   * 3. 200ms 容差窗口内的所有 buzz_in 视为同时抢答
   * 4. 同时抢答时，比较客户端时间戳差值进行微调
   * 5. 最终选出最快的玩家获得答题权
   */
  judeBuzzIn(buzzIns: BuzzInEntry[]): BuzzInResult

  /** 抢答窗口管理（问题展示后开始计时） */
  openBuzzWindow(questionIndex: number): void
  closeBuzzWindow(): void

  /** 网络延迟估算（通过心跳 RTT） */
  estimateLatency(playerId: string): number
}
```

#### 周赛管理

```typescript
// backend/src/services/games/g11/weekly-event-service.ts

class G11WeeklyEventService {
  /** 每周自动创建周赛（周六 20:00 开始） */
  async createWeeklyEvent(): Promise<WeeklyEvent>

  /** 报名管理（上限 100 人，超额则排队或拒绝） */
  async register(eventId: string, userId: string): Promise<RegisterResult>

  /** 分区预赛（4 区各 25 人同时答题，各区前 5 名晋级） */
  async runRegionalRound(eventId: string, region: number): Promise<RegionalResult>

  /** 总决赛（20 人争夺冠军） */
  async runFinalRound(eventId: string): Promise<FinalResult>

  /** 周赛奖励发放 */
  async distributeRewards(eventId: string): Promise<void>
}
```

#### AI 对手

```typescript
// backend/src/services/games/g11/ai-contestant.ts

class G11AIContestant {
  /**
   * AI 答题（4 档难度）
   * - 初级: 60% 正确率，答题时间 8-12 秒
   * - 中级: 75% 正确率，答题时间 5-8 秒
   * - 高级: 88% 正确率，答题时间 3-5 秒
   * - 大师: 95% 正确率，答题时间 1-3 秒
   */
  answerQuestion(question: Question, difficulty: AIDifficulty): AIAnswer

  /** AI 抢答模拟（高难度 AI 抢答更快） */
  simulateBuzzIn(difficulty: AIDifficulty): number  // 返回模拟延迟 ms
}
```

### 防作弊机制

```typescript
class G11AntiCheat {
  /** 抢答时间校验：客户端时间戳与服务端时间戳差值合理性检查 */
  validateBuzzTiming(clientTs: number, serverTs: number, estimatedLatency: number): boolean

  /** 答题速度异常检测：连续 5 题答题时间 < 1 秒 → 标记可疑 */
  detectSpeedAnomaly(answerTimes: number[]): boolean

  /** 答题正确率异常：正确率 > 98% 且题数 > 50 → 人工审核 */
  detectAccuracyAnomaly(correctRate: number, totalQuestions: number): boolean

  /** 重复提交防护：同一题只接受第一次答案 */
  isDuplicateAnswer(sessionId: string, questionIndex: number): boolean
}
```

## 范围（做什么）

- 创建 G11 题库表 + 诗词收藏表 + 连击统计表 + 周赛表 + 报名表（Migration + RLS）
- 导入 5000+ 诗词题目（覆盖 10+ 题型、210 首古诗词、L11 课程内容）
- 实现混合题型出题引擎（题型覆盖 + 难度渐进 + 去重）
- 实现连对加成计分引擎（倍率表 + 速度奖励 + 答错扣分）
- 实现抢答裁判系统（服务端时间戳 + 200ms 容差 + 延迟估算）
- 实现多人淘汰赛（4-8 人，3 次答错淘汰）
- 实现 100 人周赛管理（报名 + 分区预赛 + 总决赛 + 奖励）
- 实现诗词收藏册（答对解锁诗词 + 收藏统计）
- 实现每日挑战（5 题限定 + 特殊奖励）
- 实现 AI 对手（4 档难度 + 抢答模拟）
- 实现防作弊模块
- 与 T06-006 结算 API 对接

## 边界（不做什么）

- 不写 Phaser 前端游戏场景（T09-006）
- 不写匹配系统（T06-005 已完成）
- 不写结算页面前端（T06-011 已完成）
- 不制作音频/图片题目素材（使用占位资源或 CC0 素材）
- 不写管理后台题库管理（T14 系列）
- 不实现实时语音互动功能

## 涉及文件

- 新建: `backend/src/services/games/g11/contest-engine.ts`
- 新建: `backend/src/services/games/g11/buzzer-judge.ts`
- 新建: `backend/src/services/games/g11/weekly-event-service.ts`
- 新建: `backend/src/services/games/g11/ai-contestant.ts`
- 新建: `backend/src/services/games/g11/anti-cheat.ts`
- 新建: `backend/src/services/games/g11/types.ts`
- 新建: `backend/src/routers/v1/games/g11-poetry-contest.ts`
- 新建: `backend/src/repositories/g11-poetry-questions.repo.ts`
- 新建: `backend/src/repositories/g11-poetry-collection.repo.ts`
- 新建: `backend/src/repositories/g11-player-stats.repo.ts`
- 新建: `backend/src/repositories/g11-weekly-events.repo.ts`
- 新建: `supabase/migrations/XXXXXX_g11_poetry_contest.sql`
- 新建: `scripts/seed-g11-questions.sql`
- 修改: `backend/src/routers/v1/index.ts` — 注册 G11 路由

## 依赖

- 前置: T06-013（游戏通用系统集成验证完成）
- 前置: T06-005（匹配系统 — WebSocket 基础）
- 前置: T06-006（会话/结算 API — 对接接口）
- 后续: T09-006（G11 前端 Phaser 游戏场景）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 单人模式开始一轮答题  
   **WHEN** 出题引擎生成 10 题  
   **THEN** 题型 ≥5 种混合，难度前易后难，不与最近 50 题重复

2. **GIVEN** 玩家连续答对 5 题  
   **WHEN** 第 6 题答对  
   **THEN** 连击倍率 = 2.0，得分 = base_score × 2.0 + speed_bonus

3. **GIVEN** 连对 8 题后  
   **WHEN** 第 9 题答错  
   **THEN** 扣 50 分，连击归零，下一题连击从 0 重新计

4. **GIVEN** 多人模式抢答题  
   **WHEN** 两名玩家在 200ms 内先后按下抢答  
   **THEN** 系统使用服务端时间戳裁定，最快者获答题权，200ms 内视为同时则进一步比较

5. **GIVEN** 4-8 人淘汰赛  
   **WHEN** 某玩家累计答错 3 次  
   **THEN** 该玩家被淘汰，广播淘汰消息，其余玩家继续

6. **GIVEN** 九宫格题型  
   **WHEN** 服务端下发题目  
   **THEN** 返回 9 个汉字 + 正确诗句答案，客户端可用于渲染 3×3 九宫格

7. **GIVEN** 看图猜诗/听音识诗题型  
   **WHEN** 服务端下发题目  
   **THEN** question_media 含有效的 image/audio URL，客户端可加载展示

8. **GIVEN** 答对新诗词题  
   **WHEN** 该诗词未收藏过  
   **THEN** 自动解锁加入诗词收藏册，收藏数 +1

9. **GIVEN** 100 人周赛  
   **WHEN** 报名 → 分区预赛 → 总决赛  
   **THEN** 4 区各 25 人同时答题 → 各区前 5 名晋级 → 20 人总决赛 → 冠军

10. **GIVEN** AI 对手难度"高级"  
    **WHEN** AI 答题  
    **THEN** 正确率约 88%，答题时间 3-5 秒，抢答速度较快

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=50 backend` — 后端无报错
4. 执行 Migration + Seed（5000+ 题目导入）
5. 验证出题引擎：混合题型 + 难度渐进 + 去重
6. 模拟完整单人答题：10 题 → 计分 → 连击加成
7. 验证连击计分：连对/断连/答错扣分
8. 模拟多人抢答：并发 buzz_in → 裁定
9. 验证淘汰赛流程：4 人 → 答错 3 次淘汰
10. 验证周赛 API 流程
11. 验收标准逐条验证

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] API 端点返回正确数据
- [ ] 控制台无 Error 级别日志
- [ ] 5000+ 题目导入完整，10+ 题型覆盖
- [ ] 连击倍率计算正确（2连=1.2, 3连=1.5, 5连=2.0, 8连=3.0, 10+=5.0）
- [ ] 答错扣 50 分且连击归零
- [ ] 抢答裁定基于服务端时间戳，200ms 容差正确
- [ ] 淘汰赛 3 次答错淘汰正确
- [ ] 周赛报名/分区/总决赛流程完整
- [ ] AI 对手 4 档行为符合预期
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

> 任务完成后，必须在 `/tasks/result/09-games-g9-g12/` 下创建同名结果文件

结果文件路径: `/tasks/result/09-games-g9-g12/T09-005-g11-poetry-contest-backend.md`

## 自检重点

- [ ] 安全: 所有答题验证和计分在服务端完成
- [ ] 安全: 抢答时间戳校验防止客户端伪造
- [ ] 安全: RLS 策略正确，用户只能访问自己的收藏和统计
- [ ] 性能: 出题查询 < 100ms（有索引支持）
- [ ] 性能: 计分引擎 < 10ms（纯计算）
- [ ] 性能: 周赛 100 人并发 WebSocket 稳定
- [ ] 并发: 多人同时提交答案无竞态（服务端序列化处理）
- [ ] 数据: 题目无重复，答案无歧义
- [ ] 数据: 连击倍率表与 PRD 一致
