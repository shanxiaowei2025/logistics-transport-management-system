import { useEffect, Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import { ConfigProvider, Spin } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import { useAuthStore } from './stores';
import { router } from './router';

function App() {
  const { getCurrentUser } = useAuthStore();

  // 应用启动时恢复用户认证状态
  useEffect(() => {
    getCurrentUser();
  }, [getCurrentUser]);

  return (
    <ConfigProvider
      locale={zhCN}
      theme={{
        token: {
          colorPrimary: '#1890ff',
          borderRadius: 6,
        },
      }}
    >
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-screen">
            <Spin size="large" />
          </div>
        }
      >
        <RouterProvider router={router} />
      </Suspense>
    </ConfigProvider>
  );
}

export default App;
