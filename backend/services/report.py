"""
报告生成服务：作为 BackgroundTask 运行，不阻塞支付响应
"""
import logging
from services.dify import run_report_workflow
from db.queries.orders import update_order_status, update_order_report

logger = logging.getLogger(__name__)


async def generate_report_background(order_id: str, category: str, input_content: str) -> None:
    """
    后台任务：调用 Dify 生成报告
    - 先将状态改为 generating
    - 调用成功后写入报告，状态改为 completed
    - 失败后状态改为 failed（前端可重试）
    """
    await update_order_status(order_id, "generating")
    try:
        report = await run_report_workflow(category, input_content, order_id)
        await update_order_report(order_id, report)
        logger.info(f"Report generated for order {order_id}")
    except Exception as e:
        await update_order_status(order_id, "failed")
        logger.error(f"Report generation failed for order {order_id}: {e}")
