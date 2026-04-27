# FP-20 · 实现 PushAdapter Fake

## 原文引用

- `planning/spec/02-tech-stack.md`：“Push | PushAdapter | console/fake | Web Push。”
- `planning/prds/07-learning-engine/01-functional-requirements.md`：“v1.5：浏览器 Web Push。”

## 需求落实

- 页面：无。
- 组件：PushAdapter interface、FakePushAdapter。
- API：供学习提醒、公告、客服离线通知后续调用。
- 数据表：push subscription 表由后续通知需求决定。
- 状态逻辑：v1 只 fake 记录；真实 Web Push 是 v1.5 或后续任务。

## 技术假设

- 本期不请求浏览器 push permission 作为必需流程。
- fake adapter 支持 locale 与 payload 记录。

## 不明确 / 风险

- 标注：真实推送暂不支持。
- 处理：所有触发点同时有 EmailAdapter 或站内提示 fallback。

## 最终验收清单

- [ ] PushAdapter fake 可记录通知。
- [ ] 无 VAPID key 不影响容器启动。
- [ ] v1.5 功能点被明确标注为占位。
