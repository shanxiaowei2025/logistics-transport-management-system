import { createBrowserRouter, Navigate } from 'react-router-dom';
import { ProtectedRoute } from '../components/Common/ProtectedRoute';
import { ROUTES } from '../constants';

// 页面组件懒加载
import { lazy } from 'react';

const Login = lazy(() => import('../pages/Login'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Orders = lazy(() => import('../pages/Orders'));
const Reports = lazy(() => import('../pages/Reports'));
const MainLayout = lazy(() => import('../components/Layout/MainLayout'));

export const router = createBrowserRouter([
  {
    path: ROUTES.LOGIN,
    element: <Login />,
  },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <MainLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: ROUTES.ORDERS.substring(1),
        element: <Orders />,
      },
      {
        path: ROUTES.REPORTS.substring(1),
        element: <Reports />,
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to={ROUTES.DASHBOARD} replace />,
  },
]);
