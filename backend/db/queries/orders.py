"""
订单相关数据库查询
"""
from typing import Optional
from db.client import get_admin_client


async def create_order(user_id: str, category: str, input_content: str, amount: float) -> dict:
    """创建订单，初始状态 pending"""
    data = {
        "user_id": user_id,
        "category": category,
        "input_content": input_content,
        "amount": amount,
        "status": "pending",
    }
    result = await get_admin_client().table("orders").insert(data).execute()
    return result.data[0]


async def get_order_by_id(order_id: str) -> Optional[dict]:
    """查询订单详情（含报告内容）"""
    result = await get_admin_client().table("orders").select("*").eq("id", order_id).maybe_single().execute()
    return result.data


async def get_orders_by_user(user_id: str, page: int = 1, page_size: int = 10) -> list[dict]:
    """分页查询用户历史订单，按时间倒序"""
    offset = (page - 1) * page_size
    result = await (
        get_admin_client().table("orders")
        .select("id,category,status,amount,paid_at,created_at,report")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
        .execute()
    )
    return result.data or []


async def update_order_status(order_id: str, status: str, **kwargs) -> None:
    """更新订单状态，支持附加字段（如 paid_at、payment_no）"""
    update_data = {"status": status, **kwargs}
    await get_admin_client().table("orders").update(update_data).eq("id", order_id).execute()


async def update_order_report(order_id: str, report: dict) -> None:
    """写入 AI 生成的报告，同时将状态改为 completed"""
    await get_admin_client().table("orders").update(
        {"report": report, "status": "completed"}
    ).eq("id", order_id).execute()


async def get_order_by_payment_no(payment_no: str) -> Optional[dict]:
    """通过支付流水号查询订单（用于 Webhook 幂等校验）"""
    result = await (
        get_admin_client().table("orders")
        .select("*")
        .eq("payment_no", payment_no)
        .maybe_single()
        .execute()
    )
    return result.data
