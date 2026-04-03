"""
订单 Pydantic v2 模型
"""
from typing import Optional, Literal
from pydantic import BaseModel, field_validator


class CreateOrderRequest(BaseModel):
    category: Literal["career", "emotion"]
    input_content: str

    @field_validator("input_content")
    @classmethod
    def validate_content(cls, v: str) -> str:
        v = v.strip()
        if len(v) < 20:
            raise ValueError("描述内容至少 20 个字符")
        if len(v) > 2000:
            raise ValueError("描述内容最多 2000 个字符")
        return v


class CreateOrderResponse(BaseModel):
    order_id: str
    pay_url: str               # 微信 MWEB 跳转 URL 或支付宝 H5 URL
    pay_type: str              # wechat_mweb | wechat_jsapi | alipay


class OrderStatusResponse(BaseModel):
    order_id: str
    status: str
    report: Optional[dict] = None   # completed 状态时携带报告


class OrderListItem(BaseModel):
    id: str
    category: str
    status: str
    amount: float
    paid_at: Optional[str]
    created_at: str
