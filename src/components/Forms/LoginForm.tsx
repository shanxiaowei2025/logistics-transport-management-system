import { Form, Input, Button, Checkbox, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import type { LoginCredentials } from '../../types';

interface LoginFormProps {
  onSubmit: (values: LoginCredentials & { remember: boolean }) => void;
  loading?: boolean;
  error?: string | null;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  loading = false,
  error,
}) => {
  const [form] = Form.useForm();

  const handleSubmit = (values: LoginCredentials & { remember: boolean }) => {
    onSubmit(values);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          物流运输管理系统
        </h1>
        <p className="text-gray-600">请登录您的账户</p>
      </div>

      {error && (
        <Alert message={error} type="error" showIcon className="mb-6" />
      )}

      <Form
        form={form}
        name="login"
        onFinish={handleSubmit}
        size="large"
        requiredMark={false}
      >
        <Form.Item
          name="username"
          rules={[
            { required: true, message: '请输入用户名' },
            { min: 2, message: '用户名至少2个字符' },
          ]}
        >
          <Input
            prefix={<UserOutlined className="text-gray-400" />}
            placeholder="用户名"
          />
        </Form.Item>

        <Form.Item
          name="password"
          rules={[
            { required: true, message: '请输入密码' },
            { min: 6, message: '密码至少6个字符' },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="text-gray-400" />}
            placeholder="密码"
          />
        </Form.Item>

        <Form.Item>
          <div className="flex items-center justify-between">
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>记住密码</Checkbox>
            </Form.Item>
          </div>
        </Form.Item>

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className="w-full"
            loading={loading}
          >
            登录
          </Button>
        </Form.Item>
      </Form>

      <div className="mt-6 text-center text-sm text-gray-600">
        <p>测试账户：</p>
        <p>管理员：admin / password</p>
        <p>操作员：operator1 / password</p>
      </div>
    </div>
  );
};
