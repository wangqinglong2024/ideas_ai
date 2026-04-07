# 部署与运维规范 (Deployment & Operations)

> **版本**: v1.0 | **最后更新**: 2025-07-16
>
> **本文件覆盖**：环境管理、Docker 部署策略、回滚机制、监控告警、日志聚合、数据库备份。
> 与 `coding-standards.md` 互补 — 后者管"怎么写代码"，本文件管"怎么部署和运行代码"。

---

## 一、环境分级

| 环境 | 用途 | 部署方式 | 数据 | 访问控制 |
|------|------|---------|------|---------|
| **local** | 开发者本机 | `docker compose up` | 种子数据 | 无限制 |
| **staging** | 提测/验收 | 推送 `dev` 分支自动部署 | 生产数据脱敏副本 | 内部 IP 白名单 |
| **production** | 线上正式 | 推送 `release/vX.Y.Z` 标签触发 | 真实数据 | 公网 + CDN |

### 环境变量管理

```
.env.example      → Git 提交（占位符，开发者参考）
.env               → Git 忽略（本地开发真实值）
.env.staging       → Git 忽略（CI/CD 自动注入）
.env.production    → Git 忽略（CI/CD 自动注入 / 服务器 Secret Manager）
```

**铁律**：生产环境的密钥绝不以文件形式存储在服务器磁盘上，必须通过 Docker Secrets 或环境变量注入。

---

## 二、Docker 镜像策略

### 1. 镜像标签规范

| 场景 | 标签格式 | 示例 |
|------|---------|------|
| 开发中 | `{project}-{service}:dev` | `myapp-backend:dev` |
| Staging | `{project}-{service}:staging-{git-sha7}` | `myapp-backend:staging-a1b2c3d` |
| 生产发版 | `{project}-{service}:v{Major}.{Minor}.{Patch}` | `myapp-backend:v1.2.0` |
| 生产最新 | `{project}-{service}:latest` | 仅在明确的 release 后更新 |

### 2. 构建优化

```dockerfile
# 后端 — 利用层缓存，依赖不变时不重装
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .

# 前端 — 同理，node_modules 层缓存
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build
```

- 基础镜像锁定版本：`node:20-alpine`、`python:3.12-slim`
- 生产镜像必须是多阶段构建（builder → runner），最终镜像不含 devDependencies
- 每次构建打印 `IMAGE_TAG` 和 `GIT_SHA` 到日志

---

## 三、部署流程

### 1. 标准部署（手动 / SSH）

```bash
# 登录生产服务器
ssh user@115.159.109.23

# 进入项目目录
cd /opt/projects/{project-name}

# 拉取最新代码
git pull origin main

# 重建并启动（只重建变更的服务）
docker compose up -d --build {service}

# 验证
docker compose ps                            # 全部 Up
docker compose logs --tail=30 {service}       # 无 ERROR
curl -s http://localhost:{port}/api/v1/health # 200 OK
```

### 2. 零停机更新（推荐）

```bash
# 1. 构建新镜像（不中断旧容器）
docker compose build {service}

# 2. 滚动替换
docker compose up -d --no-deps {service}

# 3. 等 30 秒新容器就绪后，健康检查
curl -f http://localhost:{port}/api/v1/health || echo "UNHEALTHY!"
```

### 3. 数据库迁移部署

```bash
# 迁移必须在服务更新之前执行
# 1. 执行迁移 SQL
docker compose exec backend python -c "
import asyncio
from app.core.supabase import run_migration
asyncio.run(run_migration('supabase/migrations/xxx.sql'))
"

# 2. 或直接通过 Supabase MCP 执行 SQL

# 3. 确认迁移成功后再更新服务
docker compose up -d --build backend
```

**数据库迁移铁律**：
- 迁移必须向后兼容（新代码能跑旧 Schema，旧代码能跑新 Schema）
- 大表变更（ALTER TABLE > 100 万行）必须在低峰期执行
- 每个迁移文件必须附带回滚 SQL

---

## 四、回滚策略

### 1. 代码回滚（最常用）

```bash
# 回滚到上一个版本
git log --oneline -5                         # 确认目标 commit
git checkout {commit-sha} -- .               # 回到目标版本
docker compose up -d --build {service}       # 重建
```

### 2. 快速回退（Docker 镜像级）

```bash
# 如果之前的镜像还在本地
docker compose down {service}
docker tag myapp-backend:v1.1.0 myapp-backend:latest
docker compose up -d {service}
```

### 3. 数据库回滚

```bash
# 执行迁移文件对应的 DOWN 回滚语句
# 每个 migration 文件必须在末尾注释中包含回滚 SQL：
# -- DOWN:
# -- DROP TABLE IF EXISTS xxx;
# -- ALTER TABLE yyy DROP COLUMN zzz;
```

### 回滚决策矩阵

| 症状 | 判断 | 动作 |
|------|------|------|
| API 返回 500 | 新代码 Bug | 代码回滚 |
| 页面白屏 | 前端构建问题 | 前端镜像回退 |
| 数据库连接失败 | 迁移破坏 Schema | 数据库回滚 + 代码回滚 |
| 性能骤降 | 新查询无索引 | 紧急加索引 / 回滚 |
| 用户投诉数据错误 | 业务逻辑 Bug | 代码回滚 + 数据修复脚本 |

---

## 五、健康检查与监控

### 1. 健康检查端点（必须实现）

```python
# backend/app/routers/health.py
@router.get("/api/v1/health")
async def health_check():
    """供负载均衡器 / 部署脚本调用，判断服务是否就绪"""
    checks = {
        "api": "ok",
        "database": await check_db_connection(),    # Supabase 可达？
        "timestamp": datetime.utcnow().isoformat(),
    }
    all_ok = all(v == "ok" for v in checks.values() if isinstance(v, str))
    return JSONResponse(
        status_code=200 if all_ok else 503,
        content=checks,
    )
```

### 2. Docker 容器健康检查

```yaml
# docker-compose.yml
services:
  backend:
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:8000/api/v1/health"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 10s
```

### 3. 关键监控指标

| 指标 | 正常范围 | 告警阈值 | 监控方式 |
|------|---------|---------|---------|
| API 响应时间 (P95) | < 500ms | > 1000ms | Nginx access log 分析 |
| 错误率 (5xx) | < 0.1% | > 1% | Nginx error log 计数 |
| 容器内存 | < 512MB | > 800MB | `docker stats` |
| 容器 CPU | < 50% | > 80% | `docker stats` |
| 数据库连接数 | < 15 | > 18（池上限 20） | Supabase 监控 |
| 磁盘使用率 | < 70% | > 85% | `df -h` |

### 4. 日志聚合策略

```bash
# 所有容器日志统一输出到 Docker logging driver
# docker-compose.yml 中配置：
services:
  backend:
    logging:
      driver: "json-file"
      options:
        max-size: "50m"
        max-file: "5"
```

**日志查看常用命令**：
```bash
# 实时跟踪
docker compose logs -f backend --tail=50

# 搜索错误
docker compose logs backend 2>&1 | grep -i error | tail -20

# 查看特定时间段
docker compose logs --since="2h" backend
```

---

## 六、数据库备份

### 1. 自动备份策略

```bash
# 添加 cron 任务：每天凌晨 3 点自动备份
# crontab -e
0 3 * * * /opt/scripts/backup-db.sh >> /var/log/db-backup.log 2>&1
```

### 2. 备份脚本模板

```bash
#!/bin/bash
# /opt/scripts/backup-db.sh
set -e

BACKUP_DIR="/opt/backups/supabase"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/postgres_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

# 通过 Docker 执行 pg_dump
docker exec supabase-db pg_dump -U postgres -d postgres | gzip > "$BACKUP_FILE"

# 保留最近 30 天的备份，删除更早的
find "$BACKUP_DIR" -name "*.sql.gz" -mtime +30 -delete

echo "[$(date)] Backup completed: $BACKUP_FILE ($(du -h "$BACKUP_FILE" | cut -f1))"
```

### 3. 恢复流程

```bash
# 1. 停止后端服务（防止写入冲突）
docker compose stop backend

# 2. 恢复备份
gunzip -c /opt/backups/supabase/postgres_20260407_030000.sql.gz | \
  docker exec -i supabase-db psql -U postgres -d postgres

# 3. 重启服务
docker compose start backend
```

**备份铁律**：
- 每月至少手动验证一次备份可恢复（执行恢复到临时数据库验证）
- 关键数据变更操作（批量删除、Schema 变更）前必须手动触发一次即时备份
- 备份文件存放在与数据库不同的磁盘/云存储（防止磁盘故障同时丢失数据和备份）

---

## 七、事故响应（Incident Response）

### 1. 严重等级定义

| 等级 | 定义 | 响应时间 | 示例 |
|------|------|---------|------|
| **P0 致命** | 核心功能完全不可用 | 立即 | 全站白屏、支付不可用、数据丢失 |
| **P1 严重** | 核心功能部分异常 | 30 分钟内 | 登录偶发失败、列表加载超慢 |
| **P2 一般** | 非核心功能异常 | 4 小时内 | 头像上传失败、非核心页面样式错位 |
| **P3 轻微** | 不影响使用 | 下一工作日 | 文案笔误、非关键 console warning |

### 2. P0/P1 事故处理流程

```
发现问题（监控告警 / 用户反馈）
    ↓
1. 初步判断：是什么坏了？影响范围？
    ↓
2. 止血：能快速回滚就先回滚（< 5 分钟决策）
    ↓
3. 定位：查日志 → 查最近变更 → 定位代码/配置/数据库
    ↓
4. 修复：最小化修复（不顺手重构！）
    ↓
5. 验证：Docker 重建 → 健康检查 → 核心流程测试
    ↓
6. 事后复盘：记录到 incident-log（下方模板）
```

### 3. 事故记录模板

```markdown
# INCIDENT-NNN: [简短标题]

## 概要
- **时间**: 发现时间 ~ 恢复时间（持续时长）
- **等级**: P0/P1/P2
- **影响范围**: 多少用户受影响 / 哪些功能不可用

## 时间线
- HH:MM — 发现问题（如何发现的）
- HH:MM — 初步判断
- HH:MM — 执行止血/回滚
- HH:MM — 确认恢复

## 根因分析
简述根本原因。

## 修复方案
做了什么修复。附 commit hash。

## 后续改进
- [ ] 加监控告警防止复发
- [ ] 补充测试用例覆盖此场景
- [ ] 更新文档/规范
```
