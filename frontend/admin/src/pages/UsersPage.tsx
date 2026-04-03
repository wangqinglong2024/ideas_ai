import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Table,
  Button,
  Tag,
  Typography,
  Modal,
  Drawer,
  Descriptions,
  Space,
  message,
  Statistic,
  Row,
  Col,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs from 'dayjs';
import { listUsers, getUser, freezeUser, unfreezeUser } from '../api/users';

const { Title, Text } = Typography;

/** 用户管理页 */
export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [detailId, setDetailId] = useState<string | null>(null);
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-users', page],
    queryFn: () => listUsers({ page }),
  });

  const { data: detailRes, isLoading: detailLoading } = useQuery({
    queryKey: ['admin-user-detail', detailId],
    queryFn: () => getUser(detailId!),
    enabled: !!detailId,
  });

  const freezeMut = useMutation({
    mutationFn: (id: string) => freezeUser(id),
    onSuccess: () => { message.success('用户已冻结'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  });

  const unfreezeMut = useMutation({
    mutationFn: (id: string) => unfreezeUser(id),
    onSuccess: () => { message.success('用户已解封'); qc.invalidateQueries({ queryKey: ['admin-users'] }); },
    onError: (e: any) => message.error(e.response?.data?.message || '操作失败'),
  });

  const handleFreeze = (id: string, frozen: boolean) => {
    const action = frozen ? '解封' : '冻结';
    Modal.confirm({
      title: `确认${action}用户`,
      content: `确定要${action}该用户账号吗？`,
      okText: `确认${action}`,
      okButtonProps: { danger: !frozen },
      onOk: () => frozen ? unfreezeMut.mutate(id) : freezeMut.mutate(id),
    });
  };

  const users = data?.data?.data?.users || [];
  const total = data?.data?.data?.total || 0;
  const detail = detailRes?.data?.data;

  const columns: ColumnsType<any> = [
    {
      title: '手机号',
      dataIndex: 'phone',
      width: 140,
      render: (v: string) => v || '-',
    },
    {
      title: '邀请码',
      dataIndex: 'invite_code',
      width: 100,
    },
    {
      title: '邀请人ID',
      dataIndex: 'invited_by',
      width: 120,
      render: (v: string) => v ? v.slice(0, 8) + '...' : '-',
    },
    {
      title: '状态',
      dataIndex: 'is_frozen',
      width: 80,
      render: (v: boolean) => (
        <Tag color={v ? 'error' : 'success'}>{v ? '已冻结' : '正常'}</Tag>
      ),
    },
    {
      title: '注册时间',
      dataIndex: 'created_at',
      width: 140,
      render: (v: string) => dayjs(v).format('MM-DD HH:mm'),
    },
    {
      title: '操作',
      width: 140,
      render: (record: any) => (
        <Space size="small">
          <Button size="small" onClick={() => setDetailId(record.id)}>详情</Button>
          <Button
            size="small"
            danger={!record.is_frozen}
            type={record.is_frozen ? 'default' : undefined}
            onClick={() => handleFreeze(record.id, record.is_frozen)}
          >
            {record.is_frozen ? '解封' : '冻结'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>用户管理</Title>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={users}
        loading={isLoading}
        pagination={{
          current: page,
          pageSize: 20,
          total,
          showSizeChanger: false,
          showTotal: (t) => `共 ${t} 条`,
          onChange: setPage,
        }}
        scroll={{ x: 800 }}
      />

      {/* 用户详情 Drawer */}
      <Drawer
        title="用户详情"
        open={!!detailId}
        onClose={() => setDetailId(null)}
        width={400}
      >
        {detailLoading ? (
          <Text>加载中...</Text>
        ) : detail ? (
          <>
            <Row gutter={16} style={{ marginBottom: 24 }}>
              <Col span={12}>
                <Statistic
                  title="可提现余额"
                  value={detail.wallet?.balance ?? 0}
                  precision={2}
                  prefix="¥"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="历史订单数"
                  value={detail.order_count ?? 0}
                />
              </Col>
            </Row>
            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="用户ID">{detail.user?.id}</Descriptions.Item>
              <Descriptions.Item label="手机号">{detail.user?.phone || '-'}</Descriptions.Item>
              <Descriptions.Item label="邀请码">{detail.user?.invite_code}</Descriptions.Item>
              <Descriptions.Item label="账号状态">
                <Tag color={detail.user?.is_frozen ? 'error' : 'success'}>
                  {detail.user?.is_frozen ? '已冻结' : '正常'}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="累计收益">
                ¥{Number(detail.wallet?.total_earned ?? 0).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="已提现">
                ¥{Number(detail.wallet?.total_withdrawn ?? 0).toFixed(2)}
              </Descriptions.Item>
              <Descriptions.Item label="注册时间">
                {detail.user?.created_at ? dayjs(detail.user.created_at).format('YYYY-MM-DD HH:mm') : '-'}
              </Descriptions.Item>
            </Descriptions>
          </>
        ) : null}
      </Drawer>
    </div>
  );
}
