# ZY-09-08 · WordPackLoader + PinyinRenderer

> Epic：E09 · 估算：L · 阶段：V1 · 状态：ready-for-dev
> 顶层约束：[planning/00-rules.md](../../00-rules.md)

## Acceptance Criteria
- [ ] 远程加载词包：GET `/api/v1/wordpacks/:id`（schema：words[] with hanzi/pinyin/tone/translation/audio_url）
- [ ] BitmapFont 子集生成（运行时按词包字符集生成）
- [ ] PinyinRenderer：拼音上方、汉字下方、声调色彩（4 调 + 轻声）
- [ ] 缓存（同包 30 分钟内不重复请求）

## 测试方法
- 单元：词包格式 zod 校验
- demo：加载 100 词包并渲染

## DoD
- [ ] BitmapFont 渲染流畅
