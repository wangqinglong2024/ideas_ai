"""
应用配置：从环境变量读取所有参数，pydantic-settings 自动校验类型
"""
from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # Supabase
    supabase_url: str
    supabase_anon_key: str
    supabase_service_role_key: str
    supabase_jwt_secret: str

    # Admin 认证（独立，与 Supabase 隔离）
    admin_username: str = "admin"
    admin_password_hash: str
    admin_jwt_secret: str

    # 微信支付
    wechat_pay_mchid: str = ""
    wechat_pay_appid: str = ""
    wechat_pay_api_v3_key: str = ""
    wechat_pay_serial_no: str = ""
    wechat_pay_private_key_path: str = "/app/certs/apiclient_key.pem"

    # 支付宝
    alipay_app_id: str = ""
    alipay_private_key: str = ""
    alipay_public_key: str = ""

    # 短信服务
    sms_provider: str = "aliyun"
    aliyun_access_key_id: str = ""
    aliyun_access_key_secret: str = ""
    aliyun_sms_sign_name: str = "内观"
    aliyun_sms_template_code: str = ""

    # Dify AI
    dify_api_url: str = "https://api.dify.ai/v1"
    dify_api_key: str = ""
    dify_workflow_timeout: int = 60

    # 应用
    app_env: str = "production"
    app_base_url: str = "https://ideas.top"
    wechat_pay_notify_url: str = ""
    alipay_notify_url: str = ""
    alipay_return_url: str = ""

    # CORS（逗号分隔的允许来源列表）
    cors_origins: str = "http://localhost:5173,http://localhost:5174"

    class Config:
        env_file = ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    """单例缓存，避免重复读取环境变量"""
    return Settings()


settings = get_settings()
