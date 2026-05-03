# 发现中国 · 02 · 字段与 JSONL 格式

> 完整字段规约。AI 生成时严格按本文件输出。
> 字段来源：[function/01-china/ai/F1-AI-数据模型规范/02-表定义-china_articles.md](../../../function/01-china/ai/F1-AI-数据模型规范/02-表定义-china_articles.md) + [03-表定义-china_sentences.md](../../../function/01-china/ai/F1-AI-数据模型规范/03-表定义-china_sentences.md)

---

## 1. `articles.jsonl`

每行一条文章。

### 1.1 完整字段（AI 必须填的字段）

| 字段 | 类型 | 必填 | 长度/格式 | 说明 |
|------|------|------|----------|------|
| `__article_local_id` | string | ✅ | 1–32 字符，本批次内唯一 | 占位 ID，建议用短串 `a1`/`a2`/... 或 slug |
| `category_code` | string | ✅ | `01..12` | 必须与 manifest 的 `category_code` 一致 |
| `title_pinyin` | string | ✅ | 1–200 字 | 标题全拼，按音节空格分，带声调，例：`bā dà cài xì` |
| `title_i18n` | object | ✅ | 5 key 全齐 | `{zh,en,vi,th,id}`，每值 1–40 字 |

### 1.2 完整示例

```jsonl
// schema=china.article.v1
{"__article_local_id":"a1","category_code":"02","title_pinyin":"bā dà cài xì shì shén me","title_i18n":{"zh":"八大菜系是什么？","en":"What Are China's Eight Great Cuisines?","vi":"Bát đại trường phái ẩm thực Trung Hoa là gì?","th":"แปดสำรับใหญ่ของจีนคืออะไร?","id":"Apa Itu Delapan Aliran Kuliner Tiongkok?"}}
{"__article_local_id":"a2","category_code":"02","title_pinyin":"chuān cài de má là cóng nǎ ér lái","title_i18n":{"zh":"川菜的麻辣从哪儿来？","en":"Where Does Sichuan Cuisine's Heat Come From?","vi":"Vị tê cay của Tứ Xuyên đến từ đâu?","th":"ความเผ็ดชาของอาหารเสฉวนมาจากไหน?","id":"Dari Mana Pedas-Getir Masakan Sichuan?"}}
```

### 1.3 校验细节

- `title_i18n.zh` 与 manifest `notes` 的中文要呼应，便于人工查阅
- 标题不要以"。"结尾；问句以"？"结尾；陈述句不带句号
- 不允许出现 emoji、特殊符号、URL、@、#
- 30% 以上的标题用问句式（GEO 引擎更易识别 QA 对）

---

## 2. `sentences.jsonl`

每行一条句子，按 `(__article_local_id, seq_in_batch)` 升序排列。

### 2.1 完整字段

| 字段 | 类型 | 必填 | 长度/格式 | 说明 |
|------|------|------|----------|------|
| `__article_local_id` | string | ✅ | 与 articles.jsonl 中某行一致 | 关联到本批次某文章 |
| `seq_in_batch` | int | ✅ | 1–N | 文章内顺序，从 1 开始连续，不允许跳号 |
| `pinyin` | string | ✅ | 1–600 字 | 整句拼音，按字空格分，带声调 |
| `content_zh` | string | ✅ | 1–400 字 | 中文原文 |
| `content_en` | string | ✅ | 1–400 字 | 英文翻译 |
| `content_vi` | string | ✅ | 1–400 字 | 越南语翻译 |
| `content_th` | string | ✅ | 1–400 字 | 泰语翻译 |
| `content_id` | string | ✅ | 1–400 字 | 印尼语翻译（注意字段名 `content_id` 中的 `id` 是语言代码，不是主键 id） |

### 2.2 完整示例

```jsonl
// schema=china.sentence.v1
{"__article_local_id":"a2","seq_in_batch":1,"pinyin":"chuān cài de má là zhǔ yào lái zì huā jiāo hé là jiāo de jié hé","content_zh":"川菜的麻辣主要来自花椒和辣椒的结合。","content_en":"Sichuan cuisine's heat comes mainly from the combination of Sichuan peppercorn and chili.","content_vi":"Vị tê cay của Tứ Xuyên chủ yếu đến từ sự kết hợp của hạt tiêu Tứ Xuyên và ớt.","content_th":"ความเผ็ดชาของอาหารเสฉวนมาจากการผสมของพริกหอมเสฉวนกับพริก","content_id":"Pedas-getir Sichuan terutama dari paduan merica Sichuan dan cabai."}
{"__article_local_id":"a2","seq_in_batch":2,"pinyin":"huā jiāo dài lái má de gǎn jué","content_zh":"花椒带来"麻"的感觉。","content_en":"The peppercorn brings the numbing sensation.","content_vi":"Hạt tiêu mang lại cảm giác tê.","content_th":"พริกหอมให้ความรู้สึกชา","content_id":"Merica Sichuan memberi sensasi kesemutan."}
{"__article_local_id":"a2","seq_in_batch":3,"pinyin":"là jiāo dài lái rè liè de là","content_zh":"辣椒带来热烈的辣。","content_en":"Chili brings the burning heat.","content_vi":"Ớt mang lại vị cay nồng.","content_th":"พริกให้ความเผ็ดร้อน","content_id":"Cabai memberi pedas membara."}
```

### 2.3 拼音规则（重要）

- 用**带声调字符**（`ā á ǎ à ē é ě è ī í ǐ ì ō ó ǒ ò ū ú ǔ ù ǖ ǘ ǚ ǜ`）
- **不要**用数字调（`jia4 ge2` 错；`jià gé` 对）
- **轻声**不标声调字符，如 `de` `le` `ma` `ne`
- **儿化**：`huār`（`huā` + `r`）写作 `huār`
- 按音节空格分，标点前后**不**额外加空格
- 句末标点（。？！）不出现在 pinyin 中（pinyin 只对应字音）

例：
```
中文：你好，世界！
拼音：nǐ hǎo  shì jiè
（注意"，"前后用 2 个空格表示停顿是可选的；最简形式："nǐ hǎo shì jiè"）
```

推荐统一最简："`nǐ hǎo shì jiè`"，标点不出现在拼音串中。

### 2.4 5 语言翻译规则

| 语言 | 要求 |
|------|------|
| zh | 简体中文，全角标点 |
| en | 美式英语，自然口语化 |
| vi | 越南语，使用变音符号（`á à ả ã ạ` 等），口语化 |
| th | 泰语，正式书面与口语兼顾，注意空格分词 |
| id | 印尼语 (Bahasa Indonesia)，避免马来西亚语用法 |

**翻译质量要求**：
- 不是直译；要让目标读者觉得"这就是本国人写的"
- 保留文化专有名词（如"花椒"翻 `Sichuan peppercorn`，不要翻成 `numbing pepper`）
- 数字、年代、朝代名等专有概念按目标语言习惯（如"唐朝" → en `Tang Dynasty`，vi `nhà Đường`，th `ราชวงศ์ถัง`）

### 2.5 BLUF 规则（GEO 关键）

每篇文章的 `seq_in_batch=1` 必须是 **BLUF (Bottom Line Up Front)** 句：
- 一句话给出文章的核心答案 / 定义
- ≤ 80 字（中文）；其它语言相应自然长度
- 让 AI 引擎能直接抓取作为答案片段

例（标题"川菜的麻辣从哪儿来？"）：
- ✅ BLUF 第 1 句："川菜的麻辣主要来自花椒和辣椒的结合。"
- ❌ 反例第 1 句："说起川菜，大家都不陌生。"（这是闲扯不是答案）

### 2.6 长度建议

- 一篇文章 38–42 句最佳（一期目标统一为 ~40 句，硬上限 60，DB 上限 9999 仅作保护）
- 每句中文 ≤ 80 字最佳（GEO 引用单位）
- 整篇文章中文总长 200–800 字

---

## 3. 字段对照（jsonl → DB 列）

### 3.1 `articles.jsonl` → `zhiyu.china_articles`

| jsonl 字段 | DB 列 | 导入逻辑 |
|-----------|-------|---------|
| `__article_local_id` | — | 仅本批次内引用，不入库 |
| `category_code` | `category_id` | 按 code 反查 `china_categories.id` |
| `title_pinyin` | `title_pinyin` | 直接写入 |
| `title_i18n` | `title_i18n` | 直接写入 |
| — | `code` | 由 `fn_gen_article_code()` 生成 |
| — | `status` | 默认 `'draft'` |
| — | `id` / `created_at` / `updated_at` | DB 默认 |
| — | `created_by` | 导入脚本写入操作者 uuid（可选） |

### 3.2 `sentences.jsonl` → `zhiyu.china_sentences`

| jsonl 字段 | DB 列 | 导入逻辑 |
|-----------|-------|---------|
| `__article_local_id` | `article_id` | 通过批次内映射查 article uuid |
| `seq_in_batch` | — | 仅排序用，不入库 |
| `pinyin` | `pinyin` | 直接写入 |
| `content_zh` | `content_zh` | 直接写入 |
| `content_en` | `content_en` | 直接写入 |
| `content_vi` | `content_vi` | 直接写入 |
| `content_th` | `content_th` | 直接写入 |
| `content_id` | `content_id` | 直接写入 |
| — | `seq_no` | 由 `fn_next_sentence_seq()` 顺序分配 |
| — | `audio_status` | 默认 `'pending'` |
| — | `id` / `created_at` / `updated_at` | DB 默认 |

---

## 4. 自检清单（提交前必跑）

- [ ] 文件第 1 行是 `// schema=china.article.v1` / `// schema=china.sentence.v1`
- [ ] articles.jsonl 行数 = manifest.files[0].rows
- [ ] sentences.jsonl 行数 = manifest.files[1].rows
- [ ] 所有 `__article_local_id` 在 articles.jsonl 中都能找到
- [ ] 每篇文章的 `seq_in_batch` 从 1 开始连续无跳号
- [ ] 每条 `title_i18n` / `content_*` 字数在限制内
- [ ] pinyin 不含数字调、不含标点
- [ ] 5 语言全齐（zh/en/vi/th/id）
- [ ] 标题不以句号结尾
- [ ] 至少 30% 文章标题为问句
- [ ] 每篇第 1 句是 BLUF 答案句
- [ ] manifest.json 中 `category_code` 与所有 article 一致
