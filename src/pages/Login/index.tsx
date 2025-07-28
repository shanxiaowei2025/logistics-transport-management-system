import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { message } from 'antd';
import { LoginForm } from '../../components/Forms/LoginForm';
import { useAuthStore } from '../../stores';
import { ROUTES } from '../../constants';
import type { LoginCredentials } from '../../types';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, isAuthenticated, isLoading, error, clearError } =
    useAuthStore();

  // 获取登录前用户想访问的页面
  const from =
    (location.state as { from?: { pathname: string } })?.from?.pathname ||
    ROUTES.DASHBOARD;

  // 如果已经登录，重定向到目标页面
  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  // 清除错误信息
  useEffect(() => {
    return () => {
      clearError();
    };
  }, [clearError]);

  const handleLogin = async (
    values: LoginCredentials & { remember: boolean }
  ) => {
    const { ...credentials } = values;

    const success = await login(credentials);

    if (success) {
      message.success('登录成功');
      navigate(from, { replace: true });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">
        <LoginForm onSubmit={handleLogin} loading={isLoading} error={error} />
      </div>
    </div>
  );
};

export default Login;
