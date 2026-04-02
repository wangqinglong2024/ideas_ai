"""
管理端用户管理：列表、详情、冻结/解封
"""
from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_admin
from db.client import admin_client
from db.queries.users import set_user_frozen
from models.common import ok
from utils.phone_mask import mask_phone

router = APIRouter(prefix="/admin/users", tags=["admin-users"])


@router.get("")
async def list_users(
    page: int = 1,
    page_size: int = 20,
    _: None = Depends(get_admin),
):
    """用户列表（分页，按注册时间倒序）"""
    offset = (page - 1) * page_size
    result = await (
        admin_client.table("users")
        .select("id,phone,invite_code,invited_by,is_frozen,created_at")
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    total_result = await admin_client.table("users").select("id", count="exact").execute()
    total = total_result.count or 0

    # 脱敏手机号
    users = result.data or []
    for u in users:
        if u.get("phone") and not u["phone"].startswith("wx_"):
            u["phone"] = mask_phone(u["phone"])

    return ok(data={"users": users, "total": total, "page": page})


@router.get("/{user_id}")
async def get_user_detail(user_id: str, _: None = Depends(get_admin)):
    """用户详情（含钱包余额和订单统计）"""
    user_result = await admin_client.table("users").select("*").eq("id", user_id).maybe_single().execute()
    user = user_result.data
    if not user:
        raise HTTPException(status_code=404, detail="用户不存在")

    wallet_result = await admin_client.table("wallets").select("*").eq("user_id", user_id).maybe_single().execute()
    wallet = wallet_result.data
    order_count_result = await admin_client.table("orders").select("id", count="exact").eq("user_id", user_id).execute()
    order_count = order_count_result.count

    if user.get("phone") and not user["phone"].startswith("wx_"):
        user["phone"] = mask_phone(user["phone"])

    return ok(data={"user": user, "wallet": wallet, "order_count": order_count or 0})


@router.post("/{user_id}/freeze")
async def freeze_user(user_id: str, _: None = Depends(get_admin)):
    """冻结用户账号"""
    await set_user_frozen(user_id, True)
    return ok(message="用户已冻结")


@router.post("/{user_id}/unfreeze")
async def unfreeze_user(user_id: str, _: None = Depends(get_admin)):
    """解封用户账号"""
    await set_user_frozen(user_id, False)
    return ok(message="用户已解封")
