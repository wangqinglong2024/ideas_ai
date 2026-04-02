"""
短信频率限制（进程内字典，MVP 单容器适用）
同一手机号 60 秒内只允许发送 1 次
"""
import time
from collections import defaultdict
from fastapi import HTTPException

# {phone: last_send_timestamp}
_sms_cooldown: dict[str, float] = defaultdict(float)
SMS_COOLDOWN_SECONDS = 60


def check_sms_rate_limit(phone: str) -> None:
    """检查手机号是否在冷却期内，是则抛 429"""
    now = time.time()
    last_sent = _sms_cooldown[phone]
    if now - last_sent < SMS_COOLDOWN_SECONDS:
        remaining = int(SMS_COOLDOWN_SECONDS - (now - last_sent))
        raise HTTPException(
            status_code=429,
            detail=f"发送太频繁，请 {remaining} 秒后重试",
        )
    _sms_cooldown[phone] = now
