# ZY-02-07 · Storybook（容器内网）

> Epic：E02 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] Storybook 8 配置在 `packages/ui`
- [ ] 在 `zhiyu-app-fe` dev 容器内挂 6006 端口（仅 zhiyu-internal 网络可见）
- [ ] 全部组件含 stories；a11y addon + interactions addon
- [ ] **不**引入 Chromatic、Loki Cloud 等付费 SaaS
- [ ] 如开发者需外网查看：临时 `docker compose port zhiyu-app-fe 6006` 转发，**不**新增 compose 端口暴露

## 测试方法
```bash
docker compose exec zhiyu-app-fe pnpm storybook:smoke
```
- 内网容器互访：`docker compose exec zhiyu-app-be wget -O- http://zhiyu-app-fe:6006/`

## DoD
- [ ] Storybook 全绿、a11y AA 通过
- [ ] 不引用付费 SaaS
