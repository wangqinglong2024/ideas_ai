# PlayLingo — 技术架构方案

> 架构设计文档，不涉及具体代码实现
> 版本：v3.0 | 日期：2026-04-15

---

## 一、系统总览

### 架构分层

```
用户浏览器 (PWA / WebView)
    ↓
Cloudflare CDN (静态资源 + DDoS)
    ↓
Nginx 反向代理 (HTTPS, 路由, CORS)
    ↓
┌─────────────────────────────────────────────┐
│  Frontend: React + TypeScript + Phaser 3     │
│  ├─ React Router (非游戏页面)                │
│  ├─ Phaser Canvas (游戏关卡+迷你游戏)        │
│  └─ EventEmitter (React ↔ Phaser 通信)      │
├─────────────────────────────────────────────┤
│  Backend: FastAPI (Python, async-first)       │
│  ├─ REST API (业务接口)                      │
│  ├─ WebSocket (PvP对战, v1.1)                │
│  └─ Background Tasks (重型计算)              │
├─────────────────────────────────────────────┤
│  Database: Supabase (PostgreSQL + Auth)       │
│  ├─ Auth (用户认证)                          │
│  ├─ PostgreSQL (业务数据)                    │
│  ├─ RLS (行级安全)                           │
│  └─ Realtime (v1.1)                          │
├─────────────────────────────────────────────┤
│  Cache: Redis (Upstash)                       │
│  ├─ Session cache                             │
│  ├─ Leaderboard (Sorted Sets)                │
│  └─ PvP matching queue (v1.1)                │
├─────────────────────────────────────────────┤
│  AI: Dify Workflow                            │
│  ├─ 离线：内容生成 (文化文章/课程/脚本)       │
│  └─ 在线：对话练习/作文批改 (v1.1)           │
├─────────────────────────────────────────────┤
│  External Services                            │
│  ├─ Azure TTS (语音合成)                     │
│  ├─ Paddle / LemonSqueezy (MoR 支付)         │
│  ├─ MoMo / Midtrans (本地支付)               │
│  └─ Cloudflare R2 (对象存储)                 │
└─────────────────────────────────────────────┘
```

### 服务器选址
- **主机房**：新加坡 (Tencent Cloud / AWS AP-Southeast-1)
- **延迟**：越南 25-40ms, 印尼 15-30ms
- **合规**：PDPA（新加坡）兼容 PDPD（越南）和 PDP（印尼）

---

## 二、前端架构

### 技术栈
| 技术 | 用途 |
|------|------|
| React 18+ | UI 框架 |
| TypeScript | 类型安全 |
| React Router v6 | 页面路由 |
| Phaser 3 | 2D 游戏引擎（关卡+迷你游戏） |
| Tailwind CSS v4 | 样式系统 |
| Zustand | 状态管理 |
| React Query | 服务端状态 |
| i18next | 国际化（越/中/英/印尼） |
| Workbox | PWA Service Worker |

### 页面结构（三大模块入口）

```
App
├─ / (Landing Page)
├─ /auth (登录/注册)
├─ /home (首页 — 三模块入口 + 每日任务 + 学习统计)
│
├─ /discover (发现中国)
│  ├─ /discover (板块列表)
│  ├─ /discover/:category (板块内文章列表)
│  └─ /discover/:category/:articleId (文章阅读)
│
├─ /courses (系统课程)
│  ├─ /courses (级别总览)
│  ├─ /courses/:level (单元列表)
│  ├─ /courses/:level/:lesson (课程学习 — 全屏)
│  └─ /courses/:level/test/:unit (单元测验 — 全屏)
│
├─ /games (趣味游戏)
│  ├─ /games/map (世界地图)
│  ├─ /games/level/:id (关卡 — Phaser 横屏全屏)
│  ├─ /games/mini/:type (迷你游戏 — Phaser 横屏全屏)
│  └─ /games/cutscene/:id (过场动画 — 横屏全屏)
│
├─ /vocabulary (词汇本 — 跨模块共享)
├─ /profile (个人主页)
├─ /achievements (成就中心)
├─ /referral (推荐返佣中心)
├─ /membership (会员管理)
└─ /settings (设置)
```

### 屏幕方向策略

| 页面类型 | 方向 | 实现 |
|---------|------|------|
| 非游戏页面（首页/文化/课程列表/设置） | 响应式竖屏 | Tailwind 断点 |
| 课程学习/测验 | 竖屏全屏 | requestFullscreen() |
| 游戏关卡/迷你游戏/过场动画 | **强制横屏 16:9** | screen.orientation.lock('landscape') |
| 文化文章阅读 | 竖屏（H5）/自适应（PC） | 响应式 |

### 断点定义（Tailwind v4）

| 断点 | 范围 | 场景 |
|------|------|------|
| sm | 375-639px | 手机竖屏（基线） |
| md | 640-767px | 大手机/手机横屏 |
| lg | 768-1023px | 平板横屏 |
| xl | 1024-1279px | 笔记本 |
| 2xl | ≥1280px | 桌面 |

---

## 三、后端架构

### FastAPI 核心设计

- **全异步**：所有路由 `async def`，数据库用异步客户端
- **JWT 本地验签**：使用 Supabase JWT_SECRET 在内存中毫秒级验签，不回调 Supabase
- **依赖注入**：`user_id` 通过 `Depends()` 全链路透传
- **外部 HTTP**：统一使用 `httpx` 异步请求

### API 模块划分

```
/api/v1/
├─ /auth/          # 认证辅助（OAuth 回调处理）
├─ /users/         # 用户档案 CRUD
├─ /discover/      # 发现中国 — 文章列表/详情/书签
├─ /courses/       # 课程 — 进度/测验提交/成绩
├─ /games/         # 游戏 — 关卡数据/成绩提交
├─ /vocabulary/    # 词汇 — CRUD/SRS 复习队列
├─ /achievements/  # 成就 — 进度/解锁
├─ /membership/    # 会员 — 状态/Paddle webhook
├─ /referral/      # 推荐 — 关系/佣金/提现
├─ /leaderboard/   # 排行榜
└─ /admin/         # 后台管理
```

---

## 四、数据库设计

### 核心表结构

```sql
-- 用户扩展信息（profiles 表承载三模块共享数据）
profiles
  id (FK → auth.users)
  nickname, avatar_url
  current_level, total_xp, gold_coins, diamonds
  subscription_tier (free/monthly/quarterly/annual/lifetime)
  referral_code (UNIQUE)
  preferred_language (vi/zh/en/id)
  preferred_difficulty (beginner/intermediate/advanced)
  streak_days, streak_last_date
  created_at, updated_at

-- 发现中国 — 文章
discover_articles
  id, category (history/geography/literature/idiom/culture/philosophy/modern/connection)
  title_zh, title_vi, title_en
  difficulty (beginner/intermediate/advanced)
  content_json (结构化内容)
  audio_url, cover_image_url
  word_count, read_time_minutes
  is_free (boolean)
  sort_order, published_at

-- 发现中国 — 阅读记录
discover_progress
  user_id (FK), article_id (FK)
  read_completed (boolean)
  quiz_score, quiz_completed
  bookmarked
  read_at

-- 课程进度
course_progress
  user_id (FK), level, unit, lesson
  completed (boolean)
  score, accuracy_percent
  time_spent_seconds
  completed_at

-- 课程测验成绩
course_test_results
  user_id (FK), level, unit_or_final
  score, total_questions, correct_count
  passed (boolean)
  certificate_url
  taken_at

-- 游戏关卡进度
game_level_progress
  user_id (FK), level_id
  stars (0-3), best_score, attempts
  first_cleared_at, last_played_at

-- 迷你游戏成绩
game_mini_scores
  user_id (FK), game_type (tone_sniper/radical_blitz/pinyin_drift)
  score, max_combo, accuracy_percent
  played_at

-- 词汇本（跨模块共享）
user_vocabulary
  user_id (FK), word_id (FK)
  source_type (discover/course/game)
  source_id
  mastery_level (0-5)
  next_review_at
  review_count, correct_count

-- 词库
words
  id, hanzi, pinyin, meaning_vi, meaning_en
  example_sentence_zh, example_sentence_vi
  audio_url
  hsk_level, difficulty
  radical, stroke_count

-- 成就
user_achievements
  user_id (FK), achievement_id
  unlocked_at, progress_current, progress_target

-- 每日任务
daily_tasks
  user_id (FK), task_date
  course_completed (boolean)
  review_completed (boolean)
  game_completed (boolean)
  bonus_claimed (boolean)

-- 订阅
subscriptions (同前版本)

-- 推荐关系
referral_relations (同前版本)

-- 佣金记录
commission_logs (同前版本)
```

### RLS 策略（必须）
- 所有业务表必须 `ENABLE ROW LEVEL SECURITY`
- 读写策略绑定 `auth.uid() = user_id`
- discover_articles：匿名可读免费文章，付费文章需订阅
- words：全局只读

---

## 五、内容数据格式

### 文化文章 JSON 结构

```json
{
  "id": "history-panggu",
  "category": "history",
  "title": { "zh": "盘古开天辟地", "vi": "Bàn Cổ khai thiên lập địa" },
  "difficulty": "beginner",
  "cover_image": "/assets/discover/history/panggu-cover.webp",
  "sections": [
    {
      "type": "paragraph",
      "content_vi": "Trong thần thoại Trung Quốc cổ đại...",
      "content_zh": "在中国古代神话中...",
      "content_pinyin": "zài zhōngguó gǔdài shénhuà zhōng..."
    },
    {
      "type": "image",
      "src": "/assets/discover/history/panggu-01.webp",
      "caption": { "zh": "盘古开天辟地", "vi": "Bàn Cổ khai thiên" }
    },
    {
      "type": "audio",
      "src": "/assets/audio/discover/history/panggu-narration.mp3",
      "label": "听中文朗读"
    },
    {
      "type": "vocabulary_highlight",
      "word_ids": ["w-shenhua", "w-gudai", "w-tiandi"]
    }
  ],
  "vocabulary": ["w-shenhua", "w-gudai", "w-tiandi", "..."],
  "quiz": [
    {
      "type": "choice",
      "question_vi": "Bàn Cổ đã dùng gì để tách trời và đất?",
      "options": ["Búa", "Rìu", "Kiếm", "Tay không"],
      "correct": 1
    }
  ]
}
```

### 课程 JSON 结构

```json
{
  "level": 0,
  "unit": 1,
  "lesson": 1,
  "title": { "zh": "唇音声母 b, p, m, f", "vi": "Phụ âm môi b, p, m, f" },
  "intro": {
    "image": "/assets/courses/L0/U1/L01-intro.webp",
    "description_vi": "Hôm nay chúng ta sẽ học 4 phụ âm đầu tiên..."
  },
  "new_words": [
    {
      "id": "pinyin-b",
      "display": "b",
      "pinyin": "bō",
      "meaning_vi": "Âm b (giống tiếng Việt)",
      "audio": "/assets/audio/courses/L0/pinyin-b.mp3",
      "example": { "word": "爸", "pinyin": "bà", "meaning": "bố" }
    }
  ],
  "text": {
    "content_zh": "...",
    "content_pinyin": "...",
    "content_vi": "...",
    "audio_full": "/assets/audio/courses/L0/U1/L01-text-full.mp3",
    "audio_sentences": ["/path/to/s1.mp3", "/path/to/s2.mp3"]
  },
  "grammar": [
    {
      "title_vi": "Cách phát âm phụ âm bật hơi và không bật hơi",
      "explanation_vi": "...",
      "diagram": "/assets/courses/L0/U1/grammar-aspiration.svg",
      "examples": ["..."]
    }
  ],
  "exercises": [
    {
      "type": "listen_select",
      "audio": "/assets/audio/courses/L0/ex-01.mp3",
      "options": ["b", "p", "m", "f"],
      "correct": 0
    }
  ],
  "culture_corner": {
    "title_vi": "Bạn có biết?",
    "content_vi": "Tiếng Trung có nhiều âm giống tiếng Việt...",
    "link_discover": "connection-vietnamese-chinese-sounds"
  }
}
```

### 游戏关卡 JSON 结构（同前版本，不再赘述）

---

## 六、部署策略

### 优先级
1. **PWA（首要）**：浏览器直接访问，无需应用商店审核
2. **Android WebView（次要）**：Capacitor 打包上 Google Play
3. **iOS WebView（最低）**：引导用户通过 Web 订阅避开 30% 抽成

### 容器化
- Docker Compose 编排前后端
- 前端：Nginx 容器提供静态文件
- 后端：Uvicorn + FastAPI 容器
- Redis：Upstash 托管

### CDN 策略
- 静态资源（图片/音频/JSON）→ Cloudflare R2 + CDN
- 缓存策略：30天 + immutable（内容文件名含 hash）
- 图片格式：WebP（主）+ PNG（兜底）
- 音频格式：MP3 128kbps + OGG 备选

---

## 七、性能目标

| 指标 | 目标 | 说明 |
|------|------|------|
| LCP | ≤3s | 越南 4G 网络 |
| FID | ≤100ms | 交互响应 |
| CLS | ≤0.1 | 视觉稳定性 |
| 游戏帧率 | ≥30fps | H5 中低端机 |
| API 响应 | ≤200ms | P95 |
| 可用性 | 99.9% | SLA |

---

## 八、安全

- HTTPS 全站强制
- JWT 本地验签 + Token 7天过期 + 30天刷新
- Supabase RLS 全表启用
- API Rate Limiting（100次/分钟）
- 游戏成绩服务端校验（客户端不持有答案）
- 支付 Webhook 签名验证
- XSS/CSRF/SQL注入 防护
- 用户数据加密存储 + 删除权
