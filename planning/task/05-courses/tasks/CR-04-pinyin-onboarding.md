# CR-04 · 拼音入门 3 模块前置流程

## PRD 原文引用

- `CR-FR-002`：“触发：零基础用户首次进入主轨道；结构：3 模块（声母 / 韵母 / 声调）+ 综合练习；题型：P1 / P2 / P3；完成度：完成所有模块 + 综合练习 ≥ 80%；可跳过：是。”
- `content/course/shared/01-pinyin-system.md`：23 声母 / 24 韵母 / 16 整体认读 / 四声 + 轻声 / 变调 / 儿化 / 隔音符号。

## 需求落实

- 页面：`/learn/pinyin`、`/learn/pinyin/initials`、`/learn/pinyin/finals`、`/learn/pinyin/tones`、`/learn/pinyin/quiz`。
- 组件：PinyinSyllableCard、ToneAudioPlayer、P1QuestionView、P2QuestionView、P3QuestionView、PinyinProgressBar。
- API：`GET /api/learn/pinyin/modules`、`POST /api/learn/pinyin/progress`、`POST /api/learn/pinyin/quiz/submit`。
- 数据：通过 `content_lessons + content_knowledge_points` 复用，特殊 track code = `pinyin`（伪轨道）；进度同 `learning_progress(scope_type='lesson')`。
- 引导：欢迎流程后若用户选择“零基础”自动跳到 `/learn/pinyin`，否则在 dashboard 提供入口。

## 状态逻辑

- 触发：欢迎流程 `level='zero'` 自动跳转，弹一次性引导卡片；其他水平用户在 dashboard 看到“拼音入门（推荐）”卡片。
- 跳过：弹确认“拼音是中文学习基础，确定跳过吗？”；确认后写 `learning_progress(scope_type='module', scope_id='pinyin', status='skipped')`。
- 完成：3 模块每模块 ≥ 80% + 综合 ≥ 80% 才标 `completed`，奖励 +20 知语币（与 EC 模块对接）。

## 不明确 / 风险

- 风险：拼音入门“伪轨道”可能与 4 真实轨道在 dashboard 切换 tab 中混入。
- 处理：`pinyin` 不出现在 track 切换 tab，仅作为 dashboard 顶部引导卡片与独立路由。

## 技术假设

- 拼音音频复用 TTS fixture（不依赖真实 TTS）。
- 综合练习题型为 P1/P2/P3 各 10 题，30 题随机抽。

## 最终验收清单

- [ ] 零基础用户首次登录后自动进入 `/learn/pinyin`。
- [ ] 任一模块 ≥ 80% + 综合 ≥ 80% 后状态变为 `completed`，奖励到账。
- [ ] 跳过流程在 `learning_progress` 写 `skipped`，dashboard 仍可重新进入。
- [ ] P1/P2/P3 三种题型组件都可作答并即时反馈。
- [ ] 拼音轨道不出现在主 track 切换 tab。
