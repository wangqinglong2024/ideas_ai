# Story Index · E16 AI 内容工厂（Content Factory）

> Epic：[E16](../../epics/16-content-factory.md) · Sprint：[S16](../../sprint/16-content-factory.md)
> 阶段：**v1.5（Post-MVP）** · 优先级：P1（v1 不交付） · 估算：8 周
> Story 数：12

## ⚠️ 排期说明
- **MVP（v1）阶段不交付**：所有 stories 推迟到 v1.5（M+3 评估，M+4-M+5 实施）
- 数据库表（prompt_templates / factory_tasks / generations）由 E01 平台基建一并建好（schema 占位），暂不接入工作流
- admin `/admin/factory` 在 E17 仅显示「v1.5 即将上线」占位
- 启动条件：v1 上线 4 国 ≥ 3 个月，月活 ≥ 50k，内容产出瓶颈出现

## Story 列表

| 序 | Story Key | 标题 | 估 | 周次 |
|:-:|---|---|:-:|:-:|
| 1 | [16-1-prompt-templates-admin](./16-1-prompt-templates-admin.md) | prompt_templates 表 + 后台 | M | W1 |
| 2 | [16-3-anthropic-deepseek-clients](./16-3-anthropic-deepseek-clients.md) | Anthropic + DeepSeek 客户端 | L | W1-W2 |
| 3 | [16-2-langgraph-checkpointer](./16-2-langgraph-checkpointer.md) | LangGraph + PG checkpointer | L | W2 |
| 4 | [16-9-translation-node-five-langs](./16-9-translation-node-five-langs.md) | 翻译节点（5 语） | M | W3 |
| 5 | [16-8-deepseek-tts](./16-8-deepseek-tts.md) | DeepSeek TTS | M | W3 |
| 6 | [16-10-auto-evaluator](./16-10-auto-evaluator.md) | 自动评估器（4 维度） | M | W3 |
| 7 | [16-4-article-generation-flow](./16-4-article-generation-flow.md) | 文章生成工作流 | L | W4 |
| 8 | [16-7-wordpack-generation-flow](./16-7-wordpack-generation-flow.md) | 词包生成工作流 | M | W4 |
| 9 | [16-5-lesson-generation-flow](./16-5-lesson-generation-flow.md) | 课程节生成工作流 | L | W5 |
| 10 | [16-6-novel-chapter-generation-flow](./16-6-novel-chapter-generation-flow.md) | 小说章生成工作流 | L | W6 |
| 11 | [16-11-human-review-ui](./16-11-human-review-ui.md) | 人审 UI（后台） | L | W7 |
| 12 | [16-12-cost-quality-dashboard](./16-12-cost-quality-dashboard.md) | 成本 + 质量仪表板 | M | W8 |

## 成本目标
- 文章 < $0.30 / 篇
- 课程节 < $0.50 / 节
- 小说章 < $1.50 / 章（3000 字）
- 词包 < $0.20 / 包

## 依赖
- E01：prompt_templates / factory_tasks / generations 表已建（schema 占位）
- E04：i18n / 5 语翻译资源
- E08 / E06 / E11：写库目标表 schema 已稳定
- E17：admin 后台 + RBAC + 占位路由

## DoD
- 4 类工作流可一键触发
- 单任务成本达标
- 人审 UI 完整（任务队列 / 编辑器 / 状态机）
- LangSmith 全链路可见
- retrospective 完成
