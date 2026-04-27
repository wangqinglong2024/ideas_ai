# I18N-16 · 后台翻译完整度状态

## PRD 原文引用

- `I18N-FR-004` 与 `AD-FR-006`：“所有内容模块后台编辑器必须显示 translations 完整度和缺失语种状态。”

## 需求落实

- 共享组件：`TranslationsCompletenessBadge`（X/N 数字 + 颜色：绿满 / 黄部分 / 红空）。
- 共享组件：`TranslationsStatusPanel`（在编辑器侧栏显示每 lang 的 status 与上次更新时间）。
- 应用范围：DC 文章/句子、NV 小说、CR lessons/knowledge_points/questions、GM 词包、CMS 公告。
- API：复用 ACR-09 `GET .../translations/coverage` 与 `gaps`。

## 状态逻辑

- N = 启用语种数（5 = zh + 4 ui_lang）。
- zh 主字段缺失视为整体 0/N。
- status 状态统一来自 I18N-15 `_meta.{lang}.status`。

## 最终验收清单

- [ ] 5 模块编辑器均显示完整度徽章。
- [ ] 侧栏 panel 列出各 lang 状态。
- [ ] 缺失语 click → 跳到该 lang tab。
- [ ] N 随启用语种动态。
