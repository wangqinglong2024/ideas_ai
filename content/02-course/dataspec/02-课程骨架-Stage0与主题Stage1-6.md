# 课程 · 02 · 课程骨架（Stage 0 与主题 Stage 1-6）

> 本节只覆盖 **4 张目录表**：tracks / stages / chapters / lessons。
> 内容（KP / Question / Exam）在后续文件。
> ⚠️ 这是**全平台一次性活**：骨架定下来后，后续 AI 只在已知 lesson_code 范围内生成内容。

---

## 1. 4 张表速览

| 表 | 数量 | 谁来写 | 是否在内容批次里 |
|----|------|-------|---------------|
| `course_tracks` | 5（固定） | 迁移种子 | 否（已存在） |
| `course_stages` | 25 | PM + 内容 AI 一次性 | 否（独立 skeleton 批次） |
| `course_chapters` | ~148 | PM + 内容 AI 一次性 | 否 |
| `course_lessons` | ~888 | PM + 内容 AI 一次性 | 否 |

骨架批次与内容批次**严格分开**。骨架先全部入库后，内容 AI 才开始按 `lesson_code` 写内容。

---

## 2. tracks.jsonl（5 行，迁移已含可跳过）

如果迁移已写入种子，骨架批次就不要再生成。验证命令：
```sql
select count(*) from zhiyu.course_tracks;  -- 应为 5
```

否则 `_skeleton/tracks.jsonl`：

```jsonl
{"code":"share","name_zh":"共享预备","name_i18n":{"zh":"共享预备","en":"Foundations","vi":"Nền tảng","th":"พื้นฐาน","id":"Dasar"},"sort_order":1,"is_enabled":true}
{"code":"ec","name_zh":"电商客服","name_i18n":{"zh":"电商客服","en":"E-commerce CS","vi":"CSKH TMĐT","th":"CS อีคอมเมิร์ซ","id":"CS E-commerce"},"sort_order":2,"is_enabled":true}
{"code":"fc","name_zh":"工厂沟通","name_i18n":{"zh":"工厂沟通","en":"Factory Comms","vi":"Giao tiếp Nhà máy","th":"การสื่อสารโรงงาน","id":"Komunikasi Pabrik"},"sort_order":3,"is_enabled":true}
{"code":"hsk","name_zh":"HSK 应试","name_i18n":{"zh":"HSK 应试","en":"HSK Prep","vi":"Luyện thi HSK","th":"เตรียมสอบ HSK","id":"Persiapan HSK"},"sort_order":4,"is_enabled":true}
{"code":"dl","name_zh":"日常生活","name_i18n":{"zh":"日常生活","en":"Daily Life","vi":"Cuộc sống hàng ngày","th":"ชีวิตประจำวัน","id":"Kehidupan Sehari-hari"},"sort_order":5,"is_enabled":true}
```

---

## 3. stages.jsonl（25 行）

### 3.1 字段

```jsonc
{
  "track_code": "ec",                       // 5 主题之一
  "stage_no": 2,                            // 0–6；0 仅 share 可用
  "title_zh": "电商基础对话",
  "title_i18n": { "zh": "...", "en": "...", "vi": "...", "th": "...", "id": "..." },
  "desc_i18n":  { "zh": "...", ... },       // 可选，每语言 ≤ 200
  "hsk_mapping": null,                      // 仅 hsk 主题填，"HSK1".."HSK6"
  "unlock_rule": {
    "prev_stage_pass": true,
    "require_shared_stage_done": true,      // 主题 stage 1 自动 true，其它默认 false
    "min_score": 70
  },
  "vocab_increment": 200,                   // 该阶段计划新增词汇
  "sort_order": 2,
  "is_published": false                     // AI 一律 false
}
```

### 3.2 25 阶段清单

| track | stage_no | 中文标题 | 来源 PRD |
|-------|---------|---------|---------|
| share | 0 | 共享预备：拼音与汉字基础 | prd/01 §1.3 共享层 |
| ec | 1 | 电商入门：商品与订单 | prd/01 §1.3 EC |
| ec | 2 | 电商进阶：优惠与支付 | 同上 |
| ec | 3 | 电商专业：物流与售后 | 同上 |
| ec | 4 | 电商高级：投诉与退换 | 同上 |
| ec | 5 | 电商精通：直播与营销 | 同上 |
| ec | 6 | 电商专家：跨境与团队管理 | 同上 |
| fc | 1 | 工厂入门：宿舍与日常 | prd/01 §1.3 FC |
| fc | 2 | 工厂基础：安全与规章 | 同上 |
| fc | 3 | 工厂进阶：生产流程 | 同上 |
| fc | 4 | 工厂专业：设备操作 | 同上 |
| fc | 5 | 工厂高级：质量管理 | 同上 |
| fc | 6 | 工厂精通：班组沟通 | 同上 |
| hsk | 1 | HSK1：基础词汇 150 | prd/01 §1.3 HSK，hsk_mapping=HSK1 |
| hsk | 2 | HSK2：常用词汇 300 | hsk_mapping=HSK2 |
| hsk | 3 | HSK3：进阶词汇 600 | HSK3 |
| hsk | 4 | HSK4：中级词汇 1200 | HSK4 |
| hsk | 5 | HSK5：高级词汇 2500 | HSK5 |
| hsk | 6 | HSK6：流利汉语 5000 | HSK6 |
| dl | 1 | 生活入门：自我介绍与问候 | prd/01 §1.3 DL |
| dl | 2 | 生活基础：吃喝玩乐 | 同上 |
| dl | 3 | 生活进阶：出行与购物 | 同上 |
| dl | 4 | 生活专业：医疗与紧急 | 同上 |
| dl | 5 | 生活高级：工作与社交 | 同上 |
| dl | 6 | 生活精通：旅游与文化 | 同上 |

> 准确标题以 PM 在 PRD `prd/01 §1.3` 给出的为准；如有调整在 stages.jsonl 中按实际填写。

---

## 4. chapters.jsonl（~148 行）

### 4.1 字段

```jsonc
{
  "stage_track": "ec",                       // 用 (track,stage_no) 反查 stage_id
  "stage_no": 2,
  "chapter_no": 3,                           // 1–20
  "title_zh": "优惠与支付",
  "title_i18n": { "zh": "...", "en": "...", "vi": "...", "th": "...", "id": "..." },
  "cover_url": "cdn://placeholder/ec-2-3.png",
  "sort_order": 3,
  "is_published": false
}
```

### 4.2 章数规划

每阶段固定 6 章；唯一例外是 **share Stage 0** 为 4 章：

| stage | 章数 | 4 章主题（仅 share） |
|-------|------|------|
| share-0 | **4** | chapter01-pinyin（拼音）/ chapter02-listening（听音辨义）/ chapter03-strokes（笔画与笔顺）/ chapter04-radicals（部首与汉字结构） |
| 其他 24 stage × 6 | 144 | 详见 prd/01 |

合计：4 + 144 = **148 章**。

---

## 5. lessons.jsonl（~888 行）

### 5.1 字段

```jsonc
{
  "chapter_track": "ec",
  "chapter_stage_no": 2,
  "chapter_no": 3,
  "lesson_no": 1,                            // 1–30，常规为 6
  "code": "ec-2-3-1",                        // 必须正则匹配
  "title_zh": "优惠券与折扣",
  "title_i18n": { "zh": "...", "en": "...", "vi": "...", "th": "...", "id": "..." },
  "goal_i18n":  { "zh": "...", ... },        // 可选，每语言 ≤ 80
  "est_minutes": 12,
  "sort_order": 1,
  "has_quiz": true,
  "is_published": false
}
```

### 5.2 节数规划

- 每章固定 6 节
- 148 章 × 6 节 = **888 节**
- code 规则：`<track>-<stage_no>-<chapter_no>-<lesson_no>`，零填充不要（直接 `ec-2-3-1` 而非 `ec-02-03-01`），与 DB 正则一致

### 5.3 lesson_code 全量速查

| Track | Stage | 章范围 | 节范围 | code 示例 |
|-------|-------|-------|-------|----------|
| share | 0 | 1–4 | 1–6 | `share-0-1-1` … `share-0-4-6` |
| ec | 1–6 | 1–6 | 1–6 | `ec-1-1-1` … `ec-6-6-6` |
| fc | 1–6 | 1–6 | 1–6 | `fc-1-1-1` … `fc-6-6-6` |
| hsk | 1–6 | 1–6 | 1–6 | `hsk-1-1-1` … `hsk-6-6-6` |
| dl | 1–6 | 1–6 | 1–6 | `dl-1-1-1` … `dl-6-6-6` |

---

## 6. ⚠️ Stage 0 vs Stage 1-6 内容差异（设计要点）

> 这一节不是骨架字段问题，而是**为后续内容 AI 划定边界**。骨架文件在标题与简介上就要让差异显现。

### 6.1 Stage 0 章 / 节标题应"基础抽象"

✅ 推荐：

- chapter01-pinyin
  - lesson01: "声母 b/p/m/f"
  - lesson02: "声母 d/t/n/l"
  - lesson03: "韵母 a/o/e/i/u/ü"
  - lesson04: "复韵母 ai/ei/ao/ou"
  - lesson05: "鼻韵母 an/en/in/un"
  - lesson06: "整体认读音节"
- chapter02-listening
  - lesson01: "四声辨别"
  - lesson02: "轻声练习"
  - lesson03: "易混音节 zh/z, ch/c, sh/s"
  - lesson04: "前后鼻音 in/ing"
  - lesson05: "听音辨字（同音字入门）"
  - lesson06: "拼音综合听辨"
- chapter03-strokes
  - lesson01: "8 种基本笔画"
  - lesson02: "笔顺 5 大规则"
  - lesson03: "独体字笔顺示范"
  - lesson04: "上下结构笔顺"
  - lesson05: "左右结构笔顺"
  - lesson06: "包围结构笔顺"
- chapter04-radicals
  - lesson01: "30 个常用部首（一）"
  - lesson02: "30 个常用部首（二）"
  - lesson03: "部首与字义的关系"
  - lesson04: "形声字结构"
  - lesson05: "易混部首辨析"
  - lesson06: "部首查字法实战"

❌ 禁止在 Stage 0 出现 "对话 / 场景 / 短语" 类标题。

### 6.2 Stage 1-6 章 / 节标题应"业务场景化"

✅ 推荐（以 ec-2-3 为例）：

- chapter03 标题 = "优惠与支付"
  - lesson01 = "优惠券与折扣"
  - lesson02 = "满减与凑单"
  - lesson03 = "微信支付与支付宝"
  - lesson04 = "退款与售后流程"
  - lesson05 = "发票与开票"
  - lesson06 = "本章综合对话"

❌ 禁止在主题层出现 "声调 / 笔顺 / 部首" 类标题。

### 6.3 跨主题首节绑定共享 Stage 0

每个主题 stage_1 的 lesson01 在 `lesson_kp` 阶段必须**复用** share 的关键 KP（拼音入门 + 笔画入门），通过 `lesson_kp.jsonl` 写：

```json
{"lesson_code":"ec-1-1-1","kp_code":"kp_share_p_000001","position":1,"is_new_in_lesson":false}
{"lesson_code":"ec-1-1-1","kp_code":"kp_share_h_000001","position":2,"is_new_in_lesson":false}
```

具体复用清单由 PM 在批次任务中给出，AI 不要自行决定复用范围。

---

## 7. 骨架批次 manifest

`content/02-course/data/_skeleton/skeleton.manifest.json`：

```jsonc
{
  "batch_code": "skeleton_v1",
  "domain": "course",
  "import_type": "skeleton",
  "files": [
    { "path": "tracks.jsonl",   "rows": 5,   "sha256": "..." },
    { "path": "stages.jsonl",   "rows": 25,  "sha256": "..." },
    { "path": "chapters.jsonl", "rows": 148, "sha256": "..." },
    { "path": "lessons.jsonl",  "rows": 888, "sha256": "..." }
  ],
  "auto_publish": false,
  "notes": "课程骨架首发：5 主题 / 25 阶段 / 148 章 / 888 节。"
}
```

---

## 8. 骨架自检

- [ ] tracks 行数 = 5（或迁移已写入则 0）
- [ ] stages 行数 = 25
- [ ] stages 中 stage_no=0 的行有且只有 1 个，且 track_code='share'
- [ ] hsk 主题 6 阶段的 hsk_mapping 必须填，且 = `HSK1..HSK6`
- [ ] chapters 行数 = 148（share=4，其余 24 stage × 6 = 144）
- [ ] lessons 行数 = 888
- [ ] 每个 code 唯一，正则匹配 `^(share|ec|fc|hsk|dl)-\d{1,2}-\d{1,2}-\d{1,2}$`
- [ ] 所有 i18n 字段 5 语言齐
- [ ] 所有 is_published = false
- [ ] Stage 0 章/节标题不含"场景词"，主题章/节标题不含"拼音/笔顺/部首"
