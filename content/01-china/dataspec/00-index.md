# 发现中国 · 数据生成规范 · 索引

> **业务**：发现中国（Discover China）—— 12 类目下中文短文 + 5 语言对照 + TTS
> **库表**：`zhiyu.china_categories` / `zhiyu.china_articles` / `zhiyu.china_sentences`
> **migration**：[system/supabase/migrations/0005_china_module.sql](../../../system/supabase/migrations/0005_china_module.sql)
> **F1 数据模型**：[function/01-china/ai/F1-AI-数据模型规范/](../../../function/01-china/ai/F1-AI-数据模型规范/)

---

## 文档导航

| # | 文件 | 内容 |
|---|------|------|
| 0 | 本文件 | 索引 + 业务速览 |
| 1 | [01-生成流程与目录约定.md](./01-生成流程与目录约定.md) | 文件命名、批次、生成顺序 |
| 2 | [02-字段与JSONL格式.md](./02-字段与JSONL格式.md) | articles / sentences 完整字段规约 + 校验细则 |
| 3 | [03-类目与批次规划.md](./03-类目与批次规划.md) | 12 类目下首批选题、配额、风格指南、SEO/GEO 要点 |
| 4 | [04-导入与校验.md](./04-导入与校验.md) | 导入命令、错误处理、幂等与回滚 |

---

## 业务速览

### 1. 数据对象（3 张表）

```
china_categories（数据字典 · 12 条固定）
   └─ china_articles（文章主体 · status: draft|published）
        └─ china_sentences（句子 · 1..N · 5 语言独立列 + 拼音 + TTS 状态）
```

### 2. 关键约束

| 表 | 约束 | 含义 |
|----|------|------|
| `china_categories` | 12 条固定，code `01..12` | **AI 不生成此表**，已在 migration 0005 内置 |
| `china_articles.code` | 12 位 `[A-Z0-9]`（剔除 I O 0 1） | **AI 不生成 code**，由 RPC `fn_gen_article_code()` 生成。AI 在 jsonl 里写 `__article_local_id` 占位（同批次内唯一），导入脚本调 RPC 拿真 code |
| `china_articles.title_pinyin` | 1–200 字 | 全拼带空格分隔，带声调 |
| `china_articles.title_i18n` | 必含 5 key，每值 1–40 字 | `zh/en/vi/th/id` 全齐 |
| `china_articles.status` | 默认 `draft` | AI 生成时**始终 `draft`**，发布动作由运营在管理端完成 |
| `china_sentences.seq_no` | 1–9999，复合唯一 | **AI 不生成 seq_no**，由 RPC `fn_next_sentence_seq()` 分配；AI 写 `seq_in_batch` 表示生成顺序，导入脚本按此顺序逐条插入 |
| `china_sentences.pinyin` | 1–600 字 | 整句拼音，带声调，按字空格分 |
| `china_sentences.content_zh/en/vi/th/id` | 各 1–400 字 | 5 语言独立列（**不是 jsonb**） |
| `china_sentences.audio_status` | 默认 `pending` | AI 不生成音频字段，TTS 由用户首次播放触发 |

### 3. 生成顺序

```
对每个 category（01..12）独立循环：
  1. 准备本批次的 N 篇 articles（推荐每批 5 篇）
  2. 每篇 article 生成约 40 条 sentences（推荐 38–42 句，硬上限 60 句）
  3. 输出：
     - batch_xxx.articles.jsonl   （N 行）
     - batch_xxx.sentences.jsonl  （N × ~10 行）
     - batch_xxx.manifest.json
```

### 4. 输出位置

```
content/01-china/data/articles/<类目编码>-<英文名>/
  例：content/01-china/data/articles/01-history/
       batch_20260515_001.articles.jsonl
       batch_20260515_001.sentences.jsonl
       batch_20260515_001.manifest.json
```

类目目录命名（固定）：
| code | 目录名 |
|------|-------|
| 01 | `01-history` |
| 02 | `02-cuisine` |
| 03 | `03-scenic` |
| 04 | `04-festival` |
| 05 | `05-arts` |
| 06 | `06-music` |
| 07 | `07-literature` |
| 08 | `08-idiom` |
| 09 | `09-philosophy` |
| 10 | `10-modern` |
| 11 | `11-fun-hanzi` |
| 12 | `12-myth` |

### 5. 必读文档（生成 AI 按顺序读）

1. [content/00-总览-数据生成规范.md](../../00-总览-数据生成规范.md) §1–§7（铁律 + 枚举 + SEO/GEO）
2. 本目录 01 → 02 → 03 → 04
3. [function/01-china/prd/F1-用户-数据与业务规则.md](../../../function/01-china/prd/F1-用户-数据与业务规则.md)（业务定义）
4. [function/01-china/ai/F1-AI-数据模型规范/02-表定义-china_articles.md](../../../function/01-china/ai/F1-AI-数据模型规范/02-表定义-china_articles.md) 与 [03-表定义-china_sentences.md](../../../function/01-china/ai/F1-AI-数据模型规范/03-表定义-china_sentences.md)（字段细则）

---

```
