"""
管理端系统配置：价格、佣金比例、AI 成本系数、公告
"""
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from typing import Optional
from dependencies import get_admin
from db.client import admin_client
from models.common import ok

router = APIRouter(prefix="/admin/settings", tags=["admin-settings"])


class SettingsUpdateRequest(BaseModel):
    order_price: Optional[float] = None
    commission_ratio: Optional[float] = None
    min_withdraw_amount: Optional[float] = None
    ai_cost_per_call: Optional[float] = None
    announcement: Optional[str] = None


@router.get("")
async def get_settings(_: None = Depends(get_admin)):
    """获取当前系统配置"""
    result = await admin_client.table("settings").select("*").eq("id", 1).single().execute()
    return ok(data=result.data)


@router.put("")
async def update_settings(req: SettingsUpdateRequest, _: None = Depends(get_admin)):
    """更新系统配置（只更新非 None 字段）"""
    update_data = {k: v for k, v in req.model_dump().items() if v is not None}
    if not update_data:
        return ok(message="无需更新")

    await admin_client.table("settings").update(update_data).eq("id", 1).execute()
    return ok(message="配置已更新")
