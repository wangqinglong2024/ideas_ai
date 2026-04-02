import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Form, InputNumber, Input, Button, Card, message, Typography } from 'antd'
import { getSettings, updateSettings } from '../api/admin'

const { Title } = Typography

export default function SettingsPage() {
  const [form] = Form.useForm()
  const qc = useQueryClient()

  const { isLoading } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: () =>
      getSettings().then((r) => {
        form.setFieldsValue(r.data.data)
        return r.data.data
      }),
  })

  const mutation = useMutation({
    mutationFn: (values: Record<string, unknown>) => updateSettings(values),
    onSuccess: () => { message.success('配置已保存'); qc.invalidateQueries({ queryKey: ['admin-settings'] }) },
    onError: (e: any) => message.error(e.response?.data?.message || '保存失败'),
  })

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>系统设置</Title>
      <Card style={{ maxWidth: 480 }} loading={isLoading}>
        <Form form={form} layout="vertical" onFinish={mutation.mutate}>
          <Form.Item label="订单价格（元）" name="order_price" rules={[{ required: true }]}>
            <InputNumber min={1} precision={2} style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item label="佣金比例（0-1）" name="commission_ratio" rules={[{ required: true }]}>
            <InputNumber min={0} max={1} step={0.01} precision={2} style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="最低提现金额（元）" name="min_withdraw_amount" rules={[{ required: true }]}>
            <InputNumber min={1} precision={2} style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item label="AI 成本估算系数（元/次）" name="ai_cost_per_call">
            <InputNumber min={0} precision={2} style={{ width: '100%' }} prefix="¥" />
          </Form.Item>
          <Form.Item label="首页公告（空则不显示）" name="announcement">
            <Input.TextArea rows={3} placeholder="可选" />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={mutation.isPending}>
            保存配置
          </Button>
        </Form>
      </Card>
    </div>
  )
}
