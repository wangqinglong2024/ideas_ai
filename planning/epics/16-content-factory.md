# Epic E16 · AI 内容工厂占位（Content Factory · Deferred）

> 阶段：**v1.5+（本 dev 周期不交付）** · 优先级：P2
>
> 顶层约束：[planning/00-rules.md](../00-rules.md)
>
> **本期只做 schema 占位 + Adapter 契约**。完整工作流推迟到未来「LangGraph(TS) + Vercel AI SDK + Anthropic Claude / DeepSeek」重写阶段；本 dev 周期内容由人工 / fixture 入库。

## 范围（本期实际交付）
- `prompt_templates` / `factory_tasks` / `generations` 表（schema `zhiyu`）
- `LLMAdapter`、`TTSAdapter`、`ASRAdapter`、`WebSearchAdapter` 接口与 fake 实现
- 后台 `/admin/factory` 占位页（"v1.5+ 即将上线"）
- 批量内容导入工具（CSV / JSON → 课程 / 文章 / 小说章 / 词包）

## 非范围（明确推迟）
- LangGraph 工作流（4 类内容）
- 真实 LLM / TTS / ASR 接入（key 在 env.md 标记，但本期不消耗）
- 自动评估 / LangSmith
- 人审 UI 完整功能
- 翻译节点

## Stories（按需 3）

### ZY-16-01 · 表 schema + Adapter 契约
**AC**
- [ ] 三表创建 + 索引；不接入工作流
- [ ] `LLMAdapter`（generate / stream）、`TTSAdapter`（synthesize → supabase-storage url）、`ASRAdapter`（recognize）、`WebSearchAdapter`（search） 接口 + Fake 实现
- [ ] 缺真实 key 时 Fake 实现自动启用
**估**：M

### ZY-16-02 · 后台占位页
**AC**
- [ ] `/admin/factory` 显示「即将上线」+ 导入工具入口
- [ ] 路由 + 简单文案（i18n）
**估**：S

### ZY-16-03 · 批量内容导入工具
**AC**
- [ ] 命令行：`pnpm content:import <type> <file>`
- [ ] 校验 + 入库 + supabase-storage 上传音频 / 图片
- [ ] 在 zhiyu-worker 容器内可跑
**估**：M

## DoD
- [ ] 三表 schema 落地；Adapter 接口稳定
- [ ] 占位页可见
- [ ] 导入工具 fixture 跑通
- [ ] 不引用 Dify、不真实调用 Anthropic / OpenAI / DeepSeek
