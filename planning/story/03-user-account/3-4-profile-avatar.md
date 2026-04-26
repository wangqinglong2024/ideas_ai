# ZY-03-04 · 个人资料 + 头像

> Epic：E03 · 估算：M · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] GET / PATCH `/api/v1/me` 操作 `profiles`
- [ ] 头像上传：supabase-storage 桶 `avatars`；FE 通过 signed URL 上传
- [ ] 图片裁剪 + ≤ 2MB + 类型白名单 png/jpg/webp
- [ ] 字段编辑：nickname、country、ui_lang、HSK 等级（手动）
- [ ] 提交防抖；保存成功 toast

## 测试方法
- MCP Puppeteer：上传 avatar 后刷新仍显示
- 单元：zod 校验非法 country/lang 拒收

## DoD
- [ ] 头像桶 RLS：仅本人写、所有人读（公开 URL 可用）
- [ ] PATCH 幂等
