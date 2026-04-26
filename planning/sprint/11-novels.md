# Sprint S11 · 小说阅读

> 顶层约束：[planning/00-rules.md](../00-rules.md)
> Epic：[../epics/11-novels.md](../epics/11-novels.md) · 阶段：M4 · 周期：W17-W19 · 优先级：P0
> Story 数：6 · 状态：[sprint-status.yaml](./sprint-status.yaml)

## 目标
3 周：novels+chapters schema + 公开 API；列表 / 详情 + 目录；沉浸式章节阅读器；ZC / VIP / 自动订阅 三路径解锁；书架 + TTS + 推荐。

## 排期
| 周 | Day | Story | 验收 |
|---|---|---|---|
| W17 | D1-D2 | ZY-11-01 tables+API | 三接口通；402 路径 |
| W17 | D3-D5 | ZY-11-02 list | 12 类型 + 排序 + 离线缓存 |
| W18 | D6-D8 | ZY-11-03 detail+toc | ≥1000 章流畅 |
| W18 | D8-D10 | ZY-11-04 reader | 4 主题 + TTS + 滑翻章 |
| W19 | D11-D13 | ZY-11-05 unlock | 三路径 + 自动订阅 |
| W19 | D13-D15 | ZY-11-06 bookshelf+tts+recommend | 红点 + 推荐 8-12 本 |

## 依赖与并行
- 依赖 S05 / S12 / S13 / S04
- 与 S10 并行

## 退出标准
- 完整阅读 / 解锁 / 加书架闭环
- 离线已读章节可读

## 风险
- 章节正文国际化：admin 翻译界面承载
- 推荐冷启动：用 hsk_self_level + 全站热度兜底
