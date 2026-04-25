# Sprint S16 · AI 内容工厂（Content Factory）

> Epic：[E16](../epics/16-content-factory.md) · 阶段：**v1.5（Post-MVP）** · 周期：M+3-M+4（8 周） · 优先级：**P1**
> Story 数：12 · 状态：[sprint-status.yaml](./sprint-status.yaml#epic-16)

## ⚠️ 排期说明
- **MVP（v1）阶段不交付** —— 所有内容由人工 / 外部脚本写库
- 数据库表（prompt_templates / factory_tasks / generations）由 S01 阶段一并建好（schema 占位），暂不接入工作流
- admin 路由 `/admin/factory` 在 S17 仅显示「v1.5 即将上线」占位
- 启动条件：v1 上线 4 国 ≥ 3 个月，月活 ≥ 50k，内容产出瓶颈出现

## Sprint 目标
LangGraph + Claude + DeepSeek 编排，自动生成文章 / 课程节 / 小说章 / 词包，人审 + 评分 + 发布。

## Story 列表

| 序 | Story Key | 标题 | 估 | 周次（M+3-M+4）|
|:-:|---|---|:-:|:-:|
| 1 | 16-1-prompt-templates-admin | prompt_templates 表 + 后台 | M | W1 |
| 2 | 16-3-anthropic-deepseek-clients | Anthropic + DeepSeek 客户端 | L | W1-W2 |
| 3 | 16-2-langgraph-checkpointer | LangGraph + PG checkpointer | L | W2 |
| 4 | 16-9-translation-node-five-langs | 翻译节点（5 语） | M | W3 |
| 5 | 16-8-deepseek-tts | DeepSeek TTS | M | W3 |
| 6 | 16-10-auto-evaluator | 自动评估器（4 维度） | M | W3 |
| 7 | 16-4-article-generation-flow | 文章生成工作流 | L | W4 |
| 8 | 16-7-wordpack-generation-flow | 词包生成工作流 | M | W4 |
| 9 | 16-5-lesson-generation-flow | 课程节生成工作流 | L | W5 |
| 10 | 16-6-novel-chapter-generation-flow | 小说章生成工作流 | L | W6 |
| 11 | 16-11-human-review-ui | 人审 UI（后台） | L | W7 |
| 12 | 16-12-cost-quality-dashboard | 成本 + 质量仪表板 | M | W8 |

## 成本目标
- 文章 < $0.30 / 篇
- 课程节 < $0.50 / 节
- 小说章 < $1.50 / 章 (3000 字)
- 词包 < $0.20 / 包

## 风险
- AI 输出质量不稳 → 人审 + 反馈训练 prompt
- 成本超支 → 严格配额 + Redis 缓存 + token 上限

## DoD
- [ ] 4 类工作流可一键触发
- [ ] 单任务成本达标
- [ ] 人审 UI 完整（任务队列 / 编辑器 / 状态）
- [ ] LangSmith 可见全链路
- [ ] retrospective 完成
