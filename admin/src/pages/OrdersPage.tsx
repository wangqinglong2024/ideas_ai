import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Tag, Button, Select, Modal, message, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getOrders, getOrderDetail, refundOrder } from '../api/admin'

const { Title } = Typography

const STATUS_COLOR: Record<string, string> = {
  pending: 'default',
  paid: 'processing',
  generating: 'processing',
  completed: 'success',
  failed: 'error',
  refunded: 'default',
}

const STATUS_LABEL: Record<string, string> = {
  pending: '待支付',
  paid: '已支付',
  generating: '生成中',
  completed: '已完成',
  failed: '生成失败',
  refunded: '已退款',
  expired: '已过期',
}

export default function OrdersPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('')
  const [detailOrder, setDetailOrder] = useState<any>(null)
  const qc = useQueryClient()

  const { data, isFetching } = useQuery({
    queryKey: ['admin-orders', page, statusFilter],
    queryFn: () => getOrders(page, statusFilter).then((r) => r.data.data),
  })

  const refundMutation = useMutation({
    mutationFn: (id: string) => refundOrder(id),
    onSuccess: () => {
      message.success('退款标记成功')
      qc.invalidateQueries({ queryKey: ['admin-orders'] })
    },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  })

  const columns: ColumnsType<any> = [
    { title: '订单ID', dataIndex: 'id', width: 100, render: (v) => v.slice(0, 8) + '...' },
    {
      title: '类目',
      dataIndex: 'category',
      render: (v) => (v === 'career' ? '职场' : '情感'),
    },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v) => <Tag color={STATUS_COLOR[v]}>{STATUS_LABEL[v] || v}</Tag>,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      render: (v) => `¥${Number(v).toFixed(2)}`,
    },
    { title: '支付时间', dataIndex: 'paid_at', render: (v) => v?.slice(0, 16) || '-' },
    { title: '创建时间', dataIndex: 'created_at', render: (v) => v?.slice(0, 16) },
    {
      title: '操作',
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button
            size="small"
            onClick={() =>
              getOrderDetail(r.id).then((res) => setDetailOrder(res.data.data))
            }
          >
            详情
          </Button>
          {['paid', 'completed'].includes(r.status) && (
            <Button
              size="small"
              danger
              onClick={() =>
                Modal.confirm({
                  title: '确认退款？',
                  content: '此操作将订单标记为退款，实际退款请在支付平台操作。',
                  onOk: () => refundMutation.mutate(r.id),
                })
              }
            >
              退款
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>订单管理</Title>
        <Select
          style={{ width: 140 }}
          placeholder="筛选状态"
          allowClear
          value={statusFilter || undefined}
          onChange={(v) => { setStatusFilter(v || ''); setPage(1) }}
          options={Object.entries(STATUS_LABEL).map(([v, l]) => ({ value: v, label: l }))}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data?.orders || []}
        rowKey="id"
        loading={isFetching}
        pagination={{
          current: page,
          total: data?.total || 0,
          pageSize: 20,
          onChange: setPage,
        }}
      />

      <Modal
        title="订单详情"
        open={!!detailOrder}
        onCancel={() => setDetailOrder(null)}
        footer={null}
        width={600}
      >
        {detailOrder && (
          <pre style={{ fontSize: 12, maxHeight: 400, overflow: 'auto' }}>
            {JSON.stringify(detailOrder, null, 2)}
          </pre>
        )}
      </Modal>
    </div>
  )
}
