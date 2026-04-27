# I18N-01 · packages/i18n 与 locales 目录骨架

## PRD 原文引用

- `planning/prds/15-i18n/02-data-model-api.md` 目录结构：`packages/i18n/locales/{lang}/{ns}.json`。
- 命名空间：`common / auth / learn / games / novels / payment / discover / referral / cs / admin`。

## 需求落实

- 新建/确认 `system/packages/i18n/`：
  - `package.json`、`tsconfig.json`。
  - `src/index.ts` 暴露 `i18n` 实例 / `useT` / `LANGUAGES` / `loadNamespace`。
  - `src/types.ts` 自动生成 typed keys（基于 en JSON）。
  - `locales/en/{ns}.json` 等 5 语 × 10 ns。
- 工具：脚本 `scripts/i18n/generate-types.ts` 从 en 生成 `keys.d.ts`。

## 状态逻辑

- `LANGUAGES = ['en','vi','th','id','zh-CN']`（用户裁决新增 zh-CN）。
- 命名空间按页面分桶；admin ns 单独包以防泄漏到客户端。

## 不明确 / 风险

- 风险：admin ns 不应被 web 应用打包，避免管理员词条暴露。
- 处理：i18n 实例分双导出：`createWebI18n()` 仅含前 9 ns；`createAdminI18n()` 含 admin ns。

## 技术假设

- locale JSON 文件按 alphabetical key 排序，便于 diff。
- Type 生成在 build 前自动跑。

## 最终验收清单

- [ ] `pnpm --filter @zhiyu/i18n build` 成功。
- [ ] 5 lang × 10 ns = 50 文件存在（initial 可空 {}）。
- [ ] keys.d.ts 自动生成。
- [ ] web vs admin i18n 实例分离。
