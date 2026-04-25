# Story 5.4: TanStack Query 配置

Status: ready-for-dev

## Story

作为 **前端开发者**，
我希望 **统一的数据获取层（TanStack Query）**，
以便 **缓存、错误处理、重试、持久化等行为有一致策略，避免每个页面各写一套 fetch**。

## Acceptance Criteria

1. 引入 `@tanstack/react-query` 与 `@tanstack/react-query-devtools`，创建全局 `QueryClient`。
2. 默认配置：`staleTime: 60s`、`gcTime: 5min`、`retry: 2`（仅 5xx / 网络错）、`refetchOnWindowFocus: false`。
3. 全局错误处理：`QueryCache.onError` 与 `MutationCache.onError` 统一捕获，401 → 触发登出；5xx → toast。
4. 持久化：使用 `@tanstack/react-query-persist-client` + IndexedDB（`idb-keyval`），最多保留 24h。
5. DevTools 仅 dev 注入；prod 无包体增量。
6. 提供 `useApi` / `useApiMutation` hooks 包装：自动注入 `Authorization` 头，处理基础 URL，统一错误结构。
7. 与 TanStack Router 集成：在 router context 注入 `queryClient`，路由 `loader` 可使用 `queryClient.ensureQueryData`。
8. 在不同语言切换后失效相关查询（`queryClient.invalidateQueries({ predicate })`）。

## Tasks / Subtasks

- [ ] **建立 QueryClient**（AC: 1,2,3,5）
  - [ ] 安装依赖
  - [ ] `apps/app/src/lib/query-client.ts` 导出单例
  - [ ] 配置默认选项与 onError 钩子

- [ ] **持久化**（AC: 4）
  - [ ] 安装 persistQueryClient + idb-keyval
  - [ ] 仅持久化 GET 查询；24h `maxAge`
  - [ ] dehydrate / hydrate 钩子

- [ ] **API hooks 封装**（AC: 6）
  - [ ] `useApi(key, fn, options)` 注入 token + baseURL
  - [ ] `useApiMutation(fn, options)` 同上
  - [ ] 错误对象规范：`{ status, code, message }`

- [ ] **Router 集成**（AC: 7）
  - [ ] router context 注入 queryClient
  - [ ] 在样例 loader 中演示 `ensureQueryData`

- [ ] **i18n 失效**（AC: 8）
  - [ ] 监听 i18next `languageChanged`
  - [ ] invalidateQueries（key 含 `i18n` 标记）

- [ ] **DevTools**（AC: 5）
  - [ ] dev only 加载

## Dev Notes

### 关键约束
- 持久化 IndexedDB 在隐私模式下可能失败，必须 try/catch 兜底。
- 401 触发登出时避免无限循环：登出 mutation 自身不应再触发 401 处理。
- mutation 不持久化（仅 query）。

### 关联后续 stories
- 5-3 router 已就位；本 story 注入 context
- 后续业务页面统一使用 `useApi` / `useApiMutation`

### Project Structure Notes
- `apps/app/src/lib/query-client.ts`
- `apps/app/src/lib/api/use-api.ts`
- `apps/app/src/lib/api/use-api-mutation.ts`
- `apps/app/src/main.tsx`（Provider 包裹）

### References
- `planning/epics/05-app-shell.md` ZY-05-04
- TanStack Query docs

### 测试标准
- 单元：useApi 注入 token；onError 401 触发登出 mock
- 集成：刷新页面后，缓存命中 < 50ms
- 集成：i18n 切换后特定 key 失效

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
