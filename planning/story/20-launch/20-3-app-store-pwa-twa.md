# Story 20.3: 应用商店准备（PWA + TWA）

Status: ready-for-dev

## Story

作为 **移动产品 / 增长**，
我希望 **app.zhiyu.io 是一个完美的 PWA，并通过 TWA 打包上架 Google Play（v1.5），同时在 iOS 提供「添加到主屏」引导**，
以便 **零成本覆盖移动端，规避 App Store 30% 抽成，未来再补原生**。

## Acceptance Criteria

1. **PWA manifest** 完整：name / short_name / start_url / scope / display=standalone / theme_color / background_color / icons（72/96/128/144/192/512 + maskable）/ screenshots / shortcuts / categories=education / lang。
2. **Service Worker**：Workbox 5 策略：
   - `precache`：app shell（offline 兜底页）
   - `network-first`：API / page
   - `cache-first`：静态资源 / 字体
   - `stale-while-revalidate`：图片 / 课程封面
   - 版本切换 skipWaiting + clientsClaim + 用户提示「新版本可用，刷新」
3. **离线支持**：基本路由有兜底（offline.html）；课程节最近 5 节支持离线学习（v1.5）。
4. **安装提示**：`beforeinstallprompt` 自定义 UI；7 日内不重复打扰。
5. **TWA**（Android v1.5）：
   - Bubblewrap 生成 AAB
   - Digital Asset Links（`/.well-known/assetlinks.json`）
   - Play Store listing：4+1 语描述 / 截图 / 隐私政策链接
6. **iOS 引导**：检测 iOS Safari 且未 standalone → 显示「添加到主屏」提示；标准 apple-touch-icon + 屏蔽缩放避坑。
7. **更新策略**：每次部署 SW 自动更新；强制刷新阈值（critical 更新可强制）。
8. **Lighthouse PWA 全 ✅**；installable / themed / icons / SW 全部通过。
9. **PostHog 事件**：`pwa.installed` / `pwa.install_prompted` / `pwa.update_available` / `pwa.offline_used`。

## Tasks / Subtasks

- [ ] **manifest + icons**（AC: 1）
  - [ ] `apps/web/public/manifest.webmanifest`
  - [ ] icon set + maskable
- [ ] **Service Worker**（AC: 2, 3, 7）
  - [ ] `apps/web/workbox.config.ts`
  - [ ] `next-pwa` 或自定义注入
  - [ ] 更新提示 UI
- [ ] **安装提示 / iOS**（AC: 4, 6）
  - [ ] `useInstallPrompt` hook
  - [ ] iOS detect util
- [ ] **TWA**（AC: 5）
  - [ ] `infra/twa/`：bubblewrap config
  - [ ] assetlinks.json 部署
  - [ ] Play Console listing checklist
- [ ] **测试**（AC: 8）
  - [ ] lighthouse PWA CI
  - [ ] manual install on Android / iOS
- [ ] **埋点**（AC: 9）

## Dev Notes

### 关键约束
- iOS Safari **不支持** `beforeinstallprompt`：必须 fallback 引导卡片。
- SW 更新若强制刷新会丢失未保存的学习进度；做缓冲（持久化进度后再刷新）。
- TWA v1.5 才上线；MVP 阶段仅做好 PWA 基础。
- iOS push v1.5（≥ 16.4 + 主屏 PWA），本 story 不实现。
- assetlinks.json 必须返回 200 + correct content-type，否则 Android 显示浏览器条。

### 关联后续 stories
- 19-3 PostHog 事件
- 20-1 营销站 hero 引导下载
- 20-9 法律：Play Console privacy 链接

### Project Structure Notes
- `apps/web/public/manifest.webmanifest`
- `apps/web/workbox.config.ts`
- `apps/web/components/InstallPrompt.tsx`
- `infra/twa/`

### References
- [planning/epics/20-launch.md ZY-20-03](../../epics/20-launch.md)
- [planning/spec/03-frontend.md](../../spec/03-frontend.md)

### 测试标准
- Lighthouse PWA 全通过
- 真机：Android Chrome 安装 / iOS Safari 主屏 / 离线兜底
- E2E：SW 更新流程

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
