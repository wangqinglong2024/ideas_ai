"""
佣金和钱包路由
"""
from fastapi import APIRouter, Depends
from dependencies import get_current_user
from db.queries.commissions import get_wallet_by_user, get_commissions_by_user
from models.common import ok

router = APIRouter(prefix="/commissions", tags=["commissions"])


@router.get("/balance")
async def get_balance(user_id: str = Depends(get_current_user)):
    """查询钱包余额和佣金统计"""
    wallet = await get_wallet_by_user(user_id)
    if not wallet:
        wallet = {"balance": 0.0, "total_earned": 0.0, "total_withdrawn": 0.0}

    commissions = await get_commissions_by_user(user_id, page=1, page_size=20)
    return ok(data={"wallet": wallet, "recent_commissions": commissions})
