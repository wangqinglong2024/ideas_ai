# FP-32 · 建立 PostgreSQL 备份脚本

## 原文引用

- `planning/rules.md`：“备份：pg_dump -Fc cron 写到 /opt/backups/zhiyu/<ts>/，30 天保留。”
- `planning/prds/01-overall/06-non-functional.md`：“数据库每日全备 | 保留 30 天。”

## 需求落实

- 页面：无。
- 组件：backup script、cron job、retention cleanup。
- API：无。
- 数据表：无。
- 状态逻辑：定时备份、失败记录日志、超过 30 天清理。

## 技术假设

- 备份脚本在宿主或专用容器中执行，输出路径固定。
- 备份只覆盖 dev 环境当前数据库。

## 不明确 / 风险

- 风险：备份路径权限不足。
- 处理：启动前自检目录可写。

## 最终验收清单

- [ ] 手动执行备份生成 `.dump` 文件。
- [ ] 清理逻辑只删除 30 天以上备份。
- [ ] 失败会写 ERROR 日志。
