"""
佣金和钱包相关查询
"""
from typing import Optional
from db.client import get_admin_client


async def get_wallet_by_user(user_id: str) -> Optional[dict]:
    """查询用户钱包余额"""
    result = await (
        get_admin_client().table("wallets")
        .select("balance,total_earned,total_withdrawn")
        .eq("user_id", user_id)
        .maybe_single()
        .execute()
    )
    return result.data


async def get_commissions_by_user(user_id: str, page: int = 1, page_size: int = 20) -> list[dict]:
    """分页查询用户佣金记录"""
    offset = (page - 1) * page_size
    result = await (
        get_admin_client().table("commissions")
        .select("id,type,amount,status,created_at")
        .eq("beneficiary_id", user_id)
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return result.data or []


async def settle_commission_transaction(
    order_id: str,
    buyer_id: str,
    referrer_id: Optional[str],
    commission_amount: float,
) -> None:
    """
    原子佣金结算事务（通过 Supabase RPC 调用存储过程）
    1. INSERT commissions（买家自购返佣）
    2. INSERT commissions（邀请人推荐佣金，若有）
    3. UPDATE wallets（余额）
    """
    await get_admin_client().rpc(
        "settle_commission",
        {
            "p_order_id": order_id,
            "p_buyer_id": buyer_id,
            "p_referrer_id": referrer_id,
            "p_commission_amount": commission_amount,
        },
    ).execute()
