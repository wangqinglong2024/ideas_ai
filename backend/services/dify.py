"""
Dify AI 工作流调用服务
使用 httpx 全异步，超时由 settings.dify_workflow_timeout 控制
"""
import logging
import httpx
from config import settings

logger = logging.getLogger(__name__)


async def run_report_workflow(
    category: str,
    input_content: str,
    order_id: str,
) -> dict:
    """
    调用 Dify 工作流生成认知分析报告
    返回结构化 JSON（由 Dify workflow 输出）
    超时或失败抛 RuntimeError
    """
    url = f"{settings.dify_api_url}/workflows/run"
    headers = {
        "Authorization": f"Bearer {settings.dify_api_key}",
        "Content-Type": "application/json",
    }
    payload = {
        "inputs": {
            "category": category,          # career | emotion
            "content": input_content,      # 用户填写的困境
        },
        "response_mode": "blocking",       # 同步等待结果
        "user": order_id,                  # 用 order_id 作为 user 标识，方便 Dify 追踪
    }

    async with httpx.AsyncClient(timeout=settings.dify_workflow_timeout) as client:
        try:
            resp = await client.post(url, json=payload, headers=headers)
            resp.raise_for_status()
            result = resp.json()
            # Dify 工作流输出在 outputs 字段
            return result.get("data", {}).get("outputs", {})
        except httpx.TimeoutException:
            logger.error(f"Dify timeout for order {order_id}")
            raise RuntimeError("AI 生成超时，请稍后重试")
        except httpx.HTTPStatusError as e:
            logger.error(f"Dify error {e.response.status_code} for order {order_id}: {e.response.text}")
            raise RuntimeError("AI 服务异常")
