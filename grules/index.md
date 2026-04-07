# 规范文件索引 (Standards Index)

> **版本**: v1.2 | **最后更新**: 2025-07-16
>
> **AI 请先阅读此文件**，了解本项目的完整规范体系，然后按需深入阅读具体文件。
>
> **架构概要**：单服务器（`115.159.109.23`）三环境架构。基础设施（Supabase/Dify/NocoBase）仅一套，前后端按 dev/staging/prod 独立容器。

---

## 文件清单

| 文件 | 内容 | 什么时候读 |
|------|------|-----------|
| [env.md](env.md) | 项目凭证与配置（Supabase/Dify/微信支付等） | 需要配置连接信息时 |
| [rules.md](rules.md) | 全局架构白皮书（Cosmic Refraction UI 设计规范 + Supabase/FastAPI/测试哲学） | 每个项目启动时必读 |
| [coding-standards.md](coding-standards.md) | 编码规范（命名约定、前后端规范、Git 规范、**纵深安全体系**、**支付资金安全**、**数据库设计铁律**、审查检查表） | 写任何代码前必读 |
| [qa-testing.md](qa-testing.md) | QA 测试规范（Browser MCP 测试方法、Docker 强制规则、Bug 报告格式、健康评分） | 测试任何功能时必读 |
| [project-structure.md](project-structure.md) | 项目目录结构标准模板（前端/后端/数据库/脚本） | 创建新项目或新模块时 |
| [api-design.md](api-design.md) | RESTful API 设计规约（URL 规范、响应格式、错误码、分页、鉴权） | 设计或开发 API 时 |
| [task-workflow.md](task-workflow.md) | AI 驱动的任务拆解与开发流程（需求优化→原型审查→需求分析→拆任务→逐个开发→验收） | 新项目启动的完整流程 |
| [product-design.md](product-design.md) | 产品需求文档全维度规范 + Stitch 原型工作流 + MCP API 调用手册 + 竞品分析/用户旅程/无障碍模板 | 写需求、审查原型、管理设计系统时 |
| [copilot-instructions.md](copilot-instructions.md) | VS Code Copilot 项目级指令 + 使用技巧 | 配置新项目的 Copilot 时 |
| [deployment.md](deployment.md) | 单服务器三环境架构、端口规划、Docker 多环境部署、Schema 隔离、回滚、监控、备份、事故响应 | 部署上线、环境配置时 |
| [operational-runbook.md](operational-runbook.md) | 操作诊断与自愈运行手册（故障决策树、按层排错、性能基准、缓存策略、自愈脚本） | 生产故障排查、性能优化时 |

---

## 技术栈速查

```
前端：Vite + React + TypeScript + Tailwind CSS v4
后端：FastAPI + Python（全异步）
数据库：Supabase（PostgreSQL + Auth + Storage + Realtime）
容器化：Docker + Docker Compose
网关：Nginx 反向代理
AI 工作流：Dify
原型设计：Stitch（通过 MCP 集成，支持原型审查/创建/修改）
```

---

## 新项目启动快速指引

```
1. 把 grules/ 整个目录复制到新项目（或保持在公共位置引用）
2. 按 deployment.md 的端口规划分配新项目的 dev/staging 端口
3. 创建 docker-compose.yml + dev/stg 覆盖文件 + .env.{dev,stg,prod}
4. 在新项目根目录创建 .github/copilot-instructions.md
5. 在 product/ 目录写好产品需求文档（按 product-design.md 规范优化）
6. 如有 Stitch 原型，按 product-design.md 的流程审查
7. 开始和 AI 对话，按 task-workflow.md 的流程推进
```
