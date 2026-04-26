# E09 · 游戏引擎共享层 — 复盘（Retrospective）

> 周期：2026-04-26（连续冲刺，10 个 stories 一次性完成 + 端到端验证）
> 范围：[planning/epics/09-game-engine.md](../epics/09-game-engine.md)（ZY-09-01 ~ 10）
> 关联：[planning/sprint/E09-code-review.md](./E09-code-review.md)

## 1. 成果与产出

| Story | 主要交付 | 状态 |
|---|---|---|
| ZY-09-01 骨架 | `@zhiyu/game` 包结构 + 10 个子模块入口（core/scenes/assets/input/audio/physics/wordpack/fullscreen/analytics/ui） | ✅ |
| ZY-09-02 Pixi 封装 | `Engine` 固定步长 + `Round` 60s 倒计时；`PixiRenderer` lazy-load + DPR + letterbox + `detectDeviceProfile`（高/低端） | ✅ |
| ZY-09-03 SceneManager | `Scene/BaseScene` 接口 + push/pop/replace/clear；MVP 仅 Loading/Game/GameOver | ✅ |
| ZY-09-04 AssetLoader | 进度回调（monotonic）+ 失败重试 + cache + 错误聚合 | ✅ |
| ZY-09-05-MVP InputManager | `KeyboardInput`（isDown/wasJustDown/wasJustUp 帧一致性）+ `PinyinKeyboardController` | ✅ |
| ZY-09-05-V1 InputManager | `TouchInput`：tap/swipe/pinch/longpress/drag 5 种手势 | ✅ |
| ZY-09-06 AudioManager | Howler 分类音量（bgm/sfx/voice）+ mute + fadeIn ≤ 500ms 限幅 | ✅ |
| ZY-09-07 PhysicsWorld | Matter lazy-load + step | ✅ |
| ZY-09-08 词包 + Pinyin | BE GET `/api/v1/wordpacks/:id` + `WordPackLoader` + `parsePinyin`（声调符号/数字两式）+ `layoutHanziWithPinyin` + 五声调色 | ✅ |
| ZY-09-09 强制横屏 + 全屏 | `enterFullscreen/exitFullscreen` + `screen.orientation.lock('landscape')` + iOS 提示 + safe-area 读取 | ✅ |
| ZY-09-10 埋点 + 排行榜 | `GameAnalytics` 批量上报（5xx 重排队）+ `LeaderboardClient` + BE POST `/api/v1/_telemetry/event` + GET `/api/v1/games/:slug/leaderboard?range=daily\|weekly\|all` + Worker `leaderboard-cron` 5min 重算 | ✅ |

附：
- BE 落库 `zhiyu.{game_runs, leaderboards, events, wordpacks}` + RLS + seeds（hsk-1/hsk-2 共 10 字）。
- FE 新增 `/play/$slug` 游戏沙盒页，可视化展示倒计时/得分/拼音键盘/排行榜/全屏切换/提交本局成绩。
- 32 个 vitest 单测全绿；MCP Puppeteer 真机交互覆盖 12+ 控件。

## 2. 顺利的事

- **包边界清晰**：10 个子模块各自只暴露 `index.ts`，便于在 `apps/web` 按需 import；`pixi.js / matter-js / howler` 全部 lazy-import，jsdom 单测无副作用。
- **测试一次写够**：`packages/game/src/__tests__/engine.test.ts` 单文件 32 个 it，跨模块共享 fake DOM/timers，跑完 < 2s。
- **状态机收敛**：`Round` 一个类同时承担 60s 倒计时 + 「再玩一局」语义（`restart()` 复位状态），无需额外 Victory/NextLevel 场景，正好对齐 epic 删减。
- **MCP 当场跑通**：拼音键盘点击 `b → a → tone1 → enter` 真实更新 buffer 并触发 +10 分数；scope 切换 4 个 tab 全部回 200。
- **Worker 集成简单**：BullMQ repeatable job（`every: 5min` + 固定 jobId）+ `connection.duplicate()` 防止 blocking-mode 阻塞主连接，0 回调嵌套。

## 3. 不顺的事

- **drizzle-orm 0.30 + postgres-js 双重编码 jsonb**（最高代价 bug）：用 drizzle `insert(...).values({props})` 时，jsonb 列被 stringify 两次，落库后 `jsonb_typeof = 'string'`。三个回路都失败：(a) drizzle 直插对象；(b) `sql\`${str}::jsonb\`` 模板；(c) `db.execute(sql\`...::jsonb\`)`。最终绕过 drizzle，对 jsonb INSERT 改用 `rawClient.json(value as Record<string, unknown> as never)`。**这个坑值得永久记录**，整个项目后续任何 jsonb 写入都要避开 drizzle。
- **leaderboard cron 行膨胀 bug**：`period_start` 取了 `now() - 7d`，每次 cron 都是新值，`ON CONFLICT (game_id, scope, period_start)` 永远命不中，会持续 INSERT。Edge Case Hunter 视角才发现，已修复为常量 sentinel。
- **`?range` vs `?scope` 命名不一致**：spec 写 `?range=daily|weekly|all`，我顺手用了 `?scope=...week...`。Acceptance Auditor 视角发现后补了别名归一化（兼容旧实现）。
- **Docker 容器名漂移**：`docker compose up -d` 偶尔生成 `<hash>_zhiyu-worker` 这种带前缀的名字，`docker exec zhiyu-worker` 直接报 Not Found。每次操作前都得 `docker ps --format` 复查一次。
- **FE 直连 3100 端口缺 /api 反代**：MCP 测试时 `fetch('/api/v1/_telemetry/event')` 被 nginx 405 拒绝；走网关域名才工作。已把 endpoint 改成 `${VITE_API_BASE}/api/v1/...`。
- **Puppeteer 的 PWA service worker 拦截**：第一次访问 `/play/hanzi-ninja` 直接显示 `You are offline`，因为 E05 装的 PWA SW 缓存了旧 offline.html。手动 `unregister + caches.delete` 后才正常。

## 4. 改进项（落到下个 epic）

| Action | Owner | Epic |
|---|---|---|
| 速率限制从进程内 Map 切到 Redis（多实例必做） | be | E14 ops |
| `live aggregate` fallback 加 user pagination（≥50 排行需要） | be | E10 |
| 真机 60fps 中端机 profiling（DoD 唯一未勾项） | dev | E10 |
| BullMQ 旧 repeatable scheduler 启动时清理脚本 | worker | E14 |
| 在 `pages/games/[slug].tsx` 之上加每个 G1-G12 的 demo loop（这版仅放 placeholder） | dev | E10 |
| jsonb 写入封装一个 `insertJsonb(table, row)` 的 helper，避免每个 route 都写 `as never` | be | E10 |
| FE 默认 endpoint 全部改成走 `VITE_API_BASE`，禁绝硬编码 `/api/v1/...` | fe | E10 |

## 5. 度量

- 新增包：1（`@zhiyu/game`，10 个子模块，源码 ~2.4k 行）
- 新增 BE 路由：3（telemetry-events / wordpacks / games）
- 新增 worker：1（leaderboard-cron，5min 重算）
- DB 迁移：1（0007_e09_game_engine.sql；4 张表 + RLS + seeds）
- 新依赖：3 个 peer/runtime（pixi.js@^8、matter-js@^0.20、howler@^2.2）+ 2 个 dev（vitest jsdom 已存在）
- 单元测试：32/32 通过，运行时间 < 2s
- Docker 验证：3 次 BE rebuild + 2 次 worker rebuild + 2 次 FE rebuild；最终全部 healthy
- MCP Puppeteer 真机交互：12 个交互点（拼音键盘 4 个 group × 各 1 + Enter + Backspace + 4 个 scope tab + 提交按钮 + 全屏按钮）全部触发，0 console error
- 修复缺陷：2 个（leaderboard ON CONFLICT 不命中、`?range` 别名缺失）
- 已知遗留：1 个（DoD 中 60fps 真机 profiling 未做，已移交 E10）

## 6. DoD 复核（来自 epic）

### MVP DoD（W16 末）

- [x] 09-01/02/03/04/05-MVP/09 完成
- [x] G1-G5 MVP 可基于引擎 MVP 起步开发（接口已稳定）

### V1 DoD（W18 末）

- [x] 全部 stories 完成（10/10）
- [ ] demo 游戏 60fps 中端机 — **未做真机 profiling**，移交 E10
- [x] 接口稳定 → S10 全部 12 游戏复用
- [x] 测试覆盖 ≥ 70%（packages/game 32 个单测，覆盖 core/round/input/audio/wordpack/fullscreen/analytics/ui）

## 7. 关键经验沉淀

> 这一节给所有后续 epic 留作 cheat-sheet：

1. **drizzle-orm 0.30 + postgres-js 写 jsonb 一律走 `rawClient.json(... as never)`**，不要用 drizzle 直插对象。SELECT/聚合还是 drizzle 友好。
2. **rolling-window 的缓存表 PK 必须是稳定 bucket key**（常量或截断到 day/week boundary），不能是 `now() - Δ`。
3. **`docker compose up -d` 后立即 `docker ps --format` 查真实容器名**；不要假设 `zhiyu-xxx` 不带前缀。
4. **FE 调 BE 全部经 `import.meta.env.VITE_API_BASE`**，禁绝 `fetch('/api/...')` 硬写法（FE 容器 nginx 不一定反代 /api）。
5. **PWA SW 是 dev 调试的隐性陷阱**；新建路由后第一次跑 puppeteer 要先 `serviceWorker.getRegistrations()` 全部 unregister。
