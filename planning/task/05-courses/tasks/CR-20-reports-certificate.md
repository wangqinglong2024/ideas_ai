# CR-20 · 学习报告 + 阶段证书 PDF

## PRD 原文引用

- `CR-FR-013`：“节末报告：节小测得分、错题列表、知识点掌握度（基于 SRS 状态）、推荐：下一节 / 复习 / 游戏强化。章末报告：章测得分 + 章节统计 + 推荐。阶段末报告：阶段考 + 阶段统计 + 证书 + 下阶段预告。”
- `CR-AC-012`：“节末 / 章末 / 阶段末报告；知识点掌握度可视化；推荐准确。”

## 需求落实

- 页面：
  - `/learn/reports/lesson/:lesson_id`
  - `/learn/reports/chapter/:chapter_id`
  - `/learn/reports/stage/:stage_id`
- 组件：ScoreSummary、WrongQuestionReview、KnowledgeMasteryHeatmap、RecommendationCards、CertificateDownloadCta、NextStagePreview。
- API：
  - `GET /api/learn/reports/lesson/:lesson_id`
  - `GET /api/learn/reports/chapter/:chapter_id`
  - `GET /api/learn/reports/stage/:stage_id`

## 报告内容

- 节末：得分 / 错题（含解释） / 12 知识点掌握度（颜色：绿/黄/红） / 推荐 3 卡（继续下一节 / 错题练习 / 相关游戏）。
- 章末：章测得分 / 12 节平均得分 / 总用时 / 推荐 3 卡。
- 阶段末：阶段考得分 / 12 章统计 / 证书下载 / 下阶段预告（默认 stage_no+1，不含付费提示）。

## 状态逻辑

- 知识点掌握度来源：lesson_quiz 表现 + SRS 状态（CR-14 LeFakeAdapter）。
- 推荐：基于错题集 / SRS 待复习 / 游戏关联词包，组合 3 张卡。
- 证书：CR-13 同步生成 PDF；report 页提供下载按钮 + QR 预览。

## 不明确 / 风险

- 风险：SRS 本期未实施，掌握度数据不准。
- 处理：掌握度按 quiz 表现简化（答对 → 绿、未做 → 灰、答错 → 红）；后续接入 SRS。

## 技术假设

- KnowledgeMasteryHeatmap 用 12 个圆点显示，hover 显示详情。
- 推荐卡片可被用户隐藏（写 `users.metadata.report_hidden_cards`）。

## 最终验收清单

- [ ] 节小测完成后跳节末报告页。
- [ ] 章测完成跳章末报告页。
- [ ] 阶段考通过跳阶段末报告页 + 证书下载。
- [ ] 错题在报告中可逐题查看解释。
- [ ] 推荐 3 卡可点击跳转。
