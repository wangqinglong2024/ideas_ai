# I18N-09 · v1 不支持 RTL 声明

## PRD 原文引用

- `I18N-FR-008`：“v1 不支持（4 目标语都 LTR），中文亦 LTR；预留 dir 属性接口。”

## 需求落实

- `<html dir='ltr'>` 全局固定。
- 设计文档明确：v1.5 若新增 ar/he 才考虑 RTL。
- Tailwind 不引入 RTL 插件。

## 状态逻辑

- 预留 `useDirection()` hook 返回 'ltr'，未来切 RTL 时改实现即可。

## 最终验收清单

- [ ] HTML 输出 dir='ltr'。
- [ ] 文档中明确 v1 不做 RTL。
- [ ] 不引入 RTL 依赖。
