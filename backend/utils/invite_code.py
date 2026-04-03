"""
6 位邀请码生成工具：字母（大写）+ 数字混合，唯一性由数据库 UNIQUE 约束保证
"""
import random
import string

_CHARS = string.ascii_uppercase + string.digits  # A-Z + 0-9，共 36 个字符


def generate_invite_code() -> str:
    """生成 6 位随机邀请码，例如 A3K9MX"""
    return "".join(random.choices(_CHARS, k=6))
