import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { ROUTES } from '../../constants';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // 保存用户尝试访问的页面，登录后可以重定向回来
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
