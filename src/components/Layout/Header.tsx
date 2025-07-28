import { Dropdown, Avatar, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores';
import { USER_ROLE_LABELS } from '../../constants';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: '个人信息',
      disabled: true,
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      onClick: handleLogout,
    },
  ];

  return (
    <div className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {getPageTitle(location.pathname)}
        </h1>
      </div>

      <div className="flex items-center space-x-4">
        {user && (
          <Dropdown
            menu={{ items: userMenuItems }}
            placement="bottomRight"
            arrow
          >
            <Space className="cursor-pointer hover:bg-gray-50 px-3 py-2 rounded-lg">
              <Avatar size="small" icon={<UserOutlined />} />
              <div className="text-sm">
                <div className="font-medium text-gray-900">{user.username}</div>
                <div className="text-gray-500">
                  {USER_ROLE_LABELS[user.role]}
                </div>
              </div>
            </Space>
          </Dropdown>
        )}
      </div>
    </div>
  );
};

// 根据路径获取页面标题
const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/':
    case '/dashboard':
      return '仪表盘';
    case '/orders':
      return '订单管理';
    case '/reports':
      return '报表统计';
    default:
      return '物流运输管理系统';
  }
};
