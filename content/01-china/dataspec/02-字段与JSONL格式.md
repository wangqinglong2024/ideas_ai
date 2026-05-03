# 发现中国 · 02 · 字段与 JSON 格式

> 完整字段规约。文件名保留历史编号，但当前格式已经从 JSONL 改为单篇 `*.article.json`。

---

## 1. 单篇 `article.json` 顶层结构

```jsonc
{
  "schema": "china.article.v2",
  "doc_version": "2026-05-phase1",
  "category_code": "01",
  "category_dir": "01-history",
  "article_slug": "01-dynasty-order-rhyme",
  "article": { ... },
  "content_policy": { ... },
  "seo": { ... },
  "geo": { ... },
  "sentences": [ ... ]
}
```

| 字段 | 必填 | 说明 |
|------|------|------|
| `schema` | 是 | 固定 `china.article.v2` |
| `doc_version` | 是 | 数据规格版本，如 `2026-05-phase1` |
| `category_code` | 是 | `01..12`，必须与 `article.category_code` 一致 |
| `category_dir` | 是 | 类目目录名，如 `01-history` |
| `article_slug` | 是 | 文件稳定 slug，不等同 DB code |
| `article` | 是 | DB `china_articles` 可导入字段 |
| `content_policy` | 是 | 句数和更新策略 |
| `seo` | 是 | 搜索引擎元数据 |
| `geo` | 是 | AI 答案引擎元数据 |
| `sentences` | 是 | DB `china_sentences` 可导入字段数组 |

---

## 2. `article` 字段

```jsonc
{
  "local_id": "hist-001",
  "category_code": "01",
  "title_pinyin": "zhōng guó cháo dài shùn xù kǒu jué lǐ jiǎng le shén me",
  "title_i18n": {
    "zh": "中国朝代顺序口诀里讲了什么？",
    "en": "What Does the Chinese Dynasty Order Rhyme Tell Us?",
    "vi": "Câu vè thứ tự các triều đại Trung Quốc nói gì?",
    "th": "กลอนลำดับราชวงศ์จีนบอกอะไรเราบ้าง?",
    "id": "Apa Isi Rima Urutan Dinasti Tiongkok?"
  }
}
```

| 字段 | 要求 |
|------|------|
| `local_id` | 1–64 字符，文件内追踪用，不入库 |
| `category_code` | `01..12` |
| `title_pinyin` | 1–200 字，带声调，音节空格分隔 |
| `title_i18n.*` | 5 语言全齐，每项 1–40 字 |

AI 不写 `code`、`id`、`status`、`published_at`。导入脚本入库时生成 DB code，并默认 `draft`；如果命令带 `--publish`，导入后调用 `fn_publish_article`。

---

## 3. `content_policy`

```jsonc
{
  "sentence_target": 120,
  "sentence_hard_max": 120,
  "update_mode": "append_only_infinite",
  "phase": "phase1"
}
```

首期正式内容使用 120 句/篇。后续热点增量可以少于 120，但不得超过 120；需要更长内容时拆成系列文章。

---

## 4. `seo` 字段

```jsonc
{
  "schema_type": "Article",
  "primary_keywords": {
    "zh": ["中国朝代顺序", "中国历史入门"],
    "en": ["Chinese dynasty order", "Chinese history timeline"],
    "vi": ["thứ tự triều đại Trung Quốc"],
    "th": ["ลำดับราชวงศ์จีน"],
    "id": ["urutan dinasti Tiongkok"]
  },
  "search_intents": ["what_is", "timeline", "beginner_learning"],
  "pseo_paths": ["/china/01-history/dynasty-order-rhyme"]
}
```

每篇必须覆盖：主关键词、长尾问题、目标语言搜索词、推荐落地页路径。

---

## 5. `geo` 字段

```jsonc
{
  "bluf": {
    "zh": "中国朝代顺序口诀用固定顺序帮助学习者记住主要王朝。",
    "en": "The dynasty order rhyme helps learners remember the main Chinese dynasties in sequence."
  },
  "entities": [
    { "type": "dynasty", "name_zh": "秦朝", "name_en": "Qin Dynasty" },
    { "type": "dynasty", "name_zh": "唐朝", "name_en": "Tang Dynasty" }
  ],
  "citation_notes": ["第 1 句可直接作为 AI 摘要答案", "实体名首次出现需中英对齐"]
}
```

GEO 必须体现 BLUF、实体协调、可引用句子和事实密度。

---

## 6. `sentences` 字段

每个元素是一句，按 `seq_in_article` 升序排列。

```jsonc
{
  "seq_in_article": 1,
  "pinyin": "zhōng guó cháo dài shùn xù kǒu jué yòng gù dìng shùn xù bāng zhù xué xí zhě jì zhù zhǔ yào wáng cháo",
  "content_zh": "中国朝代顺序口诀用固定顺序帮助学习者记住主要王朝。",
  "content_en": "The Chinese dynasty order rhyme uses a fixed sequence to help learners remember the main dynasties.",
  "content_vi": "Câu vè thứ tự triều đại Trung Quốc dùng trình tự cố định để giúp người học nhớ các triều đại chính.",
  "content_th": "กลอนลำดับราชวงศ์จีนใช้ลำดับตายตัวเพื่อช่วยผู้เรียนจำราชวงศ์หลัก",
  "content_id": "Rima urutan dinasti Tiongkok memakai urutan tetap untuk membantu pelajar mengingat dinasti utama."
}
```

| 字段 | 要求 |
|------|------|
| `seq_in_article` | 1..120，连续无跳号 |
| `pinyin` | 1–600 字，带声调，不用数字调 |
| `content_zh` | 1–400 字，简体中文，全角标点 |
| `content_en/vi/th/id` | 1–400 字，自然翻译 |

第 1 句必须是 BLUF：直接回答标题问题，不写寒暄或铺垫。

---

## 7. 自检清单

- [ ] 每个文件只含 1 篇文章
- [ ] `schema = china.article.v2`
- [ ] `category_code` 三处一致：顶层、`article`、manifest
- [ ] `sentences.length <= 120`
- [ ] 首期 phase1 正式内容 `sentences.length = 120`
- [ ] `seq_in_article` 从 1 连续到 N
- [ ] 第 1 句是 BLUF
- [ ] 5 语言全齐
- [ ] SEO/GEO 元数据没有缺失
- [ ] 文件不含 DB `id/code/article_id/created_at/audio_url_zh`
