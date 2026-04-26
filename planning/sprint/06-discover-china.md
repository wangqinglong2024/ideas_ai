# Sprint S06 · 中国发现

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/06-discover-china.md](../epics/06-discover-china.md) · 阶段：M2 · 周期：W9-W11 · 优先级：P0
> Story 数：6 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周：12 类目 + articles 表；列表 keyset 无限加载；沉浸阅读 (拼音 ruby + SpeechSynthesis TTS)；点字弹窗 + 收藏；阅读进度 + i18n subtitles；jieba FTS + 拼音 tsvector（pg_jieba 自定 supabase-db Dockerfile）。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W9 | D1-D2 | ZY-06-01 categories+articles | 12 categories 种子 + RLS |
| W9 | D2-D5 | ZY-06-02 list page | keyset pagination 无限加载 |
| W10 | D6-D8 | ZY-06-03 reader | 拼音 ruby + TTS + 4 主题 |
| W10 | D8-D10 | ZY-06-04 dict+favorites | 弹窗 + entity_type favorites |
| W11 | D11-D12 | ZY-06-05 progress+subtitles | reading_progress + 段落字幕切语 |
| W11 | D12-D15 | ZY-06-06 search jieba | pg_jieba + tsvector + 拼音匹配 |

## 依赖与并行
- 依赖 S01 / S04 / S05
- 与 S07 并行

## 退出标准
- 12 类各 ≥ 5 篇示例
- 搜索准确率人工抽样 ≥ 90%
- TTS 4 语切换可用

## 风险
- pg_jieba 编译：写入 supabase-db custom Dockerfile，记录于 spec/02-db
- TTS 浏览器差异：保留 fallback 提示
