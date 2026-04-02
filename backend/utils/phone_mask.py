"""
手机号脱敏：138****8888
"""


def mask_phone(phone: str) -> str:
    """将 11 位手机号中间 4 位替换为 ****"""
    if len(phone) == 11:
        return phone[:3] + "****" + phone[7:]
    return phone
