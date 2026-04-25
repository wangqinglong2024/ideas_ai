# Story 1.4: GitHub Actions CI

Status: ready-for-dev

## Story

As a 开发者,
I want PR 自动跑 lint / typecheck / test / build / bundle-size 五件套并在 PR 上评论失败明细,
so that 我们在合并前对质量与体积有量化保障。

## Acceptance Criteria

1. `.github/workflows/ci.yml` 在 `pull_request` 与 `push: main` 触发。
2. Job 矩阵覆盖 Node 20 + ubuntu-latest；pnpm 9 缓存命中。
3. 串/并行步骤：`install → lint → typecheck → test → build → size-check`。
4. 接入 Turbo Remote Cache（Vercel 提供 free），缓存命中率在第二次运行 ≥ 70%。
5. 失败时 PR 自动评论包含：失败 job 名 + 关键日志 + 直达 logs 链接。
6. Bundle size 检查：对 `apps/app` 与 `apps/admin` 的 `dist/assets/index-*.js` gzipped 设置阈值（app ≤ 250KB / admin ≤ 350KB），超阈值时 fail 并评论 diff。
7. 工作流支持 `workflow_dispatch` 手动触发。
8. CodeQL（与 18-8 提前对接）作为独立 workflow 文件占位（仅启用 default queries）。
9. 提供 `.github/workflows/_reusable-setup.yml`（或 composite action）抽取 `setup-node + setup-pnpm + install` 重复段。
10. README 顶部加状态徽章。

## Tasks / Subtasks

- [ ] Task 1: 主 CI workflow（AC: #1, #2, #3, #7）
  - [ ] `.github/workflows/ci.yml`
  - [ ] 用 `actions/setup-node@v4` + `pnpm/action-setup@v4`
  - [ ] cache key 含 `pnpm-lock.yaml` hash
- [ ] Task 2: Turbo Remote Cache（AC: #4）
  - [ ] `TURBO_TOKEN / TURBO_TEAM` 加 GitHub Secret（写文档）
  - [ ] env 注入；验证第二次 build cache hit
- [ ] Task 3: PR 评论（AC: #5）
  - [ ] 用 `actions/github-script@v7` 在 failure 收集 logs 摘要
  - [ ] 或采用 `reviewdog` 输出 ESLint / tsc 注释
- [ ] Task 4: Bundle size check（AC: #6）
  - [ ] 选 `siz-limit` 或自实现脚本
  - [ ] 配置 `.size-limit.json`
  - [ ] failure 自动 PR 评论 diff
- [ ] Task 5: Composite action（AC: #9）
  - [ ] 抽取 `.github/actions/setup/action.yml`
- [ ] Task 6: CodeQL（AC: #8）
  - [ ] `.github/workflows/codeql.yml` 占位
- [ ] Task 7: README 徽章（AC: #10）

## Dev Notes

### 关键设计
- 仅在 `apps/**` 与 `packages/**` 改动触发 build 阶段（用 turbo `--filter=...[origin/main]`）
- 测试覆盖率上传 Codecov 留 v1.5；本 story 仅跑测试
- 不在此 story 引入 Playwright e2e（在 S20 引入）
- 不引入 release-please（v1.5 评估）

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-04](../../epics/01-platform-foundation.md)
- [Source: planning/spec/08-deployment.md#§-6](../../spec/08-deployment.md)
- [Source: planning/sprint/01-platform-foundation.md#W2](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
