"""
支付服务：微信支付 H5(MWEB) + 支付宝 H5
"""
import logging
from config import settings

logger = logging.getLogger(__name__)


async def create_wechat_pay(
    order_id: str,
    amount_fen: int,          # 金额（分）
    description: str,
    client_ip: str,
) -> str:
    """
    创建微信支付 H5 订单，返回 mweb_url（MWEB 场景）
    """
    from wechatpayv3 import WeChatPay, WeChatPayType
    import os

    private_key = open(settings.wechat_pay_private_key_path).read()

    wxpay = WeChatPay(
        wechatpay_type=WeChatPayType.H5,
        mchid=settings.wechat_pay_mchid,
        private_key=private_key,
        cert_serial_no=settings.wechat_pay_serial_no,
        apiv3_key=settings.wechat_pay_api_v3_key,
        appid=settings.wechat_pay_appid,
        notify_url=settings.wechat_pay_notify_url,
    )

    result = wxpay.pay(
        description=description,
        out_trade_no=order_id,
        amount={"total": amount_fen, "currency": "CNY"},
        payer_client_ip=client_ip,
        h5_info={"type": "Wap", "app_name": "内观", "app_url": settings.app_base_url},
    )

    if result and result.get("mweb_url"):
        return result["mweb_url"]
    raise RuntimeError(f"微信支付下单失败: {result}")


async def create_alipay(order_id: str, amount: float, subject: str, return_url: str) -> str:
    """
    创建支付宝 H5 支付，返回支付页面 HTML 字符串（前端直接 POST 表单跳转）
    """
    from alipay import AliPay

    alipay = AliPay(
        appid=settings.alipay_app_id,
        app_notify_url=settings.alipay_notify_url,
        app_private_key_string=settings.alipay_private_key,
        alipay_public_key_string=settings.alipay_public_key,
        sign_type="RSA2",
        debug=settings.app_env == "development",
    )

    pay_url = alipay.api_alipay_trade_wap_pay(
        out_trade_no=order_id,
        total_amount=str(amount),
        subject=subject,
        return_url=return_url.replace("{order_id}", order_id),
        notify_url=settings.alipay_notify_url,
    )
    return f"https://openapi.alipay.com/gateway.do?{pay_url}"


async def verify_wechat_callback(headers: dict, body: bytes) -> dict:
    """
    验证微信支付回调签名并解密通知数据
    返回解密后的订单信息
    """
    from wechatpayv3 import WeChatPay, WeChatPayType

    private_key = open(settings.wechat_pay_private_key_path).read()
    wxpay = WeChatPay(
        wechatpay_type=WeChatPayType.H5,
        mchid=settings.wechat_pay_mchid,
        private_key=private_key,
        cert_serial_no=settings.wechat_pay_serial_no,
        apiv3_key=settings.wechat_pay_api_v3_key,
        appid=settings.wechat_pay_appid,
    )
    return wxpay.decrypt_callback(headers, body)


async def verify_alipay_callback(params: dict) -> bool:
    """验证支付宝异步通知签名"""
    from alipay import AliPay

    alipay = AliPay(
        appid=settings.alipay_app_id,
        app_notify_url=settings.alipay_notify_url,
        app_private_key_string=settings.alipay_private_key,
        alipay_public_key_string=settings.alipay_public_key,
        sign_type="RSA2",
        debug=settings.app_env == "development",
    )
    sign = params.pop("sign", None)
    return alipay.verify(params, sign)
