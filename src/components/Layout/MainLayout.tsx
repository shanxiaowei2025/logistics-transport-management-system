import { Layout } from 'antd';
import { Outlet } from 'react-router-dom';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { SWRProvider } from '../../services';

const { Sider, Content } = Layout;

const MainLayout: React.FC = () => {
  return (
    <SWRProvider>
      <Layout className="min-h-screen">
        <Sider width={240} className="bg-white shadow-sm" theme="light">
          <Sidebar />
        </Sider>

        <Layout>
          <Header />

          <Content className="bg-gray-50 p-6">
            <div className="bg-white rounded-lg shadow-sm min-h-full">
              <Outlet />
            </div>
          </Content>
        </Layout>
      </Layout>
    </SWRProvider>
  );
};

export default MainLayout;
