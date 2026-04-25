# Story 5.2: Service Worker（Workbox）

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **离线 / 弱网情况下也能打开 App 的核心页面**，
以便 **不受网络抖动影响阅读历史内容与基础导航**。

## Acceptance Criteria

1. 引入 Workbox（vite-plugin-pwa），生成 Service Worker，注册策略：自动更新 + skipWaiting 受控。
2. 静态资源（JS / CSS / 字体）使用 `CacheFirst` 策略，版本随构建 hash 失效。
3. GET API 请求使用 `StaleWhileRevalidate` 策略，缓存 24h，仅缓存 200 状态码。
4. 提供离线兜底页 `/offline.html`：包含 logo / 提示文案（4 语）/ 重试按钮。
5. 当检测到新版本 SW 时，弹出"发现新版本"提示，用户点击「立即更新」后调用 `skipWaiting` + `clients.claim` 并刷新。
6. 图片走 `CacheFirst` + 容量上限（最多 60 项 / 50MB），LRU 淘汰。
7. POST / PUT / DELETE 请求**不**走 SW 缓存，直通网络。
8. SW 不缓存 `/admin/**`、`/api/auth/**`。

## Tasks / Subtasks

- [ ] **集成 vite-plugin-pwa**（AC: 1）
  - [ ] 安装依赖；配置 `registerType: 'prompt'`
  - [ ] 配置 `workbox.runtimeCaching` 多策略

- [ ] **配置缓存策略**（AC: 2,3,6,7,8）
  - [ ] 静态资源 CacheFirst（含 hash）
  - [ ] API GET StaleWhileRevalidate（24h，仅 200）
  - [ ] 图片 CacheFirst + ExpirationPlugin（60 项 / 50MB）
  - [ ] navigateFallbackDenylist 排除 `/admin` `/api/auth`

- [ ] **离线兜底页**（AC: 4）
  - [ ] 创建 `apps/app/public/offline.html`
  - [ ] 4 语文案通过 inline `<script>` 根据 `navigator.language` 切换
  - [ ] navigateFallback 配置为 `/offline.html`

- [ ] **新版本提示**（AC: 5）
  - [ ] 实现 `<UpdatePrompt>` 组件，监听 `onNeedRefresh`
  - [ ] 提供「立即更新」按钮 → `updateSW(true)`

- [ ] **验证与监控**（AC: 1-8）
  - [ ] Chrome DevTools Application 面板检查
  - [ ] 模拟离线访问历史页 + 未访问过的页（应跳 `/offline.html`）

## Dev Notes

### 关键约束
- iOS Safari Service Worker 容量上限 ~50MB；超过会被驱逐。
- POST 等写操作必须直通；缓存写请求会破坏数据一致性。
- 切换 `Content-Encoding` 时旧缓存会失效，构建 hash 必须严格随构建变化。

### 关联后续 stories
- 5-1（manifest）已建立 PWA 基础
- 5-3（router）需要离线时仍能渲染已缓存的路由

### Project Structure Notes
- `apps/app/vite.config.ts`（pwa plugin）
- `apps/app/public/offline.html`
- `apps/app/src/components/UpdatePrompt.tsx`
- `apps/app/src/main.tsx`（注册 SW）

### References
- `planning/epics/05-app-shell.md` ZY-05-02
- Workbox docs

### 测试标准
- 单元：StaleWhileRevalidate 命中行为
- E2E：Chrome offline 模式访问已访问页能加载，未访问页跳兜底
- E2E：版本切换时弹更新提示

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
