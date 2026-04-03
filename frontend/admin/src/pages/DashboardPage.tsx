import { useQuery } from '@tanstack/react-query';
import { Card, Col, Row, Statistic, Typography, Spin } from 'antd';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { getOverview, getRevenueChart } from '../api/stats';

const { Title } = Typography;

/** 统计指标卡片配置 */
const STAT_CARDS = [
  { key: 'today_revenue', label: '今日收入(¥)', color: '#C9A84C', prefix: '¥' },
  { key: 'total_revenue', label: '总收入(¥)', color: '#1a1a2e', prefix: '¥' },
  { key: 'today_orders', label: '今日订单数', color: '#1677ff' },
  { key: 'total_orders', label: '总订单数', color: '#1677ff' },
  { key: 'total_users', label: '总用户数', color: '#52c41a' },
  { key: 'pending_withdrawals', label: '待审核提现', color: '#fa8c16' },
  { key: 'estimated_ai_cost', label: 'AI成本估算(¥)', color: '#eb2f96', prefix: '¥' },
  { key: 'net_revenue', label: '净收入(¥)', color: '#13c2c2', prefix: '¥' },
];

/** Dashboard 页：核心指标卡片 + 7天收入折线图 */
export default function DashboardPage() {
  const { data: overviewRes, isLoading: overviewLoading } = useQuery({
    queryKey: ['admin-overview'],
    queryFn: () => getOverview(),
    refetchInterval: 30000, // 每30秒刷新
  });

  const { data: chartRes, isLoading: chartLoading } = useQuery({
    queryKey: ['admin-revenue-chart'],
    queryFn: () => getRevenueChart(),
    refetchInterval: 60000,
  });

  const overview = overviewRes?.data?.data || {};
  const chartData = chartRes?.data?.data?.chart || [];

  return (
    <div>
      <Title level={4} style={{ marginBottom: 24 }}>数据概览</Title>

      {/* 指标卡片区 */}
      <Spin spinning={overviewLoading}>
        <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
          {STAT_CARDS.map(({ key, label, color, prefix }) => (
            <Col key={key} xs={24} sm={12} lg={6}>
              <Card>
                <Statistic
                  title={label}
                  value={overview[key] ?? 0}
                  precision={prefix ? 2 : 0}
                  prefix={prefix}
                  valueStyle={{ color }}
                />
              </Card>
            </Col>
          ))}
        </Row>
      </Spin>

      {/* 收入折线图 */}
      <Card title="近7天收入趋势">
        <Spin spinning={chartLoading}>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip formatter={(value: number) => [`¥${value.toFixed(2)}`, '收入']} />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#C9A84C"
                strokeWidth={2}
                dot={{ fill: '#C9A84C', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </Spin>
      </Card>
    </div>
  );
}
