import { useQuery } from '@tanstack/react-query'
import { Card, Row, Col, Statistic, Typography } from 'antd'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { getStatsOverview, getRevenueChart } from '../api/admin'

const { Title } = Typography

export default function DashboardPage() {
  const { data: overview } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => getStatsOverview().then((r) => r.data.data),
    refetchInterval: 30_000,
  })

  const { data: chartData } = useQuery({
    queryKey: ['admin-chart'],
    queryFn: () => getRevenueChart().then((r) => r.data.data?.chart || []),
  })

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>
        数据概览
      </Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <Statistic title="今日收入" value={overview?.today_revenue ?? 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总收入" value={overview?.total_revenue ?? 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="今日订单" value={overview?.today_orders ?? 0} suffix="笔" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="总用户数" value={overview?.total_users ?? 0} suffix="人" />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="待审核提现"
              value={overview?.pending_withdrawals ?? 0}
              suffix="笔"
              valueStyle={{ color: overview?.pending_withdrawals ? '#cf1322' : undefined }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="预估AI成本" value={overview?.estimated_ai_cost ?? 0} prefix="¥" precision={2} />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic title="净收益" value={overview?.net_revenue ?? 0} prefix="¥" precision={2} valueStyle={{ color: '#3f8600' }} />
          </Card>
        </Col>
      </Row>

      {/* 7 天收入折线图 */}
      <Card title="近 7 天收入">
        <ResponsiveContainer width="100%" height={280}>
          <LineChart data={chartData || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(v: number) => [`¥${v.toFixed(2)}`, '收入']} />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#C9A84C"
              strokeWidth={2}
              dot={{ r: 4 }}
              activeDot={{ r: 6 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </Card>
    </div>
  )
}
