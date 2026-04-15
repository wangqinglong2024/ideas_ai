# PRD-02：发现中国模块

> **模块定位**: 内容驱动的中华文化探索平台 — PlayLingo 三大模块之一  
> **版本**: v3.0 | **日期**: 2025-01  
> **关联**: [Plan-02](../plan/02-discover-china.md) | [产品总览](00-index.md)

---

## 一、模块概述

### 1.1 目标

「发现中国」是面向越南用户的中华文化探索平台，通过 8 大板块的双语文章、互动测验和词汇卡片，让用户**先爱上中国文化，再自然激发学中文的动机**。同时，文化内容作为 SEO 公开页面，是 PlayLingo 最核心的**自然流量获客引擎**。

### 1.2 核心指标

| 指标 | MVP 目标 | 月 6 目标 |
|------|---------|----------|
| 文章总数 | 40 篇（8板块×5篇） | 80 篇 |
| 文章阅读完成率 | ≥ 60% | ≥ 65% |
| 测验完成率 | ≥ 40% | ≥ 50% |
| 文章 → 注册转化（SEO 访客） | ≥ 8% | ≥ 12% |
| SEO 月 UV | — | 50,000 |
| 文化词汇收藏率 | ≥ 20% | ≥ 30% |

---

## 二、信息架构

### 2.1 页面层级

```
/discover                          → 发现中国首页（板块网格）
/discover/:category                → 板块列表页（文章卡片列表）
/discover/:category/:articleSlug   → 文章详情页（阅读体验）
/discover/:category/:articleSlug/quiz → 文章测验页
```

### 2.2 八大板块

| 板块 ID | 板块名称 | 图标 | MVP 篇数 | 免费/付费 |
|---------|---------|------|---------|----------|
| history | 🏛️ 历史纵横 | 卷轴 | 5 | **全部免费** |
| geography | 🌍 地理风景 | 山峰 | 5 | **全部免费** |
| literature | 📖 文学经典 | 书卷 | 5 | 3 免费 / 2 会员 |
| idioms | 🗣️ 成语典故 | 灯笼 | 5 | 3 免费 / 2 会员 |
| culture | 🎎 民俗文化 | 龙 | 5 | **全部免费** |
| philosophy | 🧘 哲学思想 | 阴阳 | 5 | 3 免费 / 2 会员 |
| modern | 🏙️ 现代中国 | 火箭 | 5 | **全部免费** |
| cn-vn | 🇻🇳 中越对比 | 桥梁 | 5 | **全部免费** |

**免费占比：30/40 = 75%** — 文化内容承担 SEO 获客任务，大部分免费开放。

---

## 三、页面设计

### 3.1 发现中国首页 `/discover`

**布局**：2×4 板块网格卡片

每张卡片包含：
- 板块图标（64×64 SVG）
- 板块名称（越南语 + 中文）
- 文章数量标签（如 "5 bài viết"）
- 阅读进度条（已读/总数）
- 新文章角标（有未读时显示）

**排序**：固定顺序（按板块 ID），不可自定义。

**顶部区域**：
- 大标题："Khám phá Trung Quốc 🇨🇳"（发现中国）
- 副标题："Tìm hiểu lịch sử, văn hóa và vẻ đẹp của Trung Quốc"
- 统计栏：已读文章数 / 总数 | 收藏词汇数 | 测验通过数

### 3.2 板块列表页 `/discover/:category`

**布局**：文章卡片纵向列表

每张文章卡片：
- 封面配图（16:9，宽度 100%，圆角 12px）
- 文章标题（越南语为主，中文副标题）
- 摘要文字（2 行截断）
- 标签栏：难度等级 | 阅读时长 | 词汇数
- 右上角状态：🔒 会员 | ✅ 已读 | 空白（未读免费）
- 底部操作：♡ 收藏 | 📤 分享

**筛选**：
- 难度筛选：入门 / 初级 / 中级（对应词汇量要求）
- 排序：推荐 / 最新 / 最热

### 3.3 文章详情页 `/discover/:category/:articleSlug`

**核心阅读体验**：

```
┌─────────────────────────────┐
│      封面大图（16:9）        │
│                             │
│  文章标题（越南语）          │
│  中文标题（灰色副标题）      │
│                             │
│  📅 发布日期  ⏱️ 8分钟  📝 25词 │
├─────────────────────────────┤
│                             │
│  [越南语段落]               │
│                             │
│  ┌─────────────────────┐   │
│  │ 📌 中文原文          │   │
│  │ "有朋自远方来，       │   │
│  │  不亦乐乎？"         │   │
│  │ Yǒu péng zì yuǎn   │   │
│  │ fāng lái, bú yì     │   │
│  │ lè hū?              │   │
│  │ 🔊 播放音频           │   │
│  └─────────────────────┘   │
│                             │
│  [越南语段落继续...]        │
│                             │
│  💡 词汇卡片               │
│  ┌───┐ ┌───┐ ┌───┐       │
│  │朋友│ │远方│ │快乐│       │
│  │péng│ │yuǎn│ │kuài│       │
│  │yǒu │ │fāng│ │lè  │       │
│  │bạn │ │xa  │ │vui │       │
│  │bè  │ │xôi │ │vẻ  │       │
│  └───┘ └───┘ └───┘       │
│  [点击翻转看例句]           │
│                             │
├─────────────────────────────┤
│  📝 文章测验（5题）→        │
│  📚 相关文章推荐            │
│  📤 分享本文                │
└─────────────────────────────┘
```

**中文内容嵌入规则**：
1. 主体用越南语书写，保证可读性
2. 关键中文词句用**引用卡片**呈现（含拼音 + 音频）
3. 每篇文章嵌入 **15-30 个关键词汇**，自动提取到词汇卡片区
4. 词汇卡片支持**一键收藏**到个人词库（联动 SRS 复习系统）

**文章难度分级**：

| 难度 | 标签 | 词汇要求 | 中文比例 |
|------|------|---------|---------|
| 入门 | 🟢 Sơ cấp | 0 词汇基础 | ~10% 中文嵌入 |
| 初级 | 🟡 Trung cấp | HSK1 150 词 | ~20% 中文嵌入 |
| 中级 | 🔴 Cao cấp | HSK2 300 词 | ~30% 中文嵌入 |

### 3.4 文章测验页

每篇文章配 **5 道测验题**，题型分布：

| 题型 | 数量 | 说明 |
|------|------|------|
| 内容理解 | 2 | 基于文章内容的选择题（越南语出题） |
| 词汇辨识 | 2 | 文章中出现的中文词汇 → 选越南语释义 |
| 文化知识 | 1 | 文化延伸问题（如"长城修建于哪个朝代？"） |

**测验交互**：
- 每题 4 个选项，单选
- 即时反馈：正确显示绿色 ✅ + 解析；错误显示红色 ❌ + 正确答案 + 解析
- 完成后显示得分（如 4/5）和**获得经验值**
- 满分（5/5）奖励额外 💎10 钻石
- 测验可无限重做，但只有首次计经验值

**评分与奖励**：

| 得分 | 经验值 | 额外奖励 |
|------|--------|---------|
| 5/5 | 50 XP | +10 💎 |
| 4/5 | 40 XP | — |
| 3/5 | 30 XP | — |
| ≤2/5 | 20 XP | 建议重读文章 |

---

## 四、文章数据模型

### 4.1 数据库表结构

```sql
-- 文章主表
CREATE TABLE discover_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug VARCHAR(100) UNIQUE NOT NULL,       -- URL 友好标识
  category VARCHAR(20) NOT NULL,            -- 板块 ID
  title_vi TEXT NOT NULL,                   -- 越南语标题
  title_zh TEXT NOT NULL,                   -- 中文标题
  summary_vi TEXT NOT NULL,                 -- 越南语摘要（≤150字）
  content_vi TEXT NOT NULL,                 -- 越南语正文（Markdown）
  content_zh_blocks JSONB NOT NULL,         -- 中文引用块数组
  cover_image_url TEXT NOT NULL,            -- 封面图 URL
  difficulty VARCHAR(10) NOT NULL,          -- beginner/elementary/intermediate
  reading_time_min SMALLINT NOT NULL,       -- 预估阅读时长（分钟）
  vocab_count SMALLINT NOT NULL,            -- 关键词汇数
  is_free BOOLEAN NOT NULL DEFAULT true,    -- 是否免费
  is_published BOOLEAN NOT NULL DEFAULT false,
  seo_title TEXT,                           -- SEO 标题
  seo_description TEXT,                     -- SEO 描述
  sort_order SMALLINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 文章词汇表
CREATE TABLE discover_article_vocab (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES discover_articles(id) ON DELETE CASCADE,
  word_zh VARCHAR(20) NOT NULL,             -- 中文词汇
  pinyin VARCHAR(50) NOT NULL,              -- 拼音
  meaning_vi TEXT NOT NULL,                 -- 越南语释义
  example_zh TEXT,                          -- 中文例句
  example_pinyin TEXT,                      -- 例句拼音
  example_vi TEXT,                          -- 例句越南语翻译
  audio_url TEXT,                           -- 词汇音频 URL
  sort_order SMALLINT NOT NULL DEFAULT 0
);

-- 文章测验表
CREATE TABLE discover_quizzes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id UUID REFERENCES discover_articles(id) ON DELETE CASCADE,
  question_type VARCHAR(20) NOT NULL,       -- comprehension/vocab/culture
  question_vi TEXT NOT NULL,                -- 题目（越南语）
  options JSONB NOT NULL,                   -- [{label, value, isCorrect}]
  explanation_vi TEXT NOT NULL,             -- 答案解析
  sort_order SMALLINT NOT NULL DEFAULT 0
);

-- 用户文章进度表
CREATE TABLE user_article_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES discover_articles(id) ON DELETE CASCADE,
  read_completed BOOLEAN DEFAULT false,
  read_progress REAL DEFAULT 0,             -- 阅读进度 0-1
  quiz_score SMALLINT,                      -- 首次测验得分（0-5）
  quiz_best_score SMALLINT,                 -- 最佳得分
  quiz_attempts SMALLINT DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, article_id)
);

-- 用户词汇收藏（联动 SRS）
CREATE TABLE user_vocab_bookmarks (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  vocab_id UUID REFERENCES discover_article_vocab(id) ON DELETE CASCADE,
  source VARCHAR(20) NOT NULL DEFAULT 'discover', -- discover/course/game
  source_id UUID,                           -- 来源文章/课程/关卡 ID
  bookmarked_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (user_id, vocab_id)
);
```

### 4.2 RLS 策略

```sql
-- 文章公开可读（SEO 需求）
CREATE POLICY "articles_public_read" ON discover_articles
  FOR SELECT USING (is_published = true);

-- 付费文章需会员
CREATE POLICY "articles_premium_read" ON discover_articles
  FOR SELECT USING (
    is_free = true 
    OR auth.uid() IN (SELECT user_id FROM subscriptions WHERE status = 'active')
  );

-- 用户进度仅自己可读写
CREATE POLICY "progress_owner" ON user_article_progress
  FOR ALL USING (auth.uid() = user_id);

-- 词汇收藏仅自己可读写
CREATE POLICY "bookmarks_owner" ON user_vocab_bookmarks
  FOR ALL USING (auth.uid() = user_id);
```

---

## 五、前端组件

### 5.1 组件清单

| 组件 | 路径 | 职责 |
|------|------|------|
| `DiscoverHome` | `/discover` | 板块网格、统计栏 |
| `CategoryList` | `/discover/:cat` | 文章卡片列表、筛选排序 |
| `ArticleReader` | `/discover/:cat/:slug` | 文章阅读体验 |
| `ChineseQuoteBlock` | 嵌入组件 | 中文引用卡片（拼音+音频） |
| `VocabCard` | 嵌入组件 | 词汇卡片（翻转交互） |
| `VocabCardGrid` | 嵌入组件 | 文章底部词汇卡片网格 |
| `ArticleQuiz` | `/discover/:cat/:slug/quiz` | 5 题测验 |
| `QuizQuestion` | 嵌入组件 | 单题交互（选择+反馈） |
| `ReadingProgress` | 嵌入组件 | 顶部阅读进度条 |
| `BookmarkButton` | 嵌入组件 | 词汇收藏按钮 |

### 5.2 关键交互

**阅读进度追踪**：
- 使用 Intersection Observer API 追踪用户滚动位置
- 每滚动到新段落，更新 `read_progress`（0-1）
- 滚动到文章底部 → `read_completed = true` → 弹出测验入口浮窗

**词汇卡片交互**：
- 默认显示中文 + 拼音
- 点击翻转显示越南语释义 + 例句
- 长按/右键弹出操作菜单：收藏 | 播放音频 | 添加到 SRS
- 收藏后出现 ✅ 标记，联动 SRS 复习队列

**中文引用块音频**：
- 每个中文引用块配有 TTS 音频按钮
- 点击播放中文朗读（Azure Neural TTS）
- 播放时逐字/逐词高亮

---

## 六、SEO 策略

### 6.1 公开页面要求

文化文章需要对搜索引擎可索引，采用 SSR/SSG 策略：

| 要素 | 实现 |
|------|------|
| 渲染方式 | 文章详情页使用 SSR（React Server Components 或预渲染） |
| URL 格式 | `/discover/history/great-wall`（纯英文 slug） |
| Meta 标签 | title + description + og:image + og:title（越南语） |
| 结构化数据 | JSON-LD `Article` Schema |
| Sitemap | 自动生成 `/sitemap-discover.xml` |
| 规范链接 | `<link rel="canonical">` 指向主URL |
| hreflang | vi（越南语）为默认，后续扩展多语言 |

### 6.2 SEO 内容优化

每篇文章必须包含：
- 越南语 SEO 标题（含关键词，≤60 字符）
- 越南语 Meta Description（≤155 字符）
- 至少 1 个 H2 和 3 个 H3 标题
- 封面图 alt 文本（越南语）
- 内链至少 2 篇相关文章

### 6.3 CTA 策略（未注册访客）

```
阅读文章 → 到达 50% 位置
→ 浮窗提示："Đăng ký miễn phí để nghe phát âm và lưu từ vựng"
  （注册免费账号可听发音和收藏词汇）
→ [Google 一键注册] [继续阅读]

阅读完文章 → 底部 CTA
→ "Bạn muốn học tiếng Trung? Thử khóa học miễn phí!"
  （想学中文？试试免费课程！）
→ [开始免费课程] [探索更多文化]
```

---

## 七、分享功能

### 7.1 分享场景

| 场景 | 分享内容 | 渠道 |
|------|---------|------|
| 文章分享 | 文章标题 + 封面图 + 摘要 + 链接 | 所有渠道 |
| 测验成绩 | "我在「长城」文章测验中获得 5/5！" + 链接 | 社交媒体 |
| 文化卡片 | 精美文化知识卡片图（1080×1080） | Instagram/TikTok |
| 成语卡片 | 成语 + 释义 + 配图（方形卡片） | 社交媒体 |

### 7.2 分享卡片生成

文化卡片使用 Canvas API 客户端生成：
- 尺寸：1080×1080（正方形，适配社交媒体）
- 内容：文化主题 + 精美配图 + 一句中文 + 拼音 + 越南语
- 底部：PlayLingo Logo + 邀请链接（含推荐码）
- 风格：与设计系统一致（Cosmic Refraction 配色）

---

## 八、跨模块联动

### 8.1 → 系统课程

- 文章中标注的词汇如果出现在 HSK 词表中，显示 **"📗 HSK1 词汇"** 标签
- 文章底部推荐相关课程："这些词汇将在 L1-05 课中系统学习"
- 完成文化板块 → 解锁对应课程章节（如读完历史板块 → 解锁历史相关课文）

### 8.2 → 趣味游戏

- 文章中出现的词汇自动加入游戏词库
- 完成板块所有文章 → 解锁对应游戏彩蛋关卡
- 游戏中获得的文化碎片 → 在发现中国模块展示收集进度

### 8.3 → 词汇 SRS

- 文章中收藏的词汇进入统一 SRS 复习队列
- SRS 复习时显示词汇来源（"来自《万里长城》文章"）
- 词汇来源多元化标记：📚 文化 / 📖 课程 / 🎮 游戏

---

## 九、MVP 内容清单

### 9.1 MVP 40 篇文章列表

详见 [Plan-02 发现中国设计方案](../plan/02-discover-china.md) 的"八大内容板块"章节，每板块 5 篇 MVP 文章已详细列出。

### 9.2 静态资源需求

| 资源 | 数量 | 规格 | 生成方式 |
|------|------|------|---------|
| 文章封面图 | 40 张 | 1200×675 (16:9) | FLUX 2 生成 |
| 板块图标 | 8 个 | 64×64 SVG | 设计 / Lucide |
| 文化分享卡片模板 | 3 套 | 1080×1080 | 设计 |
| 词汇音频 | ~800 条 | MP3 / 16kHz | Azure Neural TTS |
| 中文引用音频 | ~200 条 | MP3 / 16kHz | Azure Neural TTS |

---

## 十、API 接口

### 10.1 接口列表

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/discover/categories` | 获取板块列表（含阅读进度） | 可选 |
| GET | `/api/discover/articles?category=&difficulty=&sort=` | 文章列表（分页） | 可选 |
| GET | `/api/discover/articles/:slug` | 文章详情 | 可选（付费检查） |
| GET | `/api/discover/articles/:slug/quiz` | 文章测验题目 | 必须 |
| POST | `/api/discover/articles/:slug/quiz` | 提交测验答案 | 必须 |
| POST | `/api/discover/articles/:slug/progress` | 更新阅读进度 | 必须 |
| POST | `/api/discover/vocab/:vocabId/bookmark` | 收藏词汇 | 必须 |
| DELETE | `/api/discover/vocab/:vocabId/bookmark` | 取消收藏 | 必须 |

### 10.2 关键接口响应格式

**GET /api/discover/articles/:slug**

```json
{
  "id": "uuid",
  "slug": "great-wall",
  "category": "geography",
  "titleVi": "Vạn Lý Trường Thành: Kỳ quan thứ 8 của thế giới",
  "titleZh": "万里长城：世界第八大奇迹",
  "summaryVi": "...",
  "contentVi": "# Markdown 正文...",
  "chineseBlocks": [
    {
      "id": "block-1",
      "textZh": "不到长城非好汉",
      "pinyin": "bú dào chángchéng fēi hǎohàn",
      "meaningVi": "Chưa đến Trường Thành thì chưa phải anh hùng",
      "audioUrl": "/audio/discover/great-wall-block-1.mp3"
    }
  ],
  "vocab": [
    {
      "id": "vocab-1",
      "wordZh": "长城",
      "pinyin": "chángchéng",
      "meaningVi": "Trường Thành, Vạn Lý Trường Thành",
      "exampleZh": "我去过长城。",
      "examplePinyin": "Wǒ qùguò chángchéng.",
      "exampleVi": "Tôi đã đến Trường Thành.",
      "audioUrl": "/audio/vocab/changcheng.mp3",
      "hskLevel": null,
      "isBookmarked": false
    }
  ],
  "coverImageUrl": "/images/discover/great-wall.webp",
  "difficulty": "beginner",
  "readingTimeMin": 8,
  "vocabCount": 25,
  "isFree": true,
  "userProgress": {
    "readCompleted": false,
    "readProgress": 0.35,
    "quizScore": null
  }
}
```

---

## 十一、非功能需求

| 指标 | 目标 |
|------|------|
| 文章页 LCP | ≤ 2.5 秒（SEO 要求更严格） |
| 文章页 CLS | ≤ 0.1 |
| 图片加载 | 懒加载 + WebP + srcset 响应式 |
| 音频加载 | 点击时按需加载，预加载前 2 个 |
| 离线支持 | 已读文章缓存到 Service Worker |
| 可访问性 | 图片 alt 文本、音频文字替代、键盘导航 |
