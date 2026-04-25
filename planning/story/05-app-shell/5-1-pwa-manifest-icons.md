# Story 5.1: PWA Manifest + 图标体系

Status: ready-for-dev

## Story

作为 **App 用户**，
我希望 **可以将知语 H5 应用安装到桌面 / 主屏幕**，
以便 **像原生 App 一样独立打开使用，不依赖浏览器 UI**。

## Acceptance Criteria

1. 提供完整的 `manifest.webmanifest`，包含 `name` / `short_name` / `description` / `theme_color` / `background_color` / `display: standalone` / `start_url` / `scope` / `lang` 等字段。
2. 图标资源全尺寸覆盖：72 / 96 / 128 / 144 / 152 / 192 / 384 / 512，含 `purpose: any maskable` 一份。
3. iOS 适配：`apple-touch-icon` + `apple-mobile-web-app-capable` + splash screen（按设备分辨率生成）。
4. Lighthouse PWA 安装性检查全部通过（Installability ≥ 95）。
5. 提供"安装到主屏幕"提示组件：根据 `beforeinstallprompt` 事件触发，可手动关闭并 7 天内不重复展示。
6. iOS Safari 走兜底说明：弹出「分享 → 添加到主屏幕」图文指引。
7. manifest 中 `name` / `short_name` / `description` 通过 i18n 注入 4 语 UI 文本。

## Tasks / Subtasks

- [ ] **配置 manifest 与图标资源**（AC: 1,2,3）
  - [ ] 在 `apps/app/public/` 下创建 `manifest.webmanifest`
  - [ ] 生成全尺寸 PNG 图标 + maskable 图标（设计资源由 UX 提供）
  - [ ] 生成 iOS splash screen 序列（脚本自动化，按 iPhone/iPad 分辨率）
  - [ ] 在 `index.html` `<head>` 引用 manifest 与 apple-touch-icon

- [ ] **i18n 注入 manifest 文案**（AC: 7）
  - [ ] 设计 manifest 渲染流程：构建期按语言生成 4 份 manifest
  - [ ] 或运行期：根据 `Accept-Language` 由 Edge Function 返回不同 manifest

- [ ] **安装提示 UX**（AC: 5,6）
  - [ ] 监听 `beforeinstallprompt`，缓存 event
  - [ ] 实现 `<InstallPrompt>` 组件：底部 sheet，按钮「安装」/「以后」
  - [ ] 关闭后 localStorage 记录时间戳，7 天内不再触发
  - [ ] iOS 检测：UA 含 iPhone/iPad 且无 standalone → 显示 iOS 兜底图文指引

- [ ] **Lighthouse 验证**（AC: 4）
  - [ ] CI 接入 Lighthouse CI，PWA 分数门槛 ≥ 95
  - [ ] 修复全部安装性 audit 警告

## Dev Notes

### 关键约束
- iOS 16.4 以下不支持 Web Push，安装提示文案需明示「通知能力受限」。
- maskable 图标安全区域为中心 80% 圆形，避免内容被裁剪。
- `start_url` 必须可独立加载，不可依赖登录态。

### Project Structure Notes
- `apps/app/public/manifest.webmanifest`
- `apps/app/public/icons/`（全尺寸 PNG）
- `apps/app/public/splash/`（iOS）
- `apps/app/src/components/InstallPrompt.tsx`

### References
- `planning/epics/05-app-shell.md` ZY-05-01
- `planning/prds/05-app-shell/`（如存在）
- Lighthouse PWA checklist

### 测试标准
- E2E：Chrome desktop 触发 `beforeinstallprompt` 后能成功安装。
- E2E：iOS Safari 显示兜底指引。
- 单元：InstallPrompt 7 天冷却逻辑。

## Dev Agent Record

### Context Reference
<!-- 由 dev agent 填写 -->

### Agent Model Used
<!-- 由 dev agent 填写 -->

### Debug Log References
<!-- 由 dev agent 填写 -->

### Completion Notes List
<!-- 由 dev agent 填写 -->

### File List
<!-- 由 dev agent 填写 -->
