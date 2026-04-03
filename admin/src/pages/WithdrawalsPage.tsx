import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Table, Tag, Button, Select, Modal, Input, message, Typography } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { getWithdrawals, approveWithdrawal, rejectWithdrawal, confirmPaid } from '../api/admin'

const { Title } = Typography

const STATUS_COLOR: Record<string, string> = {
  pending: 'processing',
  approved: 'warning',
  rejected: 'default',
  paid: 'success',
}

export default function WithdrawalsPage() {
  const [page, setPage] = useState(1)
  const [statusFilter, setStatusFilter] = useState('pending')
  const [noteModal, setNoteModal] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null)
  const [adminNote, setAdminNote] = useState('')
  const qc = useQueryClient()

  const { data, isFetching } = useQuery({
    queryKey: ['admin-withdrawals', page, statusFilter],
    queryFn: () => getWithdrawals(page, statusFilter).then((r) => r.data.data),
  })

  const approveMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => approveWithdrawal(id, note),
    onSuccess: () => { message.success('已通过'); qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }) },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  })

  const rejectMutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => rejectWithdrawal(id, note),
    onSuccess: () => { message.success('已拒绝'); qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }) },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  })

  const paidMutation = useMutation({
    mutationFn: (id: string) => confirmPaid(id),
    onSuccess: () => { message.success('已确认打款'); qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }) },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  })

  const columns: ColumnsType<any> = [
    { title: '申请人', dataIndex: 'user_id', render: (v) => v.slice(0, 8) + '...' },
    { title: '金额', dataIndex: 'amount', render: (v) => `¥${Number(v).toFixed(2)}` },
    { title: '收款方式', dataIndex: 'payee_method', render: (v) => v === 'wechat' ? '微信' : '支付宝' },
    { title: '收款账号', dataIndex: 'payee_account' },
    { title: '收款人', dataIndex: 'payee_name' },
    {
      title: '状态',
      dataIndex: 'status',
      render: (v) => (
        <Tag color={STATUS_COLOR[v]}>
          {{ pending: '待审核', approved: '已通过', rejected: '已拒绝', paid: '已打款' }[v] || v}
        </Tag>
      ),
    },
    { title: '申请时间', dataIndex: 'created_at', render: (v) => v?.slice(0, 16) },
    {
      title: '操作',
      render: (_, r) => (
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {r.status === 'pending' && (
            <>
              <Button size="small" type="primary" onClick={() => { setNoteModal({ id: r.id, action: 'approve' }); setAdminNote('') }}>通过</Button>
              <Button size="small" danger onClick={() => { setNoteModal({ id: r.id, action: 'reject' }); setAdminNote('') }}>拒绝</Button>
            </>
          )}
          {r.status === 'approved' && (
            <Button size="small" type="primary" onClick={() =>
              Modal.confirm({ title: '确认已完成打款？', onOk: () => paidMutation.mutate(r.id) })
            }>
              确认打款
            </Button>
          )}
        </div>
      ),
    },
  ]

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
        <Title level={4} style={{ margin: 0 }}>提现管理</Title>
        <Select
          style={{ width: 140 }}
          value={statusFilter}
          onChange={(v) => { setStatusFilter(v); setPage(1) }}
          options={[
            { value: 'pending', label: '待审核' },
            { value: 'approved', label: '已通过' },
            { value: 'rejected', label: '已拒绝' },
            { value: 'paid', label: '已打款' },
            { value: '', label: '全部' },
          ]}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data?.withdrawals || []}
        rowKey="id"
        loading={isFetching}
        pagination={{ current: page, total: data?.total || 0, pageSize: 20, onChange: setPage }}
      />

      <Modal
        title={noteModal?.action === 'approve' ? '审核通过' : '拒绝提现'}
        open={!!noteModal}
        onCancel={() => setNoteModal(null)}
        onOk={() => {
          if (!noteModal) return
          if (noteModal.action === 'approve') {
            approveMutation.mutate({ id: noteModal.id, note: adminNote })
          } else {
            if (!adminNote.trim()) { message.warning('请填写拒绝原因'); return }
            rejectMutation.mutate({ id: noteModal.id, note: adminNote })
          }
          setNoteModal(null)
        }}
      >
        <Input.TextArea
          placeholder={noteModal?.action === 'approve' ? '备注（选填）' : '拒绝原因（必填）'}
          value={adminNote}
          onChange={(e) => setAdminNote(e.target.value)}
          rows={3}
        />
      </Modal>
    </div>
  )
}
