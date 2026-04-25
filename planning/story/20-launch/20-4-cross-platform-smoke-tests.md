# Story 20.4: 跨平台冒烟测试

Status: ready-for-dev

## Story

作为 **QA / 发布工程师**，
我希望 **在 iPhone / Android / iPad / Desktop 4 种设备 × 4 语 × 4 国 IP 矩阵下完整跑通主流程**，
以便 **上线前发现兼容性 / 国家差异 / 翻译错位等问题，确保灰度（20-5）安全**。

## Acceptance Criteria

1. **测试矩阵**：
   - 设备：iPhone（iOS 17/18 Safari）/ Android（Chrome / Samsung Internet）/ iPad / Desktop（Chrome / Safari / Firefox / Edge）
   - 语言：VN / TH / ID / EN / 中
   - 国家 IP：VN / TH / ID / SG（VPN / 真机 SIM）
   - 网络：4G / 弱网（Slow 3G） / Wi-Fi
2. **主流程**（每场景 100% 通过）：
   - 注册（邮箱 / Google / Apple）
   - 登录 / 找回密码
   - 首课完成 + XP 入账
   - 游戏 1 局完成
   - 推荐邀请发送 + 接受
   - 充值（每国 1 种本地支付）
   - 商城购买 + 金币扣除
   - 客服工单提交
   - PWA 安装（iOS 主屏 / Android）
   - 隐私设置 / 注销
3. **i18n 检查**：每语种文案不溢出 UI；RTL 不需要（4 语全 LTR）；占位变量正确。
4. **支付**：4 国 × 各国主流方式（VN MoMo/ZaloPay / TH PromptPay / ID OVO/Dana / SG PayNow）实测 + 退款 1 次。
5. **性能**：每平台首屏 LCP；移动 P95 < 3s；Wi-Fi < 1.5s。
6. **可观测**：测试事件标 `qa_smoke=true`，不污染生产 PostHog 漏斗。
7. **缺陷分级**：P1（阻塞主流程）= 0；P2 ≤ 3；P3 / P4 入 backlog。
8. **报告**：`docs/qa/smoke-{date}.md` 含矩阵勾选表 / 截图 / 视频 / 缺陷链接；3 次必须 100% 通过才允许灰度。
9. **自动化**：核心流程 Playwright（Web）+ Maestro（PWA Android）回归脚本，CI nightly。

## Tasks / Subtasks

- [ ] **矩阵规划**（AC: 1）
  - [ ] BrowserStack / 真机租赁清单
  - [ ] VPN 节点 / SIM
- [ ] **手工脚本**（AC: 2, 3, 4）
  - [ ] Test Case 表 `docs/qa/cases.csv`
- [ ] **支付实测**（AC: 4）
  - [ ] 每国 1 笔真实交易（小额）+ 退款
- [ ] **性能**（AC: 5）
  - [ ] WebPageTest / Lighthouse 多区域
- [ ] **自动化**（AC: 9）
  - [ ] Playwright suite
  - [ ] Maestro Android
- [ ] **报告**（AC: 8）
  - [ ] 模板 + 3 轮记录
- [ ] **观测过滤**（AC: 6）
  - [ ] PostHog property `qa=true` 过滤

## Dev Notes

### 关键约束
- 真实支付小额（≤ $1）使用专用 QA 账户，立即退款；CFO 知会。
- iOS 真机优先（模拟器对 PWA 行为不一致）。
- 弱网测试用 Chrome DevTools throttling + 真机飞行模式 + 4G 切换。
- 翻译错位多发于德语 / 越语长词；UI 必须支持文本截断 / 折行。
- 自动化优先回归 Web 主流程；Mobile 真机不强求 100% 自动化。

### 关联后续 stories
- 20-5 灰度：通过 3 轮 smoke 才允许
- 20-6 增长：UTM / Pixel 矩阵中验证
- E13 支付：4 国通道
- E04 i18n：翻译资源

### Project Structure Notes
- `docs/qa/{cases.csv,smoke-*.md,reports/}`
- `tests/e2e/` Playwright
- `tests/maestro/` Maestro flow

### References
- [planning/epics/20-launch.md ZY-20-04](../../epics/20-launch.md)

### 测试标准
- 矩阵 100% 设备 × 语 × 国 主流程通过
- P1 = 0；P2 ≤ 3
- 自动化回归 nightly green

## Dev Agent Record

### Context Reference
### Agent Model Used
### Debug Log References
### Completion Notes List
### File List
