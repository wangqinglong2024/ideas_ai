# ACR-09 · 多语翻译完整度可视化

## PRD 原文引用

- `I18N-FR-004`：“所有内容表 translations JSONB（en, vi, th, id），缺失语 → 回退 en。”
- 用户裁决：内容多语对照应跟随系统启用语数（zh-CN + 4 ui_lang = 5 语对照）。

## 需求落实

- 组件：TranslationsCompletenessBadge（每节点显示 X/N 徽章）、TranslationGapList（节点详情页显示缺失语种列表）、BulkTranslationFilter。
- API：
  - `GET /admin/api/content/courses/translations/coverage?scope=track&id=` 返回每节点覆盖率。
  - `GET /admin/api/content/courses/translations/gaps?lang=&scope=` 返回缺失列表。
- 页面：`/admin/content/courses/translations` 总览（按 lang × resource_type 矩阵）。

## 状态逻辑

- N = 启用语种数（zh-CN + 4 ui_lang），从 i18n 配置读取，非硬编码。
- 缺失语种字段标 `needs_translation=true`。
- 总览页按 track 列出 stage/chapter/lesson/knowledge_point 的覆盖率。
- 编辑器内一键“标记需翻译”按钮，自动入审校工作台。

## 不明确 / 风险

- 风险：i18n 启用语种动态扩展（如新增 ja 日语）后历史内容缺失。
- 处理：语种新增时全量扫描 + 自动入“缺失列表”，后台一键批量发审校任务。

## 技术假设

- 翻译完整度计算定时（每 10min）batch 更新 cache 表，避免实时计算。

## 最终验收清单

- [ ] 节点列表显示完整度徽章（X/N）。
- [ ] 详情页可看缺失语种 + “去翻译”链接。
- [ ] 总览页矩阵可定位低覆盖区域。
- [ ] 启用语种数动态变化时统计同步更新。
- [ ] 编辑器内可一键发起翻译审校任务。
