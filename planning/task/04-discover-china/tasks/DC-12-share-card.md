# DC-12 · 实现分享卡片

## PRD 原文引用

- `DC-FR-009`：“分享按钮 → 生成 1080×1920 图卡（标题 + 1 句金句 + QR 含分销码）。”
- `DC-FR-009`：“缓存：Storage 90 天。”

## 需求落实

- 页面：DC 文章页。
- 组件：ShareButton、ShareCardPreview。
- API：`POST /api/discover/articles/:id/share-card`。
- 数据表：`content_articles`、可选 `share_assets`；Storage 桶 `images`。
- 状态逻辑：登录用户 QR 附带 ref；未登录可复制普通链接。

## 不明确 / 风险

- 风险：服务端渲染图卡工具未最终确定。
- 处理：优先使用本地 Puppeteer/satori 任一可 Docker 内运行方案。

## 技术假设

- 分享图卡过期后可重新生成；旧图不影响文章阅读。

## 最终验收清单

- [ ] 图卡尺寸 1080×1920。
- [ ] 含标题、金句、品牌、二维码。
- [ ] 已绑定分销码的用户二维码带 ref。
- [ ] 移动端优先使用 navigator.share，桌面端复制图/文案。