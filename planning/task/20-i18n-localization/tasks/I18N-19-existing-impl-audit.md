# I18N-19 · 已开发任务 20 实现的合规审计

## 背景

- 用户已提前实现部分 i18n 功能；本任务对已实现部分做规范审计 + 缺口补齐。

## 审计清单

- [ ] **LANGUAGES 常量**：是否含 `zh-CN`？类型是否同步至 `packages/types/db/backend`？
- [ ] **i18next 初始化**：fallbackLng / saveMissing / missingKeyHandler 是否符合 I18N-02。
- [ ] **URL 前缀路由**：`/zh-CN/*` 是否能访问；根路径 redirect 是否含 zh-CN（I18N-03）。
- [ ] **用户偏好**：preferences JSONB 是否含 ui_lang/bilingual_show_pinyin/bilingual_show_translation；JSONB 写入是否走 raw postgres-js（I18N-04 / 用户记忆）。
- [ ] **内容 translations**：现有页面 BilingualText 是否区分 zh-CN 场景（I18N-05/CR-25）。
- [ ] **字体**：是否自托管，无外部 CDN（I18N-06）；Noto Sans SC 是否就绪。
- [ ] **格式化**：date-fns + Intl.NumberFormat 是否 5 语都能用（I18N-07）。
- [ ] **SEO**：hreflang/sitemap 是否含 zh-CN（I18N-08）。
- [ ] **邮件**：是否 5 语模板（I18N-10）。
- [ ] **错误码**：errors ns 5 语是否齐全（I18N-12）。
- [ ] **缺 key 检查**：`pnpm i18n:check` 是否覆盖 5 语（I18N-13）。
- [ ] **locale API + cache**：是否使用 SW 缓存（I18N-14）。
- [ ] **后台完整度组件**：是否在 5 模块编辑器显示（I18N-16）。
- [ ] **系统 vs 内容渲染**：`<T>` vs `<BilingualText>` 划分是否清晰（I18N-18）。
- [ ] **lint 规则**：是否阻止裸 CJK 字符串（I18N-18）。

## 输出

- 报告文件：`_bmad-output/implementation-artifacts/audit-i18n-<ts>.md`，对每项给 PASS / FAIL / N/A + 证据 + 修复任务编号。
- 失败项 → 落到 sprint backlog 待补齐。

## 最终验收清单

- [ ] 审计报告生成。
- [ ] 所有 FAIL 项有对应修复 PR / commit 链接。
- [ ] 二轮审计全部 PASS。
