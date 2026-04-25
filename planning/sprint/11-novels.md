# Sprint S11 · 小说阅读（Novels）

> Epic：[E11](../epics/11-novels.md) · 阶段：M4 · 周期：W21-W24 · 优先级：P0
> Story 数：10 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-11)

## Sprint 目标
12 类目，v1 启动 5 部精品长篇；句子级阅读 / 单字弹窗 / 章节订阅 / 付费解锁。

## Story 列表

| 序 | Story Key | 标题 | 估 | 依赖 | 周次 |
|:-:|---|---|:-:|---|:-:|
| 1 | 11-1-novels-tables | novels / chapters 表 | S | S01 | W21 |
| 2 | 11-2-novels-list-detail-api | 小说列表 + 详情 API | M | 11-1 | W21 |
| 3 | 11-3-chapter-content-paywall-api | 章节内容 + 付费校验 | M | 11-2,S13 | W22 |
| 4 | 11-4-novels-bookshelf-page | 书架页 | L | 11-2,S05 | W22 |
| 5 | 11-5-novel-detail-page | 详情页 | M | 11-2 | W22 |
| 6 | 11-6-chapter-reader | 章节阅读器（复用 S06） | L | 11-3,S06 | W23 |
| 7 | 11-7-chapter-unlock-payment | 单章 / 整本解锁 + VIP | M | 11-3,S12 | W23 |
| 8 | 11-9-reading-preferences | 阅读偏好 | M | 11-6 | W23 |
| 9 | 11-8-update-notifications | 追更通知 | S | 11-2 | W24 |
| 10 | 11-10-five-launch-novels-content | 5 部启动小说内容 | L | 11-1,S04 | W21-W24（并行）|

## 风险
- 小说翻译质量 → 母语审稿；先翻 5 章试读
- 内容审核 → 入库前过审（敏感词 + 人工）

## DoD
- [ ] 5 部小说可读（每部 ≥ 30 章首发，4 语翻译完成）
- [ ] 阅读器流畅；偏好持久化
- [ ] 付费链路通：单章 ZC、整本订阅、VIP 全免
- [ ] 追更通知可订阅
- [ ] retrospective 完成
