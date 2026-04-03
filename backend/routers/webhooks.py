"""
支付回调路由（不走 JWT 鉴权，只验签名）
幂等保障：通过 payment_no 唯一约束
"""
import logging
from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import PlainTextResponse
from fastapi import BackgroundTasks

from db.queries.orders import update_order_status, get_order_by_id, get_order_by_payment_no
from services.commission import settle_after_payment
from services.report import generate_report_background
from services.payment import verify_wechat_callback, verify_alipay_callback
from datetime import datetime, timezone

router = APIRouter(prefix="/webhooks", tags=["webhooks"])
logger = logging.getLogger(__name__)


@router.post("/wechat-pay")
async def wechat_pay_notify(request: Request, background_tasks: BackgroundTasks):
    """
    微信支付异步通知
    1. 验证签名
    2. 解密通知数据
    3. 更新订单状态为 paid
    4. 触发佣金结算（后台任务）
    5. 触发 AI 报告生成（后台任务）
    6. 返回 {"code":"SUCCESS"} 告知微信支付通知成功
    """
    headers = dict(request.headers)
    body = await request.body()

    try:
        data = await verify_wechat_callback(headers, body)
    except Exception as e:
        logger.error(f"WeChat pay callback verify failed: {e}")
        raise HTTPException(status_code=400, detail="签名验证失败")

    out_trade_no = data.get("out_trade_no")    # 我们的 order_id
    transaction_id = data.get("transaction_id")  # 微信支付流水号
    trade_state = data.get("trade_state")

    if trade_state != "SUCCESS":
        return {"code": "SUCCESS", "message": ""}   # 非成功状态直接忽略

    # 幂等检查：已处理过则不重复结算
    existing = await get_order_by_payment_no(transaction_id)
    if existing:
        return {"code": "SUCCESS", "message": ""}

    order = await get_order_by_id(out_trade_no)
    if not order or order["status"] != "pending":
        return {"code": "SUCCESS", "message": ""}

    paid_at = datetime.now(timezone.utc).isoformat()
    await update_order_status(
        out_trade_no, "paid",
        payment_no=transaction_id,
        paid_at=paid_at,
    )

    # 后台异步：佣金结算 + AI 报告生成
    background_tasks.add_task(
        settle_after_payment, out_trade_no, order["user_id"], float(order["amount"])
    )
    background_tasks.add_task(
        generate_report_background,
        out_trade_no,
        order["category"],
        order["input_content"],
    )

    return {"code": "SUCCESS", "message": ""}


@router.post("/alipay")
async def alipay_notify(request: Request, background_tasks: BackgroundTasks):
    """
    支付宝异步通知（application/x-www-form-urlencoded）
    """
    form = await request.form()
    params = dict(form)

    try:
        verified = await verify_alipay_callback(params)
    except Exception as e:
        logger.error(f"Alipay callback verify failed: {e}")
        return PlainTextResponse("fail")

    if not verified:
        return PlainTextResponse("fail")

    trade_status = params.get("trade_status", "")
    out_trade_no = params.get("out_trade_no", "")
    trade_no = params.get("trade_no", "")   # 支付宝流水号

    if trade_status not in ("TRADE_SUCCESS", "TRADE_FINISHED"):
        return PlainTextResponse("success")

    # 幂等检查
    existing = await get_order_by_payment_no(trade_no)
    if existing:
        return PlainTextResponse("success")

    order = await get_order_by_id(out_trade_no)
    if not order or order["status"] != "pending":
        return PlainTextResponse("success")

    paid_at = datetime.now(timezone.utc).isoformat()
    await update_order_status(
        out_trade_no, "paid",
        payment_no=trade_no,
        paid_at=paid_at,
    )

    background_tasks.add_task(
        settle_after_payment, out_trade_no, order["user_id"], float(order["amount"])
    )
    background_tasks.add_task(
        generate_report_background,
        out_trade_no,
        order["category"],
        order["input_content"],
    )

    return PlainTextResponse("success")
