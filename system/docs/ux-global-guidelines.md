# 全局 UX 实现准则

## 来源

- 用户要求：参考 Stitch 的按钮、卡片、输入、分段控件、动态背景交互，但不照搬其色调。
- UX：`planning/ux/03-glassmorphism-system.md`、`07-components-core.md`、`12-motion.md`。
- PRD：`DC-FR-004`、`UA-FR-007`、`I18N-FR-003`、`I18N-FR-004`。

## 全局材质

- 页面底层使用 `surface-wash`，带一层低对比动态水墨流光。
- 交互组件使用 `glass-porcelain` 或 tokenized card/button，不写业务硬编码颜色。
- 阅读正文、句子、后台表格优先 `surface-paper` 实底，避免透明度降低可读性。

## 组件交互

- Button：hover 轻抬，active scale 0.97，focus ring 清晰，主操作使用朱砂。
- IconButton：必须有 `aria-label` 和 `title`，用于搜索、分享、返回、主题等工具动作。
- Card：默认 8px 圆角；interactive card hover 只上移 1px 并加强阴影。
- Segmented/Select：语言、拼音、翻译显示、主题等模式切换必须使用明确控件。
- SentenceCard：必须展示中文、拼音、母语翻译、播放、收藏、笔记、复制，并跟随偏好实时变化。

## 发现中国视觉

- 12 类目顺序、开放范围和内容边界以 `content/china/00-index.md` 为准。
- 类目视觉使用碑拓、蒸汽、山水、节气、宣纸、弦线、书页、印章、竹简、城市线稿、字形演变、云水等本地纹样。
- 未登录访问第 4-12 类目不得泄露正文、句子、音频 URL、分享金句。

## 管理后台

- 桌面优先、密度优先、审计优先。
- DC 后台必须显式展示访问模型、红线状态、4 语翻译、句子级拼音/音频、审校状态和发布状态。
- 所有写操作必须走后端 API 并产生审计记录。
