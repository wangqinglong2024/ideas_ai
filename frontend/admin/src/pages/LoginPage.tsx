import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, Form, Input, Button, Typography, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import client from '../api/client';
import { useAdminStore } from '../store/adminStore';

const { Title, Text } = Typography;

/** 管理员登录页：用户名 + 密码，使用独立 Admin JWT */
export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const setToken = useAdminStore((s) => s.setToken);
  const navigate = useNavigate();

  const handleLogin = async (values: { username: string; password: string }) => {
    setLoading(true);
    try {
      const res = await client.post('/auth/admin/login', values);
      const token = res.data?.data?.access_token;
      if (token) {
        setToken(token);
        message.success('登录成功');
        navigate('/admin/dashboard', { replace: true });
      } else {
        message.error('登录失败，请重试');
      }
    } catch (e: any) {
      message.error(e.response?.data?.message || '用户名或密码错误');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#1a1a2e',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Card style={{ width: 380, boxShadow: '0 8px 32px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <Title level={3} style={{ color: '#1a1a2e', marginBottom: 4 }}>
            内观 · 管理后台
          </Title>
          <Text type="secondary">请使用管理员账号登录</Text>
        </div>

        <Form onFinish={handleLogin} autoComplete="off">
          <Form.Item name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input
              prefix={<UserOutlined />}
              placeholder="用户名"
              size="large"
            />
          </Form.Item>
          <Form.Item name="password" rules={[{ required: true, message: '请输入密码' }]}>
            <Input.Password
              prefix={<LockOutlined />}
              placeholder="密码"
              size="large"
            />
          </Form.Item>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              loading={loading}
              style={{ background: '#1a1a2e' }}
            >
              登录
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
