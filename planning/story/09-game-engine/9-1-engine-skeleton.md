# ZY-09-01 · packages 骨架

> Epic：E09 · 估算：M · 阶段：MVP · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] `packages/game-engine`：包结构按 spec/11 §3
- [ ] 入口导出：Application、SceneManager、AssetLoader、InputManager、AudioManager、PhysicsWorld
- [ ] tsup build 双产物（esm + cjs）+ d.ts
- [ ] peer deps：pixi.js 8、matter-js、howler

## 测试方法
```bash
docker compose exec zhiyu-app-fe pnpm --filter @zhiyu/game-engine build
```

## DoD
- [ ] build 通过；可被 zhiyu-app-fe import
