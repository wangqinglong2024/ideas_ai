"""
提现相关查询
"""
from typing import Optional
from db.client import admin_client


async def create_withdrawal(
    user_id: str,
    amount: float,
    payee_name: str,
    payee_account: str,
    payee_method: str,
) -> dict:
    """
    创建提现申请，同时冻结（扣除）钱包余额
    余额不足时 CHECK 约束会拦截，抛出数据库异常
    """
    # 扣除余额（CHECK 约束保证余额不为负）
    await admin_client.rpc(
        "deduct_wallet_balance",
        {"p_user_id": user_id, "p_amount": amount},
    ).execute()

    data = {
        "user_id": user_id,
        "amount": amount,
        "payee_name": payee_name,
        "payee_account": payee_account,
        "payee_method": payee_method,
        "status": "pending",
    }
    result = await admin_client.table("withdrawals").insert(data).execute()
    return result.data[0]


async def get_withdrawals_by_user(user_id: str, page: int = 1, page_size: int = 20) -> list[dict]:
    """查询用户提现记录"""
    offset = (page - 1) * page_size
    result = await (
        admin_client.table("withdrawals")
        .select("id,amount,payee_method,status,admin_note,created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return result.data or []


async def get_withdrawal_by_id(withdrawal_id: str) -> Optional[dict]:
    """管理端：查询单条提现记录"""
    result = await (
        admin_client.table("withdrawals")
        .select("*")
        .eq("id", withdrawal_id)
        .maybe_single()
        .execute()
    )
    return result.data


async def update_withdrawal_status(
    withdrawal_id: str,
    status: str,
    admin_note: Optional[str] = None,
) -> None:
    """管理端：更新提现状态"""
    data: dict = {"status": status}
    if admin_note is not None:
        data["admin_note"] = admin_note
    await admin_client.table("withdrawals").update(data).eq("id", withdrawal_id).execute()
