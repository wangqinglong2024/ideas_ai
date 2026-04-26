# ZY-14-02 · 注册时邀请码生成

> Epic：E14 · 估算：S · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 监听 supabase auth.user.created webhook → 生成 6 位无歧义码（排除 0/O/1/I/L）
- [ ] 唯一冲突重试（最多 5 次）
- [ ] 不可变（不暴露 regenerate 端点）
- [ ] **不暴露**纯 code 字段 API（仅可通过 share-link 拿到完整链接）

## 测试方法
- 集成：注册新用户 → referral_codes 表落行
- 单元：码生成无歧义字符

## DoD
- [ ] 生成可靠；纯 code 永不外泄
