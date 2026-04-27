# CR-13 · 阶段考 80-150 题 + 证书 PDF

## PRD 原文引用

- `CR-FR-009`：“结构：80-150 题（HSK 模考结构 / 工厂场景模拟 / 电商考核）；行为：一次完成、时间限制 120-180 分钟、错题入 SRS；通过标准：≥ 75% 标阶段完成；奖励：知语币 100 + 阶段证书（PDF 下载）。”
- `03-question-types.md` §15.3：HSK 4 模考 80 题 / HSK 6 模考 120 题。
- `05-acceptance-criteria.md` §4 用例 7：“PDF 含：用户名 / 阶段名 / 通过日期 / 得分 / 二维码（验真）。”

## 需求落实

- 页面：`/learn/:track/:stage/exam`、`/learn/reports/stage/:stage_id`。
- 组件：StageExamSession、QuestionPager、Timer180、AutoSaveIndicator、StageReport、CertificateDownloadCta、CertificateQrModal。
- API：
  - `GET /api/learn/quizzes/:stage_exam_id`。
  - `POST /api/learn/quizzes/:stage_exam_id/submit`。
  - `GET /api/learn/reports/stage/:stage_id`（含 `certificate_url`）。
  - `GET /api/learn/certificates/:cert_id/verify`（二维码扫描）。

## 状态逻辑

- 题量按轨道：HSK→80/120/150；ec/factory→100；daily→100。配置在 `content_quizzes.question_count`。
- 时间限制：80 题→120min；120 题→150min；150 题→180min。
- 自动保存：每 30s 写一次 `learning_quiz_attempts.responses`；断网恢复后续答。
- 通过 75% → `learning_progress(scope_type='stage', status='completed')`；生成证书 PDF 并存 `supabase-storage/certificates/`。
- 证书包含：用户名 / 轨道+阶段 / 通过日期 / 得分 / QR Code（指向 verify URL）。

## 不明确 / 风险

- 风险：证书 PDF 生成失败时是否阻塞通过？
- 处理：先写通过状态，PDF 异步生成；report 页轮询直到 ready；失败可重新生成。
- 风险：QR 验真需要不可伪造的签名。
- 处理：证书 ID + HMAC（密钥 `CERT_HMAC_SECRET`）；verify 端点比对。

## 技术假设

- PDF 生成走 backend `pdfkit` 或 `puppeteer-pdf`；本期不依赖第三方。
- 证书模板预置 4 语言版本 + 中文版本。

## 最终验收清单

- [ ] HSK Stage 1 阶段考 80 题、120min、≥75% 通过。
- [ ] 通过后证书 PDF 可下载，QR 扫描跳 verify 页显示真伪。
- [ ] 自动保存每 30s 触发，断网恢复继续作答。
- [ ] 错题入 `learning_wrong_set` source=`stage_exam`。
- [ ] 100 知语币到账。
