# FP-10 · 编写 .dockerignore 排除非运行资产

## 原文引用

- `planning/rules.md`：“镜像内不得包含：.github/skills、.agents、.claude、_bmad、planning、docs、china、course、games、novels 等非运行期资产。”
- `planning/rules.md`：“通过 .dockerignore 强制排除。”

## 需求落实

- 页面：无。
- 组件：`system/.dockerignore`。
- API：无。
- 数据表：无。
- 状态逻辑：镜像构建上下文不得包含规划、内容、代理工具目录。

## 技术假设

- Docker build context 从 `system/` 发起，因此根目录内容默认不可见；仍需防止复制或软链误入。

## 不明确 / 风险

- 风险：后续脚本把 content/planning 复制到 system 下做 seed。
- 处理：seed 只能用 `system/packages/db/seed/**` 的格式化数据，不复制原始规划文档。

## 最终验收清单

- [ ] `system/.dockerignore` 存在并排除敏感/非运行资产。
- [ ] 构建镜像后检查不含 `_bmad`、`planning`、`content`。
- [ ] seed 文件只包含运行期需要的 JSON/SQL/assets。
