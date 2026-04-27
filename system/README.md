# Zhiyu System

本目录是 `planning/rules.md` 规定的唯一运行时代码根，覆盖基础平台 FP、UX 设计系统、用户账号 UA 与管理后台 AD 的 dev-only Docker 实现。

## PRD 来源

- FP：`planning/task/01-foundation-platform`、`planning/rules.md`、`planning/spec/*`
- UX：`planning/task/02-ux-design-system`、`planning/ux/*`
- UA：`planning/task/03-user-account`、`planning/prds/06-user-account/*`
- AD：`planning/task/13-admin`、`planning/prds/12-admin/*`

## Docker 运行

```bash
cd /opt/projects/zhiyu/system
docker network create gateway_net || true
docker compose -f docker/docker-compose.yml up -d --build
```

外部入口按工程铁律固定为：App `3100`、App API `8100`、Admin `4100`、Admin API `9100`。