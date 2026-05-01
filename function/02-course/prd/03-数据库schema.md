# 03 · 数据库 Schema

> PostgreSQL 14+。命名小写下划线，所有表都有 `id / created_at / updated_at`。
> JSON 类内容统一用 `JSONB`，方便 GIN 索引和局部字段查询。

---

## 3.1 ER 总览

```
                ┌──────────┐
                │  tracks  │  5 条静态：share / ec / fc / hsk / dl
                └────┬─────┘
                     │
                ┌────▼─────┐
                │  stages  │  Track 下的阶段
                └────┬─────┘
                     │
                ┌────▼──────┐
                │ chapters  │
                └────┬──────┘
                     │
                ┌────▼──────┐                ┌──────────────────┐
                │  lessons  │◀──────────────▶│  lesson_kp (M:N) │
                └────┬──────┘                └────────┬─────────┘
                     │                                 │
                     │                          ┌──────▼─────────┐
                     │                          │ knowledge_points│
                     │                          └──────┬─────────┘
                     │                                 │
                     │                          ┌──────▼─────────┐
                     │                          │   questions    │
                     │                          └────────────────┘
                     │
            ┌────────▼──────────┐
            │  exams (节/章/阶段) │
            └───────────────────┘

   ┌──────────┐    ┌─────────────────┐    ┌──────────────────┐
   │  users   │───▶│ user_progress   │    │ user_answers     │
   └──────────┘    │ (lesson 粒度)    │    │ (question 粒度)   │
                   └─────────────────┘    └──────────────────┘
                            │                       │
                            ▼                       ▼
                   ┌────────────────────┐   ┌─────────────────┐
                   │  user_srs (KP 粒度) │   │ user_exam_attempt│
                   └────────────────────┘   └─────────────────┘

  ┌────────────────┐  ┌────────────────────┐  ┌────────────────┐
  │ import_batches │  │ content_action_log │  │ media_assets   │
  └────────────────┘  └────────────────────┘  └────────────────┘
```

---

## 3.2 内容侧表（管理端写、用户端只读）

### 3.2.1 `tracks` —— 主题
```sql
CREATE TABLE tracks (
  code        TEXT PRIMARY KEY,                -- share / ec / fc / hsk / dl
  name_zh     TEXT NOT NULL,
  name_i18n   JSONB NOT NULL,                  -- {zh,en,vi,th,id}
  icon_url    TEXT,
  sort_order  INT  DEFAULT 0,
  is_enabled  BOOLEAN DEFAULT TRUE
);
```

### 3.2.2 `stages`
```sql
CREATE TABLE stages (
  id           BIGSERIAL PRIMARY KEY,
  track_code   TEXT REFERENCES tracks(code),
  stage_no     INT  NOT NULL,                  -- 0=共享预备、1..6=主题阶段
  title_zh     TEXT NOT NULL,
  title_i18n   JSONB,
  desc_i18n    JSONB,
  hsk_mapping  TEXT,                            -- 可空，HSK 主题才填
  unlock_rule  JSONB,                           -- {prev_stage_pass: true}
  sort_order   INT  DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  UNIQUE (track_code, stage_no)
);
```

### 3.2.3 `chapters`
```sql
CREATE TABLE chapters (
  id           BIGSERIAL PRIMARY KEY,
  stage_id     BIGINT REFERENCES stages(id),
  chapter_no   INT  NOT NULL,
  title_zh     TEXT NOT NULL,
  title_i18n   JSONB,
  cover_url    TEXT,
  sort_order   INT  DEFAULT 0,
  is_published BOOLEAN DEFAULT FALSE,
  UNIQUE (stage_id, chapter_no)
);
```

### 3.2.4 `lessons`
```sql
CREATE TABLE lessons (
  id            BIGSERIAL PRIMARY KEY,
  chapter_id    BIGINT REFERENCES chapters(id),
  lesson_no     INT NOT NULL,
  code          TEXT UNIQUE,                   -- ec-2-3-1，便于全局定位
  title_zh      TEXT NOT NULL,
  title_i18n    JSONB,
  goal_i18n     JSONB,                          -- 学习目标 1 句话
  est_minutes   INT DEFAULT 12,
  sort_order    INT DEFAULT 0,
  is_published  BOOLEAN DEFAULT FALSE,
  has_quiz      BOOLEAN DEFAULT TRUE,           -- 是否有节末小测
  UNIQUE (chapter_id, lesson_no)
);
CREATE INDEX idx_lessons_code ON lessons(code);
```

### 3.2.5 `knowledge_points`（KP 总表，跨主题可复用）
```sql
CREATE TABLE knowledge_points (
  id            BIGSERIAL PRIMARY KEY,
  kp_code       TEXT UNIQUE NOT NULL,           -- kp_ec_w_00231
  kp_type       TEXT NOT NULL,                  -- pinyin/hanzi/word/phrase/grammar/sentence/dialog
  primary_track TEXT REFERENCES tracks(code),   -- 谁出资生成的，便于结算；不限制使用
  title_zh      TEXT NOT NULL,
  pinyin        TEXT,
  difficulty    INT NOT NULL DEFAULT 1,         -- 1..6
  hsk_level     INT,                             -- 可空
  content       JSONB NOT NULL,                 -- 见 02 文件，按 kp_type 不同结构不同
  audio_url     TEXT,
  image_url     TEXT,
  tags          TEXT[],
  is_published  BOOLEAN NOT NULL DEFAULT FALSE,  -- TRUE=已发布，FALSE=待发布
  version       INT NOT NULL DEFAULT 1,
  source_batch_id BIGINT,                        -- 来自哪个导入批次
  published_by  BIGINT,                          -- admin user id
  published_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_kp_type     ON knowledge_points(kp_type);
CREATE INDEX idx_kp_published ON knowledge_points(is_published);
CREATE INDEX idx_kp_tags_gin ON knowledge_points USING GIN(tags);
CREATE INDEX idx_kp_content_gin ON knowledge_points USING GIN(content);
```

### 3.2.6 `lesson_kp` —— 节-KP 多对多（同一 KP 可复用多节）
```sql
CREATE TABLE lesson_kp (
  lesson_id    BIGINT REFERENCES lessons(id) ON DELETE CASCADE,
  kp_id        BIGINT REFERENCES knowledge_points(id),
  position     INT NOT NULL,                    -- 节内顺序
  is_new_in_lesson BOOLEAN DEFAULT TRUE,        -- 本节首学 / 仅复习
  PRIMARY KEY (lesson_id, kp_id)
);
CREATE INDEX idx_lesson_kp_lesson ON lesson_kp(lesson_id, position);
```

### 3.2.7 `questions`
```sql
CREATE TABLE questions (
  id          BIGSERIAL PRIMARY KEY,
  q_code      TEXT UNIQUE NOT NULL,             -- q_ec_00012345
  kp_id       BIGINT REFERENCES knowledge_points(id),
  q_type      TEXT NOT NULL,                    -- 02 文件 12 类
  difficulty  INT NOT NULL DEFAULT 1,
  payload     JSONB NOT NULL,                   -- stem/options/answer/explanation
  audio_url   TEXT,
  image_url   TEXT,
  is_published BOOLEAN NOT NULL DEFAULT FALSE,
  version     INT DEFAULT 1,
  source_batch_id BIGINT,
  published_by BIGINT,
  published_at TIMESTAMPTZ,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_q_kp     ON questions(kp_id);
CREATE INDEX idx_q_type   ON questions(q_type);
CREATE INDEX idx_q_published ON questions(is_published);
```

### 3.2.8 `exams` —— 节末/章/阶段考的"试卷模板"
```sql
CREATE TABLE exams (
  id           BIGSERIAL PRIMARY KEY,
  scope_type   TEXT NOT NULL,                   -- lesson_quiz / chapter_test / stage_exam / hsk_mock
  scope_ref_id BIGINT NOT NULL,                 -- lesson/chapter/stage 的 id
  title_zh     TEXT,
  pass_score   NUMERIC(5,2) DEFAULT 60.00,
  total_score  NUMERIC(5,2) DEFAULT 100.00,
  blueprint    JSONB NOT NULL,                  -- 出卷规则，见下
  is_published BOOLEAN DEFAULT FALSE
);
-- blueprint 例：
-- { "items":[
--    {"q_type":"mcq_meaning","count":3,"difficulty_range":[1,2]},
--    {"q_type":"listen_pick","count":2}
--   ],
--   "kp_filter":{"lesson_id":123,"include_review_pct":20}
-- }
```

> 用户端考试时按 `blueprint` **实时随机抽题**，但题源都是已有 `questions`，不会现造。每次抽到的题集快照存在 `user_exam_attempts.snapshot`。

---

## 3.3 用户与进度侧表（用户端写为主）

### 3.3.1 `users`
```sql
CREATE TABLE users (
  id              BIGSERIAL PRIMARY KEY,
  phone           TEXT UNIQUE,
  email           TEXT UNIQUE,
  password_hash   TEXT,
  ui_lang         TEXT NOT NULL DEFAULT 'zh',   -- zh/en/vi/th/id
  native_lang     TEXT NOT NULL DEFAULT 'vi',   -- 影响题目翻译
  current_track   TEXT REFERENCES tracks(code),
  shared_stage_done BOOLEAN DEFAULT FALSE,      -- 共享 Stage 0 是否已完成
  subscription    JSONB,                         -- 订阅状态
  created_at      TIMESTAMPTZ DEFAULT now(),
  last_active_at  TIMESTAMPTZ
);
```

### 3.3.2 `user_progress` —— 节级进度
```sql
CREATE TABLE user_progress (
  user_id     BIGINT REFERENCES users(id),
  lesson_id   BIGINT REFERENCES lessons(id),
  status      TEXT NOT NULL,                    -- locked/unlocked/in_progress/passed
  last_kp_id  BIGINT,                            -- 断点续学
  best_score  NUMERIC(5,2),
  attempts    INT DEFAULT 0,
  passed_at   TIMESTAMPTZ,
  updated_at  TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, lesson_id)
);
CREATE INDEX idx_up_user_status ON user_progress(user_id, status);
```

### 3.3.3 `user_answers` —— 每道题作答流水
```sql
CREATE TABLE user_answers (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT REFERENCES users(id),
  question_id   BIGINT REFERENCES questions(id),
  kp_id         BIGINT,                         -- 冗余，方便 SRS
  context_type  TEXT,                            -- practice / lesson_quiz / chapter_test / stage_exam / srs_review
  context_ref_id BIGINT,
  is_correct    BOOLEAN NOT NULL,
  user_answer   JSONB,                           -- 提交内容
  duration_ms   INT,
  answered_at   TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_ua_user_kp ON user_answers(user_id, kp_id);
```

### 3.3.4 `user_srs` —— SRS 队列（Leitner 5 盒）
```sql
CREATE TABLE user_srs (
  user_id     BIGINT REFERENCES users(id),
  kp_id       BIGINT REFERENCES knowledge_points(id),
  box         SMALLINT NOT NULL DEFAULT 1,     -- 1..5
  due_at      TIMESTAMPTZ NOT NULL,
  correct_streak  INT DEFAULT 0,
  wrong_count INT DEFAULT 0,
  last_seen_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, kp_id)
);
CREATE INDEX idx_srs_due ON user_srs(user_id, due_at);
```

### 3.3.5 `user_exam_attempts`
```sql
CREATE TABLE user_exam_attempts (
  id            BIGSERIAL PRIMARY KEY,
  user_id       BIGINT REFERENCES users(id),
  exam_id       BIGINT REFERENCES exams(id),
  score         NUMERIC(5,2),
  passed        BOOLEAN,
  snapshot      JSONB,                           -- 抽到的题 id 列表 + 顺序
  started_at    TIMESTAMPTZ,
  finished_at   TIMESTAMPTZ
);
CREATE INDEX idx_uea_user ON user_exam_attempts(user_id, exam_id);
```

---

## 3.4 内容导入 / 操作留痕 / 媒资表

### 3.4.1 `import_batches` —— 批量导入批次
```sql
CREATE TABLE import_batches (
  id          BIGSERIAL PRIMARY KEY,
  import_type TEXT NOT NULL,                   -- kp / question / lesson / exam
  source_name TEXT,
  payload_hash TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'ready',   -- ready/imported/failed
  summary     JSONB,
  created_by  BIGINT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

### 3.4.2 `content_action_log` —— 内容操作与举报留痕
```sql
CREATE TABLE content_action_log (
  id           BIGSERIAL PRIMARY KEY,
  target_type  TEXT NOT NULL,                  -- kp / question / lesson / exam
  target_id    BIGINT NOT NULL,
  action       TEXT NOT NULL,                  -- edit/publish/unpublish/report/dismiss/adopt
  actor_id     BIGINT,
  actor_role   TEXT NOT NULL,                  -- learner/content_admin/super
  reason       TEXT,
  diff         JSONB,
  created_at   TIMESTAMPTZ DEFAULT now()
);
```

### 3.4.3 `media_assets` —— 音/图/视频统一资产表
```sql
CREATE TABLE media_assets (
  id          BIGSERIAL PRIMARY KEY,
  kind        TEXT NOT NULL,                   -- audio / image / video / svg / lottie
  url         TEXT NOT NULL,
  hash        TEXT UNIQUE,                     -- 去重用
  meta        JSONB,                           -- 时长、分辨率、TTS 声线等
  source      TEXT,                            -- tts / generated_image / human_recorded
  ref_kp_id   BIGINT,
  ref_q_id    BIGINT,
  created_at  TIMESTAMPTZ DEFAULT now()
);
CREATE INDEX idx_media_hash ON media_assets(hash);
```

## 3.5 管理端用户表（与学员 users 完全分库分表）

```sql
CREATE TABLE admins (
  id           BIGSERIAL PRIMARY KEY,
  username     TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role         TEXT NOT NULL,                  -- super / content_admin / readonly
  tracks_scope TEXT[],                          -- 该管理员能管哪几个主题，空=全部
  is_enabled   BOOLEAN DEFAULT TRUE,
  created_at   TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE admin_audit_log (
  id          BIGSERIAL PRIMARY KEY,
  admin_id    BIGINT,
  action      TEXT,
  target      TEXT,
  payload     JSONB,
  ip          INET,
  created_at  TIMESTAMPTZ DEFAULT now()
);
```

---

## 3.6 关键关系与读写边界

| 表 | 谁写 | 谁读 |
|---|---|---|
| tracks/stages/chapters/lessons/knowledge_points/questions/exams/media_assets | **管理端**（发布后学员端可见） | 用户端**只读** |
| user_*（progress/answers/srs/exam_attempts） | **用户端** | 管理端 BI 只读统计 |
| import_batches、content_action_log、admin_* | **管理端** | 管理端自用 |

> 用户端**永远不直接 SELECT 待发布 KP**——通过视图 `v_published_*` 或 API 层 `WHERE is_published=true` 强制过滤。

---

## 3.7 重要索引与性能注意

- `knowledge_points(content)` 加 GIN，便于"按 hsk_level 找词"等运营查询。
- `user_srs(user_id, due_at)` 是 SRS 拉队列的热查询，必加。
- `user_answers` 是高写入表，按 `answered_at` 月分区（pg_partman）。
- `questions.payload` 不建议建宽 GIN，按需在应用层处理。

---

## 3.8 一份"最小种子数据"清单（上线前必须有）

1. `tracks` 5 条（share/ec/fc/hsk/dl）
2. `stages` 25 条（共享 Stage 0 + 4 × 6）
3. `import_batches` 至少 1 条示例批次（验证导入追溯）
4. `admins` 至少 1 个 super 账号
5. `media_assets` 一套默认占位音/图

---

> 下一步看 [04-管理端模块设计.md](04-管理端模块设计.md)。
