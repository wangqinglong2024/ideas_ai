"""
Supabase 异步客户端初始化
- anon_client：前端权限（受 RLS 约束），用于用户接口
- admin_client：service_role（绕过 RLS），用于管理端 + 支付回调
- 必须在 FastAPI lifespan 中通过 init_clients() 完成初始化
"""
from supabase import acreate_client, AsyncClient
from config import settings

# 模块级别变量，通过 lifespan 初始化，所有查询函数调用前已就绪
anon_client: AsyncClient = None  # type: ignore
admin_client: AsyncClient = None  # type: ignore


async def init_clients() -> None:
    """在 FastAPI lifespan 启动阶段初始化异步 Supabase 客户端"""
    global anon_client, admin_client
    anon_client = await acreate_client(settings.supabase_url, settings.supabase_anon_key)
    admin_client = await acreate_client(settings.supabase_url, settings.supabase_service_role_key)
