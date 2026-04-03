"""
管理端提现审核：列表、通过、拒绝、确认打款
"""
from fastapi import APIRouter, Depends, HTTPException
from dependencies import get_admin
from db.client import get_admin_client
from db.queries.withdrawals import get_withdrawal_by_id, update_withdrawal_status
from models.withdrawal import AdminWithdrawalAction
from models.common import ok

router = APIRouter(prefix="/admin/withdrawals", tags=["admin-withdrawals"])


@router.get("")
async def list_withdrawals(
    page: int = 1,
    page_size: int = 20,
    status: str = "pending",
    _: None = Depends(get_admin),
):
    """提现列表（默认 pending）"""
    offset = (page - 1) * page_size
    query = (
        get_admin_client().table("withdrawals")
        .select("id,user_id,amount,payee_name,payee_account,payee_method,status,admin_note,created_at")
        .order("created_at", desc=True)
        .range(offset, offset + page_size - 1)
    )
    if status:
        query = query.eq("status", status)
    result = await query.execute()

    count_q = get_admin_client().table("withdrawals").select("id", count="exact")
    if status:
        count_q = count_q.eq("status", status)
    count_result = await count_q.execute()
    total = count_result.count or 0

    return ok(data={"withdrawals": result.data or [], "total": total, "page": page})


@router.post("/{withdrawal_id}/approve")
async def approve_withdrawal(
    withdrawal_id: str,
    body: AdminWithdrawalAction,
    _: None = Depends(get_admin),
):
    """审核通过（等待打款）"""
    w = await get_withdrawal_by_id(withdrawal_id)
    if not w or w["status"] != "pending":
        raise HTTPException(status_code=400, detail="状态不可操作")
    await update_withdrawal_status(withdrawal_id, "approved", body.admin_note)
    return ok(message="已通过，请尽快打款")


@router.post("/{withdrawal_id}/reject")
async def reject_withdrawal(
    withdrawal_id: str,
    body: AdminWithdrawalAction,
    _: None = Depends(get_admin),
):
    """
    审核拒绝：将余额退还给用户
    """
    w = await get_withdrawal_by_id(withdrawal_id)
    if not w or w["status"] != "pending":
        raise HTTPException(status_code=400, detail="状态不可操作")

    # 退还余额
    await get_admin_client().rpc(
        "refund_wallet_balance",
        {"p_user_id": w["user_id"], "p_amount": float(w["amount"])},
    ).execute()

    await update_withdrawal_status(withdrawal_id, "rejected", body.admin_note)
    return ok(message="已拒绝，余额已退还")


@router.post("/{withdrawal_id}/confirm-paid")
async def confirm_paid(withdrawal_id: str, _: None = Depends(get_admin)):
    """
    确认已打款：更新状态为 paid，累加 total_withdrawn
    """
    w = await get_withdrawal_by_id(withdrawal_id)
    if not w or w["status"] != "approved":
        raise HTTPException(status_code=400, detail="状态不可操作")

    # 累加 total_withdrawn
    await get_admin_client().rpc(
        "confirm_withdrawal_paid",
        {"p_user_id": w["user_id"], "p_amount": float(w["amount"])},
    ).execute()

    await update_withdrawal_status(withdrawal_id, "paid")
    return ok(message="已确认打款完成")
