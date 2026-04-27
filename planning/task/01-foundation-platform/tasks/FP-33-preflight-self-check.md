# FP-33 · 建立开发前自检脚本

## 原文引用

- `planning/rules.md`：“自检清单（任何 spec/story PR 合入前）。”
- `planning/rules.md` 自检项包括“是否在 system/ 内”“是否没有新增外部 SaaS 依赖”“是否所有 AI/第三方 key 缺失时 fake fallback”。

## 需求落实

- 页面：无。
- 组件：preflight script、forbidden dependency scanner、path scanner。
- API：无。
- 数据表：无。
- 状态逻辑：发现违反铁律即失败退出。

## 技术假设

- 自检脚本位于 `system/scripts/preflight.ts` 或 `system/packages/tooling`。
- 检查规则用显式列表维护。

## 不明确 / 风险

- 风险：误报阻塞合理开发。
- 处理：规则失败信息必须指出文件和铁律来源。

## 最终验收清单

- [ ] 能发现根目录运行文件。
- [ ] 能发现禁用 SaaS 包或配置。
- [ ] 能验证 adapter fake fallback 配置。
