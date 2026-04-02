# ======================================================
# 多阶段构建
# Stage 1: 构建 React SPA（Vite）
# Stage 2: Nginx 托管静态文件
# ======================================================

FROM node:20-alpine AS builder

WORKDIR /app

# 依赖安装（利用层缓存）
COPY package.json package-lock.json* ./
RUN npm ci --prefer-offline

# 拷贝源码并构建
COPY . .
RUN npm run build
# 构建产物输出到 /app/dist

# ======================================================
FROM nginx:alpine

# 删除 Nginx 默认配置
RUN rm /etc/nginx/conf.d/default.conf

# 自定义配置（SPA 兜底）
COPY nginx.conf /etc/nginx/conf.d/app.conf

# 拷贝构建产物
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
