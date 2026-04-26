# ZY-14-02 · 邀请码生成与续期

> Epic：E14 · 估算：S · 状态：ready-for-dev
> 代码根：`/opt/projects/zhiyu/system/`
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## User Story
**As a** 用户
**I want** 进入推荐页自动获得 6-8 位易记邀请码
**So that** 我能立刻分享给朋友。

## 上下文
- 字典：去掉易混 0/O/1/I 后的 32 字符
- 长度策略：6 位 → 不足时升 7 / 8 位
- 重置：用户可手动换码（旧码状态置 expired，关联记录不受影响）

## Acceptance Criteria
- [ ] `GET /api/v1/referral/me` 自动生成 / 返回当前码
- [ ] `POST /api/v1/referral/regenerate` 限频每 30 天 1 次
- [ ] 唯一性碰撞重试 ≤ 5 次

## 测试方法
```bash
cd /opt/projects/zhiyu/system/docker
docker compose exec zhiyu-app-be pnpm vitest run referral.code
```

## DoD
- [ ] 1000 用户并发生成无重复

## 依赖
- 上游：ZY-14-01
