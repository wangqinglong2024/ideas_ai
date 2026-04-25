# E01 Retrospective · 平台基础设施

日期：2026-04-25

## 结论

E01 的最终方向是本地 Docker-only、mock-first。通过标准只认：

```bash
docker compose -f docker-compose.test.yml run --rm --build test
```

不需要 GitHub Actions，不需要远端 CI，不需要手动注册外部 SaaS。后续如果 Google 登录、Paddle 支付等业务确实需要 API key，也必须提供 mock/fake/test adapter，测试不能因为缺 key 中断。

## 已纠正的问题

- 删除 GitHub Actions、PR 模板、Issue 模板。
- Dockerfile 不再复制 `.github`，避免 BMAD 技能资料进入服务验证镜像。
- 移除 commitlint 依赖和脚本，保留真正影响代码质量的 ESLint、Prettier、TypeScript、test、build、size、file-line check。
- E01 story 文件名和内容从 Cloudflare/Render/Doppler/Sentry/PostHog/Better Stack/Upstash 等旧方向改为本地 Docker/mock-first。
- 运行时配置从 `SUPABASE_*` 改为通用 `DATABASE_*`，E01 不创建数据库表，也不要求 Supabase 项目。

## 为什么这次耗时长

1. 原始 E01 规划里混入了大量外部 SaaS 和 CI 交付项，先前实现没有第一时间把故事命名和验收条件全部改干净。
2. 我把 `.github` 整个复制进 Docker 验证镜像，导致 Prettier 扫描 BMAD 技能资料，产生大量无关格式错误。
3. Docker 镜像反复重建，`pnpm install` 和 Turbo build 本身耗时较长；每次修正验证边界都会触发重跑。
4. 代码先通过了，但文档/规划状态随后又变化，最终验证必须覆盖最新文件。

## 后续规避规则

- Story 开发前先做关键词闸门：不允许 E01/E02 基础设施 story 出现 GitHub Actions、远端 CI、必须注册 SaaS、真实 secret 阻塞测试。
- 外部集成一律写成 optional adapter：真实 key 后续提供，默认 mock 必须通过 Docker 测试。
- Dockerfile 只复制服务运行和验证所需文件；不要复制 agent 技能、编辑器配置或外部工作流资料。
- 先跑快速源码扫描，再跑一次完整 Docker 验证；避免在 Docker 安装依赖后才发现文本级错误。
- E02 预计不会重复这次 2 小时问题，因为 E01 的验证边界、Dockerfile、mock 配置和目录清理已经定型。