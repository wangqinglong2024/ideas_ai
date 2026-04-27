# CR-28 · 非功能 / 性能 / 可访问性 / 安全 / 可观测性

## PRD 原文引用

- `CR-NFR-001`：“节页 LCP < 2s；知识点切换 < 200ms；36 题章测渲染 < 1s；150 题阶段考渲染 < 2s。”
- `CR-NFR-002`：“PWA 缓存 30 天 / 离线可学。”
- `CR-NFR-003`：“WCAG 2.1 AA；键盘可达；屏幕阅读器友好。”
- `CR-NFR-004`：“RLS 全用户表；题目答案不在前端泄露；限流 30 req/min/user/lesson。”
- `CR-NFR-005`：“4 语种内容 100% 覆盖；红线词 0 触发；HSK 等级匹配。”
- `CR-NFR-006`：“节开始 / 节完成 / 测验提交 / 测验通过 埋点；错误率 < 0.1%；题目 report_count 监控。”

## 需求落实

- 性能：
  - 节学习页 SSR + 关键 CSS inline；TTS 音频 lazy load。
  - 题型组件按需 import (code-split)。
  - 章测/阶段考使用虚拟列表（react-virtuoso）渲染题号导航。
- 可访问性：
  - 全部按钮 focus ring；色彩对比 AA；屏幕阅读器 ARIA labels；键盘 Tab/Shift+Tab/Enter/Space 全流程可达。
- 安全：
  - RLS 已在 CR-03。
  - `GET /api/learn/quizzes/:id` 响应剥离 `correct_answer / explanation`，仅 submit 后返回。
  - 限流：`@upstash/ratelimit` 等价（自托管 Redis），`30 req/min/user`，按 lesson key 拆分。
  - 测验 submit 防重放：写 idempotency_key。
- 可观测：
  - 埋点事件：`course.lesson.start`、`course.lesson.complete`、`course.quiz.start`、`course.quiz.submit`、`course.quiz.passed`、`course.quiz.failed`。
  - 指标：`courses_active_users`、`courses_quiz_pass_rate`、`courses_p95_lesson_lcp`、`courses_question_report_count`。

## 不明确 / 风险

- 风险：题目报错率监控阈值未明。
- 处理：`report_count >= 3` 触发后台告警卡片；可在 settings 调整阈值。

## 技术假设

- 性能测量在 Docker dev 环境用 Lighthouse CLI 跑。
- 限流后端基于 `supabase-redis`（如未提供则降级到内存 + warn log）。

## 最终验收清单

- [ ] Lighthouse 节学习页 LCP < 2s。
- [ ] 屏幕阅读器（VoiceOver/NVDA）可走完一个节的学习 + 小测。
- [ ] DevTools Network 检查：题目响应不含 correct_answer。
- [ ] 暴力请求 35 次/min → 第 31 次起 429。
- [ ] 埋点事件在后台 events 表可查。
