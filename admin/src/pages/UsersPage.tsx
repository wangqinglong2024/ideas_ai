import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Tag, Button, Modal, message, Typography, Descriptions } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getUsers, getUserDetail, freezeUser, unfreezeUser } from '../api/admin'

const { Title } = Typography

export default function UsersPage() {
  const [page, setPage] = useState(1)
  const [detailUser, setDetailUser] = useState<any>(null)
  const qc = useQueryClient()

  const { data, isFetching } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => getUsers(page).then((r) => r.data.data),
  })

  const freezeMutation = useMutation({
    mutationFn: (id: string) => freezeUser(id),
    onSuccess: () => { message.success('已冻结'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
  })

  const unfreezeMutation = useMutation({
    mutationFn: (id: string) => unfreezeUser(id),
    onSuccess: () => { message.success('已解封'); qc.invalidateQueries({ queryKey: ['admin-users'] }) },
  })

  const columns: ColumnsType<any> = [
    { title: '手机号', dataIndex: 'phone' },
    { title: '邀请码', dataIndex: 'invite_code' },
    {
      title: '状态',
      dataIndex: 'is_frozen',
      render: (v) => v ? <Tag color="error">已冻结</Tag> : <Tag color="success">正常</Tag>,
    },
    { title: '注册时间', dataIndex: 'created_at', render: (v) => v?.slice(0, 10) },
    {
      title: '操作',
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8 }}>
          <Button size="small" onClick={() => getUserDetail(r.id).then((res) => setDetailUser(res.data.data))}>
            详情
          </Button>
          {r.is_frozen ? (
            <Button size="small" onClick={() => unfreezeMutation.mutate(r.id)}>解封</Button>
          ) : (
            <Button size="small" danger onClick={() =>
              Modal.confirm({ title: '确认冻结该用户？', onOk: () => freezeMutation.mutate(r.id) })
            }>冻结</Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>用户管理</Title>
      <Table
        columns={columns}
        dataSource={data?.users || []}
        rowKey="id"
        loading={isFetching}
        pagination={{ current: page, total: data?.total || 0, pageSize: 20, onChange: setPage }}
      />

      <Modal
        title="用户详情"
        open={!!detailUser}
        onCancel={() => setDetailUser(null)}
        footer={null}
        width={560}
      >
        {detailUser && (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="手机号">{detailUser.user?.phone}</Descriptions.Item>
            <Descriptions.Item label="邀请码">{detailUser.user?.invite_code}</Descriptions.Item>
            <Descriptions.Item label="订单数">{detailUser.order_count}</Descriptions.Item>
            <Descriptions.Item label="可提现余额">¥{Number(detailUser.wallet?.balance || 0).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="累计佣金">¥{Number(detailUser.wallet?.total_earned || 0).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="已提现">¥{Number(detailUser.wallet?.total_withdrawn || 0).toFixed(2)}</Descriptions.Item>
            <Descriptions.Item label="注册时间">{detailUser.user?.created_at?.slice(0, 16)}</Descriptions.Item>
          </Descriptions>
        )}
      </Modal>
    </div>
  )
}
