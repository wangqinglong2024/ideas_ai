# FP-27 · 建立 pino JSON 日志

## 原文引用

- `planning/spec/10-observability.md`：“Logs | pino JSON → docker logs / 落盘。”
- `planning/spec/10-observability.md`：“敏感字段脱敏。”

## 需求落实

- 页面：无。
- 组件：logger package、request logger middleware、redaction config。
- API：所有 API 请求附 request_id/trace_id。
- 数据表：无默认日志表；结构化日志输出到 docker logs。
- 状态逻辑：ERROR/WARN/INFO/DEBUG 分级，敏感字段永不明文输出。

## 技术假设

- pino 为唯一后端日志库。
- 前端错误另走 telemetry 任务。

## 不明确 / 风险

- 风险：日志包含 token、password、OTP。
- 处理：redaction 列表覆盖 headers、body 常见敏感字段。

## 最终验收清单

- [ ] API 请求日志为 JSON。
- [ ] 每条请求有 request_id。
- [ ] 敏感字段被脱敏。
