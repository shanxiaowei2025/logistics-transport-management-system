import { Card, Row, Col, Statistic, Spin } from 'antd';
import {
  DollarOutlined,
  FileTextOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import { useStatistics } from '../../hooks/useApi';

const Dashboard: React.FC = () => {
  const { statistics, isLoading, error } = useStatistics();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">加载统计数据失败：{error}</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">仪表盘概览</h2>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="今日利润"
              value={statistics?.dailyProfit || 0}
              precision={2}
              valueStyle={{ color: '#3f8600' }}
              prefix={<DollarOutlined />}
              suffix="元"
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="订单总数"
              value={statistics?.totalOrders || 0}
              valueStyle={{ color: '#1890ff' }}
              prefix={<FileTextOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="已完成订单"
              value={statistics?.completedOrders || 0}
              valueStyle={{ color: '#52c41a' }}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>

        <Col xs={24} sm={12} lg={6}>
          <Card>
            <Statistic
              title="待处理订单"
              value={statistics?.pendingOrders || 0}
              valueStyle={{ color: '#faad14' }}
              prefix={<ClockCircleOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card title="本周利润" className="h-96">
            <Statistic
              value={statistics?.weeklyProfit || 0}
              precision={2}
              suffix="元"
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </Col>

        <Col xs={24} lg={12}>
          <Card title="本月利润" className="h-96">
            <Statistic
              value={statistics?.monthlyProfit || 0}
              precision={2}
              suffix="元"
              valueStyle={{ color: '#3f8600', fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
