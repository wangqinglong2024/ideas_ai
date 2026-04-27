# UX-16 · 实现游戏输入控制映射

## 原文引用

- `planning/ux/10-game-ux.md` 包含“通用键位”和“虚拟控件”。
- `planning/ux/10-game-ux.md` 要求浏览器 + 手机触控可玩。

## 需求落实

- 页面：所有游戏 play 页。
- 组件：InputOverlay、VirtualJoystick/Buttons、KeyboardHint。
- API：无。
- 数据表：无。
- 状态逻辑：桌面键鼠和移动触控映射到统一 GameInput events。

## 技术假设

- 具体游戏可声明需要的输入类型。
- 控件不放进装饰卡片，叠加在画布 safe area 内。

## 不明确 / 风险

- 风险：12 款游戏输入差异大。
- 处理：统一抽象 action events，如 move/confirm/cancel/select/drag。

## 最终验收清单

- [ ] 桌面键盘可操作游戏。
- [ ] 手机触控可操作游戏。
- [ ] 控件不遮挡核心玩法区域。
# UX-16 · 实现游戏输入控制映射

## 原文引用

- `planning/ux/10-game-ux.md` 包含“通用键位”和“虚拟控件”。
- `planning/ux/10-game-ux.md` 要求浏览器 + 手机触控可玩。

## 需求落实

- 页面：所有游戏 play 页。
- 组件：InputOverlay、VirtualJoystick/Buttons、KeyboardHint。
- API：无。
- 数据表：无。
- 状态逻辑：桌面键鼠和移动触控映射到统一 GameInput events。

## 技术假设

- 具体游戏可声明需要的输入类型。
- 控件不放进装饰卡片，叠加在画布 safe area 内。

## 不明确 / 风险

- 风险：12 款游戏输入差异大。
- 处理：统一抽象 action events，如 move/confirm/cancel/select/drag。

## 最终验收清单

- [ ] 桌面键盘可操作游戏。
- [ ] 手机触控可操作游戏。
- [ ] 控件不遮挡核心玩法区域。
