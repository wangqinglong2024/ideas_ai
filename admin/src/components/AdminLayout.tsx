/**
 * 管理端布局：深色顶部导航 + 侧边菜单 + 内容区域
 */
import { Layout, Menu } from 'antd'
import {
  DashboardOutlined,
  ShoppingOutlined,
  TeamOutlined,
  WalletOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons'
import { useNavigate, useLocation, Outlet } from 'react-router-dom'
import { clearAdminToken } from '../api/client'

const { Header, Sider, Content } = Layout

const menuItems = [
  { key: '/admin/', icon: <DashboardOutlined />, label: '数据概览' },
  { key: '/admin/orders', icon: <ShoppingOutlined />, label: '订单管理' },
  { key: '/admin/withdrawals', icon: <WalletOutlined />, label: '提现管理' },
  { key: '/admin/users', icon: <TeamOutlined />, label: '用户管理' },
  { key: '/admin/settings', icon: <SettingOutlined />, label: '系统设置' },
]

export default function AdminLayout() {
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogout = () => {
    clearAdminToken()
    navigate('/admin/login')
  }

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Header
        style={{
          background: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
        }}
      >
        <span style={{ color: '#C9A84C', fontWeight: 600, fontSize: 16 }}>
          内观 · 管理后台
        </span>
        <LogoutOutlined
          style={{ color: '#fff', cursor: 'pointer', fontSize: 16 }}
          onClick={handleLogout}
        />
      </Header>
      <Layout>
        <Sider width={200} style={{ background: '#fff' }}>
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
            style={{ height: '100%', borderRight: 0 }}
          />
        </Sider>
        <Content style={{ padding: 24, background: '#f0f2f5' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  )
}
