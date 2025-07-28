import { Card, Row, Col, Tabs, Spin } from 'antd';
import { useChartData, useStatistics } from '../../hooks/useApi';

const Reports: React.FC = () => {
  const { statistics, isLoading: statsLoading } = useStatistics();
  const { chartData: dailyData, isLoading: dailyLoading } =
    useChartData('daily');
  const { chartData: weeklyData, isLoading: weeklyLoading } =
    useChartData('weekly');
  const { chartData: monthlyData, isLoading: monthlyLoading } =
    useChartData('monthly');

  const tabItems = [
    {
      key: 'daily',
      label: '日报表',
      children: (
        <Card>
          {dailyLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">
                日利润数据：{dailyData.length} 条记录
              </p>
            </div>
          )}
        </Card>
      ),
    },
    {
      key: 'weekly',
      label: '周报表',
      children: (
        <Card>
          {weeklyLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">
                周利润数据：{weeklyData.length} 条记录
              </p>
            </div>
          )}
        </Card>
      ),
    },
    {
      key: 'monthly',
      label: '月报表',
      children: (
        <Card>
          {monthlyLoading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center">
              <p className="text-gray-500">
                月利润数据：{monthlyData.length} 条记录
              </p>
            </div>
          )}
        </Card>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">报表统计</h2>

      {statsLoading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <Row gutter={[16, 16]} className="mb-6">
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    ¥{statistics?.yearlyProfit?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-gray-500 mt-1">年度利润</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ¥{statistics?.monthlyProfit?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-gray-500 mt-1">月度利润</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ¥{statistics?.weeklyProfit?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-gray-500 mt-1">周度利润</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ¥{statistics?.dailyProfit?.toFixed(2) || '0.00'}
                  </div>
                  <div className="text-gray-500 mt-1">今日利润</div>
                </div>
              </Card>
            </Col>
          </Row>

          <Card>
            <Tabs defaultActiveKey="daily" items={tabItems} />
          </Card>
        </>
      )}
    </div>
  );
};

export default Reports;
