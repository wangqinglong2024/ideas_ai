import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Tabs,
  Button,
  Tag,
  Typography,
  Modal,
  Input,
  message,
  Space,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import {
  listWithdrawals,
  approveWithdrawal,
  rejectWithdrawal,
  confirmPaid,
} from '../api/withdrawals';

const { Title, Text } = Typography;
const { TextArea } = Input;

const STATUS_COLORS: Record<string, string> = {
  pending: 'orange',
  approved: 'blue',
  paid: 'success',
  rejected: 'error',
};

const STATUS_LABELS: Record<string, string> = {
  pending: '待审核',
  approved: '待打款',
  paid: '已完成',
  rejected: '已拒绝',
};

/** 提现审核页 */
export default function WithdrawalsPage() {
  const [activeTab, setActiveTab] = useState('pending');
  const [page, setPage] = useState(1);
  const [noteModal, setNoteModal] = useState<{ id: string; action: 'approve' | 'reject' } | null>(null);
  const [noteText, setNoteText] = useState('');
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-withdrawals', activeTab, page],
    queryFn: () => listWithdrawals({ page, page_size: 20, status: activeTab }),
  });

  const approveMut = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => approveWithdrawal(id, note),
    onSuccess: () => { message.success('已通过审核'); qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }); },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  });

  const rejectMut = useMutation({
    mutationFn: ({ id, note }: { id: string; note?: string }) => rejectWithdrawal(id, note),
    onSuccess: () => { message.success('已拒绝，余额已退还'); qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }); },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  });

  const confirmMut = useMutation({
    mutationFn: (id: string) => confirmPaid(id),
    onSuccess: () => { message.success('已确认打款'); qc.invalidateQueries({ queryKey: ['admin-withdrawals'] }); },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  });

  const handleNoteOk = () => {
    if (!noteModal) return;
    if (noteModal.action === 'approve') {
      approveMut.mutate({ id: noteModal.id, note: noteText });
    } else {
      rejectMut.mutate({ id: noteModal.id, note: noteText });
    }
    setNoteModal(null);
    setNoteText('');
  };

  const withdrawals = data?.data?.data?.withdrawals || [];
  const total = data?.data?.data?.total || 0;

  const columns: ColumnsType<any> = [
    {
      title: '申请人ID',
      dataIndex: 'user_id',
      width: 120,
      render: (v: string) => v?.slice(0, 8) + '...',
    },
    {
      title: '金额',
      dataIndex: 'amount',
      width: 90,
      render: (v: number) => <Text strong>¥{Number(v).toFixed(2)}</Text>,
    },
    {
      title: '收款方式',
      dataIndex: 'payee_method',
      width: 90,
    },
    {
      title: '收款账号',
      dataIndex: 'payee_account',
      width: 140,
    },
    {
      title: '收款姓名',
      dataIndex: 'payee_name',
      width: 90,
    },
    {
      title: '状态',
      dataIndex: 'status',
      width: 90,
      render: (v: string) => <Tag color={STATUS_COLORS[v]}>{STATUS_LABELS[v] || v}</Tag>,
    },
    {
      title: '备注',
      dataIndex: 'admin_note',
      width: 120,
      render: (v: string) => v || '-',
    },
    {
      title: '申请时间',
      dataIndex: 'created_at',
      width: 140,
      render: (v: string) => dayjs(v).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 160,
      render: (record: any) => (
        <Space size="small">
          {record.status === 'pending' && (
            <>
              <Button
                size="small"
                type="primary"
                onClick={() => { setNoteModal({ id: record.id, action: 'approve' }); setNoteText(''); }}
              >
                通过
              </Button>
              <Button
                size="small"
                danger
                onClick={() => { setNoteModal({ id: record.id, action: 'reject' }); setNoteText(''); }}
              >
                拒绝
              </Button>
            </>
          )}
          {record.status === 'approved' && (
            <Button
              size="small"
              type="primary"
              ghost
              onClick={() =>
                Modal.confirm({
                  title: '确认已打款',
                  content: `确认已向 ${record.payee_name} 打款 ¥${Number(record.amount).toFixed(2)} 吗？`,
                  onOk: () => confirmMut.mutate(record.id),
                })
              }
            >
              确认打款
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>提现审核</Title>

      <Tabs
        activeKey={activeTab}
        onChange={(k) => { setActiveTab(k); setPage(1); }}
        items={[
          { key: 'pending', label: '待审核' },
          { key: 'approved', label: '待打款' },
          { key: 'paid', label: '已完成' },
          { key: 'rejected', label: '已拒绝' },
        ]}
      />

      <Table
        rowKey="id"
        columns={columns}
        dataSource={withdrawals}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          showSizeChanger: false,
          showTotal: (t) => `共 ${t} 条`,
          onChange: setPage,
        }}
        scroll={{ x: 1000 }}
      />

      {/* 备注弹窗（通过/拒绝） */}
      <Modal
        title={noteModal?.action === 'approve' ? '通过审核' : '拒绝提现'}
        open={!!noteModal}
        onOk={handleNoteOk}
        onCancel={() => setNoteModal(null)}
        okText="确认"
        cancelText="取消"
        okButtonProps={{ danger: noteModal?.action === 'reject' }}
      >
        <TextArea
          rows={3}
          placeholder="备注（可选）"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          style={{ marginTop: 8 }}
        />
      </Modal>
    </div>
  );
}
