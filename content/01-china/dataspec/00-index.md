# 发现中国 · 数据生成规范 · 索引

> **业务**：发现中国（Discover China）—— 12 个主题类目下的持续更新文化文章。
> **核心规则**：每篇文章单独一个 JSON 文件；每篇最多 120 句；首期每个主题先产出 12 篇，后续按搜索热点无限增量更新。
> **库表**：`zhiyu.china_categories` / `zhiyu.china_articles` / `zhiyu.china_sentences`
> **migration**：[system/supabase/migrations/0005_china_module.sql](../../../system/supabase/migrations/0005_china_module.sql)

---

## 文档导航

| # | 文件 | 内容 |
|---|------|------|
| 0 | 本文件 | 索引 + 业务速览 |
| 1 | [01-生成流程与目录约定.md](./01-生成流程与目录约定.md) | 单篇 JSON 工作流、目录、命名、更新规则 |
| 2 | [02-字段与JSONL格式.md](./02-字段与JSONL格式.md) | 单篇 article JSON 字段、句子数组、SEO/GEO 元数据 |
| 3 | [03-类目与批次规划.md](./03-类目与批次规划.md) | 12 主题、首期 12 篇/主题、持续更新策略 |
| 4 | [04-导入与校验.md](./04-导入与校验.md) | 导入脚本、清库替换、校验、幂等和回滚 |

---

## 业务速览

### 1. 数据对象

```
china_categories（固定 12 个主题）
   └─ china_articles（文章主体，持续增量）
        └─ china_sentences（文章句子，1..120，5 语言 + 拼音）
```

### 2. 关键约束

| 对象 | 规则 |
|------|------|
| 主题类目 | 固定 12 个，code `01..12`，AI 不生成类目表 |
| 文章文件 | 每篇文章一个 `*.article.json`，不得把多篇文章塞入同一数据文件 |
| 文章数量 | 首期每个主题 12 篇；后续不设总量上限，按搜索热点持续追加 |
| 句子数量 | 每篇最多 120 句；首期正式内容目标为 120 句/篇 |
| 文章 code | AI 不生成，由 `fn_gen_article_code()` 入库时生成 12 位稳定编码 |
| 句子顺序 | JSON 写 `seq_in_article`，导入脚本按顺序写入 DB `seq_no` |
| 多语言 | `zh/en/vi/th/id` 5 语言全齐；中文用简体和全角标点 |
| SEO/GEO | 每篇 JSON 内嵌 `seo` 与 `geo` 元数据；第 1 句必须是 BLUF 答案句；不得另拆外置 GEO 内容包 |
| 内容安全 | 面向东南亚首发市场，避开政治、宗教、民族、领土争议、成人性内容和色情暗示 |

### 3. 输出位置

```
content/01-china/data/articles/<类目目录>/<phase>/
  01-topic-slug.article.json
  02-topic-slug.article.json
  ...
  manifest.json
```

首期历史类目示例：

```
content/01-china/data/articles/01-history/phase1/
  01-dynasty-order-rhyme.article.json
  02-qin-shi-huang-unification.article.json
  ...
  manifest.json
```

类目目录固定：

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

### 4. 必读顺序

1. [content/00-总览-数据生成规范.md](../../00-总览-数据生成规范.md)
2. 本目录 01 → 02 → 03 → 04
3. [function/01-china/prd/F1-用户-数据与业务规则.md](../../../function/01-china/prd/F1-用户-数据与业务规则.md)
4. [function/01-china/ai/F1-AI-数据模型规范/02-表定义-china_articles.md](../../../function/01-china/ai/F1-AI-数据模型规范/02-表定义-china_articles.md) 与 [03-表定义-china_sentences.md](../../../function/01-china/ai/F1-AI-数据模型规范/03-表定义-china_sentences.md)

---

## 当前执行入口

- 生成首期历史内容：`node content/01-china/data/scripts/generate-history-phase1.mjs`
- 导入单篇 JSON：`node system/scripts/db/import-china-article-json.mjs --data-root content/01-china/data/articles/01-history/phase1 --env-file system/docker/env/.env.dev --replace --publish`

`--replace` 会清空 `zhiyu.china_articles` / `zhiyu.china_sentences` 下的发现中国内容后重新导入，仅用于本地或明确授权的环境。
