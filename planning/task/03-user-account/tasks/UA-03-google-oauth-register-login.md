# UA-03 · Google OAuth 注册与登录

## PRD 原文引用

- `UA-FR-002`：“Supabase Auth Google provider。”
- `UA-FR-002`：“首次登录后弹引导填母语 + 隐私同意。”
- `UA-FR-002`：“同样送 100 币。”

## 需求落实

- 页面：登录页、注册页、首次 OAuth 补全弹窗。
- 组件：OAuthButton、OAuthProfileCompletionModal。
- API：`POST /api/auth/oauth/google`。
- 数据表：`auth.users`、`users`、`user_preferences`、`coin_ledger`。
- 状态逻辑：OAuth 首登若缺 native_lang/privacy consent，则进入补全状态；补全后进入 onboarding。

## 技术假设

- dev 缺 Google key 时不接真实 OAuth；保留 Supabase provider 配置位和 fake 失败/测试 token。
- 赠币仍按邮箱验证/有效账号幂等发放规则处理。

## 不明确 / 风险

- 标注：真实 Google OAuth 在缺 key 的 dev 环境暂不支持。
- 处理：不阻塞容器；提供 fake adapter 或明确错误。

## 最终验收清单

- [ ] OAuth 按钮存在但 dev 无 key 不崩。
- [ ] 首登补全母语和隐私同意。
- [ ] OAuth 用户不重复创建 profile。
