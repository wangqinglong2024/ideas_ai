# Sprint S06 · 中国发现（Discover China）

> Epic：[E06](../epics/06-discover-china.md) · 阶段：M2 · 周期：W9-W12 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-6)

## Sprint 目标
12 大文化分类的浏览 / 阅读 / 互动学习；句子级阅读器、单字弹窗、收藏笔记、阅读进度。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 6-1-categories-articles-tables | 分类 / 文章 / 句子 表 + API | M | S01 | W9 |
| 2 | 6-2-articles-list-page | 文章列表页 | M | 6-1,S05 | W9 |
| 3 | 6-3-article-detail-immersive | 文章详情（沉浸阅读） | L | 6-1,S02 | W10 |
| 4 | 6-4-sentence-audio-player | 句子音频 + 全篇连播 | M | 6-3 | W10 |
| 5 | 6-5-character-popup | 单字弹窗 | M | 6-3 | W10 |
| 6 | 6-6-favorites-notes | 收藏 / 笔记 | M | 6-5 | W11 |
| 7 | 6-7-reading-progress-time | 阅读进度 / 时长 | S | 6-3,S07 | W11 |
| 8 | 6-8-multilingual-toggle | 多语言切换 | S | S04 | W11 |
| 9 | 6-9-article-fulltext-search | 文章 FTS 搜索 | L | 6-1 | W11-W12 |
| 10 | 6-10-mobile-desktop-optimization | 移动 / 桌面优化 | M | 6-3 | W12 |

## 周次计划
- **W9**：6-1 数据建模；6-2 列表页
- **W10**：6-3 沉浸阅读；6-4 音频；6-5 单字弹窗
- **W11**：6-6 笔记；6-7 进度；6-8 多语；6-9 启动 FTS
- **W12**：6-9 完结（pg_trgm + jieba-rs 分词）；6-10 桌面双栏

## 风险
- 中文分词性能 → 选 jieba-rs 或 nodejieba；离线生成索引
- TTS 音频量大 → 按需生成 + R2 缓存

## DoD
- [ ] 12 类各 ≥ 5 篇可读
- [ ] 4 语翻译完整
- [ ] 阅读体验流畅 60fps
- [ ] FTS 搜索 P95 < 300ms
- [ ] retrospective 完成
