# Story 1.7: Doppler Secrets 管理

Status: ready-for-dev

## Story

As a 开发者,
I want 所有环境变量通过 Doppler 集中管理并在本地 / CI / Render 三处统一注入,
so that 我们消除 .env 文件泄漏风险，并在启动期对必填变量做强制校验。

## Acceptance Criteria

1. Doppler 项目 `zhiyu` 下创建 3 configs：`dev`、`staging`、`prod`。
2. 本地：`doppler login` + `doppler setup` 后，`doppler run -- pnpm dev` 能正确注入变量；禁止仓库提交 `.env*`（除 `.env.example`）。
3. CI：GitHub Actions 通过 `dopplerhq/cli-action` + `DOPPLER_TOKEN`（Service Token）注入 staging。
4. Render：通过 Doppler Render integration 拉取，Render 控制台无明文业务密钥。
5. 应用启动时使用 `Zod` 对 `process.env` 做 schema 校验，缺失/格式错误时立即抛出并退出码 78（EX_CONFIG）。
6. `apps/api/src/env.ts` 与 `apps/app/src/env.ts` 各自定义自己的 schema，仅暴露白名单变量。
7. 客户端环境变量前缀 `VITE_` 强制；严禁服务端 secret 被打入前端 bundle（CI 增加 grep 检查）。
8. 文档 `docs/secrets.md` 描述：新增变量流程、轮换流程、应急吊销。
9. 提供 `.env.example` 列出所有变量（值留空 / 标注示例），与 schema 同步。
10. 提供 `scripts/check-env-drift.ts`：CI 中比对 Doppler 与 schema 的变量集合，差异 fail。

## Tasks / Subtasks

- [ ] Task 1: Doppler 项目（AC: #1, #4）
  - [ ] dashboard 创建 project + 3 configs
  - [ ] Render integration 配置
- [ ] Task 2: 本地工作流（AC: #2）
  - [ ] `package.json` scripts 全部 `doppler run -- ...`
  - [ ] CONTRIBUTING.md 写明 onboarding 步骤
- [ ] Task 3: CI 注入（AC: #3）
  - [ ] GH secret `DOPPLER_TOKEN_STAGING` `DOPPLER_TOKEN_PROD`
  - [ ] CI step 调 `doppler/cli-action`
- [ ] Task 4: Zod schema（AC: #5, #6, #9）
  - [ ] `apps/api/src/env.ts` 用 `zod.object({...}).parse(process.env)`
  - [ ] `apps/app/src/env.ts` 同理（仅 `VITE_` 前缀）
  - [ ] `.env.example`
- [ ] Task 5: 防泄漏（AC: #7, #10）
  - [ ] CI step：`grep -R "process.env" apps/app/dist` 仅允许 VITE_*
  - [ ] `scripts/check-env-drift.ts`
- [ ] Task 6: 文档（AC: #8）

## Dev Notes

### 关键
- Doppler Service Token 仅赋 read 权限，不能写
- 轮换：在 Doppler dashboard 旋转，Render / CI 自动拉新值（10min 窗口）
- 应急吊销：撤销 Doppler service token + 重新生成

### References

- [Source: planning/epics/01-platform-foundation.md#ZY-01-07](../../epics/01-platform-foundation.md)
- [Source: planning/spec/09-security.md#§-15](../../spec/09-security.md)
- [Source: planning/sprint/01-platform-foundation.md#W2](../../sprint/01-platform-foundation.md)

## Dev Agent Record

### Agent Model Used

### Debug Log References

### Completion Notes List

### File List
