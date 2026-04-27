# CR-22 · 内容报错入审校工作台

## PRD 原文引用

- `CR-FR-020`：“行为：知识点 / 句子菜单 → ‘报错’；报错类型：拼音错 / 翻译错 / 音频问题 / 内容不当；流程：进入审校工作台。”
- `04-data-model-api.md` §2.4：“`POST /api/learn/content-reports` Body `{target_type, target_id, issue_type, description}` 入审校工作台。”

## 需求落实

- 数据表：`content_reports(id, reporter_id, target_type, target_id, issue_type, description, status, created_at, resolved_at, resolved_by)`。
- API：
  - `POST /api/learn/content-reports`。
  - `GET /admin/api/content/reports?status=&page=`（后台）。
  - `POST /admin/api/content/reports/:id/resolve`（修正后标 resolved + 通知用户 + 5 知语币奖励）。
- 组件：ReportIssueModal、IssueTypePicker、ReportStatusToast。

## 状态逻辑

- issue_type ∈ {`pinyin_wrong`,`translation_wrong`,`audio_issue`,`inappropriate_content`}。
- status ∈ {`pending`,`in_review`,`resolved`,`rejected`}。
- 同 user 同 target 同 issue_type 24h 内只允许 1 次（防刷）。
- resolved 时通过站内通知 + 5 知语币奖励。

## 不明确 / 风险

- 风险：恶意刷报错可能影响审校工作台。
- 处理：限频（24h 单 user 单 target 单 type 1 次）+ 后台拒绝率 > 50% 用户标灰名单。

## 技术假设

- 通知渠道为站内消息（NotificationAdapter），邮件 v1.5。

## 最终验收清单

- [ ] 知识点菜单点“报错” → 弹 4 类型选择 + 描述。
- [ ] 提交后 `content_reports` 写入。
- [ ] 后台 `/admin/content/review/reports` 可看见列表。
- [ ] resolve 后用户收到通知 + 5 币。
- [ ] 24h 限频生效。
