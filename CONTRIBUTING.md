# Contributing

所有工程验证默认在 Docker 中执行：

```bash
docker compose -f docker-compose.test.yml run --rm --build test
```

## 密钥策略

缺少密码或 API Key 时，不阻塞构建、测试或本地体验。实现必须自动走 mock adapter，并在 `/ready` 或日志中暴露缺失项。
