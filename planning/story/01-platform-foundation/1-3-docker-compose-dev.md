# ZY-01-03 · Docker Compose 一键拉起（dev）

> Epic：E01 · 估算：L · 状态：ready-for-dev
>
> 顶层约束：[planning/00-rules.md](../../00-rules.md) §1 / §2 / spec/08

## User Story
**As a** 新加入工程师
**I want** 一条命令在 `115.159.109.23` 拉起整套 zhiyu 业务环境
**So that** 30 分钟内可开始写业务代码

## 上下文
- 既有 supabase-* 容器在 `gateway_net` 网络，连接：`http://supabase-kong:8000`
- 既有 `global-gateway` nginx；本项目只有 dev 环境，走 IP+端口，不挂域名
- 端口约束：3100/8100（C 端 fe/be）、4100/9100（B 端 fe/be），均已防火墙放行

## Acceptance Criteria
- [ ] 文件：`system/docker/docker-compose.yml`
- [ ] 服务：`zhiyu-app-fe`(3100→80)、`zhiyu-app-be`(8100→8080)、`zhiyu-admin-fe`(4100→80)、`zhiyu-admin-be`(9100→8080)、`zhiyu-worker`、`zhiyu-redis`
- [ ] 网络：加入 external `gateway_net`（与 supabase 互通）+ 自建 `zhiyu-internal`
- [ ] 各 app 多阶段 Dockerfile（`deps` / `build` / `runtime` / `dev`）；dev target 启动 vite/tsx watch
- [ ] runtime 用非 root `node` 用户
- [ ] `.dockerignore`（**根级**）排除：
  ```
  .git
  .github
  .agents
  .claude
  _bmad
  planning
  docs
  china
  course
  games
  novels
  research
  **/node_modules
  **/.env
  **/.env.*
  !**/.env.example
  ```
- [ ] 每服务定义 `healthcheck` 走 `/health`（fe 走 nginx `/`）
- [ ] `docker compose up -d --build` 后所有容器 healthy
- [ ] `system/scripts/up.sh` 一键脚本（pull / build / up / wait healthy）

## 技术参考
- spec/08 §三、§四、§五
- planning/00-rules.md §2

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose up -d --build
docker compose ps         # 全 healthy
curl -fsS http://115.159.109.23:8100/health
curl -fsS http://115.159.109.23:9100/health
curl -fsS -I http://115.159.109.23:3100/
curl -fsS -I http://115.159.109.23:4100/
```

MCP Puppeteer 自动化：依次访问 4 个 URL，断言均得 200/合理 HTML。

## DoD
- [ ] 上述四个 curl 全 200
- [ ] 浏览器外网访问 4 个端口正常
- [ ] 镜像大小：fe < 200MB、be < 300MB（生产 stage）
- [ ] 任意一容器 down 后 `up.sh` 可幂等恢复

## 不做
- nginx 域名 vhost（本项目不覆盖生产）
- staging / prod compose（项目只有 dev）
