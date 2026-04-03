"""
管理端订单管理：列表、详情、退款
"""
from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_admin
from db.client import get_admin_client
from models.common import ok

router = APIRouter(prefix="/admin/orders", tags=["admin-orders"])


@router.get("")
async def list_orders(
    page: int = 1,
    page_size: int = 20,
    status: str = "",
    _: None = Depends(get_admin),
):
    """订单列表（分页 + 按状态筛选）"""
    offset = (page - 1) * page_size
    query = (
        get_admin_client().table("orders")
        .select("id,user_id,category,status,amount,paid_at,created_at")
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
    )
    if status:
        query = query.eq("status", status)

    result = await query.execute()
    count_query = get_admin_client().table("orders").select("id", count="exact")
    if status:
        count_query = count_query.eq("status", status)
    count_result = await count_query.execute()
    total = count_result.count or 0

    return ok(data={"orders": result.data or [], "total": total, "page": page})


@router.get("/{order_id}")
async def get_order(order_id: str, _: None = Depends(get_admin)):
    """订单详情（含报告内容）"""
    result = await get_admin_client().table("orders").select("*").eq("id", order_id).maybe_single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="订单不存在")
    return ok(data=result.data)


@router.post("/{order_id}/refund")
async def refund_order(order_id: str, _: None = Depends(get_admin)):
    """
    退款（将订单标记为 refunded）
    实际退款需通过微信/支付宝 API 操作（MVP 手动处理）
    """
    result = await get_admin_client().table("orders").select("status,payment_no").eq("id", order_id).maybe_single().execute()
    if not result.data:
        raise HTTPException(status_code=404, detail="订单不存在")

    current_status = result.data["status"]
    if current_status not in ("paid", "completed"):
        raise HTTPException(status_code=400, detail=f"当前状态 {current_status} 不可退款")

    await get_admin_client().table("orders").update({"status": "refunded"}).eq("id", order_id).execute()
    return ok(message="订单已标记为退款")
