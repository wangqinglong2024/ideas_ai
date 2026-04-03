import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Select,
  Space,
  Button,
  Tag,
  Typography,
  Modal,
  message,
  Drawer,
  Descriptions,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { listOrders, refundOrder, getOrder } from '../api/orders';

const { Title, Text } = Typography;

/** 订单状态标签颜色 */
const STATUS_COLORS: Record<string, string> = {
  pending: 'default',
  paid: 'blue',
  generating: 'processing',
  completed: 'success',
  failed: 'error',
  expired: 'default',
  refunded: 'warning',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  generating: '生成中',
  completed: '已完成',
  failed: '失败',
  expired: '已过期',
  refunded: '已退款',
};

const CATEGORY_LABELS: Record<string, string> = {
  career: '职场困境',
  emotion: '情感困境',
};

/** 订单管理页 */
export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () => listOrders({ page, page_size: 20, status: statusFilter || undefined }),
  });

  const { data: detailRes, isLoading: detailLoading } = useQuery({
    queryKey: ['admin-order-detail', detailId],
    queryFn: () => getOrder(detailId!),
    enabled: !!detailId,
  });

  const refundMutation = useMutation({
    mutationFn: (id: string) => refundOrder(id),
    onSuccess: () => {
      message.success('退款标记成功');
      qc.invalidateQueries({ queryKey: ['admin-orders'] });
    },
    onError: (e: any) => message.error(e.response?.data?.message || '退款失败'),
  });

  const handleRefund = (id: string) => {
    Modal.confirm({
      title: '确认退款',
      content: '将订单标记为退款状态，实际退款请通过支付平台处理。确定继续吗？',
      okText: '确认退款',
      okButtonProps: { danger: true },
      onOk: () => refundMutation.mutate(id),
    });
  };

  const orders = data?.data?.data?.orders || [];
  const total = data?.data?.data?.total || 0;
  const detail = detailRes?.data?.data;

  const columns: ColumnsType<any> = [
    {
      title: '订单ID',
      dataIndex: 'id',
      width: 120,
      render: (id: string) => (
        <Button type="link" size="small" onClick={() => setDetailId(id)}>
          {id.slice(0, 8)}...
        </Button>
      ),
    },
    {
      title: '类目',
      dataIndex: 'category',
      width: 100,
      render: (v: string) => CATEGORY_LABELS[v] || v,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 100,
      render: (v: string) => (
        <Tag color={STATUS_COLORS[v]}>{STATUS_LABELS[v] || v}</Tag>
      ),
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 90,
      render: (v: number) => `¥${Number(v).toFixed(2)}`,
    },
    {
      title: '支付时间',
      dataIndex: 'paid_at',
      width: 160,
      render: (v: string) => v ? dayjs(v).format('MM-DD HH:mm') : '-',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      width: 160,
      render: (v: string) => dayjs(v).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 80,
      render: (record: any) => (
        <Button
          size="small"
          danger
          disabled={!['paid', 'completed'].includes(record.status)}
          onClick={() => handleRefund(record.id)}
        >
          退款
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>订单管理</Title>

      {/* 状态筛选 */}
      <Space style={{ marginBottom: 16 }}>
        <Text>状态筛选：</Text>
        <Select
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1); }}
          style={{ width: 140 }}
          options={[
            { value: '', label: '全部' },
            { value: 'pending', label: '待支付' },
            { value: 'paid', label: '已支付' },
            { value: 'generating', label: '生成中' },
            { value: 'completed', label: '已完成' },
            { value: 'failed', label: '失败' },
            { value: 'refunded', label: '已退款' },
          ]}
        />
      </Space>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={orders}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          showSizeChanger: false,
          showTotal: (t) => `共 ${t} 条`,
          onChange: setPage,
        }}
        scroll={{ x: 900 }}
      />

      {/* 订单详情 Drawer */}
      <Drawer
        title="订单详情"
        open={!!detailId}
        onClose={() => setDetailId(null)}
        width={480}
      >
        {detailLoading ? (
          <Text>加载中...</Text>
        ) : detail ? (
          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="订单ID">{detail.id}</Descriptions.Item>
            <Descriptions.Item label="用户ID">{detail.user_id}</Descriptions.Item>
            <Descriptions.Item label="类目">{CATEGORY_LABELS[detail.category] || detail.category}</Descriptions.Item>
            <Descriptions.Item label="状态">
              <Tag color={STATUS_COLORS[detail.status]}>{STATUS_LABELS[detail.status]}</Tag>
            </Descriptions.Item>
            <Descriptions.Item label="金额">¥{Number(detail.amount).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="困境描述">
              <div style={{ maxHeight: 120, overflow: 'auto', whiteSpace: 'pre-wrap' }}>
                {detail.input_content}
              </div>
            </Descriptions.Item>
            {detail.report && (
              <Descriptions.Item label="报告摘要">
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {detail.report?.core_issue?.slice(0, 100)}...
                </Text>
              </Descriptions.Item>
            )}
            <Descriptions.Item label="创建时间">
              {dayjs(detail.created_at).format('YYYY-MM-DD HH:mm')}
            </Descriptions.Item>
          </Descriptions>
        ) : null}
      </Drawer>
    </div>
  );
}
