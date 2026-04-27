# UX-15 · 实现游戏横屏遮罩与 16:9 画布

## 原文引用

- `planning/ux/10-game-ux.md`：“portrait → 显示 OrientationMask。”
- `planning/ux/10-game-ux.md`：“设计基准：1280×720。”
- `planning/ux/05-layout-and-responsive.md`：“横屏游戏：左右 safe-area 避让。”

## 需求落实

- 页面：`/games/:game/play`。
- 组件：OrientationMask、GameCanvasShell、SafeAreaHud。
- API：无直接 API。
- 数据表：无。
- 状态逻辑：竖屏显示遮罩；横屏锁定后进入游戏；退出解锁方向。

## 技术假设

- 使用 Screen Orientation API，失败时降级为遮罩提示。
- 画布按 16:9 contain/cover 策略适配。

## 不明确 / 风险

- 风险：iOS Safari 横屏锁定能力受限。
- 处理：提供手动旋转遮罩，不依赖强制 lock 成功。

## 最终验收清单

- [ ] 手机竖屏进入游戏显示遮罩。
- [ ] 横屏后 16:9 画布不裁 HUD。
- [ ] 退出游戏后恢复普通方向行为。
# UX-15 · 实现游戏横屏遮罩与 16:9 画布

## 原文引用

- `planning/ux/10-game-ux.md`：“portrait → 显示 OrientationMask。”
- `planning/ux/10-game-ux.md`：“设计基准：1280×720。”
- `planning/ux/05-layout-and-responsive.md`：“横屏游戏：左右 safe-area 避让。”

## 需求落实

- 页面：`/games/:game/play`。
- 组件：OrientationMask、GameCanvasShell、SafeAreaHud。
- API：无直接 API。
- 数据表：无。
- 状态逻辑：竖屏显示遮罩；横屏锁定后进入游戏；退出解锁方向。

## 技术假设

- 使用 Screen Orientation API，失败时降级为遮罩提示。
- 画布按 16:9 contain/cover 策略适配。

## 不明确 / 风险

- 风险：iOS Safari 横屏锁定能力受限。
- 处理：提供手动旋转遮罩，不依赖强制 lock 成功。

## 最终验收清单

- [ ] 手机竖屏进入游戏显示遮罩。
- [ ] 横屏后 16:9 画布不裁 HUD。
- [ ] 退出游戏后恢复普通方向行为。
