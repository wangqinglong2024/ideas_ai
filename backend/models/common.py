"""
统一响应模型：所有接口返回 {success, data, message} 或 {success, code, message}
"""
from typing import Any, Optional
from pydantic import BaseModel


class SuccessResponse(BaseModel):
    success: bool = True
    data: Any = None
    message: str = ""


class ErrorResponse(BaseModel):
    success: bool = False
    code: str
    message: str


def ok(data: Any = None, message: str = "") -> dict:
    """构造成功响应"""
    return {"success": True, "data": data, "message": message}


def fail(code: str, message: str) -> dict:
    """构造失败响应"""
    return {"success": False, "code": code, "message": message}
