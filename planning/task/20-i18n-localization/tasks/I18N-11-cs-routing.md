# I18N-11 · 客服按语种路由

## PRD 原文引用

- `I18N-FR-010`：“客服 v1 按语种路由；自动翻译 v1.5 占位。”

## 需求落实

- 客服会话表 `cs_conversations.lang`。
- 路由：新建会话时记录用户当前 ui_lang；后台客服列表按 lang 过滤分配。
- 客服坐席属性 `cs_agents.langs[]`，匹配优先。

## 状态逻辑

- 优先匹配同 lang 的 agent；无可用时 fallback en。
- 支持 5 lang。

## 最终验收清单

- [ ] 会话写入 lang 字段。
- [ ] 后台按 lang 过滤会话列表。
- [ ] 无对应 lang agent 时回退 en。
