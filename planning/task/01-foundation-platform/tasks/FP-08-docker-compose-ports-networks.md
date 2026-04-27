# FP-08 · 编写唯一 Docker Compose 与端口网络

## 原文引用

- `planning/rules.md`：“Compose 项目名：zhiyu，唯一 compose 文件：system/docker/docker-compose.yml。”
- `planning/rules.md`：“网络：gateway_net（已存在，给 nginx 反代用）+ zhiyu-internal（项目内部网络）。”
- `planning/rules.md`：“本项目只有一个环境：dev。”

## 需求落实

- 页面：无。
- 组件：docker compose services。
- API：对外端口 3100、8100、4100、9100；Redis/worker 内网。
- 数据表：无。
- 状态逻辑：只存在 dev compose，不创建 stg/prod compose。

## 技术假设

- compose 文件路径固定为 `system/docker/docker-compose.yml`。
- 如果宿主机已有端口冲突，调整需先改铁律或显式记录，不私自换端口。

## 不明确 / 风险

- 风险：`gateway_net` 在本机不存在。
- 处理：文档化创建命令，但 compose 不改成其他网络名。

## 最终验收清单

- [ ] `docker compose -f system/docker/docker-compose.yml config` 通过。
- [ ] services 使用固定容器名和端口。
- [ ] 没有 stg/prod compose 文件。
