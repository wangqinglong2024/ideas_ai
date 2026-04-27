# I18N-06 · 自托管字体动态加载

## PRD 原文引用

- `I18N-FR-005`：“动态字体：th Sarabun、vi Be Vietnam Pro、en/id Plus Jakarta Sans 或 Inter。”
- `planning/ux/14-i18n-fonts.md`：字体文件必须自托管（Docker-only）。
- 用户裁决：中文 Noto Sans SC；选择素雅字体（避免花哨）。

## 需求落实

- 字体文件：`system/apps/web/public/fonts/`：
  - `NotoSansSC-Regular.woff2`、`NotoSansSC-Medium.woff2`、`NotoSansSC-Bold.woff2`
  - `Sarabun-Regular.woff2` / `Medium` / `Bold`
  - `BeVietnamPro-Regular.woff2` / `Medium` / `Bold`
  - `PlusJakartaSans-Regular.woff2` / `Medium` / `Bold`
- CSS：`@font-face { font-family:..; src:url('/fonts/..') format('woff2'); font-display: swap; unicode-range: ...; }`。
- 动态加载：`document.documentElement.lang` 变化时切换 root font-family；优先按 lang 加载对应字体子集。
- Tailwind 配置：`fontFamily.zh = ['Noto Sans SC', ...]` 等。

## 状态逻辑

- ui_lang=zh-CN：root font = Noto Sans SC。
- ui_lang=th：Sarabun（强制，泰文 ascender 必须）。
- ui_lang=vi：Be Vietnam Pro。
- ui_lang=en/id：Plus Jakarta Sans。
- 中文内容混排（其他 ui_lang 时显示中文）：中文部分用 `font-family: 'Noto Sans SC', <ui_lang_font>`。

## 不明确 / 风险

- 风险：字体文件体积大（中文 4MB+）。
- 处理：使用 `unicode-range` + 子集化（仅常用 6000 字 + GB2312 范围）；按需加载非首屏字体。

## 技术假设

- 字体文件不走 CDN，由 nginx 提供长期 cache header (`Cache-Control: public, max-age=31536000, immutable`)。
- 不引入第三方 font loader。

## 最终验收清单

- [ ] 容器离线时字体仍可加载（无外部请求）。
- [ ] th 页面显示泰文字体。
- [ ] zh-CN 页面用 Noto Sans SC。
- [ ] 字体加载 FOUT < 100ms（font-display swap）。
- [ ] 中文部分混排字体正确。
