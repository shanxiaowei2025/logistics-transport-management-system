import { Menu } from 'antd';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  DashboardOutlined,
  FileTextOutlined,
  BarChartOutlined,
} from '@ant-design/icons';
import { useAuthStore } from '../../stores';
import { ROUTES } from '../../constants';

export const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const menuItems = [
    {
      key: ROUTES.DASHBOARD,
      icon: <DashboardOutlined />,
      label: '仪表盘',
    },
    {
      key: ROUTES.ORDERS,
      icon: <FileTextOutlined />,
      label: '订单管理',
    },
    {
      key: ROUTES.REPORTS,
      icon: <BarChartOutlined />,
      label: '报表统计',
    },
  ];

  // 根据用户角色过滤菜单项
  const filteredMenuItems = menuItems.filter((item) => {
    // 管理员可以访问所有功能
    if (user?.role === 'admin') {
      return true;
    }

    // 操作员可以访问仪表盘和订单管理
    if (user?.role === 'operator') {
      return item.key !== ROUTES.REPORTS;
    }

    return true;
  });

  const handleMenuClick = ({ key }: { key: string }) => {
    navigate(key);
  };

  return (
    <div className="h-full bg-white">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-800">
          物流运输管理系统
        </h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={filteredMenuItems}
        onClick={handleMenuClick}
        className="border-r-0 h-full"
      />
    </div>
  );
};
