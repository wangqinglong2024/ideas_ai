"""
用户 Pydantic v2 模型
"""
from typing import Optional
from pydantic import BaseModel, field_validator
import re


class SendSmsRequest(BaseModel):
    phone: str

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not re.match(r"^1[3-9]\d{9}$", v):
            raise ValueError("手机号格式不正确")
        return v


class LoginRequest(BaseModel):
    phone: str
    code: str
    invite_code: Optional[str] = None  # 注册时携带邀请人邀请码

    @field_validator("phone")
    @classmethod
    def validate_phone(cls, v: str) -> str:
        if not re.match(r"^1[3-9]\d{9}$", v):
            raise ValueError("手机号格式不正确")
        return v

    @field_validator("code")
    @classmethod
    def validate_code(cls, v: str) -> str:
        if not re.match(r"^\d{6}$", v):
            raise ValueError("验证码格式不正确")
        return v


class WechatLoginRequest(BaseModel):
    code: str                          # 微信 JS SDK 换取的 code
    invite_code: Optional[str] = None


class UserProfile(BaseModel):
    id: str
    phone_masked: str                  # 脱敏手机号 138****8888
    invite_code: str
    created_at: str
