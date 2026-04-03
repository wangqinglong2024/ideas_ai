"""
FastAPI 入口：挂载所有路由、注册中间件、健康检查
"""
import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from config import settings
from db.client import init_clients
from middleware.error_handler import ErrorHandlerMiddleware, http_exception_handler
from routers import auth, orders, commissions, withdrawals, webhooks
from routers.admin import stats, orders as admin_orders, withdrawals as admin_withdrawals
from routers.admin import users as admin_users, settings as admin_settings

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    """FastAPI 生命周期：启动时初始化异步 Supabase 客户端"""
    await init_clients()
    yield


app = FastAPI(
    title="内观 AI 认知镜",
    version="0.0.2",
    lifespan=lifespan,
    # 生产环境关闭 docs（防止接口泄露）
    docs_url=None,
    redoc_url=None,
    openapi_url=None,
)

# --------------------------------------------------------------------------
# 中间件
# --------------------------------------------------------------------------
app.add_middleware(ErrorHandlerMiddleware)

# CORS：从配置读取允许的来源（逗号分隔字符串 → 列表）
_cors_origins = [o.strip() for o in settings.cors_origins.split(",") if o.strip()]
app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --------------------------------------------------------------------------
# 全局异常处理
# --------------------------------------------------------------------------
app.add_exception_handler(HTTPException, http_exception_handler)

# --------------------------------------------------------------------------
# 路由挂载
# --------------------------------------------------------------------------
app.include_router(auth.router)
app.include_router(orders.router)
app.include_router(commissions.router)
app.include_router(withdrawals.router)
app.include_router(webhooks.router)

# 管理端
app.include_router(stats.router)
app.include_router(admin_orders.router)
app.include_router(admin_withdrawals.router)
app.include_router(admin_users.router)
app.include_router(admin_settings.router)


# --------------------------------------------------------------------------
# 健康检查（Docker healthcheck 使用）
# --------------------------------------------------------------------------
@app.get("/health")
async def health():
    return {"status": "ok"}
