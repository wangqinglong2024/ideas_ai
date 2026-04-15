# PRD-14：管理后台

> **文档编号**: PRD-14 | **优先级**: P0
> **版本**: v3.0 | **日期**: 2026-04-15
> **关联文档**: [文档总览](00-index.md) | [用户系统](01-user-system.md) | [发现中国](02-discover-china.md) | [系统课程](03-course-system.md) | [会员支付](09-membership-payment.md) | [推广返佣](10-referral-commission.md)

---

## 一、模块概述

### 1.1 定位

PlayLingo 管理后台是面向运营团队的内部管理系统，用于：

- **内容管理**：发现中国文章、系统课程、游戏关卡的全生命周期管理
- **用户管理**：用户账号查看、编辑、封禁
- **数据分析**：DAU/MAU、收入、留存、转化漏斗等核心运营指标
- **订阅管理**：会员订阅状态查看与人工干预
- **佣金管理**：推广返佣审核与提现处理
- **系统配置**：功能开关、定价配置、国际化文本管理

### 1.2 核心原则

1. **配置即发布** — 所有内容配置后动态显示，发布无需更新代码
2. **动态文本加载** — 管理端和应用端页面文字均通过 API 动态加载，防止爬虫抓取（SEO 公开页除外）
3. **上传即映射** — 管理端上传资源的格式/尺寸严格匹配应用端显示要求
4. **简单权限** — 不搞复杂角色体系，超级管理员 + 普通管理员两级即可

### 1.3 技术方案

| 维度 | 方案 |
|------|------|
| 前端框架 | React + TypeScript + Ant Design Pro |
| 路由 | React Router v6，独立于用户端 |
| 状态管理 | Zustand |
| HTTP | axios + React Query |
| 图表库 | ECharts 5 |
| 部署 | 与用户端同域，`/admin` 路径，Nginx 反代 |
| 后端 | 复用 FastAPI，`/api/admin/*` 前缀路由 |
| 认证 | JWT（独立于用户端 Supabase Auth） |

---

## 二、管理员认证

### 2.1 账号体系

| 角色 | 权限 | 创建方式 |
|------|------|---------|
| 超级管理员 | 全部权限 + 创建/删除管理员 | 系统初始化时创建（环境变量或 seed 脚本） |
| 普通管理员 | 内容管理 + 用户查看 + 数据查看（不可管理管理员、不可修改系统配置） | 超级管理员在后台创建 |

### 2.2 登录方式

- 用户名 + 密码登录（不接入 Google/Facebook 等第三方）
- 密码要求：≥12 字符，含大小写字母 + 数字 + 特殊字符
- bcrypt 哈希存储，salt rounds = 12

### 2.3 安全措施

| 措施 | 规则 |
|------|------|
| 登录失败锁定 | 连续 5 次失败 → 锁定 30 分钟 |
| JWT 过期 | Access Token 2 小时 / Refresh Token 7 天 |
| 操作日志 | 所有增删改操作记录 admin_id + action + target + timestamp |
| IP 白名单 | 可选，超级管理员配置生效 IP 段 |
| HTTPS Only | 管理端强制 HTTPS，Cookie Secure + SameSite=Strict |

### 2.4 数据库表

```sql
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(50) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'admin', -- 'super_admin' | 'admin'
  is_active BOOLEAN DEFAULT true,
  last_login_at TIMESTAMPTZ,
  failed_login_count INT DEFAULT 0,
  locked_until TIMESTAMPTZ,
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE admin_audit_logs (
  id BIGSERIAL PRIMARY KEY,
  admin_id UUID NOT NULL REFERENCES admin_users(id),
  action VARCHAR(50) NOT NULL, -- 'create' | 'update' | 'delete' | 'publish' | 'ban_user'
  target_type VARCHAR(50) NOT NULL, -- 'article' | 'course' | 'level' | 'user' | 'config'
  target_id VARCHAR(100),
  details JSONB,
  ip_address INET,
  created_at TIMESTAMPTZ DEFAULT now()
);
```

### 2.5 API 端点

```
POST   /api/admin/auth/login           -- 登录
POST   /api/admin/auth/refresh         -- 刷新 Token
POST   /api/admin/auth/logout          -- 登出
GET    /api/admin/admins               -- 管理员列表 (super_admin)
POST   /api/admin/admins               -- 创建管理员 (super_admin)
PUT    /api/admin/admins/:id           -- 编辑管理员 (super_admin)
DELETE /api/admin/admins/:id           -- 删除管理员 (super_admin)
PUT    /api/admin/admins/:id/password  -- 修改密码
```

---

## 三、发现中国 — 文章管理

### 3.1 文章列表页

| 功能 | 说明 |
|------|------|
| 列表展示 | 封面缩略图、标题（越南语）、板块分类、难度、状态、发布时间 |
| 筛选 | 板块（8大类）、难度（入门/进阶/高级）、状态（草稿/已发布/已下架） |
| 搜索 | 标题关键词搜索（中文 + 越南语） |
| 排序 | 发布时间、阅读量、词汇数 |
| 批量操作 | 批量发布、批量下架 |

### 3.2 文章编辑页

#### 基本信息

| 字段 | 类型 | 要求 |
|------|------|------|
| 板块分类 | 下拉选择 | 8选1：中华历史/地理风光/文学经典/成语典故/传统文化/哲学思想/当代中国/中越交流 |
| 难度等级 | 下拉选择 | 入门 ★ / 进阶 ★★ / 高级 ★★★ |
| 封面图片 | 图片上传 | **1200×675px, WebP, ≤200KB** |
| 标题（越南语） | 文本 | ≤100 字符 |
| 标题（中文） | 文本 | ≤50 字符 |
| 预计阅读时间 | 数字 | 分钟 |
| SEO 描述 | 文本 | ≤160 字符（越南语） |
| SEO 关键词 | 标签 | ≤10 个 |

#### 正文编辑器

富文本编辑器（Markdown 或 Block-Editor），支持以下内容块：

| 内容块类型 | 说明 | 上传规格 |
|-----------|------|---------|
| 越南语段落 | 主体文本 | — |
| 中文原文块 | 带拼音标注 | — |
| 内容配图 | 文中插图 | **800×auto, WebP, ≤150KB** |
| 音频片段 | 中文朗读音频 | **MP3, 16kHz, 单声道, ≤2MB/段** |
| 词汇高亮 | 行内标记，关联词汇库 | — |

#### 词汇管理（每篇文章）

| 字段 | 说明 |
|------|------|
| 汉字 | 中文词汇 |
| 拼音 | 自动生成可手动修正 |
| 越南语释义 | 翻译 |
| 音频 | **MP3, 16kHz, ≤100KB**（可 TTS 自动生成） |
| 关联课程 | 下拉选择对应课程单元（跨模块联动） |

#### 小测验管理（每篇文章 5 题）

| 字段 | 说明 |
|------|------|
| 题目文本 | 越南语 |
| 选项 | 4 选 1 |
| 正确答案 | 选择正确项 |
| 解析 | 可选，越南语说明 |

### 3.3 发布流程

```
草稿 → 预览（模拟应用端显示） → 发布（SEO 页同步生成）→ 已上线
                                                          ↓
                                                        下架 → 草稿
```

### 3.4 API 端点

```
GET    /api/admin/articles             -- 文章列表（分页+筛选）
POST   /api/admin/articles             -- 创建文章
GET    /api/admin/articles/:id         -- 文章详情
PUT    /api/admin/articles/:id         -- 更新文章
DELETE /api/admin/articles/:id         -- 删除文章（软删除）
PUT    /api/admin/articles/:id/publish -- 发布/下架
POST   /api/admin/articles/:id/preview -- 生成预览链接
POST   /api/admin/upload/image         -- 上传图片（自动压缩+格式转换）
POST   /api/admin/upload/audio         -- 上传音频
```

---

## 四、系统课程 — 课程管理

### 4.1 课程结构层级

```
Level（4个）→ Unit（每级6个）→ Lesson（每单元5课）→ Step（每课7步）
```

### 4.2 Level / Unit 管理

| 字段 | 说明 |
|------|------|
| Level 编号 | L0 / L1 / L2 / L3 |
| Level 名称 | 中文 + 越南语 |
| 封面图 | **800×600px, WebP, ≤150KB** |
| 解锁条件 | 前一 Level 完成 |
| Unit 编号 | 1-6 |
| Unit 主题 | 中文 + 越南语 |

### 4.3 Lesson 编辑页

每课包含 7 个教学步骤（Step），管理后台按步骤分 Tab 配置：

#### Step 1 — 导入（Intro）

| 字段 | 上传规格 |
|------|---------|
| 导入场景图 | **800×600px, WebP, ≤150KB** |
| 情境描述（越南语） | 文本 |
| 情境描述（中文） | 文本 + 拼音 |
| 导入音频 | **MP3, 16kHz, ≤1MB** |

#### Step 2 — 生词学习（New Words）

每课 8-15 个生词，每个生词：

| 字段 | 上传规格 |
|------|---------|
| 汉字 | 文本 |
| 拼音 | 自动生成可修正 |
| 越南语释义 | 文本 |
| 例句（中文） | 文本 |
| 例句（越南语） | 文本 |
| 发音音频 | **MP3, 16kHz, ≤100KB** |
| 例句音频 | **MP3, 16kHz, ≤500KB** |
| 配图 | **400×400px, WebP, ≤80KB**（可选） |

#### Step 3 — 课文（Text）

| 字段 | 上传规格 |
|------|---------|
| 课文内容（中文） | 文本，支持拼音标注 |
| 课文翻译（越南语） | 文本 |
| 课文朗读音频 | **MP3, 16kHz, ≤2MB** |
| 逐句音频 | 每句独立 MP3 |
| 配图 | **800×auto, WebP, ≤150KB**（可选） |

#### Step 4 — 语法讲解（Grammar）

| 字段 | 说明 |
|------|------|
| 语法点标题 | 中文 + 越南语 |
| 讲解内容 | 富文本（越南语主体 + 中文例句） |
| 语法结构图 | **800×auto, WebP, ≤100KB**（可选） |

#### Step 5 — 互动练习（Exercises）

每课 8-12 道练习，9 种题型：

| 题型 | 配置字段 |
|------|---------|
| 听力选择 | 音频(MP3 ≤200KB) + 4选项 + 正确答案 |
| 拼音填写 | 汉字 + 正确拼音 |
| 汉字选择 | 拼音/释义 + 4选项 + 正确答案 |
| 词义匹配 | 5组汉字-释义配对 |
| 语序排列 | 乱序词组 + 正确语序 |
| 填空补全 | 句子 + 空位 + 正确答案 |
| 情境选择 | 场景描述 + 4选项 + 正确答案 |
| 翻译选择 | 越南语句子 + 4中文选项 + 正确答案 |
| 跟读评测 | 目标音频(MP3) + 参考文本（v1.1 AI 评测） |

#### Step 6 — 文化角（Culture Corner）

| 字段 | 说明 |
|------|------|
| 文化点标题 | 越南语 |
| 内容 | 富文本 |
| 关联文化文章 | 下拉选择发现中国模块文章（跨模块联动） |

#### Step 7 — 课后总结（Summary）

| 字段 | 说明 |
|------|------|
| 本课要点 | 文本列表 |
| 下节预告 | 文本 |

### 4.4 单元测验 / 期末测试管理

| 字段 | 说明 |
|------|------|
| 测验类型 | 单元测验(Unit) / 期末测试(Level) |
| 题目数量 | 单元 20-30 题 / 期末 50 题 |
| 时间限制 | 单元 15-20 分钟 / 期末 30-40 分钟 |
| 通过分数 | ≥70% |
| 题目池 | 从已配置练习中抽取 + 新增独立题目 |
| 证书模板 | **1080×1080px, WebP, ≤300KB**（Level 期末专用） |

### 4.5 API 端点

```
GET    /api/admin/courses/levels                    -- Level 列表
PUT    /api/admin/courses/levels/:id                -- 编辑 Level
GET    /api/admin/courses/levels/:lid/units          -- Unit 列表
PUT    /api/admin/courses/units/:id                  -- 编辑 Unit
GET    /api/admin/courses/units/:uid/lessons         -- Lesson 列表
POST   /api/admin/courses/lessons                    -- 创建 Lesson
GET    /api/admin/courses/lessons/:id                -- Lesson 详情（含全部 Steps）
PUT    /api/admin/courses/lessons/:id                -- 更新 Lesson
DELETE /api/admin/courses/lessons/:id                -- 删除 Lesson
PUT    /api/admin/courses/lessons/:id/publish        -- 发布/下架 Lesson
POST   /api/admin/courses/tests                      -- 创建测验
PUT    /api/admin/courses/tests/:id                  -- 编辑测验
```

---

## 五、趣味游戏 — 游戏配置

### 5.1 可配置项与不可配置项

| 类型 | 内容 | 管理方式 |
|------|------|---------|
| ✅ 管理后台配置 | 关卡词汇表、关卡题目、Boss 对话脚本、过场动画脚本 | 动态 API 加载 |
| ❌ 代码内置 | 世界地图图片、角色精灵图、游戏纹理、UI 图标、音效/BGM | 构建时打包至 `/public/assets/` |

### 5.2 关卡内容配置

每关可配置：

| 字段 | 说明 |
|------|------|
| 关卡编号 | 1-60 |
| 所属区域 | 拼音群岛 / 汉字谷地 / 词汇平原 / 语法要塞 |
| 关卡类型 | 知识教学 / 词汇战役 / 汉字书写 / 听力挑战 |
| 关联词汇 | 从词汇库多选（8-20个） |
| 练习题组 | 10-15 题，与课程练习共用 9 种题型 |
| 通过条件 | 正确率阈值（默认 60%/80%/95% 对应 1-3 星） |
| 时间限制 | 秒数（限时关卡） |
| 解锁条件 | 前置关卡 ID |

### 5.3 Boss 战配置

| 字段 | 说明 |
|------|------|
| Boss 名称 | 中文 + 越南语 |
| 对话脚本 | JSON 格式，含问答对 |
| 题目池 | 15-20 题，综合前区域所有关卡词汇 |
| 通过条件 | ≥70% 正确率 + 对话 ≥2/3 正确 |

### 5.4 过场动画脚本配置

| 字段 | 说明 |
|------|------|
| 场景编号 | 1-8 |
| 对话脚本 | JSON 数组：[{speaker, text_zh, text_pinyin, text_vi, emotion, audio_url}] |
| 对话音频 | **MP3, 16kHz, ≤500KB/句**（可 TTS 生成） |

> 注：背景图片和角色精灵图为代码内置资源，不在管理后台配置。详见 [静态资源文档](13-static-assets.md)。

### 5.5 迷你游戏参数配置

| 游戏 | 可配置参数 |
|------|-----------|
| 声调狙击手 | 声波速度曲线、BPM 范围、词汇池 |
| 偏旁爆破 | 偏旁池、组合难度曲线、下落速度 |
| 拼音漂移 | 赛道词汇池、速度曲线、障碍出现频率 |

### 5.6 API 端点

```
GET    /api/admin/game/levels              -- 关卡列表
PUT    /api/admin/game/levels/:id          -- 编辑关卡内容
GET    /api/admin/game/bosses              -- Boss 列表
PUT    /api/admin/game/bosses/:id          -- 编辑 Boss 配置
GET    /api/admin/game/cutscenes           -- 过场动画列表
PUT    /api/admin/game/cutscenes/:id       -- 编辑动画脚本
PUT    /api/admin/game/minigames/:name     -- 编辑迷你游戏参数
```

---

## 六、用户管理

### 6.1 用户列表页

| 功能 | 说明 |
|------|------|
| 列表展示 | 头像、昵称、邮箱、注册方式、注册时间、最后活跃、会员状态、等级 |
| 筛选 | 会员状态（免费/付费/过期）、注册方式（Google/Facebook/邮箱）、国家、注册时间范围 |
| 搜索 | 昵称/邮箱关键词搜索 |
| 排序 | 注册时间、最后活跃、等级、消费金额 |

### 6.2 用户详情页

| 模块 | 展示内容 |
|------|---------|
| 基本信息 | 头像、昵称、邮箱、手机、注册方式、国家、语言、注册时间 |
| 模块偏好 | 首选模块、各模块使用时长分布 |
| 发现中国进度 | 已读文章数/总数、各板块进度、收藏文章 |
| 课程进度 | 当前 Level/Unit/Lesson、完成课时数、测验成绩 |
| 游戏进度 | 已通过关卡/总关卡、星级分布、迷你游戏最高分 |
| 词汇统计 | 总词汇量、各模块来源分布、SRS 等级分布 |
| 会员信息 | 当前套餐、开始/到期时间、历史订阅记录 |
| 推广信息 | 推广码、佣金等级、累计收益、下线用户数 |
| 成就信息 | 等级、徽章列表、Streak 天数 |

### 6.3 用户操作

| 操作 | 权限 | 说明 |
|------|------|------|
| 编辑基本信息 | 全部管理员 | 修改昵称/邮箱（不可改密码） |
| 赠送会员 | 超级管理员 | 手动赋予会员时长 |
| 封禁/解封 | 超级管理员 | 封禁后用户无法登录，需填写封禁原因 |
| 重置进度 | 超级管理员 | 重置指定模块的学习进度（需二次确认） |
| 查看操作日志 | 全部管理员 | 该用户相关的所有管理操作记录 |

### 6.4 API 端点

```
GET    /api/admin/users                -- 用户列表（分页+筛选+搜索）
GET    /api/admin/users/:id            -- 用户详情
PUT    /api/admin/users/:id            -- 编辑用户信息
PUT    /api/admin/users/:id/ban        -- 封禁/解封
PUT    /api/admin/users/:id/membership -- 赠送会员
PUT    /api/admin/users/:id/reset      -- 重置进度
```

---

## 七、订阅管理

### 7.1 订阅列表

| 展示字段 | 说明 |
|---------|------|
| 用户 | 昵称 + 邮箱 |
| 套餐类型 | 月/季/年/终身 |
| 金额 | USD |
| 支付方式 | Paddle / MoMo |
| 状态 | 活跃/已过期/已退款/已取消 |
| 开始时间 | — |
| 到期时间 | — |
| 自动续费 | 是/否 |

### 7.2 订阅操作

| 操作 | 说明 |
|------|------|
| 查看支付详情 | Paddle/MoMo 订单号、支付时间、金额 |
| 手动延期 | 管理员手动延长会员天数（需填原因） |
| 标记退款 | 标记已退款状态（实际退款在 Paddle 处理） |

### 7.3 API 端点

```
GET    /api/admin/subscriptions            -- 订阅列表
GET    /api/admin/subscriptions/:id        -- 订阅详情
PUT    /api/admin/subscriptions/:id/extend -- 手动延期
PUT    /api/admin/subscriptions/:id/refund -- 标记退款
```

---

## 八、佣金管理

### 8.1 佣金概览看板

| 指标 | 说明 |
|------|------|
| 总待提现金额 | 所有推广员未提现佣金总额 |
| 本月新增佣金 | 当月产生的佣金总额 |
| 本月已提现 | 当月已处理提现总额 |
| 活跃推广员数 | 本月有新增下线的推广员数 |
| 平均 K-factor | 当前病毒系数 |

### 8.2 推广员列表

| 展示字段 | 说明 |
|---------|------|
| 推广员 | 昵称 + 邮箱 |
| 佣金等级 | Lv1(5%) / Lv2(10%) / Lv3(15%) / Lv4(20%) |
| 下线总数 | 累计推荐注册用户数 |
| 付费下线数 | 推荐用户中付费人数 |
| 累计佣金 | 历史总佣金 |
| 可提现余额 | 当前可提现金额 |
| 状态 | 正常 / 涉嫌欺诈 / 已封禁 |

### 8.3 提现审核

| 字段 | 说明 |
|------|------|
| 提现单号 | 自动生成 |
| 推广员 | 昵称 + 邮箱 |
| 提现金额 | USD |
| 提现方式 | 银行转账 / 电子钱包 |
| 收款信息 | 账号/钱包地址 |
| KYC 状态 | ≥$100 需 KYC 验证 |
| 操作 | 批准 / 拒绝（需填原因） |

### 8.4 反欺诈审核

系统自动标记可疑行为（同 IP 多注册、注册后秒退、批量注册模式），管理员人工复核。

### 8.5 API 端点

```
GET    /api/admin/commissions/overview     -- 佣金概览
GET    /api/admin/commissions/promoters    -- 推广员列表
GET    /api/admin/commissions/promoters/:id -- 推广员详情
GET    /api/admin/commissions/withdrawals  -- 提现列表
PUT    /api/admin/commissions/withdrawals/:id -- 审核提现
PUT    /api/admin/commissions/promoters/:id/ban -- 封禁推广员
```

---

## 九、数据分析仪表盘

### 9.1 全局概览（Dashboard 首页）

#### 核心指标卡片（实时）

| 指标 | 说明 |
|------|------|
| 今日 DAU | 今日活跃用户数 |
| 本周 WAU | 本周活跃用户数 |
| 本月 MAU | 本月活跃用户数 |
| 今日新注册 | 今日新注册用户数 |
| 今日付费转化 | 今日新增付费/今日活跃 |
| MRR | 当月经常性收入 |

#### 趋势图表

| 图表 | 类型 | 时间范围 |
|------|------|---------|
| DAU 趋势 | 折线图 | 7天/30天/90天 |
| 新增注册 vs 付费转化 | 双轴折线图 | 30天/90天 |
| MRR 趋势 | 面积图 | 6个月/12个月 |
| 三模块 DAU 分布 | 堆叠面积图 | 30天 |

### 9.2 用户分析

| 图表 | 说明 |
|------|------|
| 注册漏斗 | 访问 → 注册 → 完成 Onboarding → 完成首个内容 → 7日留存 → 付费 |
| 留存曲线 | 次日/3日/7日/14日/30日留存率 |
| 用户地域分布 | 国家/城市热力图 |
| 注册渠道分布 | Google/Facebook/邮箱 占比饼图 |
| 模块偏好分布 | 首选模块选择饼图 + 实际使用时长分布 |
| 用户活跃时段 | 按小时的热力图（UTC+7） |

### 9.3 内容分析

#### 发现中国

| 图表 | 说明 |
|------|------|
| 文章阅读排行 | Top 20 文章按阅读量排序 |
| 板块阅读分布 | 8 大板块阅读量占比 |
| 文章完读率 | 完整阅读/打开 比率 |
| 测验通过率 | 各文章测验平均分 |
| SEO 流量 | 来自搜索引擎的 UV/PV（按文章） |

#### 系统课程

| 图表 | 说明 |
|------|------|
| 课程完成漏斗 | L0开始 → L0完成 → L1开始 → L1完成 → ... |
| 每课完成率 | 按课程编号的完成率柱状图 |
| 平均课时时长 | 用户完成每课的平均时间 |
| 练习正确率分布 | 9 种题型的平均正确率 |
| 测验成绩分布 | 各级测验成绩直方图 |
| 掉课热点 | 用户放弃率最高的课程 Top 10 |

#### 趣味游戏

| 图表 | 说明 |
|------|------|
| 关卡通过率 | 60 关的通过率折线图 |
| 迷你游戏参与度 | 3 款迷你游戏日均参与人次 |
| Boss 战通过率 | 4 场 Boss 战首次通过率 |
| 星级分布 | 1/2/3 星占比 |
| 生命消耗 | 日均生命消耗量趋势 |

### 9.4 收入分析

| 图表 | 说明 |
|------|------|
| 收入构成 | 月/季/年/终身 订阅收入占比 |
| ARPU 趋势 | 月均每用户收入趋势 |
| 付费转化漏斗 | 免费用户 → 触发付费墙 → 查看定价 → 完成支付 |
| 续费率 | 月度/季度/年度续费率 |
| 退款率 | 月度退款率趋势 |
| LTV 分布 | 用户终身价值直方图 |
| 佣金支出占比 | 佣金/收入 比率趋势 |

### 9.5 推广分析

| 图表 | 说明 |
|------|------|
| K-factor 趋势 | 病毒系数月度趋势 |
| 推广渠道效果 | 各分享渠道（Facebook/Zalo/TikTok）注册转化率 |
| Top 推广员 | 本月推荐人数 Top 20 |
| 佣金等级分布 | Lv1-Lv4 推广员分布 |

### 9.6 技术指标

| 图表 | 说明 |
|------|------|
| API 响应时间 | P50/P95/P99 延迟趋势 |
| 错误率 | 5xx/4xx 错误率趋势 |
| 游戏 FPS | 客户端平均帧率分布 |
| CDN 带宽 | 日/月 CDN 流量消耗 |

---

## 十、系统配置

### 10.1 功能开关

| 开关 | 默认值 | 说明 |
|------|--------|------|
| discover_module_enabled | true | 发现中国模块开关 |
| course_module_enabled | true | 系统课程模块开关 |
| game_module_enabled | true | 趣味游戏模块开关 |
| pvp_enabled | false | PvP 对战开关（v1.1） |
| ai_chat_enabled | false | AI 口语对话开关（v1.1） |
| referral_enabled | true | 推广返佣开关 |
| ads_enabled | true | 广告展示开关（仅免费用户） |
| maintenance_mode | false | 维护模式（全站只读提示） |

### 10.2 定价配置

| 字段 | 说明 |
|------|------|
| 各国价格表 | 月/季/年/终身 × 越南/印尼/... |
| 首月特惠价 | $0.99（可调整） |
| 免费试用天数 | 默认 0 |
| 佣金阶梯 | Lv1-4 比例（5%/10%/15%/20%） |
| 每日免费 AI Coins | 免费10 / 会员30 |
| 迷你游戏免费次数 | 默认 3 次/天 |
| 生命恢复时间 | 默认 30 分钟 |
| 免费/付费关卡分界 | 默认前 40 关免费 |

### 10.3 国际化文本管理（i18n）

管理后台提供全站文本的增删改查，实现动态加载：

| 功能 | 说明 |
|------|------|
| 文本条目列表 | key（如 `home.hero.title`）+ 各语言值 |
| 按模块筛选 | common / discover / course / game / payment / referral |
| 批量导入 | JSON 文件上传 |
| 批量导出 | 导出为 JSON |
| 缺失翻译标记 | 高亮未翻译的 key |

#### 动态加载机制

```
应用端启动 → 请求 GET /api/i18n/:locale
→ 返回该语言全部文本 JSON（gzip 压缩）
→ 客户端缓存至 localStorage（带版本号）
→ 后续每次启动对比版本号 → 有更新则拉取最新
```

> **重要**：应用端所有界面文字均通过此 API 动态加载，HTML 源码中不含任何业务文本。搜索引擎可索引的 SEO 公开页（发现中国文章公开页）除外，该类页面使用 SSR 渲染以保证 SEO 效果。

### 10.4 通知模板管理

| 模板类型 | 说明 |
|---------|------|
| 推送通知 | 标题 + 正文 + 跳转链接，支持变量插值 |
| 邮件模板 | HTML 模板，支持变量插值 |
| 应用内公告 | 富文本公告，可设置展示时间范围 |

### 10.5 API 端点

```
GET    /api/admin/config                   -- 获取全部配置
PUT    /api/admin/config/:key              -- 更新配置项
GET    /api/admin/i18n                     -- i18n 条目列表
POST   /api/admin/i18n                     -- 创建条目
PUT    /api/admin/i18n/:key                -- 更新条目
DELETE /api/admin/i18n/:key                -- 删除条目
POST   /api/admin/i18n/import              -- 批量导入
GET    /api/admin/i18n/export/:locale      -- 批量导出
GET    /api/i18n/:locale                   -- [公开] 应用端文本加载
GET    /api/admin/notifications/templates  -- 通知模板列表
POST   /api/admin/notifications/templates  -- 创建模板
PUT    /api/admin/notifications/templates/:id -- 编辑模板
POST   /api/admin/notifications/send       -- 发送通知
```

---

## 十一、资源上传规格汇总

所有通过管理后台上传的资源，必须严格匹配以下规格，确保应用端正确显示：

### 11.1 图片规格

| 用途 | 尺寸 | 格式 | 大小上限 | 应用端显示位置 |
|------|------|------|---------|---------------|
| 文章封面 | 1200×675px | WebP | 200KB | 文章卡片 + 文章头图 |
| 文章配图 | 800×auto (等比) | WebP | 150KB | 文章正文插图 |
| Level 封面 | 800×600px | WebP | 150KB | 课程 Level 选择页 |
| Lesson 导入图 | 800×600px | WebP | 150KB | 课程导入步骤 |
| 生词配图 | 400×400px | WebP | 80KB | 生词学习卡片 |
| 课文配图 | 800×auto (等比) | WebP | 150KB | 课文阅读区 |
| 语法结构图 | 800×auto (等比) | WebP | 100KB | 语法讲解区 |
| 证书模板 | 1080×1080px | WebP | 300KB | 证书分享图 |

### 11.2 音频规格

| 用途 | 格式 | 采样率 | 声道 | 大小上限 |
|------|------|--------|------|---------|
| 词汇发音 | MP3 | 16kHz | 单声道 | 100KB |
| 例句音频 | MP3 | 16kHz | 单声道 | 500KB |
| 课文朗读 | MP3 | 16kHz | 单声道 | 2MB |
| 文章音频片段 | MP3 | 16kHz | 单声道 | 2MB |
| 听力练习 | MP3 | 16kHz | 单声道 | 200KB |
| 过场动画对话 | MP3 | 16kHz | 单声道 | 500KB |

### 11.3 上传处理流程

```
管理员上传原始文件
  → 服务端校验格式/尺寸
  → 图片自动转 WebP + 压缩至目标大小
  → 音频自动转 MP3 16kHz 单声道
  → 上传至 Cloudflare R2
  → 返回 CDN URL
  → 写入数据库关联记录
```

---

## 十二、内容动态加载与反爬虫策略

### 12.1 应用端动态加载

| 内容类型 | 加载方式 | SEO |
|---------|---------|-----|
| 界面文字 (i18n) | API `/api/i18n/:locale` → localStorage 缓存 | ❌ 不可索引 |
| 文化文章（App 内阅读） | API `/api/discover/articles/:id` → 动态渲染 | ❌ 不可索引 |
| 文化文章（SEO 公开页） | SSR `/discover/:slug` → 服务端渲染完整 HTML | ✅ 可索引 |
| 课程内容 | API `/api/courses/lessons/:id` → 动态渲染 | ❌ 不可索引 |
| 游戏关卡数据 | API `/api/game/levels/:id` → 动态渲染 | ❌ 不可索引 |
| 用户数据 | API（需 Auth）→ 动态渲染 | ❌ 不可索引 |

### 12.2 反爬虫措施

| 措施 | 说明 |
|------|------|
| API Rate Limiting | 匿名 30次/分，认证用户 100次/分，管理员 300次/分 |
| Token 验证 | 所有内容 API 需 JWT（SEO 公开页除外） |
| 请求签名 | 客户端请求附带 HMAC 签名（防脚本直调） |
| 内容分片 | 长文章分页加载，单次最多返回 1 个章节 |
| 图片防盗链 | Cloudflare R2 Referer 白名单 |
| SSR 页面 Bot 检测 | User-Agent + 行为特征检测，高频爬取触发 CAPTCHA |

### 12.3 管理端动态加载

管理后台所有页面内容均通过 `/api/admin/*` API 动态加载，HTML 为纯 SPA 空壳。管理端不做 SEO，不需 SSR。

---

## 十三、管理后台页面结构

```
/admin
├── /login                          -- 登录页
├── /dashboard                      -- 数据概览（首页）
├── /discover
│   ├── /articles                   -- 文章列表
│   ├── /articles/new               -- 新建文章
│   └── /articles/:id/edit          -- 编辑文章
├── /courses
│   ├── /levels                     -- Level/Unit 总览
│   ├── /lessons                    -- Lesson 列表
│   ├── /lessons/new                -- 新建 Lesson
│   ├── /lessons/:id/edit           -- 编辑 Lesson
│   └── /tests                      -- 测验管理
├── /games
│   ├── /levels                     -- 关卡内容管理
│   ├── /bosses                     -- Boss 战管理
│   ├── /cutscenes                  -- 过场动画管理
│   └── /minigames                  -- 迷你游戏参数
├── /users
│   ├── /list                       -- 用户列表
│   └── /:id                        -- 用户详情
├── /subscriptions                  -- 订阅管理
├── /commissions
│   ├── /overview                   -- 佣金概览
│   ├── /promoters                  -- 推广员列表
│   └── /withdrawals                -- 提现审核
├── /analytics
│   ├── /users                      -- 用户分析
│   ├── /content                    -- 内容分析
│   ├── /revenue                    -- 收入分析
│   └── /growth                     -- 增长分析
├── /config
│   ├── /features                   -- 功能开关
│   ├── /pricing                    -- 定价配置
│   ├── /i18n                       -- 国际化文本
│   └── /notifications              -- 通知模板
└── /admins                         -- 管理员管理 (super_admin only)
```

---

## 十四、数据库新增表

```sql
-- 管理员（见第二章）
-- admin_users, admin_audit_logs

-- 功能开关
CREATE TABLE feature_flags (
  key VARCHAR(100) PRIMARY KEY,
  value BOOLEAN NOT NULL DEFAULT false,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- 系统配置（定价等）
CREATE TABLE system_configs (
  key VARCHAR(100) PRIMARY KEY,
  value JSONB NOT NULL,
  description TEXT,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- i18n 文本
CREATE TABLE i18n_texts (
  key VARCHAR(200) NOT NULL,
  locale VARCHAR(10) NOT NULL, -- 'vi' | 'zh' | 'en' | 'id'
  value TEXT NOT NULL,
  module VARCHAR(50), -- 'common' | 'discover' | 'course' | 'game' | ...
  version INT DEFAULT 1,
  updated_by UUID REFERENCES admin_users(id),
  updated_at TIMESTAMPTZ DEFAULT now(),
  PRIMARY KEY (key, locale)
);

-- 通知模板
CREATE TABLE notification_templates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type VARCHAR(20) NOT NULL, -- 'push' | 'email' | 'in_app'
  name VARCHAR(100) NOT NULL,
  title_template TEXT,
  body_template TEXT NOT NULL,
  variables JSONB, -- [{name: 'username', required: true}]
  created_by UUID REFERENCES admin_users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);
```

---

## 十五、MVP 范围

### MVP v1.0（第1月）

| 模块 | 范围 |
|------|------|
| 管理员认证 | 超级管理员 + 创建普通管理员 + 登录/登出 |
| 文章管理 | CRUD + 发布/下架 + 图片/音频上传 |
| 课程管理 | Level/Unit/Lesson CRUD + 7步内容编辑 + 练习题配置 |
| 游戏管理 | 关卡词汇/题目配置 + Boss 脚本编辑 |
| 用户管理 | 列表 + 详情 + 封禁 |
| 数据看板 | DAU/MAU + 注册趋势 + 付费转化（基础 4 张图表） |
| i18n | 文本 CRUD + 导入导出 + 应用端加载 API |

### v1.1（第2-3月）

| 模块 | 范围 |
|------|------|
| 订阅管理 | 完整订阅列表 + 手动延期/退款 |
| 佣金管理 | 推广员列表 + 提现审核 + 反欺诈标记 |
| 数据看板 | 完整用户/内容/收入/增长分析（全部图表） |
| 通知系统 | 模板管理 + 推送/邮件发送 |

### v1.2（第4-6月）

| 模块 | 范围 |
|------|------|
| 高级配置 | 功能开关 + 定价配置 + IP 白名单 |
| PvP 管理 | 赛季配置 + 排行榜管理 |
| AI 配置 | AI Coins 定价 + Dify Workflow 参数 |
| 多语言 | 印尼语 i18n 文本管理 |

---

## 十六、非功能性要求

| 维度 | 要求 |
|------|------|
| 响应速度 | 页面加载 ≤2s，列表查询 ≤1s |
| 并发 | 支持 10 个管理员同时在线 |
| 数据备份 | Supabase 自动备份，管理员可手动触发导出 |
| 浏览器支持 | Chrome 90+ / Edge 90+（不做移动端适配） |
| 访问控制 | 仅允许内部网络或 IP 白名单访问 |
