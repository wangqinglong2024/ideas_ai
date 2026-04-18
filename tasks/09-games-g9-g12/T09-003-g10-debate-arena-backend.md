# T09-003: G10 辩论擂台 — 后端题库与游戏逻辑

> 分类: 09-游戏 G9-G12 (Games G9-G12)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 14+

## 需求摘要

实现 G10 辩论擂台的后端游戏逻辑：辩题库管理（含正反方预设论据）、论据卡牌系统（6 种卡牌类型 + 攻击力/防御力预设数值 + 稀有度分级）、卡牌 CCG 对战引擎（3 回合制出牌 + 反驳机制 + 说服力结算——完全基于预设固定数值，非 AI 动态评分）、卡组构筑管理（15 张卡组 + 多套卡组保存）、卡牌获取/升级系统（对战奖励/每日签到/成就解锁）、四种子模式服务端逻辑（单人练习/1v1 排位/4 人淘汰赛/每日辩题）、AI 辩手（4 档难度，模拟不同水平出牌策略）、防作弊。题库从 L10 课程议论文素材、论证方法、名言警句导入。

## 相关上下文

- 产品需求: `product/apps/08-games-g9-g12/02-g10-debate-arena.md` — G10 完整 PRD
  - §二 手牌展示与出牌交互（5 张手牌、攻防数值、出牌区）
  - §三 3 回合流程（出牌 → 数值结算 → 回合结果）
  - §四 反驳卡机制（防御方出反驳卡抵消说服力）
  - §五 卡牌收集与升级系统
  - §六 确定性数值结算（**非 AI 动态评分**）
  - §七 验收标准 G10-AC01 ~ G10-AC08
- 游戏设计: `game/10-debate-arena.md` — G10 完整玩法设计
  - §二 核心玩法（辩题分配、手牌、回合、说服力对比）
  - §二.2 卡牌类型（事实论据/道理论据/类比论证/反证法/情感牌/逻辑陷阱 6 种）
  - §二.3 回合流程（3 回合，含反驳阶段）
  - §二.4 卡牌获取（课程/战斗/签到/成就）
  - §三 游戏模式（单人练习/1v1 排位/4 人淘汰/每日辩题）
  - §五 上瘾机制（卡牌收集/卡组构筑/段位/成就）
  - §七 技术要点（卡牌引擎、数据存储、出牌验证、WebSocket 同步、匹配、平衡性）
- 课程内容: `course/level-10.md` — L10 专业中文（议论文、论证方法、名言警句）
- 哲学参考: `china/09-philosophy-wisdom.md` — 哲学思想（辩论话题来源）
- 文学参考: `china/07-classic-literature.md` — 文学经典（名言引用来源）
- 通用系统: `product/apps/05-game-common/` — 匹配、结算、段位规则
- 编码规范: `grules/05-coding-standards.md` §三 — 后端 Express 规范、三层分离
- API 设计: `grules/04-api-design.md` — 统一响应格式、错误码
- 关联任务: T06-013（游戏通用系统集成验证）→ 本任务 → T09-004（G10 前端）

## 技术方案

### 数据库设计

#### 1. G10 辩题库表

```sql
-- 辩论擂台辩题库
CREATE TABLE g10_debate_topics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_text TEXT NOT NULL,                     -- 辩题（如 "科技发展利大于弊？"）
  topic_category VARCHAR(30) NOT NULL,          -- 分类（社会/科技/教育/哲学/文化/经济）
  pro_position TEXT NOT NULL,                   -- 正方立场描述
  con_position TEXT NOT NULL,                   -- 反方立场描述
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  related_knowledge JSONB DEFAULT '[]',         -- 关联课程知识点
  source VARCHAR(50),                           -- 来源（L10 课程/哲学经典/时事热点）
  is_daily_eligible BOOLEAN NOT NULL DEFAULT true,  -- 是否可作为每日辩题
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g10_topic_category ON g10_debate_topics(topic_category);
CREATE INDEX idx_g10_topic_difficulty ON g10_debate_topics(difficulty);
CREATE INDEX idx_g10_topic_daily ON g10_debate_topics(is_daily_eligible);

ALTER TABLE g10_debate_topics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g10_topic_read" ON g10_debate_topics FOR SELECT TO authenticated USING (true);
CREATE POLICY "g10_topic_admin" ON g10_debate_topics FOR ALL TO service_role USING (true);
```

#### 2. G10 论据卡牌模板表

```sql
-- 论据卡牌模板（全局定义，所有同类卡牌基础属性一致）
CREATE TABLE g10_card_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  card_name VARCHAR(50) NOT NULL,               -- 卡牌名称
  card_type VARCHAR(20) NOT NULL CHECK (card_type IN (
    'fact', 'reasoning', 'analogy', 'rebuttal', 'emotion', 'logic_trap'
  )),
  -- fact=事实论据 reasoning=道理论据 analogy=类比论证 rebuttal=反证法 emotion=情感牌 logic_trap=逻辑陷阱
  rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('common', 'good', 'rare', 'legendary')),
  -- common=白 good=绿 rare=蓝 legendary=金
  base_attack INTEGER NOT NULL,                 -- 基础攻击力（说服力）
  base_defense INTEGER NOT NULL,                -- 基础防御力（逻辑严密度）
  special_effect JSONB,                         -- 特殊效果
  -- {"type":"reduce_opponent_last","value":50} — 降低对方上一张牌 50% 效果
  -- {"type":"boost_next_card","value":30} — 下一张卡效果 +30%
  -- {"type":"emotional_appeal","value":20} — 全场持续加成 20 分
  card_text TEXT NOT NULL,                      -- 卡牌论据文本内容
  flavor_text TEXT,                             -- 风味文字（名言/出处）
  topic_categories JSONB DEFAULT '[]',          -- 适用辩题分类
  upgrade_cost JSONB NOT NULL DEFAULT '{"gold":100}',  -- 升级消耗
  max_level INTEGER NOT NULL DEFAULT 5,
  icon_key VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g10_card_type ON g10_card_templates(card_type);
CREATE INDEX idx_g10_card_rarity ON g10_card_templates(rarity);

ALTER TABLE g10_card_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g10_card_tmpl_read" ON g10_card_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "g10_card_tmpl_admin" ON g10_card_templates FOR ALL TO service_role USING (true);
```

#### 3. G10 用户卡牌收藏表

```sql
-- 用户持有的卡牌
CREATE TABLE g10_user_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_template_id UUID NOT NULL REFERENCES g10_card_templates(id) ON DELETE CASCADE,
  card_level INTEGER NOT NULL DEFAULT 1 CHECK (card_level BETWEEN 1 AND 5),
  -- 升级后攻防各 +10%
  duplicate_count INTEGER NOT NULL DEFAULT 0,   -- 额外获得的副本数（用于升级材料）
  obtained_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(user_id, card_template_id)
);

CREATE INDEX idx_g10_user_cards_user ON g10_user_cards(user_id);

ALTER TABLE g10_user_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g10_cards_own" ON g10_user_cards FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

#### 4. G10 卡组表

```sql
-- 用户卡组（15 张卡组成一套）
CREATE TABLE g10_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  deck_name VARCHAR(20) NOT NULL DEFAULT '默认卡组',
  card_ids JSONB NOT NULL DEFAULT '[]',         -- 卡牌 ID 数组（15 张）
  strategy_tag VARCHAR(20),                     -- 策略标签（事实流/情感流/逻辑流/均衡流）
  is_active BOOLEAN NOT NULL DEFAULT true,      -- 是否当前使用的卡组
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g10_deck_user ON g10_decks(user_id);

ALTER TABLE g10_decks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g10_deck_own" ON g10_decks FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

#### 5. G10 每日辩题表

```sql
CREATE TABLE g10_daily_debates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id UUID NOT NULL REFERENCES g10_debate_topics(id),
  debate_date DATE NOT NULL UNIQUE,
  pro_wins INTEGER NOT NULL DEFAULT 0,          -- 正方胜场数
  con_wins INTEGER NOT NULL DEFAULT 0,          -- 反方胜场数
  total_participants INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g10_daily_date ON g10_daily_debates(debate_date);

ALTER TABLE g10_daily_debates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g10_daily_read" ON g10_daily_debates FOR SELECT TO authenticated USING (true);
CREATE POLICY "g10_daily_admin" ON g10_daily_debates FOR ALL TO service_role USING (true);
```

### API 设计

#### 1. 获取辩题 + 分配正反方

```
POST /api/v1/games/g10-debate-arena/sessions/:sessionId/start
Headers: Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "data": {
    "topic": {
      "id": "uuid",
      "topic_text": "科技发展利大于弊？",
      "pro_position": "科技推动社会进步，提高生活质量",
      "con_position": "科技带来环境污染、隐私侵犯等问题"
    },
    "my_side": "pro",            // "pro" | "con" 随机分配
    "opponent_side": "con",
    "my_hand": [                 // 从卡组随机抽 5 张
      {
        "id": "uuid",
        "card_name": "数据铁证",
        "card_type": "fact",
        "rarity": "rare",
        "attack": 9,
        "defense": 6,
        "card_text": "据统计，互联网使全球 GDP 增长了...",
        "special_effect": null,
        "level": 2
      }
    ]
  }
}
```

#### 2. 出牌

```
POST /api/v1/games/g10-debate-arena/sessions/:sessionId/play-card
Headers: Authorization: Bearer {token}
Body: {
  "round": 1,
  "card_id": "uuid",
  "target_card_id": null          // 反驳卡专用：指定对方哪张牌
}

Response 200:
{
  "code": 0,
  "data": {
    "round": 1,
    "my_play": {
      "card": { "id":"uuid", "card_name":"数据铁证", "attack":9, "defense":6 },
      "effective_attack": 9,       // 经特殊效果/升级后的实际说服力
      "effective_defense": 6
    },
    "opponent_play": null,         // 等待对手出牌
    "status": "waiting_opponent"
  }
}
```

#### 3. 回合结算

```
// 双方出牌完毕后服务端自动结算
// 通过 WebSocket 推送结算结果

interface RoundSettlement {
  type: 'g10_round_result'
  round: number
  pro_card: CardPlayDetail
  con_card: CardPlayDetail
  pro_effective_score: number      // 正方本回合有效说服力
  con_effective_score: number      // 反方本回合有效说服力
  rebuttal_applied: boolean        // 是否有反驳卡生效
  rebuttal_detail: string | null   // 反驳描述
  cumulative_scores: {
    pro: number
    con: number
  }
  round_winner: 'pro' | 'con' | 'tie'
  timestamp: number
}
```

#### 4. 游戏最终结算

```
interface GameSettlement {
  type: 'g10_game_end'
  final_scores: { pro: number, con: number }
  winner_side: 'pro' | 'con'
  winner_player_id: string
  loser_player_id: string
  rewards: {
    winner: { exp: number, gold: number, card_drop: CardInfo | null }
    loser: { exp: number, gold: number }
  }
  rank_change: Record<string, number>    // 段位星数变化
  timestamp: number
}
```

#### 5. 卡牌管理 API

```
GET /api/v1/games/g10-debate-arena/cards
  — 获取用户所有卡牌

POST /api/v1/games/g10-debate-arena/cards/:cardId/upgrade
  — 升级卡牌（消耗副本 + 金币）

GET /api/v1/games/g10-debate-arena/decks
  — 获取用户所有卡组

POST /api/v1/games/g10-debate-arena/decks
  — 创建/更新卡组（15 张卡牌 ID）

PUT /api/v1/games/g10-debate-arena/decks/:deckId/activate
  — 设置当前使用卡组
```

#### 6. PK / 多人 WebSocket

```typescript
// 4 人淘汰赛消息
interface TournamentBracket {
  type: 'g10_tournament_bracket'
  matches: [
    { player1: string, player2: string, round: 'semi' },
    { player1: string, player2: string, round: 'semi' }
  ]
  timestamp: number
}

interface TournamentAdvance {
  type: 'g10_tournament_advance'
  winner_id: string
  next_round: 'final'
  timestamp: number
}
```

### 服务端核心逻辑

#### CCG 对战引擎

```typescript
// backend/src/services/games/g10/debate-engine.ts

class G10DebateEngine {
  /**
   * 回合结算逻辑（确定性数值，非 AI 评分）
   * 1. 双方出牌 → 获取卡牌基础攻防
   * 2. 应用卡牌等级加成（每级 +10%）
   * 3. 应用特殊效果（逻辑陷阱降低/情感加成/反驳抵消）
   * 4. 比较双方有效说服力 → 高者赢得本回合
   * 5. 累计 3 回合说服力总和 → 判定胜负
   */
  settleRound(proCard: PlayedCard, conCard: PlayedCard, context: RoundContext): RoundResult

  /** 计算卡牌有效攻击力 = base_attack × (1 + (level-1) × 0.1) + 特殊效果加成 */
  calculateEffectiveAttack(card: PlayedCard, context: RoundContext): number

  /** 反驳卡处理：rebuttal 类型卡只能在回合 2-3 出，抵消对方上回合说服力 */
  applyRebuttal(rebuttalCard: PlayedCard, targetCard: PlayedCard): RebuttalResult

  /** 逻辑陷阱卡：降低对方上一张牌 50% 效果 */
  applyLogicTrap(trapCard: PlayedCard, targetCard: PlayedCard): number

  /** 情感牌：全场持续加成（影响当前回合 + 后续回合） */
  applyEmotionalAppeal(emotionCard: PlayedCard): number

  /** 3 回合总分结算 */
  finalSettlement(rounds: RoundResult[]): GameResult
}
```

#### 卡组与发牌逻辑

```typescript
// backend/src/services/games/g10/deck-service.ts

class G10DeckService {
  /** 验证卡组合法性（15 张、不重复、用户持有） */
  validateDeck(userId: string, cardIds: string[]): Promise<boolean>

  /** 从卡组随机抽 5 张手牌 */
  drawHand(deckCardIds: string[]): string[]

  /** 卡牌升级（消耗副本 + 金币，每级攻防 +10%） */
  async upgradeCard(userId: string, cardId: string): Promise<UpgradeResult>

  /** 新卡牌发放（对战奖励/签到/成就） */
  async grantCard(userId: string, templateId: string): Promise<GrantResult>

  /** 初始卡牌发放（新用户首次进入游戏） */
  async grantStarterDeck(userId: string): Promise<void>
}
```

#### AI 辩手

```typescript
// backend/src/services/games/g10/ai-debater.ts

class G10AIDebater {
  /**
   * AI 出牌策略（4 档难度）
   * - 初级：随机出牌，不使用特殊效果卡
   * - 中级：优先出高攻牌，偶尔使用反驳卡
   * - 高级：根据对手上回合出牌调整策略，善用逻辑陷阱
   * - 大师：完美策略（先出情感牌持续加成，再出高攻牌，最后用反驳收尾）
   */
  selectCard(hand: CardInfo[], difficulty: AIDifficulty, context: GameContext): CardInfo

  /** AI 思考延迟（模拟真人，1-5 秒随难度递减） */
  getThinkingDelay(difficulty: AIDifficulty): number
}
```

#### 每日辩题

```typescript
// backend/src/services/games/g10/daily-debate-service.ts

class G10DailyDebateService {
  /** 每日 0 点选择一个热点辩题 */
  async selectDailyTopic(): Promise<DailyDebate>

  /** 记录每日辩题的正反方胜率统计 */
  async recordResult(debateId: string, winnerSide: 'pro' | 'con'): Promise<void>

  /** 获取今日辩题和全服正反方胜率 */
  async getDailyStats(): Promise<DailyDebateStats>
}
```

### 防作弊机制

```typescript
class G10AntiCheat {
  /** 出牌合法性校验：卡牌必须在手牌中 */
  validateCardInHand(cardId: string, hand: string[]): boolean

  /** 出牌时机校验：必须在自己的回合 */
  validateTurn(playerId: string, currentTurnPlayerId: string): boolean

  /** 数值篡改检测：服务端重新计算攻防，与客户端声称不一致则拒绝 */
  validateCardStats(cardId: string, claimedStats: CardStats): Promise<boolean>

  /** 反驳卡使用时机校验：只能在回合 2-3 使用 */
  validateRebuttalTiming(round: number, cardType: string): boolean
}
```

## 范围（做什么）

- 创建 G10 辩题库表 + 卡牌模板表 + 用户卡牌表 + 卡组表 + 每日辩题表（Migration + RLS）
- 从 L10 课程导入辩题（含正反方立场描述、分类、来源）
- 创建 100+ 张论据卡牌模板（6 种类型、4 种稀有度、预设攻防数值、特殊效果）
- 实现 CCG 对战引擎（3 回合出牌 + 预设固定数值结算 + 反驳/逻辑陷阱/情感牌特殊效果）
- 实现卡组管理（创建/编辑/验证/激活 + 初始卡组发放）
- 实现卡牌获取/升级系统
- 实现发牌逻辑（从卡组随机抽 5 张手牌）
- 实现 AI 辩手（4 档难度出牌策略）
- 实现 1v1 排位 WebSocket 对战
- 实现 4 人淘汰赛 WebSocket 流程（半决赛 → 决赛）
- 实现每日辩题（选题 + 统计正反方胜率）
- 实现防作弊模块
- 与 T06-006 结算 API 对接

## 边界（不做什么）

- 不写 Phaser 前端游戏场景（T09-004）
- 不写匹配系统（T06-005 已完成）
- 不实现 AI 动态评分（明确使用预设固定数值）
- 不写结算页面前端（T06-011 已完成）
- 不写管理后台卡牌管理（T14 系列）
- 不实现打字输入功能（PRD 已改为卡牌制，非打字辩论）

## 涉及文件

- 新建: `backend/src/services/games/g10/debate-engine.ts`
- 新建: `backend/src/services/games/g10/deck-service.ts`
- 新建: `backend/src/services/games/g10/ai-debater.ts`
- 新建: `backend/src/services/games/g10/daily-debate-service.ts`
- 新建: `backend/src/services/games/g10/anti-cheat.ts`
- 新建: `backend/src/services/games/g10/types.ts`
- 新建: `backend/src/routers/v1/games/g10-debate-arena.ts`
- 新建: `backend/src/repositories/g10-debate-topics.repo.ts`
- 新建: `backend/src/repositories/g10-card-templates.repo.ts`
- 新建: `backend/src/repositories/g10-user-cards.repo.ts`
- 新建: `backend/src/repositories/g10-decks.repo.ts`
- 新建: `backend/src/repositories/g10-daily-debates.repo.ts`
- 新建: `supabase/migrations/XXXXXX_g10_debate_arena.sql`
- 新建: `scripts/seed-g10-topics.sql`
- 新建: `scripts/seed-g10-cards.sql`
- 修改: `backend/src/routers/v1/index.ts` — 注册 G10 路由

## 依赖

- 前置: T06-013（游戏通用系统集成验证完成）
- 前置: T06-005（匹配系统 — WebSocket 基础）
- 前置: T06-006（会话/结算 API — 对接接口）
- 后续: T09-004（G10 前端 Phaser 游戏场景）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 新用户首次进入 G10  
   **WHEN** 初始化卡牌  
   **THEN** 自动发放基础卡组（15 张常见卡牌），创建默认卡组

2. **GIVEN** 1v1 对局开始，辩题已分配  
   **WHEN** 双方各抽 5 张手牌  
   **THEN** 手牌从各自激活卡组中随机抽取，卡牌数据含攻防数值 + 特殊效果

3. **GIVEN** 第 1 回合，正方出"事实论据卡"（攻击力 9，等级 2）  
   **WHEN** 结算有效说服力  
   **THEN** 有效攻击 = 9 × (1 + (2-1) × 0.1) = 9.9，取整为 10

4. **GIVEN** 第 2 回合，反方出"反证法卡"指定正方上回合的牌  
   **WHEN** 反驳结算  
   **THEN** 正方上回合累计说服力被削减（反驳卡防御力部分抵消），反驳详情在结果中说明

5. **GIVEN** 正方出"逻辑陷阱卡"  
   **WHEN** 特殊效果触发  
   **THEN** 反方上一张牌的效果降低 50%

6. **GIVEN** 正方出"情感牌"（特殊效果：全场持续加成 20 分）  
   **WHEN** 后续回合结算  
   **THEN** 正方每回合额外 +20 说服力

7. **GIVEN** 3 回合对战完毕  
   **WHEN** 最终结算  
   **THEN** 累计说服力高者获胜，胜者获得经验 + 金币 + 概率掉落新卡牌

8. **GIVEN** AI 辩手难度为"高级"  
   **WHEN** AI 出牌  
   **THEN** AI 根据对手上回合出牌调整策略（如对手出高攻牌则 AI 下回合优先出反驳卡）

9. **GIVEN** 4 人淘汰赛匹配成功  
   **WHEN** 赛程进行  
   **THEN** 半决赛 2 场 → 胜者进入决赛 → 冠军获得丰厚奖励

10. **GIVEN** 每日辩题系统  
    **WHEN** 查询今日辩题  
    **THEN** 返回今日辩题 + 全服正方胜率/反方胜率实时统计

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=50 backend` — 后端无报错
4. 执行 Migration + Seed（辩题 + 卡牌模板）
5. 验证卡牌初始化：新用户获得基础卡组
6. 模拟完整对局：开始 → 抽牌 → 3 回合出牌 → 结算
7. 验证反驳卡/逻辑陷阱/情感牌特殊效果
8. 验证 AI 辩手 4 档难度
9. 验证 4 人淘汰赛 WebSocket 流程
10. 验证每日辩题 + 正反方胜率统计
11. 验收标准逐条验证

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] API 端点返回正确数据
- [ ] 控制台无 Error 级别日志
- [ ] 辩题库 + 100+ 卡牌模板导入完整
- [ ] CCG 结算完全基于预设固定数值，结果确定性可复现
- [ ] 卡牌升级攻防加成正确（每级 +10%）
- [ ] 6 种卡牌类型特殊效果全部正确
- [ ] AI 辩手 4 档出牌策略行为符合预期
- [ ] 4 人淘汰赛流程完整
- [ ] 每日辩题和统计功能正常
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

> 任务完成后，必须在 `/tasks/result/09-games-g9-g12/` 下创建同名结果文件

结果文件路径: `/tasks/result/09-games-g9-g12/T09-003-g10-debate-arena-backend.md`

## 自检重点

- [ ] 安全: 所有出牌验证和结算在服务端完成
- [ ] 安全: 卡牌数值不可被客户端篡改（服务端查库验证）
- [ ] 安全: RLS 策略正确，用户只能访问自己的卡牌和卡组
- [ ] 性能: 回合结算 < 50ms
- [ ] 性能: 卡牌查询有索引支持
- [ ] 类型同步: Zod Schema 与数据库字段一致
- [ ] 并发: 双方同时出牌时无竞态（使用锁或状态机保护）
- [ ] 数据: 卡牌模板攻防数值平衡合理
- [ ] 数据: 结算逻辑确定性可复现（同输入同输出）
