# 课程 · 07 · 批次规划与 SEO/GEO 要点

> 全平台一期产能规划，便于 PM 派单与产能监控；同时把 SEO/GEO 嵌入策略落到 KP / 题目 / lesson 字段。

---

## 1. 全平台规模目标

| 项 | 数量 |
|----|------|
| 主题 | 5 |
| 阶段 | 25 |
| 章 | 148 |
| 节 | 888 |
| 节均 KP | 12 |
| 总 KP（去重前） | 888 × 12 = 10656 |
| 总 KP（去重后估算） | ~9000（共享层 KP 大量复用） |
| 节均 Question | 56（12 KP × 4–5 题） |
| 总 Question | ~50000 |
| Lesson Quiz | 888（每节 1 套） |
| Chapter Test | 148（每章 1 套） |
| Stage Exam | 25 |
| HSK Mock | 6 stage × 3 套 = 18 |
| 试卷总数 | ~1080 |

---

## 2. 分批生产计划（推荐）

### 2.1 R0 骨架阶段（一次性）

- 内容：tracks(5) + stages(25) + chapters(148) + lessons(888)
- 工时：PM 整理 stage/chapter/lesson 标题 + i18n（人工 + 翻译 AI）
- 目标：骨架全部入库，成为后续 lesson_code 命名空间

### 2.2 R1 共享层（first-week priority）

- 范围：share Stage 0 全 4 章 24 节
- 内容：~24 × 12 = 288 KP（pinyin/hanzi）
- 题目：~24 × 56 ≈ 1340
- 优先：必须在主题首节学员能学之前发布

### 2.3 R2 主题入门（month-1）

- 范围：ec/fc/hsk/dl 各 stage 1 全 6 章 36 节，4 主题 = 144 节
- 内容：~144 × 12 = 1728 KP
- 题目：~144 × 56 ≈ 8000
- 节奏：每天 5–10 节内容批次

### 2.4 R3 主题进阶（month-2 ~ month-4）

- 范围：4 主题 stage 2–4，各 18 节 × 4 = 432 节
- 内容：~5200 KP / 24000 题

### 2.5 R4 主题高阶（month-5 ~ month-6）

- 范围：4 主题 stage 5–6，各 12 节 × 4 = 288 节
- 内容：~3500 KP / 16000 题

### 2.6 R5 HSK 与试卷（持续）

- 6 HSK stage × 3 套模考 = 18 套
- 全部 lesson_quiz / chapter_test / stage_exam 在内容批次完成后陆续生成

---

## 3. 批次产能（单批=1 节）

| 阶段 | 单批 KP | 单批 Question | 单批 manifest 行数 | AI 平均耗时（参考） |
|------|--------|--------------|------------------|------------------|
| share Stage 0 | 12 | 48（4 题/KP × 12） | 60 | 8–12 min |
| 主题 stage 1–2 | 12 | 56 | 68 | 10–15 min |
| 主题 stage 3–4 | 12 | 56 | 68 | 10–15 min |
| 主题 stage 5–6 | 12 | 72（6 题/KP） | 84 | 15–20 min |
| HSK 模考组卷 | 0 | 0 | 1（exam.json） | 5 min |

---

## 4. 派单格式（PM 给 AI）

```
任务编号：T2026-EC-2-3-1
节 lesson_code：ec-2-3-1
节标题（zh）：优惠券与折扣
学习目标（zh）：能够在电商客服场景中介绍各类优惠券、满减、折扣，理解客户领取、使用、退款时的常见对话
目标词汇（10 个）：优惠券、满减、折扣、凑单、限时、包邮、立减、红包、抢购、秒杀
目标短语（2 个）：领取优惠券、买二减一
目标句子（2 个）：请问还有优惠券吗？/ 这个折扣可以叠加使用。
KP 配比：12 KP = 8 word + 2 phrase + 2 sentence
题型配比：4 题/KP（共 48 题）按 dataspec/04 §4 推荐
exam_scope 分布：见 dataspec/04 §2.2
复用 KP（kp_code）：[]   ← PM 给清单（如复用共享层 / 上节）
SEO 关键词（详见 §6）：discount coupon, e-commerce Chinese, 电商汉语, 优惠券, ecom Mandarin
GEO 实体名（详见 §7）：双十一, 京东, 淘宝, 拼多多
输出目录：content/02-course/data/ec/stage2/chapter03/lesson01/
规范：content/02-course/dataspec/* + content/00-总览-数据生成规范.md
```

---

## 5. 内容规划注意

| 关注点 | 规则 |
|--------|------|
| 词汇覆盖 | 同一主题相邻节避免重复词；如 ec-2-3-1 已教"优惠券"，2-3-2 不再做 word KP，可在 phrase/sentence 中复用 |
| 难度递进 | difficulty 严格按 stage_no（stage_no=2 → KP difficulty 2 占 ≥80%） |
| HSK 主题 | 必填 hsk_level，与 stage_no 一致 |
| 例句长度 | stage 1: ≤ 8 字；stage 3: ≤ 14 字；stage 6: ≤ 20 字 |
| 文化敏感 | 避免政治、宗教、敏感地名等议题；不出现繁体；不出现台湾地名作为主权表述 |
| 母语桥接 | translations 5 语言不要过度直译；vi/th/id 用各语言地道表达，不强求字面对应 |

---

## 6. SEO 嵌入要点（搜索引擎可发现）

> 详细方法论：[marking/seo/](../../../marking/seo/)

### 6.1 内容字段嵌入位置

| 字段 | 用途 | 关键词嵌入策略 |
|------|------|--------------|
| `lesson.title_i18n.en` | 节标题，直接展示在 SEO 着陆页 H1 | 1 个长尾关键词，如 "Discount Coupon Chinese for E-commerce CS" |
| `lesson.goal_i18n.en` | 节描述，落入 meta description | 1 主关键词 + 1 长尾，自然语言不堆砌 |
| `kp.translations.en` | KP 卡片描述 | 与目标受众搜索意图对齐 |
| `kp.tags` | 内部标签，影响站内搜索 | 含 `seo:` 前缀的 SEO 标签如 `seo:hsk3`, `seo:e-commerce-vocab` |
| `kp.content.explanation_md.en` | 详细讲解，落入正文 | BLUF 原则：第一句即答案 |

### 6.2 5 语言关键词矩阵（每节维护）

| 语言 | 主关键词例 | 长尾例 |
|------|----------|-------|
| en | Chinese coupon vocabulary | how to say coupon in Chinese for shopping |
| vi | từ vựng phiếu giảm giá tiếng Trung | cách nói coupon trong tiếng Trung |
| th | คำศัพท์คูปองภาษาจีน | วิธีพูดคูปองภาษาจีน |
| id | kosakata kupon mandarin | cara mengatakan kupon dalam mandarin |
| zh | 电商汉语 优惠券 | 客服 优惠券 怎么说 |

### 6.3 PSEO（程序化 SEO）页面种子

- 每个 lesson_code 自动生成一个 `/learn/[track]/[stage]/[chapter]/[lesson]` 落地页
- 每个 KP 生成 `/word/[kp_code]` 落地页（仅 published）
- KP `tags` 数组用于站内分类页（`/topics/coupon`、`/topics/hsk3`）
- 详见 [marking/seo/05-programmatic-seo.md](../../../marking/seo/05-programmatic-seo.md)

---

## 7. GEO 嵌入要点（AI 引擎可引用）

> 详细方法论：[marking/geo/](../../../marking/geo/)

### 7.1 BLUF 原则

每个 KP 的 `content.explanation_md.<lang>` **第一句必须直接给答案**：

✅ "Coupon (优惠券, yōuhuìquàn) is a discount voucher issued by online merchants in China."
❌ "In Chinese e-commerce, there are many tools that can be used to attract customers..."

### 7.2 实体协调（entity harmonization）

每节涉及的中国本土平台 / 节日 / 文化实体，必须在 `content` 中通过 `entities` 字段显式声明：

```jsonc
{
  "explanation_md": { "en": "Coupon (优惠券)...", /* ... */ },
  "entities": [
    { "type":"platform", "name_zh":"淘宝", "name_en":"Taobao", "wikidata_qid":"Q11375" },
    { "type":"platform", "name_zh":"京东", "name_en":"JD.com", "wikidata_qid":"Q3433356" },
    { "type":"event",    "name_zh":"双十一", "name_en":"Singles' Day", "wikidata_qid":"Q1755470" }
  ]
}
```

`entities` 字段在 schema 中是 `content` 的可选 key，导入脚本会单独抽出去做 GEO 索引（不影响主流程）。

### 7.3 语义切片（semantic chunking）

例句 examples 必须独立可引用：每条 example 含完整 zh + pinyin + 5 lang tr，AI 引擎可直接抓取一段作为答案片段。

### 7.4 引用来源 citation

KP 解释中允许标注权威出处（HSK 词表、《现代汉语词典》），用 `content.sources` 数组：

```jsonc
{
  "sources": [
    { "type":"hsk", "level": 3, "year": 2021 },
    { "type":"dict", "name":"现代汉语词典", "edition": 7 }
  ]
}
```

---

## 8. 翻新与冷启动

| 触发 | 动作 |
|------|------|
| HSK 词表更新 | 批量重生 hsk 主题 KP，version+1 |
| 学员举报 ≥ 3 | 进 web-admin 待修题列表，运营改后 version+1 |
| 平台节日（双 11/618） | 在 ec 主题相关节临时上线"今日热词"补充 KP（不进试卷） |
| 季度内容审计 | dl 主题每季度抽检 100 KP，校翻译质量 |

---

## 9. 总进度看板（建议）

```sql
-- 节级完整度
select
  l.code,
  l.is_published,
  count(distinct lk.kp_id) as kp_count,
  count(distinct q.id) filter (where q.is_published) as q_published_count,
  exists(select 1 from zhiyu.course_exams e where e.scope_type='lesson_quiz' and e.scope_ref_id=l.id and e.is_published) as has_quiz
from zhiyu.course_lessons l
left join zhiyu.course_lesson_kp lk on lk.lesson_id = l.id
left join zhiyu.course_questions q on q.kp_id = lk.kp_id
where l.deleted_at is null
group by l.id, l.code, l.is_published
order by l.code;
```

---

## 10. 下一步（实施清单）

- [ ] PM 整理 stages.jsonl 25 行（落地标题 i18n）
- [ ] PM 整理 chapters.jsonl 148 行
- [ ] PM 整理 lessons.jsonl 888 行
- [ ] 跑 `import_course_skeleton.ts`
- [ ] R1：share Stage 0 24 节内容
- [ ] R2：4 主题 Stage 1 全 144 节
- [ ] 持续：R3 / R4 / R5
