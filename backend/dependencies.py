"""
FastAPI 公共依赖注入：
- get_current_user：用户 JWT 本地验签，返回 user_id，并校验冻结状态
- get_admin：Admin JWT 验签
"""
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from utils.jwt_utils import verify_user_token, verify_admin_token
from db.queries.users import get_user_by_id

_bearer = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> str:
    """
    验证用户 JWT，提取 user_id
    同时检查账号冻结状态（is_frozen=true 返回 403）
    """
    token = credentials.credentials
    user_id = verify_user_token(token)

    # 检查账号冻结
    user = await get_user_by_id(user_id)
    if not user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="用户不存在")
    if user.get("is_frozen"):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="账号已被冻结")

    return user_id


async def get_admin(
    credentials: HTTPAuthorizationCredentials = Depends(_bearer),
) -> None:
    """验证管理员 JWT"""
    verify_admin_token(credentials.credentials)
