FROM python:3.11-slim

WORKDIR /app

# 依赖层（利用 Docker 缓存）
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 应用代码
COPY . .

# 非 root 用户运行
RUN adduser --disabled-password --gecos '' appuser && \
    mkdir -p /app/certs && chown appuser:appuser /app/certs
USER appuser

EXPOSE 8080

# 生产环境 2 workers（单核 VPS 适用）
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8080", "--workers", "2"]
