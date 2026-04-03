import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Form,
  InputNumber,
  Input,
  Button,
  Typography,
  Card,
  message,
  Spin,
} from 'antd';
import { getSettings, updateSettings } from '../api/settings';

const { Title, Text } = Typography;
const { TextArea } = Input;

/** 系统设置页：价格、佣金比例、AI成本、公告 */
export default function SettingsPage() {
  const [form] = Form.useForm();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: getSettings,
  });

  const updateMut = useMutation({
    mutationFn: updateSettings,
    onSuccess: () => {
      message.success('设置已保存');
      qc.invalidateQueries({ queryKey: ['admin-settings'] });
    },
    onError: (e: any) => message.error(e.response?.data?.message || '保存失败'),
  });

  // 数据加载后填充表单
  useEffect(() => {
    const settings = data?.data?.data;
    if (settings) {
      form.setFieldsValue(settings);
    }
  }, [data, form]);

  const handleSave = (values: any) => {
    updateMut.mutate(values);
  };

  return (
    <div style={{ maxWidth: 600 }}>
      <Title level={4} style={{ marginBottom: 24 }}>系统设置</Title>

      <Card>
        <Spin spinning={isLoading}>
          <Form form={form} layout="vertical" onFinish={handleSave}>
            <Form.Item
              label="订单价格（元）"
              name="order_price"
              rules={[{ required: true, message: '请输入订单价格' }]}
              extra="用户下单时实际支付的金额"
            >
              <InputNumber min={1} max={9999} precision={2} style={{ width: '100%' }} addonBefore="¥" />
            </Form.Item>

            <Form.Item
              label="佣金比例"
              name="commission_ratio"
              rules={[{ required: true, message: '请输入佣金比例' }]}
              extra="取值 0-1，例如 0.3 表示 30%。用户自购和邀请人各得此比例"
            >
              <InputNumber min={0} max={1} step={0.01} precision={2} style={{ width: '100%' }} />
            </Form.Item>

            <Form.Item
              label="最低提现金额（元）"
              name="min_withdraw_amount"
              rules={[{ required: true, message: '请输入最低提现金额' }]}
            >
              <InputNumber min={1} max={9999} precision={2} style={{ width: '100%' }} addonBefore="¥" />
            </Form.Item>

            <Form.Item
              label="AI 成本系数（元/次）"
              name="ai_cost_per_call"
              rules={[{ required: true, message: '请输入AI成本系数' }]}
              extra="用于 Dashboard 估算 AI 总成本，不影响实际业务"
            >
              <InputNumber min={0} max={100} precision={4} style={{ width: '100%' }} addonBefore="¥" />
            </Form.Item>

            <Form.Item
              label="系统公告"
              name="announcement"
              extra="显示在用户端首页，留空则不显示"
            >
              <TextArea rows={3} placeholder="输入公告内容（可选）" maxLength={200} showCount />
            </Form.Item>

            <Form.Item>
              <Button
                type="primary"
                htmlType="submit"
                loading={updateMut.isPending}
                style={{ background: '#1a1a2e' }}
              >
                保存设置
              </Button>
            </Form.Item>
          </Form>
        </Spin>
      </Card>

      <Card style={{ marginTop: 16, background: '#fffbe6', borderColor: '#ffe58f' }}>
        <Text type="warning" style={{ fontSize: 12 }}>
          <strong>提示：</strong>修改订单价格会立即生效，但不影响已创建的历史订单。
          修改佣金比例会影响新订单的佣金计算，历史已结算佣金不受影响。
        </Text>
      </Card>
    </div>
  );
}
