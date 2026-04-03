"""
JWT 工具：用户 JWT 本地验签（Supabase HS256）+ Admin JWT 签发与验签
不发起任何 HTTP 请求，纯内存操作，毫秒级完成
"""
from datetime import datetime, timedelta, timezone
from jose import jwt, JWTError
from fastapi import HTTPException, status
from config import settings


def verify_user_token(token: str) -> str:
    """
    验证 Supabase 签发的用户 JWT（HS256，audience='authenticated'）
    返回 user_id (uuid str)，失败则抛 401
    """
    try:
        payload = jwt.decode(
            token,
            settings.supabase_jwt_secret,
            algorithms=["HS256"],
            audience="authenticated",
        )
        user_id: str = payload.get("sub")
        if not user_id:
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="无效的 token")
        return user_id
    except JWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="token 验证失败")


def create_admin_token() -> str:
    """
    签发管理员 JWT（HS256，有效期 8 小时）
    仅在登录接口调用
    """
    now = datetime.now(timezone.utc)
    payload = {
        "sub": "admin",
        "role": "admin",
        "iat": now,
        "exp": now + timedelta(hours=8),
    }
    return jwt.encode(payload, settings.admin_jwt_secret, algorithm="HS256")


def verify_admin_token(token: str) -> None:
    """
    验证管理员 JWT，role 必须是 admin
    失败则抛 403
    """
    try:
        payload = jwt.decode(token, settings.admin_jwt_secret, algorithms=["HS256"])
        if payload.get("role") != "admin":
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="权限不足")
    except JWTError:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="管理员 token 验证失败")
