# FP-09 · 编写服务 Dockerfile

## 原文引用

- `planning/rules.md`：“多阶段 Dockerfile（deps / build / runtime）。”
- `planning/rules.md`：“runtime 阶段必须非 root 用户。”

## 需求落实

- 页面：无。
- 组件：app-fe、app-be、admin-fe、admin-be、worker 对应 Dockerfile。
- API：容器内启动各自服务。
- 数据表：无。
- 状态逻辑：镜像构建阶段与运行阶段分离，运行阶段不包含开发工具和非运行资产。

## 技术假设

- 前端镜像可用 nginx 或 node preview，但必须符合 Docker-only dev。
- 后端/worker 使用 Node 20 runtime。

## 不明确 / 风险

- 风险：前端 dev 热更新与多阶段 runtime 有冲突。
- 处理：dev compose 可使用 dev target，runtime target 为部署准备。

## 最终验收清单

- [ ] 每个服务都有 Dockerfile 或共享 Dockerfile target。
- [ ] runtime USER 不是 root。
- [ ] `docker compose build` 成功。
