# FP-01 · 建立 system 唯一代码根

## 原文引用

- `planning/rules.md`：“所有可执行代码（apps/、packages/、turbo.json、package.json、pnpm-workspace.yaml、pnpm-lock.yaml、tsconfig.base.json、docker/ 等）必须落在 /opt/projects/zhiyu/system/ 子目录下。”
- `planning/rules.md`：“禁止在根目录 /opt/projects/zhiyu/ 下创建 package.json、apps/、packages/、docker/ 等运行期工程文件。”

## 需求落实

- 页面：无。
- 组件：无。
- API：无。
- 数据表：无。
- 状态逻辑：仓库运行态只认 `system/`，根目录其他规划/内容文档不得进入运行工程。

## 技术假设

- `system/` 是未来所有代码、docker、脚本、包管理文件的唯一根目录。
- 规划文档、内容文档、日志仍保留在根目录对应文件夹，不复制进镜像。

## 不明确 / 风险

- 风险：后续开发者在根目录误执行 `pnpm init` 或创建运行文件。
- 处理：自检脚本扫描根目录禁用文件名。

## 最终验收清单

- [ ] `system/` 下存在运行工程根文件。
- [ ] 根目录不存在运行期 `package.json`、`apps/`、`packages/`、`docker/`。
- [ ] 自检脚本能发现并阻断根目录运行文件。
