# AD-12 · 实现客服工作台

## PRD 原文引用

- `AD-FR-009`：“待接单列表（按语言筛）。”
- `AD-FR-009`：“当前会话（实时）；历史搜索；快捷回复模板。”
- `planning/rules.md`：“实时通道 | supabase-realtime | 客服 IM / 通知推送。”

## 需求落实

- 页面：`/admin/cs/workbench` 或 `/admin/support`。
- 组件：ConversationList、ChatPanel、UserContextPanel、QuickReplyPicker。
- API：`/admin/api/cs/*`。
- 数据表：客服会话表、messages、quick_replies、admin_users.languages。
- 状态逻辑：cs 角色只访问客服与必要用户基本信息；实时消息走 Supabase Realtime。

## 不明确 / 风险

- 风险：客服 PRD 与实时规范分散。
- 处理：以 CS 模块任务定义表结构，AD 只实现后台工作台。

## 技术假设

- 不引入 Socket.io，复用 Supabase Realtime。

## 最终验收清单

- [ ] 待接单按语言筛选。
- [ ] 当前会话实时收发。
- [ ] 快捷回复可插入。
- [ ] cs 权限无法访问完整订单敏感信息。