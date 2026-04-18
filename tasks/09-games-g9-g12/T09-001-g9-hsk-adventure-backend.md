# T09-001: G9 HSK 大冒险 — 后端题库与游戏逻辑

> 分类: 09-游戏 G9-G12 (Games G9-G12)
> 状态: 📋 待开发
> 复杂度: L(复杂)
> 预估文件数: 18+

## 需求摘要

实现 G9 HSK 大冒险的后端游戏逻辑：HSK 7-8 级专题题库管理（听力理解/阅读理解/完形填空/词汇辨析/语法改错五大题型）、RPG 角色系统（等级 1-99/HP/攻击力/防御/技能树）、5 层 + Boss 层地图关卡配置、回合制战斗状态机（出题→答题→伤害计算→动画指令→下回合）、装备系统（武器/防具/饰品三槽位 + 随机属性生成 + 稀有度分级）、Boss 多阶段行为、多人 Boss 战 WebSocket 协作逻辑、竞技场 PK 段位对战、每日体力系统、每日全服 Boss、AI 对战对手（模拟不同水平）。题库从 L9 课程 HSK 7-8 考点导入，含高频词汇 5000+、语法考点 200+、古诗词 100 首。所有战斗逻辑和伤害计算由服务端完成。

## 相关上下文

- 产品需求: `product/apps/08-games-g9-g12/01-g9-hsk-adventure.md` — G9 完整 PRD
  - §二 战斗画面布局（左右对阵、HP 条、题目区 + 选项区）
  - §三 核心交互（地图移动 → 遇敌 → 战斗 → 掉落 → 角色成长）
  - §四 角色养成系统（等级/装备/技能树）
  - §五 Boss 战特殊规则（多阶段 HP、团队协作）
  - §六 竞技场（段位对战、数值对等化）
  - §七 验收标准 G9-AC01 ~ G9-AC10
- 游戏设计: `game/09-hsk-adventure.md` — G9 完整玩法设计
  - §二 核心玩法（答对攻击/答错被攻击/击败掉落）
  - §二.2 战斗题型（听力/阅读/完形/词汇/语法五大题型及伤害等级）
  - §二.3 地图与怪物（5 层 + Boss 层，HSK 4-8 递进）
  - §二.4 角色系统（等级 1-99、HP、攻击力、防御、技能）
  - §二.5 装备系统（武器笔/防具袍/饰品徽章）
  - §三 游戏模式（单人冒险/1v1 PK/多人 Boss 战/竞技场）
  - §五 上瘾机制（永久成长/每日 Boss/成就）
  - §七 技术要点（Tilemap、战斗状态机、角色存档、题目下发、WebSocket 协作、装备随机属性）
- 课程内容: `course/level-09.md` — L9 议论写作与 HSK 备考
  - §三 核心数据（识字 3000、词汇 10000、古诗词 100 首、成语 330）
- 哲学参考: `china/09-philosophy-wisdom.md` — 哲学思想（高级阅读理解素材来源）
- 文学参考: `china/07-classic-literature.md` — 文学经典（阅读理解素材来源）
- 通用系统: `product/apps/05-game-common/` — 匹配、结算、段位规则
- 编码规范: `grules/05-coding-standards.md` §三 — 后端 Express 规范、三层分离
- API 设计: `grules/04-api-design.md` — 统一响应格式、错误码
- 关联任务: T06-013（游戏通用系统集成验证）→ 本任务 → T09-002（G9 前端）

## 技术方案

### 数据库设计

#### 1. G9 HSK 题库表

```sql
-- HSK 大冒险题库（L9 课程 HSK 7-8 考点）
CREATE TABLE g9_hsk_question_bank (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_type VARCHAR(20) NOT NULL CHECK (question_type IN (
    'listening', 'reading', 'cloze', 'vocabulary', 'grammar'
  )),
  -- listening=听力理解 reading=阅读理解 cloze=完形填空 vocabulary=词汇辨析 grammar=语法改错
  hsk_level INTEGER NOT NULL CHECK (hsk_level BETWEEN 4 AND 8),
  difficulty INTEGER NOT NULL CHECK (difficulty BETWEEN 1 AND 5),
  -- 1=★ 2=★★ 3=★★★ 4=★★★★ 5=★★★★★
  map_layer INTEGER NOT NULL CHECK (map_layer BETWEEN 1 AND 6),
  -- 1=校园 2=街市 3=都市 4=学府 5=巅峰 6=Boss层
  question_text TEXT NOT NULL,              -- 题目正文
  question_context TEXT,                    -- 阅读理解/听力的上下文材料
  audio_url VARCHAR(500),                   -- 听力题音频 URL
  options JSONB NOT NULL,                   -- 选项数组 [{"key":"A","text":"..."},...]
  correct_answer VARCHAR(4) NOT NULL,       -- 正确答案键（如 "A"）
  explanation TEXT NOT NULL,                -- 解析
  damage_level VARCHAR(10) NOT NULL CHECK (damage_level IN ('low', 'medium', 'high')),
  -- 答对造成伤害等级：listening/reading=high, cloze/vocabulary=medium, grammar=low
  knowledge_tags JSONB DEFAULT '[]',        -- 知识点标签（如 ["虚词辨析","关联词"]）
  course_level INTEGER NOT NULL DEFAULT 9,
  is_boss_question BOOLEAN NOT NULL DEFAULT false,  -- 是否 Boss 专用题
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g9_question_type ON g9_hsk_question_bank(question_type);
CREATE INDEX idx_g9_hsk_level ON g9_hsk_question_bank(hsk_level);
CREATE INDEX idx_g9_map_layer ON g9_hsk_question_bank(map_layer);
CREATE INDEX idx_g9_difficulty ON g9_hsk_question_bank(difficulty);
CREATE INDEX idx_g9_boss ON g9_hsk_question_bank(is_boss_question);
CREATE INDEX idx_g9_active ON g9_hsk_question_bank(is_active);

ALTER TABLE g9_hsk_question_bank ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g9_question_read" ON g9_hsk_question_bank FOR SELECT TO authenticated USING (true);
CREATE POLICY "g9_question_admin" ON g9_hsk_question_bank FOR ALL TO service_role USING (true);
```

#### 2. G9 角色存档表（永久成长）

```sql
-- 角色永久存档（跨局保存，不重置）
CREATE TABLE g9_characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  character_name VARCHAR(20) NOT NULL DEFAULT '书生',
  level INTEGER NOT NULL DEFAULT 1 CHECK (level BETWEEN 1 AND 99),
  experience INTEGER NOT NULL DEFAULT 0,           -- 当前经验值
  exp_to_next_level INTEGER NOT NULL DEFAULT 100,  -- 升级所需经验
  hp_max INTEGER NOT NULL DEFAULT 100,             -- 最大 HP
  hp_current INTEGER NOT NULL DEFAULT 100,         -- 当前 HP
  attack INTEGER NOT NULL DEFAULT 10,              -- 基础攻击力
  defense INTEGER NOT NULL DEFAULT 5,              -- 基础防御
  skill_points INTEGER NOT NULL DEFAULT 0,         -- 可分配技能点
  skill_tree JSONB NOT NULL DEFAULT '{}',          -- 技能树状态
  -- {"listening_mastery":0,"reading_mastery":0,"vocab_mastery":0,"grammar_mastery":0,"cloze_mastery":0}
  current_map_layer INTEGER NOT NULL DEFAULT 1,    -- 当前探索到的地图层
  current_floor INTEGER NOT NULL DEFAULT 1,        -- 当前层内楼层
  stamina INTEGER NOT NULL DEFAULT 100,            -- 每日体力
  stamina_max INTEGER NOT NULL DEFAULT 100,
  last_stamina_refresh TIMESTAMPTZ NOT NULL DEFAULT now(),
  gold INTEGER NOT NULL DEFAULT 0,                 -- 金币
  equipped_weapon UUID,                            -- 当前装备的武器
  equipped_armor UUID,                             -- 当前装备的防具
  equipped_accessory UUID,                         -- 当前装备的饰品
  total_monsters_defeated INTEGER NOT NULL DEFAULT 0,
  total_bosses_defeated INTEGER NOT NULL DEFAULT 0,
  total_questions_correct INTEGER NOT NULL DEFAULT 0,
  total_questions_wrong INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g9_char_user ON g9_characters(user_id);
CREATE INDEX idx_g9_char_level ON g9_characters(level);

ALTER TABLE g9_characters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g9_char_own" ON g9_characters FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

#### 3. G9 装备表

```sql
-- 装备物品表
CREATE TABLE g9_equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  slot VARCHAR(10) NOT NULL CHECK (slot IN ('weapon', 'armor', 'accessory')),
  -- weapon=武器(笔) armor=防具(袍) accessory=饰品(徽章)
  name VARCHAR(50) NOT NULL,                -- 装备名称（如 "金笔"）
  rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  -- common=白 uncommon=绿 rare=蓝 epic=紫 legendary=金
  base_attack INTEGER NOT NULL DEFAULT 0,   -- 基础攻击加成
  base_defense INTEGER NOT NULL DEFAULT 0,  -- 基础防御加成
  base_hp INTEGER NOT NULL DEFAULT 0,       -- 基础 HP 加成
  special_effect JSONB,                     -- 特殊效果（如 {"type":"listening_damage_bonus","value":30}）
  -- type 枚举: listening_damage_bonus / reading_damage_bonus / hp_regen / crit_chance / exp_bonus
  level_requirement INTEGER NOT NULL DEFAULT 1,  -- 等级需求
  source VARCHAR(20) NOT NULL DEFAULT 'drop' CHECK (source IN ('drop', 'shop', 'boss', 'achievement', 'event')),
  is_equipped BOOLEAN NOT NULL DEFAULT false,
  acquired_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g9_equip_user ON g9_equipment(user_id);
CREATE INDEX idx_g9_equip_slot ON g9_equipment(slot);
CREATE INDEX idx_g9_equip_rarity ON g9_equipment(rarity);

ALTER TABLE g9_equipment ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g9_equip_own" ON g9_equipment FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

#### 4. G9 怪物配置表

```sql
-- 怪物/Boss 配置表
CREATE TABLE g9_monsters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  map_layer INTEGER NOT NULL CHECK (map_layer BETWEEN 1 AND 6),
  name VARCHAR(50) NOT NULL,                -- 怪物名称（如 "错字怪"）
  monster_type VARCHAR(10) NOT NULL CHECK (monster_type IN ('normal', 'elite', 'boss')),
  hp INTEGER NOT NULL,                      -- 怪物 HP
  attack INTEGER NOT NULL,                  -- 怪物攻击力（答错时扣玩家 HP）
  defense INTEGER NOT NULL,                 -- 怪物防御（降低玩家伤害）
  exp_reward INTEGER NOT NULL,              -- 击败后经验奖励
  gold_reward_min INTEGER NOT NULL DEFAULT 0,
  gold_reward_max INTEGER NOT NULL DEFAULT 0,
  drop_table JSONB NOT NULL DEFAULT '[]',   -- 掉落表 [{"equipment_template_id":"uuid","drop_rate":0.1}]
  question_count INTEGER NOT NULL DEFAULT 1,-- 需要答对的题目数（Boss 多道题）
  question_types JSONB NOT NULL DEFAULT '[]',-- 出题类型限制（如 ["listening","reading"]）
  boss_phases JSONB,                        -- Boss 多阶段配置 [{"hp_threshold":50,"difficulty_boost":1}]
  sprite_key VARCHAR(100) NOT NULL,         -- 像素图 Sprite 标识
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_g9_monster_layer ON g9_monsters(map_layer);
CREATE INDEX idx_g9_monster_type ON g9_monsters(monster_type);

ALTER TABLE g9_monsters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g9_monster_read" ON g9_monsters FOR SELECT TO authenticated USING (true);
CREATE POLICY "g9_monster_admin" ON g9_monsters FOR ALL TO service_role USING (true);
```

#### 5. G9 装备模板表（掉落物模板）

```sql
-- 装备模板表（怪物掉落时从此表随机生成实例）
CREATE TABLE g9_equipment_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slot VARCHAR(10) NOT NULL CHECK (slot IN ('weapon', 'armor', 'accessory')),
  name VARCHAR(50) NOT NULL,
  rarity VARCHAR(10) NOT NULL CHECK (rarity IN ('common', 'uncommon', 'rare', 'epic', 'legendary')),
  attack_range INT4RANGE,                    -- 攻击加成范围 [min, max)
  defense_range INT4RANGE,                   -- 防御加成范围
  hp_range INT4RANGE,                        -- HP 加成范围
  possible_effects JSONB DEFAULT '[]',       -- 可能的特殊效果池
  level_requirement INTEGER NOT NULL DEFAULT 1,
  icon_key VARCHAR(100) NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE g9_equipment_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g9_template_read" ON g9_equipment_templates FOR SELECT TO authenticated USING (true);
CREATE POLICY "g9_template_admin" ON g9_equipment_templates FOR ALL TO service_role USING (true);
```

#### 6. G9 用户答题错题记录（SRS 联动）

```sql
CREATE TABLE g9_wrong_answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  question_id UUID NOT NULL REFERENCES g9_hsk_question_bank(id) ON DELETE CASCADE,
  wrong_answer VARCHAR(4) NOT NULL,          -- 玩家选的错误选项
  answered_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  reviewed BOOLEAN NOT NULL DEFAULT false,   -- 是否已在 SRS 中复习
  UNIQUE(user_id, question_id, answered_at)
);

CREATE INDEX idx_g9_wrong_user ON g9_wrong_answers(user_id);
CREATE INDEX idx_g9_wrong_reviewed ON g9_wrong_answers(reviewed);

ALTER TABLE g9_wrong_answers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "g9_wrong_own" ON g9_wrong_answers FOR ALL TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
```

### API 设计

#### 1. 获取/创建角色存档

```
GET /api/v1/games/g9-hsk-adventure/character
Headers: Authorization: Bearer {token}

Response 200:
{
  "code": 0,
  "data": {
    "character": {
      "id": "uuid",
      "level": 15,
      "experience": 2340,
      "exp_to_next_level": 500,
      "hp_max": 250,
      "hp_current": 180,
      "attack": 35,
      "defense": 20,
      "skill_tree": {"listening_mastery": 3, "reading_mastery": 2},
      "current_map_layer": 2,
      "current_floor": 7,
      "stamina": 65,
      "gold": 1200,
      "equipped": {
        "weapon": {"id":"uuid","name":"钢笔","rarity":"uncommon","attack":8},
        "armor": {"id":"uuid","name":"校服","rarity":"common","defense":3},
        "accessory": null
      },
      "stats": {
        "total_monsters_defeated": 89,
        "total_bosses_defeated": 1,
        "total_questions_correct": 156,
        "total_questions_wrong": 34
      }
    }
  }
}
```

#### 2. 进入地图层/遇敌

```
POST /api/v1/games/g9-hsk-adventure/explore
Headers: Authorization: Bearer {token}
Body: {
  "map_layer": 2,
  "action": "move"  // "move" | "enter_boss"
}

Response 200:
{
  "code": 0,
  "data": {
    "event": "encounter",  // "encounter" | "treasure" | "nothing" | "boss_gate"
    "monster": {
      "id": "uuid",
      "name": "语法妖",
      "type": "normal",
      "hp": 80,
      "attack": 12,
      "defense": 5,
      "sprite_key": "monster_grammar_fairy",
      "question_count": 1
    },
    "stamina_cost": 5,
    "stamina_remaining": 60
  }
}
```

#### 3. 战斗答题

```
POST /api/v1/games/g9-hsk-adventure/battle/answer
Headers: Authorization: Bearer {token}
Body: {
  "session_id": "uuid",
  "monster_id": "uuid",
  "question_id": "uuid",
  "selected_answer": "B",
  "time_spent_ms": 8500
}

Response 200:
{
  "code": 0,
  "data": {
    "correct": true,
    "correct_answer": "B",
    "explanation": "此处应使用关联词"虽然……但是……"",
    "damage_dealt": 45,            // 对怪物造成的伤害
    "monster_hp_remaining": 35,
    "skill_bonus_applied": "listening_mastery_3",  // 触发的技能加成（如有）
    "combo_count": 3,              // 连续答对数
    "next_question": { ... }       // 如怪物未死，下发下一道题
  }
}

// 答错时
Response 200:
{
  "code": 0,
  "data": {
    "correct": false,
    "correct_answer": "A",
    "explanation": "...",
    "damage_received": 15,         // 怪物反击伤害
    "player_hp_remaining": 165,
    "monster_hp_remaining": 80,
    "combo_count": 0               // 连击中断
  }
}
```

#### 4. 击败怪物/掉落

```
POST /api/v1/games/g9-hsk-adventure/battle/victory
Headers: Authorization: Bearer {token}
Body: {
  "session_id": "uuid",
  "monster_id": "uuid"
}

Response 200:
{
  "code": 0,
  "data": {
    "exp_gained": 120,
    "gold_gained": 35,
    "level_up": false,
    "new_level": null,
    "drops": [
      {
        "id": "uuid",
        "name": "语法徽章",
        "slot": "accessory",
        "rarity": "uncommon",
        "base_attack": 0,
        "base_defense": 2,
        "base_hp": 15,
        "special_effect": {"type": "grammar_damage_bonus", "value": 15}
      }
    ],
    "character_updated": {
      "experience": 2460,
      "gold": 1235,
      "total_monsters_defeated": 90
    }
  }
}
```

#### 5. 装备管理

```
POST /api/v1/games/g9-hsk-adventure/equipment/equip
Headers: Authorization: Bearer {token}
Body: { "equipment_id": "uuid" }

POST /api/v1/games/g9-hsk-adventure/equipment/unequip
Headers: Authorization: Bearer {token}
Body: { "slot": "weapon" }

GET /api/v1/games/g9-hsk-adventure/equipment/inventory
Headers: Authorization: Bearer {token}
```

#### 6. 技能树分配

```
POST /api/v1/games/g9-hsk-adventure/skill/allocate
Headers: Authorization: Bearer {token}
Body: {
  "skill_name": "listening_mastery",
  "points": 1
}

Response 200:
{
  "code": 0,
  "data": {
    "skill_tree": {"listening_mastery": 4, "reading_mastery": 2},
    "skill_points_remaining": 2,
    "skill_effect": "听力题伤害 +40%"
  }
}
```

#### 7. 多人 Boss 战 WebSocket 消息

```typescript
// 客户端 → 服务端：加入 Boss 房间
interface JoinBossRoom {
  type: 'g9_join_boss'
  boss_id: string
  player_id: string
}

// 服务端 → 所有客户端：Boss 战开始
interface BossBattleStart {
  type: 'g9_boss_start'
  boss: MonsterInfo
  players: PlayerBriefInfo[]
  turn_order: string[]          // 轮流答题顺序
  first_question: QuestionInfo
  timestamp: number
}

// 客户端 → 服务端：Boss 战答题
interface BossAnswerSubmit {
  type: 'g9_boss_answer'
  session_id: string
  player_id: string
  question_id: string
  answer: string
  time_spent_ms: number
}

// 服务端 → 所有客户端：Boss 战答题结果广播
interface BossAnswerResult {
  type: 'g9_boss_result'
  player_id: string
  correct: boolean
  damage_dealt: number
  boss_hp_remaining: number
  boss_phase: number              // 当前 Boss 阶段
  next_player_id: string
  next_question: QuestionInfo
  timestamp: number
}

// 服务端 → 所有客户端：Boss 阶段变化
interface BossPhaseChange {
  type: 'g9_boss_phase'
  phase: number
  boss_hp_remaining: number
  difficulty_boost: number
  message: string                 // "Boss 狂暴了！题目难度提升！"
  timestamp: number
}

// 服务端 → 所有客户端：Boss 击败
interface BossDefeated {
  type: 'g9_boss_defeated'
  rewards: Record<string, BossReward>  // playerId → 奖励
  total_damage: Record<string, number> // playerId → 总伤害
  mvp_player_id: string
  timestamp: number
}
```

#### 8. 竞技场 PK WebSocket

```typescript
// 竞技场双方同题 PK
interface ArenaBattleSync {
  type: 'g9_arena_question'
  question: QuestionInfo            // 双方同一道题
  round: number                     // 当前回合（共 5 回合）
  time_limit_ms: 15000
  timestamp: number
}

interface ArenaAnswerResult {
  type: 'g9_arena_result'
  round: number
  player_answers: Record<string, {
    correct: boolean
    time_spent_ms: number
    damage_dealt: number
  }>
  // 先答对者先手攻击，双方 HP 变化
  hp_status: Record<string, number>
  round_winner: string | null       // 平局为 null
  timestamp: number
}
```

### 服务端核心逻辑

#### 战斗状态机

```typescript
// backend/src/services/games/g9/battle-state-machine.ts

enum BattleState {
  IDLE = 'idle',
  QUESTION_ISSUED = 'question_issued',   // 题目已下发，等待答题
  ANSWER_RECEIVED = 'answer_received',   // 答案已收到，计算伤害
  DAMAGE_APPLIED = 'damage_applied',     // 伤害已结算
  MONSTER_DEFEATED = 'monster_defeated', // 怪物被击败
  PLAYER_DEFEATED = 'player_defeated',   // 玩家被击败
  BOSS_PHASE_CHANGE = 'boss_phase_change' // Boss 阶段切换
}

class G9BattleStateMachine {
  /** 初始化战斗，从题库按地图层 + 题型抽题 */
  initBattle(characterId: string, monsterId: string): BattleContext

  /** 处理玩家答题，返回伤害结果和下一状态 */
  processAnswer(battleCtx: BattleContext, answer: string, timeSpentMs: number): BattleResult

  /** 计算玩家对怪物伤害 = (角色攻击 + 装备加成 + 技能加成) × 题型伤害系数 - 怪物防御 */
  calculatePlayerDamage(character: CharacterData, questionType: string, correct: boolean): number

  /** 计算怪物反击伤害 = 怪物攻击 - (角色防御 + 装备防御加成) */
  calculateMonsterDamage(monster: MonsterData, character: CharacterData): number

  /** 检查 Boss 阶段切换（HP < 50% 等阈值触发） */
  checkBossPhaseChange(boss: MonsterData, currentHp: number): BossPhaseResult | null

  /** 下发下一题（按怪物配置的题型范围和当前 Boss 阶段难度从题库抽题） */
  getNextQuestion(battleCtx: BattleContext): QuestionInfo
}
```

#### 角色系统

```typescript
// backend/src/services/games/g9/character-service.ts

class G9CharacterService {
  /** 获取角色存档，不存在则创建默认角色 */
  async getOrCreateCharacter(userId: string): Promise<CharacterData>

  /** 增加经验值，检查升级 */
  async addExperience(characterId: string, exp: number): Promise<LevelUpResult>

  /** 升级时自动提升基础属性 */
  private calculateLevelUpStats(currentLevel: number): StatBoost

  /** 分配技能点 */
  async allocateSkillPoint(characterId: string, skillName: string, points: number): Promise<SkillResult>

  /** 计算含装备加成的最终属性 */
  async getEffectiveStats(characterId: string): Promise<EffectiveStats>

  /** 每日体力刷新（每天 0 点恢复满） */
  async refreshStamina(characterId: string): Promise<number>

  /** 消耗体力 */
  async consumeStamina(characterId: string, cost: number): Promise<StaminaResult>
}
```

#### 装备生成引擎

```typescript
// backend/src/services/games/g9/equipment-generator.ts

class G9EquipmentGenerator {
  /**
   * 从模板生成装备实例
   * 1. 根据掉落表随机决定是否掉落（概率判定）
   * 2. 从模板范围内随机属性数值
   * 3. 稀有及以上装备随机附加特殊效果
   * 4. 防篡改：所有随机在服务端完成
   */
  async generateFromTemplate(templateId: string, playerLevel: number): Promise<EquipmentInstance | null>

  /** Boss 专属掉落（稀有+，必掉一件） */
  async generateBossDrop(bossId: string, playerLevel: number): Promise<EquipmentInstance>

  /** 基于玩家等级调整属性范围（等级越高属性上限越高） */
  private scaleByLevel(baseRange: [number, number], playerLevel: number): [number, number]
}
```

#### AI 竞技场对手

```typescript
// backend/src/services/games/g9/ai-arena-opponent.ts

class G9AIArenaOpponent {
  /**
   * 模拟不同水平的竞技场对手
   * - 初级：正确率 40-50%，答题速度 12-15 秒
   * - 中级：正确率 60-70%，答题速度 8-12 秒
   * - 高级：正确率 80-90%，答题速度 5-8 秒
   * - 大师：正确率 90-95%，答题速度 3-6 秒
   * 根据玩家段位匹配相应水平 AI
   */
  async simulateAnswer(question: QuestionInfo, difficulty: AIDifficulty): Promise<AIAnswer>

  /** 根据玩家段位选择 AI 水平 */
  selectDifficulty(playerRank: string): AIDifficulty
}
```

#### 每日全服 Boss

```typescript
// backend/src/services/games/g9/daily-boss-service.ts

class G9DailyBossService {
  /** 每日 0 点生成全服 Boss（超高 HP，全服玩家合力打伤害） */
  async generateDailyBoss(): Promise<DailyBoss>

  /** 记录玩家对每日 Boss 的伤害贡献 */
  async recordDamage(userId: string, bossId: string, damage: number): Promise<void>

  /** 检查每日 Boss 是否被击败（全服累计伤害 ≥ Boss HP） */
  async checkDefeat(bossId: string): Promise<boolean>

  /** 发放全服奖励 */
  async distributeRewards(bossId: string): Promise<void>
}
```

### 防作弊机制

```typescript
// backend/src/services/games/g9/anti-cheat.ts

class G9AntiCheat {
  /** 答题时间校验：<500ms 标记可疑（不可能读完题） */
  validateAnswerTime(timeSpentMs: number, questionType: string): boolean

  /** 伤害数值校验：服务端重新计算伤害，与提交不一致则拒绝 */
  validateDamage(claimed: number, calculated: number): boolean

  /** 装备属性校验：检查装备属性是否在模板合法范围内 */
  validateEquipment(equipment: EquipmentInstance, template: EquipmentTemplate): boolean

  /** 战斗节奏校验：连续 10 次 <1s 答题标记为异常 */
  validateBattleRhythm(recentAnswers: AnswerRecord[]): boolean
}
```

## 范围（做什么）

- 创建 G9 HSK 题库表 + 角色存档表 + 装备表 + 怪物配置表 + 装备模板表 + 错题记录表（Migration + RLS）
- 从 L9 课程内容导入 HSK 7-8 五大题型题库（含解析、知识点标签、伤害等级）
- 配置 5 层 + Boss 层怪物数据（名称、属性、掉落表、题型限制、Boss 多阶段）
- 配置装备模板（各稀有度、各槽位模板 + 特殊效果池）
- 实现角色存档系统（创建/读取/升级/属性计算/体力管理）
- 实现战斗状态机（出题 → 答题 → 伤害计算 → 状态流转 → 击败/被击败）
- 实现装备生成引擎（随机属性、稀有度掉落、Boss 专属掉落）
- 实现装备管理 API（穿戴/卸下/背包）
- 实现技能树分配逻辑
- 实现多人 Boss 战 WebSocket 协作（轮流答题、伤害广播、阶段切换）
- 实现竞技场 PK（同题对抗、先手机制、HP 结算）
- 实现 AI 竞技场对手（四档难度，按段位匹配）
- 实现每日全服 Boss（生成/伤害累计/击败/奖励）
- 实现防作弊模块
- 错题记录写入，与 SRS 系统联动
- 与 T06-006 结算 API 对接

## 边界（不做什么）

- 不写 Phaser 前端游戏场景（T09-002）
- 不写匹配系统（T06-005 已完成）
- 不写结算页面前端（T06-011 已完成）
- 不写段位变更逻辑（T06-006 已完成）
- 不实现皮肤系统后端（T06-008 已完成）
- 不写管理后台题库管理（T14 系列）
- 不实现音频文件上传（听力题音频由内容团队预上传至 Storage）

## 涉及文件

- 新建: `backend/src/services/games/g9/battle-state-machine.ts`
- 新建: `backend/src/services/games/g9/character-service.ts`
- 新建: `backend/src/services/games/g9/equipment-generator.ts`
- 新建: `backend/src/services/games/g9/ai-arena-opponent.ts`
- 新建: `backend/src/services/games/g9/daily-boss-service.ts`
- 新建: `backend/src/services/games/g9/anti-cheat.ts`
- 新建: `backend/src/services/games/g9/types.ts`
- 新建: `backend/src/routers/v1/games/g9-hsk-adventure.ts`
- 新建: `backend/src/repositories/g9-question-bank.repo.ts`
- 新建: `backend/src/repositories/g9-character.repo.ts`
- 新建: `backend/src/repositories/g9-equipment.repo.ts`
- 新建: `backend/src/repositories/g9-monster.repo.ts`
- 新建: `backend/src/repositories/g9-wrong-answers.repo.ts`
- 新建: `supabase/migrations/XXXXXX_g9_hsk_adventure.sql`
- 新建: `scripts/seed-g9-questions.sql`
- 新建: `scripts/seed-g9-monsters.sql`
- 新建: `scripts/seed-g9-equipment-templates.sql`
- 修改: `backend/src/routers/v1/index.ts` — 注册 G9 路由

## 依赖

- 前置: T06-013（游戏通用系统集成验证完成）
- 前置: T06-005（匹配系统 — WebSocket 基础）
- 前置: T06-006（会话/结算 API — 对接接口）
- 后续: T09-002（G9 前端 Phaser 游戏场景）

## 验收标准（GIVEN-WHEN-THEN）

1. **GIVEN** 新用户首次进入 G9  
   **WHEN** 请求角色存档  
   **THEN** 自动创建默认角色（等级 1、HP 100、攻击 10、防御 5、体力 100、位于第 1 层）

2. **GIVEN** 角色在第 2 层地图探索  
   **WHEN** 执行 explore 动作  
   **THEN** 按概率触发遭遇事件（encounter/treasure/nothing），遭遇怪物时返回第 2 层配置的怪物信息，消耗 5 体力

3. **GIVEN** 与"语法妖"（HP=80）战斗中，角色攻击力 35 + 武器加成 8  
   **WHEN** 正确回答语法改错题（damage_level=low，伤害系数 0.8）  
   **THEN** 造成伤害 = (35+8) × 0.8 - 怪物防御 5 ≈ 29，怪物 HP 降至 51

4. **GIVEN** 答错题目，怪物攻击力 12，角色防御 20 + 装备防御 3  
   **WHEN** 怪物反击  
   **THEN** 角色受到伤害 = max(12 - 23, 1) = 1（最低保底 1 点伤害），HP 相应减少

5. **GIVEN** 击败怪物，怪物配置了掉落表  
   **WHEN** 结算胜利奖励  
   **THEN** 获得经验值 + 金币 + 按掉落率随机装备，装备属性在模板范围内随机生成

6. **GIVEN** 角色经验值达到升级阈值  
   **WHEN** 结算经验  
   **THEN** 等级 +1，HP/攻击/防御按公式提升，获得 1 技能点，exp_to_next_level 按曲线增加

7. **GIVEN** Boss 层 Boss（HP=500），Boss 配置 `boss_phases: [{"hp_threshold":50,"difficulty_boost":1}]`  
   **WHEN** Boss HP 降至 250 以下  
   **THEN** 触发阶段切换，后续出题难度 +1，广播阶段变化消息

8. **GIVEN** 多人 Boss 战 3 名玩家加入房间  
   **WHEN** Boss 战开始  
   **THEN** 按轮流顺序给每位玩家发题，各自答题独立结算伤害，全部伤害累计到 Boss HP

9. **GIVEN** 竞技场 PK 匹配成功  
   **WHEN** 5 回合制对战，双方答同一题  
   **THEN** 先答对者先手攻击对方角色，5 回合后 HP 先归零者判负（竞技场角色数值对等化处理）

10. **GIVEN** AI 竞技场对手难度为"高级"  
    **WHEN** 模拟答题  
    **THEN** 正确率 80-90%，答题速度 5-8 秒内随机

11. **GIVEN** 玩家体力为 0  
    **WHEN** 尝试探索地图  
    **THEN** 返回错误"体力不足"，提示每日 0 点刷新或购买体力

12. **GIVEN** 防作弊模块开启  
    **WHEN** 答题时间 < 500ms  
    **THEN** 该次答题被标记为可疑，不计分

## Docker 自动化测试（强制）

> ⚠️ 绝对禁止在宿主机环境测试，必须通过 Docker 容器验证 ⚠️

### 测试步骤

1. `docker compose up -d --build` — 构建并启动所有服务
2. `docker compose ps` — 确认所有容器 Running
3. `docker compose logs --tail=50 backend` — 后端无报错
4. 执行 Migration: `docker compose exec backend npm run db:migrate`
5. 执行 Seed: `docker compose exec backend npm run db:seed:g9`
6. 验证题库: `curl http://localhost:3000/api/v1/games/g9-hsk-adventure/questions/sample` — 返回样本题目
7. 模拟完整冒险流程：创建角色 → 探索 → 遇敌 → 战斗答题 → 击败 → 掉落 → 升级 → 装备
8. 验证 Boss 战多阶段行为
9. 验证多人 Boss 战 WebSocket 协作
10. 验证竞技场 PK WebSocket 流程
11. 验证体力系统
12. 验证防作弊模块
13. 验收标准逐条验证

### 测试通过标准

- [ ] TypeScript 零编译错误
- [ ] Docker 构建成功，所有容器 Running
- [ ] API 端点返回正确数据（格式符合 grules/04-api-design.md）
- [ ] 控制台无 Error 级别日志
- [ ] HSK 题库五大题型完整导入（含解析、伤害等级、知识点标签）
- [ ] 角色创建/升级/属性计算正确
- [ ] 战斗状态机流转正确（答对→伤害→答错→受伤→击败→掉落）
- [ ] 装备生成属性在模板范围内
- [ ] Boss 多阶段行为正确触发
- [ ] 多人 Boss 战协作流程完整
- [ ] 竞技场 PK 同题/先手/HP 结算正确
- [ ] AI 对手四档难度行为符合预期
- [ ] 体力消耗和每日刷新正确
- [ ] 防作弊模块全部校验通过
- [ ] 所有 GIVEN-WHEN-THEN 验收标准通过

### 测试不通过处理

- 发现问题 → 立即修复 → 重新 Docker 构建 → 重新验证
- 同一问题 3 次修复失败 → 标记阻塞，停止任务

## 执行结果报告

> 任务完成后，必须在 `/tasks/result/09-games-g9-g12/` 下创建同名结果文件

结果文件路径: `/tasks/result/09-games-g9-g12/T09-001-g9-hsk-adventure-backend.md`

## 自检重点

- [ ] 安全: 所有伤害计算和掉落在服务端完成，客户端无法伪造
- [ ] 安全: 装备属性校验防篡改，生成时服务端随机
- [ ] 安全: RLS 策略正确，用户只能访问自己的角色和装备
- [ ] 安全: 防作弊四件套（时间/伤害/装备/节奏校验）全部实现
- [ ] 性能: 题库查询按 map_layer + difficulty 索引命中，< 100ms
- [ ] 性能: 战斗状态管理器内存及时清理，无泄漏
- [ ] 性能: 多人 Boss 战 WebSocket 广播高效
- [ ] 类型同步: Zod Schema 与数据库字段一致
- [ ] 并发: 多人 Boss 战伤害累计无竞态（使用行锁或原子操作）
- [ ] 并发: 装备穿戴/卸下操作幂等
- [ ] 数据: 角色永久存档跨局不丢失，退出后重进数据完整
