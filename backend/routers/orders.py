"""
订单路由：创建订单、查询状态、历史列表
"""
from fastapi import APIRouter, Depends, HTTPException, Request
from dependencies import get_current_user
from db.queries.orders import create_order, get_order_by_id, get_orders_by_user
from db.client import get_admin_client
from models.order import CreateOrderRequest
from models.common import ok
from services.payment import create_wechat_pay, create_alipay

router = APIRouter(prefix="/orders", tags=["orders"])


@router.post("/create")
async def create_new_order(
    req: CreateOrderRequest,
    request: Request,
    user_id: str = Depends(get_current_user),
):
    """
    创建订单并发起支付
    1. 从 settings 读取当前价格
    2. 写入订单记录（status=pending）
    3. 调起微信支付 H5，返回 pay_url
    """
    # 读取系统配置价格
    settings_row = await (
        get_admin_client().table("settings")
        .select("order_price")
        .eq("id", 1)
        .single()
        .execute()
    )
    amount = float(settings_row.data["order_price"])

    order = await create_order(user_id, req.category, req.input_content, amount)
    order_id = order["id"]

    # 获取客户端真实 IP（Nginx 透传）
    client_ip = request.headers.get("X-Real-IP") or request.client.host

    try:
        pay_url = await create_wechat_pay(
            order_id=order_id,
            amount_fen=int(amount * 100),
            description="内观·AI认知分析报告",
            client_ip=client_ip,
        )
        pay_type = "wechat_mweb"
    except Exception as e:
        # 微信支付失败尝试支付宝
        try:
            pay_url = await create_alipay(
                order_id=order_id,
                amount=amount,
                subject="内观·AI认知分析报告",
                return_url=f"https://ideas.top/paying/{order_id}",
            )
            pay_type = "alipay"
        except Exception as e2:
            raise HTTPException(status_code=500, detail="支付下单失败，请稍后重试")

    return ok(data={"order_id": order_id, "pay_url": pay_url, "pay_type": pay_type})


@router.get("/{order_id}/status")
async def get_order_status(order_id: str, user_id: str = Depends(get_current_user)):
    """
    轮询订单状态
    前端每 2 秒调用一次，最多 30 秒
    paid → 触发 AI 生成（由 webhook 已完成）
    """
    order = await get_order_by_id(order_id)
    if not order or order["user_id"] != user_id:
        raise HTTPException(status_code=404, detail="订单不存在")

    data = {"order_id": order_id, "status": order["status"]}
    if order["status"] == "completed" and order.get("report"):
        data["report"] = order["report"]

    return ok(data=data)


@router.get("/my")
async def my_orders(
    page: int = 1,
    user_id: str = Depends(get_current_user),
):
    """用户历史订单（仅 paid/completed 状态，分页）"""
    orders = await get_orders_by_user(user_id, page=page)
    return ok(data={"orders": orders, "page": page})
