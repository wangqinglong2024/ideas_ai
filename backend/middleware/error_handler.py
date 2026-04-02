"""
全局异常捕获中间件：将所有未处理异常转为标准化 JSON，生产环境不暴露 traceback
"""
import uuid
import logging
from fastapi import Request, HTTPException
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware
from config import settings

logger = logging.getLogger(__name__)


class ErrorHandlerMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())[:8]
        try:
            response = await call_next(request)
            return response
        except HTTPException:
            # FastAPI HTTPException 由全局 exception_handler 处理，这里不拦截
            raise
        except Exception as exc:
            # 生产环境只记录日志，不暴露内部信息
            logger.exception(f"[{request_id}] Unhandled error: {exc}")
            return JSONResponse(
                status_code=500,
                content={
                    "success": False,
                    "code": "INTERNAL_ERROR",
                    "message": "服务异常，请稍后重试",
                    "request_id": request_id,
                },
            )


def http_exception_handler(request: Request, exc: HTTPException):
    """统一格式化 HTTPException 响应"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "code": f"HTTP_{exc.status_code}",
            "message": exc.detail or "请求失败",
        },
    )
