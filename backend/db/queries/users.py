"""
用户相关数据库查询
所有写操作通过 admin_client（绕过 RLS），读操作视场景选择
"""
from typing import Optional
from db.client import get_admin_client
from utils.invite_code import generate_invite_code


async def get_user_by_phone(phone: str) -> Optional[dict]:
    """通过手机号查询用户（包含冻结状态）"""
    result = await get_admin_client().table("users").select("*").eq("phone", phone).maybe_single().execute()
    return result.data


async def get_user_by_id(user_id: str) -> Optional[dict]:
    """通过 user_id 查询用户"""
    result = await get_admin_client().table("users").select("*").eq("id", user_id).maybe_single().execute()
    return result.data


async def get_user_by_invite_code(invite_code: str) -> Optional[dict]:
    """通过邀请码查询用户"""
    result = await (
        get_admin_client().table("users")
        .select("id")
        .eq("invite_code", invite_code.upper())
        .maybe_single()
        .execute()
    )
    return result.data


async def create_user(user_id: str, phone: str, invited_by: Optional[str] = None) -> dict:
    """
    创建用户记录（auth.users 已由 Supabase Auth 创建）
    同时创建对应 wallets 记录
    """
    # 生成唯一邀请码（碰撞时重试）
    invite_code = generate_invite_code()
    for _ in range(5):
        existing = await get_user_by_invite_code(invite_code)
        if not existing:
            break
        invite_code = generate_invite_code()

    user_data = {
        "id": user_id,
        "phone": phone,
        "invite_code": invite_code,
        "invited_by": invited_by,
    }
    result = await get_admin_client().table("users").insert(user_data).execute()
    user = result.data[0]

    # 同步创建钱包
    await get_admin_client().table("wallets").insert({"user_id": user_id}).execute()

    return user


async def update_wechat_openid(user_id: str, openid: str) -> None:
    """更新微信 openid"""
    await get_admin_client().table("users").update({"wechat_openid": openid}).eq("id", user_id).execute()


async def set_user_frozen(user_id: str, frozen: bool) -> None:
    """冻结/解封用户"""
    await get_admin_client().table("users").update({"is_frozen": frozen}).eq("id", user_id).execute()
