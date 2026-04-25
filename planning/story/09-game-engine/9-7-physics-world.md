# Story 9.7: PhysicsWorld（matter-js 包装）

Status: ready-for-dev

## Story

作为 **游戏开发者**，
我希望 **PhysicsWorld 包装 matter-js，提供 PixiJS sprite 与 Body 同步、碰撞回调**，
以便 **拼音射击 / 弹弓 / 节奏掉落等物理玩法快速接入**。

## Acceptance Criteria

1. API：`world.create(opts) / world.add(body) / world.remove(body) / world.on('collision', cb)`。
2. body / sprite 自动同步（每 tick 更新 sprite.x/y/rotation）。
3. 提供基础形状辅助：`createCircle / createBox / createPolygon`。
4. 重力默认 (0, 0)（不少游戏不需要重力），可配置。
5. 碰撞过滤器：collisionGroup / mask。
6. step 由 9-2 ticker 驱动，固定 60Hz。
7. destroy 释放 world 与 bodies。
8. 单元测试：碰撞回调触发。

## Tasks / Subtasks

- [ ] **核心**（AC: 1,2,3,4,5,6,7）
  - [ ] `src/core/PhysicsWorld.ts`
- [ ] **sprite-body 桥接**（AC: 2）
- [ ] **测试**

## Dev Notes

### 关键约束
- matter-js bundle ~80KB，可接受。
- 仅游戏 11 / 12 / 8 / 1 使用；其他不要无脑创建 world。

### 关联后续 stories
- 9-2 前置
- 10-1 / 10-8 / 10-11 / 10-12 使用

### Project Structure Notes
- `packages/game-engine/src/core/PhysicsWorld.ts`

### References
- `planning/epics/09-game-engine.md` ZY-09-07

### 测试标准
- 单元：碰撞 / 重力 / 速度
- 性能：100 body 60fps

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
