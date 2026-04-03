"""
提现路由：申请提现 + 查询记录
"""
from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_current_user
from db.queries.withdrawals import create_withdrawal, get_withdrawals_by_user
from db.queries.commissions import get_wallet_by_user
from models.withdrawal import WithdrawalApplyRequest
from models.common import ok

router = APIRouter(prefix="/withdrawals", tags=["withdrawals"])


@router.post("/apply")
async def apply_withdrawal(
    req: WithdrawalApplyRequest,
    user_id: str = Depends(get_current_user),
):
    """
    申请提现
    1. 校验余额是否充足
    2. 创建提现记录（同时扣除余额进入冻结）
    """
    wallet = await get_wallet_by_user(user_id)
    if not wallet or float(wallet["balance"]) < req.amount:
        raise HTTPException(status_code=400, detail="余额不足")

    try:
        withdrawal = await create_withdrawal(
            user_id=user_id,
            amount=req.amount,
            payee_name=req.payee_name,
            payee_account=req.payee_account,
            payee_method=req.payee_method,
        )
    except Exception as e:
        raise HTTPException(status_code=400, detail="提现申请失败，请确认余额是否充足")

    return ok(data={"withdrawal_id": withdrawal["id"]}, message="提现申请已提交")


@router.get("/my")
async def my_withdrawals(
    page: int = 1,
    user_id: str = Depends(get_current_user),
):
    """查询用户提现记录"""
    records = await get_withdrawals_by_user(user_id, page=page)
    return ok(data={"withdrawals": records, "page": page})
