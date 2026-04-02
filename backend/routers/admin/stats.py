"""
管理端统计：Dashboard 核心指标 + 7 天收入折线图
"""
from datetime import datetime, timedelta, timezone
from fastapi import APIRouter, Depends
from dependencies import get_admin
from db.client import admin_client
from models.common import ok

router = APIRouter(prefix="/admin/stats", tags=["admin-stats"])


@router.get("/overview")
async def stats_overview(_: None = Depends(get_admin)):
    """
    核心指标卡片：
    - 今日收入 / 总收入
    - 今日订单数 / 总订单数
    - 总用户数
    - 待审核提现数
    - 预估 AI 成本（从 settings.ai_cost_per_call 估算）
    """
    today = datetime.now(timezone.utc).date().isoformat()

    # 总收入和今日收入
    all_orders = await (
        admin_client.table("orders")
        .select("amount,paid_at,status")
        .in_("status", ["paid", "generating", "completed"])
        .execute()
    )
    orders_data = all_orders.data or []
    total_revenue = sum(float(o["amount"]) for o in orders_data)
    today_revenue = sum(
        float(o["amount"]) for o in orders_data
        if o.get("paid_at") and o["paid_at"][:10] == today
    )

    # 总用户数
    users_count = await admin_client.table("users").select("id", count="exact").execute()
    total_users = users_count.count or 0

    # 待审核提现
    pending_withdrawals = await (
        admin_client.table("withdrawals")
        .select("id", count="exact")
        .eq("status", "pending")
        .execute()
    )
    pending_count = pending_withdrawals.count or 0

    # AI 成本估算
    settings_row = await admin_client.table("settings").select("ai_cost_per_call").eq("id", 1).single().execute()
    ai_cost = float(settings_row.data["ai_cost_per_call"])
    completed_count = len([o for o in orders_data if o["status"] == "completed"])
    estimated_ai_cost = round(ai_cost * completed_count, 2)

    return ok(data={
        "today_revenue": round(today_revenue, 2),
        "total_revenue": round(total_revenue, 2),
        "today_orders": len([o for o in orders_data if o.get("paid_at") and o["paid_at"][:10] == today]),
        "total_orders": len(orders_data),
        "total_users": total_users,
        "pending_withdrawals": pending_count,
        "estimated_ai_cost": estimated_ai_cost,
        "net_revenue": round(total_revenue - estimated_ai_cost, 2),
    })


@router.get("/revenue-chart")
async def revenue_chart(_: None = Depends(get_admin)):
    """7 天收入折线图数据"""
    today = datetime.now(timezone.utc).date()
    days = [(today - timedelta(days=i)).isoformat() for i in range(6, -1, -1)]

    result = await (
        admin_client.table("orders")
        .select("amount,paid_at")
        .in_("status", ["paid", "generating", "completed"])
        .gte("paid_at", days[0])
        .execute()
    )
    orders = result.data or []

    # 按日聚合
    daily = {d: 0.0 for d in days}
    for o in orders:
        if o.get("paid_at"):
            day = o["paid_at"][:10]
            if day in daily:
                daily[day] = round(daily[day] + float(o["amount"]), 2)

    chart_data = [{"date": d, "revenue": daily[d]} for d in days]
    return ok(data={"chart": chart_data})
