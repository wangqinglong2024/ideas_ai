# 规范文件索引 (Standards Index)

> **AI 请先阅读此文件**，了解本项目的完整规范体系，然后按需深入阅读具体文件。

---

## 文件清单

| 文件 | 内容 | 什么时候读 |
|------|------|-----------|
| [env.md](env.md) | 项目凭证与配置（Supabase/Dify/微信支付等） | 需要配置连接信息时 |
| [rules.md](rules.md) | 全局架构白皮书（UI 设计规范 + Supabase/FastAPI/测试架构哲学，具体编码规则见 coding-standards.md） | 每个项目启动时必读 |
| [coding-standards.md](coding-standards.md) | 编码规范（命名约定、前后端规范、Git 规范、**纵深安全体系**、**支付资金安全**、**数据库设计铁律**、审查检查表） | 写任何代码前必读 |
| [qa-testing.md](qa-testing.md) | QA 测试规范（Browser MCP 测试方法、Docker 强制规则、Bug 报告格式、健康评分） | 测试任何功能时必读 |
| [project-structure.md](project-structure.md) | 项目目录结构标准模板（前端/后端/数据库/脚本） | 创建新项目或新模块时 |
| [api-design.md](api-design.md) | RESTful API 设计规约（URL 规范、响应格式、错误码、分页、鉴权） | 设计或开发 API 时 |
| [task-workflow.md](task-workflow.md) | AI 驱动的任务拆解与开发流程（需求分析→拆任务→逐个开发→验收） | 新项目启动的完整流程 |
| [copilot-instructions.md](copilot-instructions.md) | VS Code Copilot 项目级指令 + 使用技巧 | 配置新项目的 Copilot 时 |

---

## 技术栈速查

```
前端：Vite + React + TypeScript + Tailwind CSS v4
后端：FastAPI + Python（全异步）
数据库：Supabase（PostgreSQL + Auth + Storage + Realtime）
容器化：Docker + Docker Compose
网关：Nginx 反向代理
AI 工作流：Dify
```

---

## 新项目启动快速指引

```
1. 把 grules/ 整个目录复制到新项目（或保持在公共位置引用）
2. 在新项目根目录创建 .github/copilot-instructions.md（从 copilot-instructions.md 中复制精简版）
3. 在 product/ 目录写好产品需求文档
4. 开始和 AI 对话，按 task-workflow.md 的流程推进
```
