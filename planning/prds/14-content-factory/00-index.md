# 14 · 内容工厂（Content Factory · CF）

> **代号**：CF | **优先级**：P0 | **核心**：LangGraph 工作流 + 双 LLM + TTS + 4 语翻译 + 母语审校

## 文件
- [01-functional-requirements.md](./01-functional-requirements.md)
- [02-data-model-api.md](./02-data-model-api.md)
- [03-acceptance-criteria.md](./03-acceptance-criteria.md)

## 关键决策
- 编排：LangGraph TS（基于 Vercel AI SDK）
- LLM：
  - Claude Sonnet 4.5（创意 / 复杂推理 / 审校）
  - DeepSeek V3（批量翻译 / 拼音生成 / 量大成本敏感）
  - 双模型按节点选择
- TTS：
  - Azure Speech Service（普通话 / 多音色 / 性价比）
  - ElevenLabs（高级旁白 / 小说音色）
- 翻译：vi/th/id/en 4 语种
- 工作流类别：
  - lesson_generation（课程节）
  - article_generation（DC 文章）
  - novel_chapter_generation（小说章节）
  - quiz_generation（题目）
  - tts_batch（批量 TTS）
  - translation_only（单独译）
- 红线词检测内嵌每步
- 失败重试 3 次 + 人工干预入口
