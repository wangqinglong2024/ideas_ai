import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Layout, Menu, Button, Typography, Space } from 'antd';
import {
  DashboardOutlined,
  OrderedListOutlined,
  WalletOutlined,
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { useAdminStore } from '../store/adminStore';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

/** 侧边栏菜单项配置 */
const menuItems = [
  { key: '/admin/dashboard', icon: <DashboardOutlined />, label: '数据概览' },
  { key: '/admin/orders', icon: <OrderedListOutlined />, label: '订单管理' },
  { key: '/admin/withdrawals', icon: <WalletOutlined />, label: '提现审核' },
  { key: '/admin/users', icon: <UserOutlined />, label: '用户管理' },
  { key: '/admin/settings', icon: <SettingOutlined />, label: '系统设置' },
];

/** 管理后台整体布局：顶部导航深色 + 左侧菜单 + 内容区 */
export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAdminStore((s) => s.logout);

  const handleLogout = () => {
    logout();
    navigate('/admin/login');
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* 顶部导航 */}
      <Header
        style={{
          background: '#1a1a2e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 24px',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Text strong style={{ color: '#C9A84C', fontSize: 18, letterSpacing: '0.12em' }}>
          内观 · 管理后台
        </Text>
        <Space>
          <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 13 }}>管理员</Text>
          <Button
            type="text"
            icon={<LogoutOutlined />}
            style={{ color: 'rgba(255,255,255,0.65)' }}
            onClick={handleLogout}
          >
            退出
          </Button>
        </Space>
      </Header>

      <Layout>
        {/* 左侧菜单 */}
        <Sider
          width={200}
          style={{ background: '#fff', borderRight: '1px solid #f0f0f0' }}
        >
          <Menu
            mode="inline"
            selectedKeys={[location.pathname]}
            style={{ height: '100%', borderRight: 0, paddingTop: 8 }}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </Sider>

        {/* 主内容区 */}
        <Content style={{ padding: 24, background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}
