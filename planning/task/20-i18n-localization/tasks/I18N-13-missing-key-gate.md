# I18N-13 · 缺 key Docker 内阻断

## PRD 原文引用

- `I18N-FR-012`：“新文案需 5 语种齐备；Docker 内本地检查缺 key 阻断。”

## 需求落实

- 脚本：`pnpm i18n:check`。
  - 以 en 为 source-of-truth，扫描每个 ns；
  - 5 语 JSON 必须 key 完全一致（缺/多都 fail）；
  - 输出缺失列表。
- 集成：本地 `husky` pre-push 钩子运行；docker dev 启动时跑一次 warn-only；CI（自托管）跑作为门槛。
- 用户裁决：仅本地 docker，无 GitHub Actions。

## 状态逻辑

- 失败 exit code 1，打印 lang × ns × keys。
- `--fix` 选项可自动用 en 值填充缺失 key（标 `[NEEDS_TRANSLATION]` 前缀）。

## 最终验收清单

- [ ] `pnpm i18n:check` 在 docker 内可执行。
- [ ] 故意删一个 vi key → 命令失败。
- [ ] `--fix` 填充占位值。
- [ ] husky pre-push 阻断缺 key 提交。
