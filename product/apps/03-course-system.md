# PRD-03：系统课程模块

> **模块定位**: 从零到一的结构化中文教学系统 — PlayLingo 三大模块之一  
> **版本**: v3.0 | **日期**: 2025-01  
> **关联**: [Plan-03](../plan/03-course-system.md) | [产品总览](00-index.md)

---

## 一、模块概述

### 1.1 目标

「系统课程」是 PlayLingo 的核心教学模块，提供**严肃、结构化、对标 HSK 的中文课程**。区别于游戏模块的趣味练习和文化模块的兴趣激发，课程模块承担"真正教会用户中文"的使命。通过图文+音频的多感官教学，让用户从拼音零基础成长到 HSK3 中级水平。

### 1.2 核心指标

| 指标 | MVP 目标 | 月 6 目标 |
|------|---------|----------|
| 课程总数 | 20 课（L0 完整） | 50 课（L0+L1） |
| 单课完成率 | ≥ 70% | ≥ 75% |
| 单元测试通过率 | ≥ 60% | ≥ 65% |
| 日均学习时长 | ≥ 10 分钟 | ≥ 15 分钟 |
| 课程 → 付费转化 | ≥ 5% | ≥ 8% |
| 7 日课程连续率 | ≥ 25% | ≥ 35% |

---

## 二、课程体系

### 2.1 四级结构总览

| 级别 | 课数 | 词汇量 | 对标 | 免费/付费 | MVP |
|------|------|--------|------|----------|-----|
| **L0 语音入门** | 20 课 | — | 拼音基础 | **全部免费** | ✅ |
| **L1 基础入门** | 30 课 | 150 词 | HSK1 | 前 15 课免费 | v1.1 |
| **L2 初级进阶** | 30 课 | 300 词 | HSK2 | 前 10 课免费 | v1.2 |
| **L3 中级突破** | 30 课 | 600 词 | HSK3 | 前 5 课免费 | v1.3 |

**总计：110 课 | 1050+ 词汇 | 覆盖 HSK1-3**

### 2.2 每课时长预算

| 环节 | 时长 | 说明 |
|------|------|------|
| 情境导入 | 1 分钟 | 配图+情境对话引出主题 |
| 新知教学 | 5 分钟 | 词汇/语法/发音讲解 |
| 互动练习 | 5 分钟 | 4-6 道练习题 |
| 文化角 | 2 分钟 | 相关文化知识小贴士 |
| 课程小结 | 1 分钟 | 复习本课重点 |
| **合计** | **~14 分钟** | — |

---

## 三、信息架构

### 3.1 页面层级

```
/courses                           → 课程首页（级别选择）
/courses/:level                    → 级别详情（单元列表）
/courses/:level/:unitId            → 单元概览（课程列表）
/courses/:level/:unitId/:lessonId  → 课程学习页
/courses/:level/:unitId/test       → 单元测试
```

### 3.2 课程导航页 `/courses`

**布局**：4 个级别卡片纵向排列

每张级别卡片：
- 级别图标（独特颜色标识）
- 级别名称（越南语 + 中文）：如 "Cấp 0: Ngữ âm nhập môn / L0 语音入门"
- 描述文字（1 行）
- 进度条：已完成课数 / 总课数
- 状态标签：🟢 学习中 | 🔒 未解锁 | ✅ 已完成
- 词汇量标签：如 "150 từ vựng"

**解锁规则**：
- L0：默认解锁
- L1：完成 L0 第 16 课（拼音综合单元结束）
- L2：完成 L1 第 20 课 + 付费会员
- L3：完成 L2 第 20 课 + 付费会员

### 3.3 级别详情页 `/courses/:level`

以 L0 为例，展示 4 个单元：

```
┌─────────────────────────────┐
│  L0 语音入门                 │
│  Ngữ âm nhập môn            │
│  进度：8/20 课已完成          │
├─────────────────────────────┤
│                             │
│  📦 Unit 1: 声母 (6课)      │
│  ████████░░ 4/6 已完成       │
│  → 继续学习 L0-05           │
│                             │
│  📦 Unit 2: 韵母 (6课)      │
│  ░░░░░░░░░░ 0/6 未开始      │
│  🔒 完成 Unit 1 后解锁       │
│                             │
│  📦 Unit 3: 声调 (4课)      │
│  🔒                         │
│                             │
│  📦 Unit 4: 拼音综合 (4课)   │
│  🔒                         │
│                             │
│  📝 Level 0 结业测试         │
│  🔒 完成全部单元后解锁       │
└─────────────────────────────┘
```

### 3.4 课程学习页 `/courses/:level/:unitId/:lessonId`

**整体结构**：分步骤线性推进，无法跳跃

```
[进度条 ████████░░░░ 第5步/共8步]

┌─────────────────────────────┐
│  Step 1: 情境导入            │
│  ┌─────────────────────┐    │
│  │   情境插图            │    │
│  │  (越南学生在课堂)     │    │
│  └─────────────────────┘    │
│                             │
│  "Xin chào! 今天我们学习     │
│   声母 b, p, m, f"          │
│                             │
│  🔊 播放导入音频             │
│         [继续 →]            │
├─────────────────────────────┤
│  Step 2: 新知教学            │
│                             │
│  ┌─ 词汇/发音卡片 ─────┐   │
│  │      b               │   │
│  │   /b/ 不送气双唇音    │   │
│  │                      │   │
│  │   🔊 标准发音         │   │
│  │   🔊 越南语对比 (b)   │   │
│  │                      │   │
│  │   口型动画 ○→        │   │
│  └──────────────────────┘   │
│                             │
│  [上一个] [播放] [下一个]    │
├─────────────────────────────┤
│  Step 3-6: 互动练习          │
│  (见练习题型详情)            │
├─────────────────────────────┤
│  Step 7: 文化角 🏮           │
│  "你知道吗？声母 b 在中文里  │
│   出现频率最高，很多常用字    │
│   都以 b 开头：爸(bà)、      │
│   北(běi)、八(bā)..."       │
├─────────────────────────────┤
│  Step 8: 课程小结            │
│  ✅ 本课学习了：b, p, m, f   │
│  📊 练习正确率：83%          │
│  ⭐ 获得 30 XP              │
│  💎 +5 钻石                 │
│                             │
│  [复习本课] [下一课 →]       │
└─────────────────────────────┘
```

---

## 四、练习题型

### 4.1 题型矩阵

| 题型 | 适用级别 | 说明 | 交互方式 |
|------|---------|------|---------|
| **听辨选择** | L0-L3 | 播放音频，选择正确选项 | 4 选 1 |
| **拼音拼读** | L0 | 看拼音组合，选正确发音 | 4 选 1 |
| **声调标注** | L0 | 给拼音标声调 | 点击声调按钮 |
| **词汇匹配** | L1-L3 | 中文词→越南语释义配对 | 连线 |
| **填空选词** | L1-L3 | 句子挖空，选正确词汇 | 4 选 1 |
| **句子排序** | L2-L3 | 打乱的词组→排列成正确句子 | 拖拽排列 |
| **听写选择** | L1-L3 | 听音频，选择对应汉字/拼音 | 4 选 1 |
| **图片选词** | L1-L2 | 看图片，选择正确中文词汇 | 4 选 1 |
| **翻译选择** | L2-L3 | 越南语句子→选中文翻译 | 4 选 1 |

### 4.2 练习反馈

**正确**：
- 绿色动画 ✅ + 音效
- 显示补充信息（如"很好！这个发音类似越南语的 b"）
- +5 XP

**错误**：
- 红色动画 ❌ + 音效
- 显示正确答案 + 解析
- 标记为"需复习"，课程结束后额外复习错题
- 不扣 XP（鼓励尝试）

### 4.3 课程评分

| 正确率 | 星级 | XP | 额外奖励 |
|--------|------|-----|---------|
| ≥ 90% | ⭐⭐⭐ | 50 | +10 💎 |
| ≥ 70% | ⭐⭐ | 30 | +5 💎 |
| ≥ 50% | ⭐ | 20 | — |
| < 50% | — | 10 | 建议重学 |

**每课至少获得 ⭐ 才可解锁下一课**。

---

## 五、单元测试

### 5.1 测试规则

每个单元结束后有**单元测试**（Unit Test）：
- 题目数：10 题
- 题型：综合（从本单元所有练习题型中抽取）
- 时间限制：无
- 通过标准：≥ 60%（6/10）
- 奖励：通过 +100 XP + 20 💎

### 5.2 结业测试

每个级别结束后有**结业测试**（Level Test）：
- 题目数：20 题
- 题型：综合 + 少量新场景应用题
- 时间限制：30 分钟
- 通过标准：≥ 70%（14/20）
- 奖励：通过 +200 XP + 50 💎 + 等级证书
- 可无限重考，但每次间隔 ≥ 4 小时

### 5.3 等级证书

通过结业测试后颁发电子证书：
- 设计：A4 横版，精美边框，PlayLingo Logo
- 内容：用户姓名、级别名称、通过日期、得分
- 格式：PNG 可下载 + 分享到社交媒体
- 证书编号：唯一编号可在线验证

---

## 六、数据模型

### 6.1 数据库表结构

```sql
-- 课程表
CREATE TABLE courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level VARCHAR(5) NOT NULL,                -- L0/L1/L2/L3
  unit_id VARCHAR(10) NOT NULL,             -- U1/U2/U3/U4
  lesson_id VARCHAR(10) NOT NULL,           -- L0-01, L1-15 etc.
  title_vi TEXT NOT NULL,                   -- 越南语课程标题
  title_zh TEXT NOT NULL,                   -- 中文课程标题
  description_vi TEXT,                      -- 课程描述
  sort_order SMALLINT NOT NULL,
  is_free BOOLEAN NOT NULL DEFAULT true,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(level, lesson_id)
);

-- 课程步骤表（每课的教学内容）
CREATE TABLE course_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  step_type VARCHAR(20) NOT NULL,           -- intro/teach/exercise/culture/summary
  sort_order SMALLINT NOT NULL,
  content JSONB NOT NULL                    -- 步骤内容（按类型不同结构不同）
);

-- 练习题表
CREATE TABLE course_exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  step_id UUID REFERENCES course_steps(id) ON DELETE CASCADE,
  exercise_type VARCHAR(20) NOT NULL,       -- listen_select/pinyin_read/tone_mark/etc.
  question JSONB NOT NULL,                  -- 题目内容
  options JSONB NOT NULL,                   -- 选项
  correct_answer JSONB NOT NULL,            -- 正确答案
  explanation_vi TEXT,                      -- 答案解析
  audio_url TEXT,                           -- 音频 URL（听力题）
  image_url TEXT,                           -- 图片 URL（看图题）
  sort_order SMALLINT NOT NULL
);

-- 课程词汇表
CREATE TABLE course_vocab (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  word_zh VARCHAR(20) NOT NULL,
  pinyin VARCHAR(50) NOT NULL,
  meaning_vi TEXT NOT NULL,
  example_zh TEXT,
  example_pinyin TEXT,
  example_vi TEXT,
  audio_url TEXT,
  hsk_level SMALLINT,                       -- 1/2/3 or null
  sort_order SMALLINT NOT NULL DEFAULT 0
);

-- 单元测试表
CREATE TABLE course_tests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  test_type VARCHAR(10) NOT NULL,           -- unit/level
  level VARCHAR(5) NOT NULL,
  unit_id VARCHAR(10),                      -- null for level test
  title_vi TEXT NOT NULL,
  pass_threshold REAL NOT NULL,             -- 0.6 or 0.7
  time_limit_min SMALLINT,                  -- null = no limit
  question_count SMALLINT NOT NULL
);

-- 用户课程进度
CREATE TABLE user_course_progress (
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE CASCADE,
  current_step SMALLINT DEFAULT 0,
  is_completed BOOLEAN DEFAULT false,
  star_rating SMALLINT DEFAULT 0,           -- 0-3
  correct_count SMALLINT DEFAULT 0,
  total_count SMALLINT DEFAULT 0,
  xp_earned INTEGER DEFAULT 0,
  started_at TIMESTAMPTZ DEFAULT now(),
  completed_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, course_id)
);

-- 用户测试记录
CREATE TABLE user_test_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  test_id UUID REFERENCES course_tests(id) ON DELETE CASCADE,
  score REAL NOT NULL,                      -- 0-1
  correct_count SMALLINT NOT NULL,
  passed BOOLEAN NOT NULL,
  xp_earned INTEGER DEFAULT 0,
  certificate_url TEXT,                     -- 证书 URL（仅结业测试）
  completed_at TIMESTAMPTZ DEFAULT now()
);
```

### 6.2 RLS 策略

```sql
-- 课程内容公开可读
CREATE POLICY "courses_public_read" ON courses
  FOR SELECT USING (is_published = true);

-- 付费课程需会员
CREATE POLICY "courses_premium" ON courses
  FOR SELECT USING (
    is_free = true
    OR auth.uid() IN (SELECT user_id FROM subscriptions WHERE status = 'active')
  );

-- 用户进度仅自己可读写
CREATE POLICY "course_progress_owner" ON user_course_progress
  FOR ALL USING (auth.uid() = user_id);

-- 测试结果仅自己可读写
CREATE POLICY "test_results_owner" ON user_test_results
  FOR ALL USING (auth.uid() = user_id);
```

---

## 七、前端组件

### 7.1 组件清单

| 组件 | 路径 | 职责 |
|------|------|------|
| `CoursesHome` | `/courses` | 级别选择卡片 |
| `LevelDetail` | `/courses/:level` | 单元列表、进度总览 |
| `UnitOverview` | `/courses/:level/:unit` | 课程列表 |
| `LessonPlayer` | `/courses/:level/:unit/:lesson` | 课程学习主页面 |
| `StepIntro` | 嵌入组件 | 情境导入步骤 |
| `StepTeach` | 嵌入组件 | 新知教学步骤 |
| `StepExercise` | 嵌入组件 | 互动练习步骤 |
| `StepCulture` | 嵌入组件 | 文化角步骤 |
| `StepSummary` | 嵌入组件 | 课程小结步骤 |
| `ExerciseListenSelect` | 嵌入组件 | 听辨选择题 |
| `ExerciseToneMark` | 嵌入组件 | 声调标注题 |
| `ExerciseWordMatch` | 嵌入组件 | 词汇匹配题（连线） |
| `ExerciseFillBlank` | 嵌入组件 | 填空选词题 |
| `ExerciseSentenceOrder` | 嵌入组件 | 句子排序题（拖拽） |
| `ExerciseImageSelect` | 嵌入组件 | 图片选词题 |
| `UnitTest` | `/courses/:level/:unit/test` | 单元测试 |
| `LevelTest` | `/courses/:level/test` | 结业测试 |
| `Certificate` | 弹窗组件 | 证书展示与分享 |
| `ProgressBar` | 嵌入组件 | 课程内进度条 |
| `AudioPlayer` | 嵌入组件 | 音频播放器（标准音+对比音） |

### 7.2 关键交互

**课程学习流（LessonPlayer）**：
- 线性步骤推进，顶部进度条显示当前位置
- 每步完成后自动过渡到下一步（0.5s 延迟）
- 练习题回答后即时反馈（正确/错误动画）
- 错题在小结步骤后增加"错题重练"环节
- 完成后弹出结算弹窗（星级+XP+钻石）
- 左滑/右滑手势支持上一步/下一步（移动端）

**音频播放**：
- 教学步骤中音频自动播放（可设置关闭）
- 播放时对应文字高亮
- 语速可调：0.7x / 1.0x / 1.2x
- 重复播放按钮（再听一次）

**离线支持**：
- 已解锁课程可预下载（课程内容 + 音频 + 图片）
- 离线完成后，联网时同步进度

---

## 八、跨模块联动

### 8.1 → 发现中国

- 每课"文化角"内容链接到相关文化文章
- 课程中学到的词汇，在文化文章中出现时高亮提示"你学过这个词"
- 完成某个文化板块的所有文章 → 解锁课程中对应主题的扩展内容

### 8.2 → 趣味游戏

- 课程中学到的词汇自动加入游戏关卡词库
- 游戏关卡对应课程进度建议（如"建议先完成 L0-06 再挑战拼音群岛第 7 关"）
- 课程 L0 完成 → 推荐进入游戏拼音群岛实战

### 8.3 → 词汇 SRS

- 每课新学词汇自动加入 SRS 复习队列
- SRS 复习时显示来源（"来自 L1-05《在餐厅》"）
- 课程词汇与文化/游戏词汇共享同一 SRS 系统

---

## 九、MVP 范围（L0：20 课）

### 9.1 L0 课程大纲

详见 [Plan-03 系统课程设计方案](../plan/03-course-system.md) 的"Level 0：语音入门"章节。

| 单元 | 课数 | 内容 |
|------|------|------|
| Unit 1 声母 | L0-01 ~ L0-06 | 23 个声母分组教学 |
| Unit 2 韵母 | L0-07 ~ L0-12 | 24 个韵母分组教学 |
| Unit 3 声调 | L0-13 ~ L0-16 | 四声+轻声+变调 |
| Unit 4 拼音综合 | L0-17 ~ L0-20 | 拼读规则+综合实战 |

### 9.2 静态资源需求

| 资源 | 数量 | 规格 | 生成方式 |
|------|------|------|---------|
| 情境插图 | 20 张 | 800×600 | FLUX 2 生成 |
| 口型/发音动画 | 47 个 | Lottie JSON | 设计制作 |
| 教学音频（标准发音） | ~200 条 | MP3 / 16kHz | Azure Neural TTS |
| 教学音频（越南语对比） | ~50 条 | MP3 / 16kHz | Azure Neural TTS |
| 练习音频 | ~300 条 | MP3 / 16kHz | Azure Neural TTS |
| 文化角配图 | 20 张 | 400×300 | FLUX 2 生成 |

---

## 十、API 接口

### 10.1 接口列表

| 方法 | 路径 | 说明 | 鉴权 |
|------|------|------|------|
| GET | `/api/courses/levels` | 获取级别列表（含进度） | 可选 |
| GET | `/api/courses/:level/units` | 获取单元列表 | 可选 |
| GET | `/api/courses/:level/:unitId/lessons` | 获取课程列表 | 可选（付费检查） |
| GET | `/api/courses/lessons/:lessonId` | 获取课程完整内容 | 必须（付费检查） |
| POST | `/api/courses/lessons/:lessonId/progress` | 更新课程进度 | 必须 |
| POST | `/api/courses/lessons/:lessonId/complete` | 标记课程完成 | 必须 |
| GET | `/api/courses/tests/:testId` | 获取测试题目 | 必须 |
| POST | `/api/courses/tests/:testId/submit` | 提交测试答案 | 必须 |
| GET | `/api/courses/certificates/:certId` | 获取证书详情 | 公开（验证用） |

### 10.2 关键接口响应格式

**GET /api/courses/lessons/:lessonId**

```json
{
  "id": "uuid",
  "lessonId": "L0-01",
  "level": "L0",
  "unitId": "U1",
  "titleVi": "Thanh mẫu đôi môi: b, p, m, f",
  "titleZh": "唇音声母：b, p, m, f",
  "steps": [
    {
      "id": "step-1",
      "type": "intro",
      "sortOrder": 1,
      "content": {
        "imageUrl": "/images/courses/L0-01-intro.webp",
        "textVi": "Xin chào! Hôm nay chúng ta học...",
        "audioUrl": "/audio/courses/L0-01-intro.mp3"
      }
    },
    {
      "id": "step-2",
      "type": "teach",
      "sortOrder": 2,
      "content": {
        "cards": [
          {
            "phoneme": "b",
            "ipa": "/b/",
            "descriptionVi": "Không bật hơi, âm đôi môi",
            "comparisonVi": "Giống âm 'b' trong tiếng Việt",
            "audioStandard": "/audio/phonemes/b.mp3",
            "audioComparison": "/audio/phonemes/b-vi.mp3",
            "mouthAnimation": "/animations/mouth-b.json"
          }
        ]
      }
    },
    {
      "id": "step-3",
      "type": "exercise",
      "sortOrder": 3,
      "content": {
        "exerciseId": "ex-uuid",
        "exerciseType": "listen_select",
        "question": {"audioUrl": "/audio/exercises/L0-01-q1.mp3", "textVi": "Bạn nghe thấy âm nào?"},
        "options": [
          {"label": "b", "value": "b"},
          {"label": "p", "value": "p"},
          {"label": "m", "value": "m"},
          {"label": "f", "value": "f"}
        ],
        "correctAnswer": "b",
        "explanationVi": "Đúng rồi! Đây là âm 'b', không bật hơi."
      }
    }
  ],
  "vocab": [],
  "userProgress": {
    "currentStep": 0,
    "isCompleted": false,
    "starRating": 0
  }
}
```

---

## 十一、非功能需求

| 指标 | 目标 |
|------|------|
| 课程页加载 | ≤ 3 秒（含音频预加载） |
| 练习响应延迟 | ≤ 100ms（答题反馈） |
| 音频播放延迟 | ≤ 200ms（首次点击到播放） |
| 进度同步 | 每完成一步即同步（debounce 2s） |
| 离线课程包大小 | ≤ 5MB / 课 |
| 动画帧率 | ≥ 30fps（口型动画） |
