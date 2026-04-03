"""
频率限制中间件（进程内字典，MVP 单容器适用）
- SMS：同一手机号 60 秒内只允许发送 1 次
- Admin 登录：同一 IP 每分钟最多 5 次，超限锁定 60 秒
"""
import time
from collections import defaultdict
from fastapi import HTTPException, Request

# {phone: last_send_timestamp}
_sms_cooldown: dict[str, float] = defaultdict(float)
SMS_COOLDOWN_SECONDS = 60

# {ip: (attempt_count, window_start_timestamp)}
_admin_login_attempts: dict[str, tuple[int, float]] = defaultdict(lambda: (0, 0.0))
ADMIN_MAX_ATTEMPTS = 5
ADMIN_WINDOW_SECONDS = 60


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


def check_admin_login_rate_limit(request: Request) -> None:
    """
    按客户端 IP 限制管理员登录尝试次数
    同一 IP 每分钟最多 5 次，超限返回 429
    """
    # 优先使用网关透传的真实 IP，无法获取时降级为 "unknown"
    ip = (
        request.headers.get("x-real-ip")
        or (request.client.host if request.client else None)
        or "unknown"
    )
    now = time.time()
    count, window_start = _admin_login_attempts[ip]

    # 超出时间窗口则重置
    if now - window_start > ADMIN_WINDOW_SECONDS:
        _admin_login_attempts[ip] = (1, now)
        return

    if count >= ADMIN_MAX_ATTEMPTS:
        remaining = int(ADMIN_WINDOW_SECONDS - (now - window_start))
        raise HTTPException(
            status_code=429,
            detail=f"登录尝试过多，请 {remaining} 秒后再试",
        )

    _admin_login_attempts[ip] = (count + 1, window_start)
