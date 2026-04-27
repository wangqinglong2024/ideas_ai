# CR-10 · 13 题型组件库（Q1-Q10 + P1-P3）

## PRD 原文引用

- `planning/prds/03-courses/03-question-types.md` §2-§14：13 题型详细定义与示例数据。
- `content/course/shared/05-question-bank.md`：自动出题引擎参考。

## 需求落实

- 组件包：`system/packages/ui/src/courses/questions/`。
- 组件：Q1ClozeChoice、Q2WordToNative、Q3NativeToZh、Q4AudioToWord、Q5DialogueToAnswer、Q6WordOrdering、Q7TrueFalse、Q8SentenceCorrection、Q9TranslationFill、Q10Reading、P1PinyinListen、P2PinyinSpell、P3PinyinToCharacter。
- 通用：QuestionShell、AnswerFeedback、ExplanationPanel、AudioPlayer、Timer、QuestionMeta（题型/HSK/难度，仅在调试或后台显示）。
- API 契约：题目数据按 `03-question-types.md` `content_questions` 表结构传入；前端组件根据 `type` 路由到具体题型。

## 状态逻辑

- 答题 → 提交 → 后端评分 → 返回 `{is_correct, correct_answer, explanation}` → 渲染 AnswerFeedback。
- 答错可重试逻辑由父组件（CR-12 节小测）控制；题型组件本身只负责输入与即时校验占位。
- Q4/Q5/P1 含音频，缺音频时显示“占位音频”。

## 不明确 / 风险

- 风险：Q9 自由输入需要后端模糊匹配（去标点 / 词序 / 同义）。
- 处理：MVP 仅支持完全匹配 + 词块拼接序对；自由输入走简化匹配（去空格 + 标点），同义匹配标记为 v1.5。

## 技术假设

- 所有题型组件均无障碍可达（键盘 + 屏幕阅读器），符合 `CR-NFR-003`。
- `QuestionShell` 提供统一倒计时、跳过、报错入口。

## 最终验收清单

- [ ] 13 个题型组件均可在 Storybook 独立预览。
- [ ] 每个题型至少 1 个 fixture 可作答并触发 AnswerFeedback。
- [ ] Q4/Q5/P1 在缺音频时显示占位且不阻塞。
- [ ] 键盘 Tab/Enter 完成全部题型作答。
- [ ] Q9 完全匹配与词块序对均可通过。
