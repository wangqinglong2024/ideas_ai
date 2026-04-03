"""
佣金结算服务
支付成功后立即触发，通过 Supabase RPC 原子执行
"""
import logging
from db.client import get_admin_client
from db.queries.users import get_user_by_id

logger = logging.getLogger(__name__)


async def get_commission_ratio() -> float:
    """从系统配置表读取当前佣金比例"""
    result = await (
        get_admin_client().table("settings")
        .select("commission_ratio")
        .eq("id", 1)
        .single()
        .execute()
    )
    return float(result.data["commission_ratio"])


async def settle_after_payment(order_id: str, buyer_id: str, order_amount: float) -> None:
    """
    支付成功后结算佣金：
    1. 查询买家的邀请人
    2. 按佣金比例计算金额
    3. 调用 Supabase RPC 原子事务写入佣金和钱包
    """
    buyer = await get_user_by_id(buyer_id)
    referrer_id = buyer.get("invited_by") if buyer else None

    commission_ratio = await get_commission_ratio()
    commission_amount = round(order_amount * commission_ratio, 2)

    try:
        await get_admin_client().rpc(
            "settle_commission",
            {
                "p_order_id": order_id,
                "p_buyer_id": buyer_id,
                "p_referrer_id": referrer_id,
                "p_commission_amount": commission_amount,
            },
        ).execute()
        logger.info(f"Commission settled for order {order_id}, buyer {buyer_id}, amount {commission_amount}")
    except Exception as e:
        # 佣金结算失败不影响主流程（订单已付款），记录日志后台处理
        logger.error(f"Commission settlement failed for order {order_id}: {e}")
