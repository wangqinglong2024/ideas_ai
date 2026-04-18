# T09-007: G12 文豪争霸 — 后端题库与游戏逻辑

> 分类: 09-游戏 G9-G12 (Games G9-G12)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 16+

## 需求摘要

实现 G12 文豪争霸的后端游戏逻辑：综合题库（10000+ 题，覆盖 L1-L12 全部课程知识——拼音/汉字/词汇/语法/阅读/诗词/文言文/成语/文学/哲学/文化/历史，所有 12 级课程终极混合）、大逃杀淘汰引擎（8-16 人同场、答错即淘汰、16→8→4→2→1 逐轮淘汰）、难度递增机制（答题时间 20s→15s→12s→10s 逐轮缩短）、道具系统（复活币 ×1 / 提示 ×2 / 加时 ×1，每局限定数量）、赛季锦标赛（64 人对阵、多轮淘汰赛、赛季排名）、头衔系统（书生→学士→翰林→大学士→文豪→圣贤，圣贤为全服前 100）、知识覆盖雷达（追踪 12 大知识领域掌握度）、每日挑战、AI 对手（4 档难度）、防作弊。

## 相关上下文

- 产品需求: `product/apps/08-games-g9-g12/04-g12-literary-master.md` — G12 完整 PRD
  - §二 淘汰赛机制（答错即淘汰、逐轮加速）
  - §三 道具系统（复活币/提示/加时 + 限制规则）
  - §四 赛季锦标赛（64 人对阵表）
  - §五 头衔系统（6 阶 + 全服前 100 圣贤）
  - §六 知识覆盖雷达图（12 维度）
  - §七 验收标准 G12-AC01 ~ G12-AC12
- 游戏设计: `game/12-literary-master.md` — G12 完整玩法设计
  - §二 核心玩法（大逃杀淘汰 + 全知识覆盖）
  - §二.2 淘汰规则（答错即出局、16→8→4→2→1）
  - §二.3 难度递增（时间压缩 + 题目难度提升）
  - §二.4 道具与策略
  - §三 游戏模式（快速 8 人/排位 16 人/主题赛/赛季锦标赛 64 人）
  - §五 上瘾机制（头衔追求/赛季排名/知识雷达/成就/每日挑战）
  - §七 技术要点（大题库管理、淘汰状态机、WebSocket 广播、道具同步、赛季系统）
- 课程内容: 全 12 级课程（`course/level-01.md` ~ `course/level-12.md`）
- 文化内容: 全 12 个中国文化专题（`china/01-*.md` ~ `china/12-*.md`）
- 通用系统: `product/apps/05-game-common/` — 匹配/结算/段位
- 编码规范: `grules/05-coding-standards.md` §三 — 后端规范
- API 设计: `grules/04-api-design.md` — 统一响应格式
- 关联任务: T06-013（游戏通用系统）→ 本任务 → T09-008（G12 前端）

## 技术方案

### 数据库设计

#### 1. G12 综合题库表

```sql
-- 文豪争霸综合题库（10000+ 题，覆盖 L1-L12）
CREATE TABLE g12_master_questions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  knowledge_domain VARCHAR(30) NOT NULL CHECK (knowledge_domain IN (
    'pinyin',        -- 拼音（L1-L2）
    'hanzi',         -- 汉字书写与识别（L1-L4）
    'vocabulary',    -- 词汇（L1-L12）
    'grammar',       -- 语法（L3-L12）
    'reading',       -- 阅读理解（L5-L12）
    'listening',     -- 听力（L4-L12）
    'poetry',        -- 诗词（L7-L12）
    'classical',     -- 文言文（L9-L12）
    'idiom',         -- 成语典故（L6-L12）
    'literature',    -- 文学知识（L8-L12）
    'philosophy',    -- 哲学思想（L10-L12）
    'culture'        -- 文化常识（L1-L12）
  )),
  question_type VARCHAR(30) NOT NULL,            -- 题型（选择/填空/排序/匹配/判断等）
  question_text TEXT NOT NULL,
  question_media JSONB,                          -- {"image":"url","audio":"url"}
  options JSONB NOT NULL,
  correct_answer VARCHAR(100) NOT NULL,
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 10),  -- 10 级难度
  source_level INTEGER NOT NULL CHECK (source_level BETWEEN 1 AND 12),  -- 来源课程等级
  base_score INTEGER NOT NULL DEFAULT 100,
  explanation TEXT,
  tags JSONB DEFAULT '[]',
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g12_q_domain ON g12_master_questions(knowledge_domain);
CREATE INDEX idx_g12_q_diff ON g12_master_questions(difficulty);
CREATE INDEX idx_g12_q_level ON g12_master_questions(source_level);
CREATE INDEX idx_g12_q_type ON g12_master_questions(question_type);
CREATE INDEX idx_g12_q_tags ON g12_master_questions USING GIN(tags);

ALTER TABLE g12_master_questions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g12_q_read" ON g12_master_questions FOR SELECT TO authenticated USING (true);
CREATE POLICY "g12_q_admin" ON g12_master_questions FOR ALL TO service_role USING (true);
```

#### 2. G12 玩家档案表

```sql
-- 文豪争霸玩家档案
CREATE TABLE g12_player_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title VARCHAR(20) NOT NULL DEFAULT '书生' CHECK (title IN (
    '书生', '学士', '翰林', '大学士', '文豪', '圣贤'
  )),
  title_points INTEGER NOT NULL DEFAULT 0,          -- 头衔积分
  season_rank INTEGER,                               -- 赛季排名
  season_score INTEGER NOT NULL DEFAULT 0,           -- 赛季积分
  total_wins INTEGER NOT NULL DEFAULT 0,
  total_games INTEGER NOT NULL DEFAULT 0,
  best_placement INTEGER,                            -- 最佳名次
  max_survival_rounds INTEGER NOT NULL DEFAULT 0,    -- 最长存活轮次
  -- 知识覆盖雷达（12 维度掌握度 0-100）
  knowledge_radar JSONB NOT NULL DEFAULT '{
    "pinyin": 0, "hanzi": 0, "vocabulary": 0, "grammar": 0,
    "reading": 0, "listening": 0, "poetry": 0, "classical": 0,
    "idiom": 0, "literature": 0, "philosophy": 0, "culture": 0
  }',
  items_inventory JSONB NOT NULL DEFAULT '{
    "revival_coin": 1, "hint": 2, "time_extension": 1
  }',
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

ALTER TABLE g12_player_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g12_profile_own" ON g12_player_profiles FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

#### 3. G12 赛季表

```sql
-- 赛季管理
CREATE TABLE g12_seasons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_name VARCHAR(50) NOT NULL,               -- "第一赛季·春" 等
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'upcoming' CHECK (status IN (
    'upcoming', 'active', 'ending', 'completed'
  )),
  rewards JSONB NOT NULL DEFAULT '{}',            -- 赛季奖励配置
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 赛季锦标赛
CREATE TABLE g12_tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  season_id UUID NOT NULL REFERENCES g12_seasons(id),
  tournament_name VARCHAR(100) NOT NULL,
  max_players INTEGER NOT NULL DEFAULT 64,
  current_round INTEGER NOT NULL DEFAULT 0,       -- 当前轮次
  total_rounds INTEGER NOT NULL DEFAULT 6,        -- 64→32→16→8→4→2→1
  bracket JSONB NOT NULL DEFAULT '{}',            -- 对阵表
  status VARCHAR(20) NOT NULL DEFAULT 'registration',
  scheduled_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 锦标赛报名
CREATE TABLE g12_tournament_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES g12_tournaments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  seed_rank INTEGER,                              -- 种子排名
  current_round INTEGER NOT NULL DEFAULT 0,       -- 当前所在轮次
  is_eliminated BOOLEAN NOT NULL DEFAULT false,
  eliminated_at_round INTEGER,
  final_placement INTEGER,
  registered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(tournament_id, user_id)
);

CREATE INDEX idx_g12_tourn_season ON g12_tournaments(season_id);
CREATE INDEX idx_g12_tourn_reg ON g12_tournament_registrations(tournament_id);

ALTER TABLE g12_seasons ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g12_season_read" ON g12_seasons FOR SELECT TO authenticated USING (true);
CREATE POLICY "g12_season_admin" ON g12_seasons FOR ALL TO service_role USING (true);

ALTER TABLE g12_tournaments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g12_tourn_read" ON g12_tournaments FOR SELECT TO authenticated USING (true);
CREATE POLICY "g12_tourn_admin" ON g12_tournaments FOR ALL TO service_role USING (true);

ALTER TABLE g12_tournament_registrations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g12_reg_own" ON g12_tournament_registrations FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "g12_reg_read" ON g12_tournament_registrations FOR SELECT TO authenticated USING (true);
```

#### 4. G12 头衔排行表

```sql
-- 全服头衔排行（用于圣贤评定）
CREATE TABLE g12_title_leaderboard (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title_points INTEGER NOT NULL DEFAULT 0,
  current_title VARCHAR(20) NOT NULL DEFAULT '书生',
  server_rank INTEGER,                            -- 全服排名
  last_calculated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

CREATE INDEX idx_g12_title_rank ON g12_title_leaderboard(title_points DESC);

ALTER TABLE g12_title_leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g12_title_read" ON g12_title_leaderboard FOR SELECT TO authenticated USING (true);
CREATE POLICY "g12_title_own_write" ON g12_title_leaderboard FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);
```

### API 设计

#### 1. 淘汰赛开始

```
POST /api/v1/games/g12-literary-master/sessions/:sessionId/start
Headers: Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "data": {
    "players": [
      { "id": "uuid", "nickname": "...", "title": "翰林", "avatar": "..." }
    ],
    "total_players": 16,
    "current_round": 1,
    "time_limit": 20,
    "my_items": { "revival_coin": 1, "hint": 2, "time_extension": 1 }
  }
}
```

#### 2. 下发题目 + 答题

```
// WebSocket 下发题目
interface QuestionBroadcast {
  type: 'g12_question'
  round: number
  question_index: number
  question: {
    knowledge_domain: string
    question_type: string
    question_text: string
    options: Array<{ key: string, text: string }>
    time_limit: number       // 20→15→12→10
    base_score: number
    media: object | null
  }
  remaining_players: number
  timestamp: number
}

// 提交答案
POST /api/v1/games/g12-literary-master/sessions/:sessionId/answer
Body: {
  "question_index": 1,
  "answer": "B",
  "item_used": null           // "hint" | "time_extension" | null
}

Response 200:
{
  "code": 0,
  "data": {
    "is_correct": true,
    "correct_answer": "B",
    "score": 120,
    "total_score": 360,
    "knowledge_domain": "poetry",
    "explanation": "...",
    "eliminated": false
  }
}
```

#### 3. 淘汰广播

```typescript
interface EliminationBroadcast {
  type: 'g12_elimination'
  eliminated_player: {
    id: string
    nickname: string
    title: string
    final_score: number
    placement: number          // 第几名被淘汰（16→1）
  }
  remaining_players: number
  round: number
  timestamp: number
}

interface RevivalUsed {
  type: 'g12_revival'
  player_id: string
  nickname: string
  remaining_revival_coins: 0   // 只有 1 次
  timestamp: number
}
```

#### 4. 道具使用

```
POST /api/v1/games/g12-literary-master/sessions/:sessionId/use-item
Body: {
  "item_type": "hint",         // "revival_coin" | "hint" | "time_extension"
  "question_index": 5          // 提示/加时：当前题目；复活币：被淘汰时
}

Response 200:
{
  "code": 0,
  "data": {
    "item_type": "hint",
    "effect": {
      "eliminated_options": ["C", "D"]    // 提示：排除 2 个错误选项
    },
    "remaining_items": { "revival_coin": 1, "hint": 1, "time_extension": 1 }
  }
}
```

#### 5. 游戏结束 + 头衔更新

```typescript
interface GameEndBroadcast {
  type: 'g12_game_end'
  final_ranking: Array<{
    placement: number
    player_id: string
    nickname: string
    title: string
    score: number
    survived_rounds: number
  }>
  champion: {
    player_id: string
    nickname: string
    title: string
    crown_animation: true
  }
  rewards: Record<string, {
    exp: number
    gold: number
    title_points: number
    items_refill: boolean        // 道具是否补充
  }>
  timestamp: number
}

interface TitleUpdate {
  type: 'g12_title_update'
  player_id: string
  old_title: string
  new_title: string
  title_points: number
  server_rank: number | null     // 圣贤才有
  timestamp: number
}
```

#### 6. 赛季/锦标赛 API

```
GET /api/v1/games/g12-literary-master/season/current
  — 当前赛季信息

GET /api/v1/games/g12-literary-master/tournaments
  — 锦标赛列表

POST /api/v1/games/g12-literary-master/tournaments/:id/register
  — 报名锦标赛

GET /api/v1/games/g12-literary-master/tournaments/:id/bracket
  — 对阵表

GET /api/v1/games/g12-literary-master/leaderboard
  — 头衔排行榜（全服 Top 100 + 我的排名）

GET /api/v1/games/g12-literary-master/profile
  — 我的档案（头衔 + 知识雷达 + 统计 + 道具库存）

GET /api/v1/games/g12-literary-master/daily
  — 每日挑战
```

### 服务端核心逻辑

#### 淘汰引擎

```typescript
// backend/src/services/games/g12/elimination-engine.ts

class G12EliminationEngine {
  /**
   * 淘汰赛状态机
   * States: WAITING → QUESTIONING → ANSWERING → SETTLING → NEXT_QUESTION → GAME_OVER
   * 
   * 答错即淘汰（除非使用复活币）
   * 16→8→4→2→1 逐轮淘汰
   * 每轮 3-5 题，难度渐进
   */
  
  /** 生成当轮题目（难度根据轮次递增 + 覆盖多个知识领域） */
  generateRoundQuestions(
    round: number,
    totalRounds: number,
    usedQuestionIds: string[]
  ): Promise<Question[]>

  /** 处理答案 + 判定淘汰 */
  processAnswer(
    sessionId: string,
    playerId: string,
    answer: string,
    itemUsed: string | null
  ): Promise<AnswerResult>

  /** 淘汰处理（广播淘汰消息 + 更新排名） */
  eliminatePlayer(sessionId: string, playerId: string): Promise<void>

  /** 复活币处理 */
  processRevival(sessionId: string, playerId: string): Promise<boolean>

  /** 难度递增：时间限制缩短 */
  getTimeLimitForRound(round: number): number
  // round 1: 20s → round 2: 15s → round 3: 12s → round 4+: 10s

  /** 判定游戏结束（只剩 1 人） */
  checkGameOver(sessionId: string): Promise<boolean>
}
```

#### 道具系统

```typescript
// backend/src/services/games/g12/item-service.ts

class G12ItemService {
  /**
   * 道具效果
   * - revival_coin: 被淘汰时复活，每局限用 1 次
   * - hint: 排除 2 个错误选项，每局限用 2 次
   * - time_extension: 当前题目 +10 秒，每局限用 1 次
   */
  
  /** 使用道具 */
  async useItem(
    sessionId: string,
    playerId: string,
    itemType: ItemType,
    questionIndex: number
  ): Promise<ItemEffect>

  /** 校验道具可用性（库存 + 使用时机） */
  validateItemUse(
    itemType: ItemType,
    inventory: ItemInventory,
    gameState: GameState
  ): boolean

  /** 每局开始时初始化道具（从玩家永久库存扣除 or 每局免费配给） */
  initializeSessionItems(playerId: string): Promise<ItemInventory>

  /** 道具补充（每日登录 / 商城购买 / 赛季奖励） */
  async refillItems(playerId: string, items: Partial<ItemInventory>): Promise<void>
}
```

#### 头衔系统

```typescript
// backend/src/services/games/g12/title-service.ts

class G12TitleService {
  /**
   * 头衔阶梯（基于累计头衔积分）
   * 书生: 0+
   * 学士: 500+
   * 翰林: 2000+
   * 大学士: 5000+
   * 文豪: 15000+
   * 圣贤: 50000+ AND 全服排名前 100
   */
  
  /** 计算头衔积分增减（基于对局名次 + 存活轮次 + 题目领域覆盖） */
  calculateTitlePoints(gameResult: GameResult): number

  /** 更新头衔（积分变化 → 查表 → 可能晋升/降级） */
  async updateTitle(userId: string, pointsChange: number): Promise<TitleUpdate | null>

  /** 圣贤评定（每日凌晨计算全服前 100） */
  async evaluateSageTitle(): Promise<void>

  /** 获取全服头衔排行榜 */
  async getLeaderboard(limit: number): Promise<LeaderboardEntry[]>
}
```

#### 知识雷达

```typescript
// backend/src/services/games/g12/knowledge-radar-service.ts

class G12KnowledgeRadarService {
  /**
   * 12 维度知识覆盖追踪
   * 每次答题更新对应维度的掌握度
   * 掌握度 = 最近 100 题该领域正确率 × 100
   */
  
  /** 更新知识雷达（答对/答错某领域题目） */
  async updateRadar(
    userId: string,
    domain: KnowledgeDomain,
    isCorrect: boolean
  ): Promise<KnowledgeRadar>

  /** 获取知识雷达数据（12 维度） */
  async getRadar(userId: string): Promise<KnowledgeRadar>

  /** 生成个人弱项报告 */
  async getWeaknessReport(userId: string): Promise<WeaknessReport>
}
```

#### 赛季锦标赛

```typescript
// backend/src/services/games/g12/tournament-service.ts

class G12TournamentService {
  /** 创建锦标赛（64 人对阵、6 轮淘汰） */
  async createTournament(seasonId: string, config: TournamentConfig): Promise<Tournament>

  /** 报名 + 种子排名（根据赛季积分排序） */
  async register(tournamentId: string, userId: string): Promise<void>

  /** 生成对阵表（种子对阵规则：1 vs 64, 2 vs 63 ...） */
  async generateBracket(tournamentId: string): Promise<Bracket>

  /** 推进轮次（当前轮所有比赛结束 → 胜者进入下一轮） */
  async advanceRound(tournamentId: string): Promise<void>

  /** 赛季结算（排名奖励 + 头衔积分 + 称号颁发） */
  async settlesSeason(seasonId: string): Promise<void>
}
```

#### AI 对手

```typescript
// backend/src/services/games/g12/ai-master.ts

class G12AIMaster {
  /**
   * AI 文豪（4 档难度，模拟真实淘汰赛行为）
   * - 初级(书生): 55% 正确率，不使用道具
   * - 中级(学士): 70% 正确率，偶尔使用提示
   * - 高级(翰林): 85% 正确率，合理使用道具
   * - 大师(大学士): 93% 正确率，完美道具策略
   */
  
  answerQuestion(question: Question, difficulty: AIDifficulty): AIAnswer

  /** AI 道具使用决策 */
  decideItemUse(difficulty: AIDifficulty, gameState: GameState): ItemDecision

  /** AI 复活决策（大师级会在关键时刻使用复活币） */
  decideRevival(difficulty: AIDifficulty, round: number, totalRounds: number): boolean
}
```

### 防作弊机制

```typescript
class G12AntiCheat {
  /** 答题时间校验（超时视为未答 → 淘汰） */
  validateAnswerTime(submitTime: number, questionStartTime: number, timeLimit: number): boolean

  /** 道具使用合法性（库存 + 时机 + 次数） */
  validateItemUse(playerId: string, itemType: string, sessionState: SessionState): boolean

  /** 连续快速答对检测（< 1 秒连续答对 5 题 → 可疑） */
  detectSpeedHack(answerTimes: number[]): boolean

  /** 复活币篡改检测（服务端库存为准） */
  validateRevivalInventory(playerId: string): Promise<boolean>
}
```

## 范围（做什么）

- 创建 G12 综合题库表 + 玩家档案表 + 赛季表 + 锦标赛表 + 头衔排行表（Migration + RLS）
- 导入 10000+ 综合题目（覆盖 L1-L12 全 12 个知识领域、10 级难度）
- 实现淘汰引擎（答错即淘汰 + 16→1 逐轮 + 难度递增时间缩短）
- 实现道具系统（复活币/提示/加时 + 使用校验 + 库存管理）
- 实现头衔系统（6 阶头衔 + 积分计算 + 圣贤全服前 100 评定）
- 实现知识覆盖雷达（12 维度追踪 + 弱项报告）
- 实现赛季锦标赛（64 人对阵 + 种子排名 + 多轮淘汰 + 赛季结算）
- 实现每日挑战
- 实现 AI 对手（4 档难度 + 道具策略）
- 实现所有 WebSocket 广播（题目下发/淘汰/复活/游戏结束/头衔更新）
- 实现防作弊模块
- 与 T06-006 结算 API 对接

## 边界（不做什么）

- 不写 Phaser 前端游戏场景（T09-008）
- 不写匹配系统（T06-005 已完成）
- 不写结算页面前端（T06-011 已完成）
- 不写管理后台题库管理（T14 系列）
- 不实现真人直播功能
- 不实现付费道具购买（商城 T06-012 负责）

## 涉及文件

- 新建: `backend/src/services/games/g12/elimination-engine.ts`
- 新建: `backend/src/services/games/g12/item-service.ts`
- 新建: `backend/src/services/games/g12/title-service.ts`
- 新建: `backend/src/services/games/g12/knowledge-radar-service.ts`
- 新建: `backend/src/services/games/g12/tournament-service.ts`
- 新建: `backend/src/services/games/g12/ai-master.ts`
- 新建: `backend/src/services/games/g12/anti-cheat.ts`
- 新建: `backend/src/services/games/g12/types.ts`
- 新建: `backend/src/routers/v1/games/g12-literary-master.ts`
- 新建: `backend/src/repositories/g12-master-questions.repo.ts`
- 新建: `backend/src/repositories/g12-player-profiles.repo.ts`
- 新建: `backend/src/repositories/g12-seasons.repo.ts`
- 新建: `backend/src/repositories/g12-tournaments.repo.ts`
- 新建: `backend/src/repositories/g12-title-leaderboard.repo.ts`
- 新建: `supabase/migrations/XXXXXX_g12_literary_master.sql`
- 新建: `scripts/seed-g12-questions.sql`
- 修改: `backend/src/routers/v1/index.ts` — 注册 G12 路由

## 依赖

- 前置: T06-013（游戏通用系统集成验证完成）
- 前置: T06-005（匹配系统 — WebSocket 基础）
- 前置: T06-006（会话/结算 API — 对接接口）
- 后续: T09-008（G12 前端 Phaser 游戏场景）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 16 人排位赛开始  
   **WHEN** 第一轮题目下发  
   **THEN** 所有 16 人同时收到同一题目，时间限制 20 秒

2. **GIVEN** 某玩家答错  
   **WHEN** 未使用复活币  
   **THEN** 该玩家立即被淘汰，广播淘汰消息，剩余人数 -1

3. **GIVEN** 某玩家答错但持有复活币  
   **WHEN** 使用复活币  
   **THEN** 复活成功，继续比赛，复活币库存归零，广播复活消息

4. **GIVEN** 进入第 2 轮（剩 8 人）  
   **WHEN** 题目下发  
   **THEN** 时间限制缩短为 15 秒，题目难度提升

5. **GIVEN** 玩家使用提示道具  
   **WHEN** 当前题目有 4 个选项  
   **THEN** 排除 2 个错误选项，仅剩 2 个选项展示

6. **GIVEN** 只剩最后 1 名玩家  
   **WHEN** 游戏结束  
   **THEN** 冠军产生，广播最终排名 + 奖励 + 头衔积分变化

7. **GIVEN** 玩家累计头衔积分达到 2000  
   **WHEN** 头衔更新  
   **THEN** 从"学士"晋升为"翰林"，广播头衔变化

8. **GIVEN** 玩家头衔积分 50000+ 且全服排名前 100  
   **WHEN** 每日圣贤评定  
   **THEN** 获得"圣贤"头衔

9. **GIVEN** 玩家多次对局后  
   **WHEN** 查看知识雷达  
   **THEN** 12 维度掌握度数据基于最近 100 题各领域正确率

10. **GIVEN** 64 人赛季锦标赛  
    **WHEN** 赛程进行  
    **THEN** 种子对阵正确（1vs64 等）→ 6 轮淘汰 → 冠军

11. **GIVEN** AI 大师级对手  
    **WHEN** AI 参与淘汰赛  
    **THEN** 正确率约 93%，会在关键时刻使用道具（如后期使用复活币）

12. **GIVEN** 题目覆盖  
    **WHEN** 一场 16 人淘汰赛（约 20-30 题）  
    **THEN** 题目覆盖 ≥6 个知识领域，不重复

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=50 backend` — 后端无报错
4. 执行 Migration + Seed（10000+ 题目导入）
5. 验证题库覆盖：12 知识领域均有题目，10 级难度分布合理
6. 模拟 16 人淘汰赛完整流程
7. 验证答错淘汰 + 复活币 + 提示 + 加时道具
8. 验证难度递增（时间 20→15→12→10）
9. 验证头衔积分计算 + 晋升
10. 验证知识雷达更新
11. 验证赛季锦标赛流程
12. 验收标准逐条验证

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] API 端点返回正确数据
- [ ] 控制台无 Error 级别日志
- [ ] 10000+ 题目导入完整，12 领域覆盖
- [ ] 答错即淘汰逻辑正确
- [ ] 复活币/提示/加时三种道具效果正确
- [ ] 难度递增时间压缩正确
- [ ] 头衔 6 阶晋升 + 圣贤评定正确
- [ ] 知识雷达 12 维度更新正确
- [ ] 64 人锦标赛对阵 + 6 轮淘汰正确
- [ ] AI 4 档行为符合预期
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

> 任务完成后，必须在 `/tasks/result/09-games-g9-g12/` 下创建同名结果文件

结果文件路径: `/tasks/result/09-games-g9-g12/T09-007-g12-literary-master-backend.md`

## 自检重点

- [ ] 安全: 淘汰判定、道具扣减、积分计算全部服务端完成
- [ ] 安全: 道具库存服务端为准，防客户端篡改
- [ ] 安全: RLS 策略正确
- [ ] 性能: 16 人同时答题 WebSocket 广播 < 100ms
- [ ] 性能: 题库查询有索引支持
- [ ] 性能: 头衔排行榜查询高效（索引 + 缓存）
- [ ] 并发: 多人同时提交答案无竞态
- [ ] 数据: 10000+ 题目无重复答案歧义
- [ ] 数据: 头衔积分阈值与 PRD 一致
- [ ] 数据: 知识雷达 12 维度与 knowledge_domain 枚举一致
