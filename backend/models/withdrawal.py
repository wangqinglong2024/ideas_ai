"""
提现 Pydantic v2 模型
"""
from typing import Optional, Literal
from pydantic import BaseModel, field_validator


class WithdrawalApplyRequest(BaseModel):
    amount: float
    payee_name: str
    payee_account: str
    payee_method: Literal["wechat", "alipay"]

    @field_validator("amount")
    @classmethod
    def validate_amount(cls, v: float) -> float:
        if v < 50:
            raise ValueError("最低提现金额为 50 元")
        return round(v, 2)

    @field_validator("payee_name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("收款人姓名不能为空")
        return v

    @field_validator("payee_account")
    @classmethod
    def validate_account(cls, v: str) -> str:
        v = v.strip()
        if not v:
            raise ValueError("收款账号不能为空")
        return v


class WithdrawalItem(BaseModel):
    id: str
    amount: float
    payee_method: str
    status: str
    admin_note: Optional[str]
    created_at: str


class AdminWithdrawalAction(BaseModel):
    admin_note: Optional[str] = None
