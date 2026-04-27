# FP-34 · 建立 W0 发布门禁（Dev-only 口径）

## 原文引用

- `planning/prds/01-overall/09-release-plan.md`：“Gate 1：W0 上线门。”
- `planning/rules.md`：“本项目只有一个环境：dev。”

## 需求落实

- 页面：无。
- 组件：release checklist、smoke test script、seed validation report。
- API：检查 app/admin health、核心模块 smoke API。
- 数据表：检查迁移、seed、审计/事件表存在。
- 状态逻辑：不创建 stg/prod；旧 PRD 的三环境/CI 门禁改为 dev Docker 门禁记录。

## 技术假设

- W0 门禁在单服务器 dev 环境完成。
- 发布清单可作为 Markdown 和脚本双形态存在。

## 不明确 / 风险

- 风险：PRD 中“三环境部署 OK / CI/CD 跑通”与铁律冲突。
- 处理：标注冲突并以 dev Docker 验证替代，不删除门禁目的。

## 最终验收清单

- [ ] Docker compose 全量启动通过。
- [ ] 4 模块基础 smoke 通过。
- [ ] 4 语 UI、seed、备份、法务文档、安全自检均有检查项。
