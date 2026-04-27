# I18N-17 · 第 5 种语言 zh-CN 全栈接入

## 用户裁决

- 当前 4 语 (en/vi/th/id) → 新增 **zh-CN** 作为第 5 种 UI 语言。
- 中文用户场景：界面 + 内容均中文（不再展示中-外双语对照）。

## 需求落实

- 修改 `LANGUAGES` 常量加 `'zh-CN'`，全栈 5 处（types/i18n/web/admin/backend）。
- 路由：URL 前缀新增 `/zh-CN/...`。
- locale 文件：每个 ns 创建 `locales/zh-CN/{ns}.json`，初稿来自现有 zh 文案 / 后端 zh 文档。
- 字体：root font-family 当 lang=zh-CN 时切 Noto Sans SC（I18N-06）。
- 内容渲染：当 ui_lang=zh-CN 时关闭“中文+ui_lang” 双语；只展示中文 + 可选拼音（CR-25）。
- 偏好默认：zh-CN 用户 `bilingual_show_translation=false`。
- 邮件、错误码、客服、SEO 全部加 zh-CN（I18N-08/10/11/12）。
- 后台 admin UI：admin 也支持中文界面（admin 默认 zh-CN）。

## 落地清单

- [ ] LANGUAGES 常量更新（types/i18n/db）。
- [ ] 5 ns × zh-CN 文件创建（10 ns）。
- [ ] 路由 + redirect 接受 zh-CN。
- [ ] cookie/preferences 接受 zh-CN。
- [ ] 字体 Noto Sans SC 加载。
- [ ] 内容渲染分支处理 zh-CN（I18N-18 协同）。
- [ ] 邮件 zh-CN 模板。
- [ ] errors.zh-CN.json 全覆盖。
- [ ] hreflang / sitemap 含 zh-CN。
- [ ] og:locale 'zh_CN'。
- [ ] admin UI 默认 zh-CN。

## 不明确 / 风险

- 风险：现有 enum / type 字面量为 4 语联合，需要全局 replace。
- 处理：先改 `packages/types`，TypeScript 编译报错驱动逐处修复。

## 最终验收清单

- [ ] 切到 zh-CN URL 全栈正常。
- [ ] 中文界面无英文兜底显示。
- [ ] 内容只显示中文（无双语）。
- [ ] 邮件/客服/错误用中文。
- [ ] admin 默认中文。
