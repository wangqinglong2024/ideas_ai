# CR-09 · 节学习页 `/learn/:track/:stage/:chapter/:lesson`

## PRD 原文引用

- `CR-FR-006`：“路径：`/learn/:track/:stage/:chapter/:lesson`。元素：节标题 + 学习目标；12 知识点切换（卡片 / 滑动 / 标签）；每个知识点：中 + 拼音 + 母语 + TTS + 例句 + key_point；进度条 + ‘下一个’按钮；末尾‘开始小测’。”
- `01-structure-content.md` §2.2：“完成标准：所有 12 知识点点过 1 次 + 节小测 ≥ 60%。”
- `5.1`：“节学习页 LCP < 2s；知识点切换 < 200ms。”

## 需求落实

- 页面：`/learn/:track/:stage/:chapter/:lesson`。
- 组件：LessonHeader、LearningObjectives（折叠）、KnowledgePointCarousel、KnowledgePointCard、TtsAudioButton、ExampleSentenceList、KeyPointPanel、LessonProgressBar、StartQuizCta、SkipLessonButton。
- API：
  - `GET /api/learn/lessons/:id` 返回节内容 + 12 知识点 + 例句 + audio。
  - `POST /api/learn/lessons/:id/start` 触发 progress=`in_progress`。
  - `POST /api/learn/knowledge-points/:kp_id/viewed` 1s 防抖。

## 状态逻辑

- 进入即调 `start`；浏览到第 12 知识点后 `StartQuizCta` 高亮。
- 全部 12 知识点 viewed 后允许直接“开始小测”；否则按钮 disabled 并提示。
- 进度条按已 viewed 数 / 12 显示。
- 多语对照按 CR-31 规则渲染：系统语 ≠ 中文显示中文+系统语；可配置带/不带拼音；系统语=中文只显示中文+拼音(可选)。

## 不明确 / 风险

- 风险：TTS 音频本期无真实生成。
- 处理：占位 mp3（静默 + 文字弹窗“TTS 占位”）；后台标记 `audio.is_placeholder=true`。

## 技术假设

- KnowledgePointCarousel 默认卡片切换；移动端支持左右滑动；桌面键盘 ←/→。
- LessonHeader 不显示 HSK 等级标签（除非 track=hsk）。

## 最终验收清单

- [ ] 节学习页 LCP < 2s（Lighthouse）。
- [ ] 知识点切换 < 200ms。
- [ ] 12 知识点全部 viewed 才解锁“开始小测”。
- [ ] 多语对照随系统语切换，未启用语种不显示。
- [ ] TTS 占位不阻塞页面交互。
