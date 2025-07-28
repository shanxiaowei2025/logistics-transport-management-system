import { Card, Row, Col, Tabs, Spin } from 'antd';
import { Line, Column } from '@ant-design/charts';
import { useChartData, useStatistics } from '../../hooks/useApi';
import { formatCurrency } from '../../utils/decimal';

const Reports: React.FC = () => {
  const { statistics, isLoading: statsLoading } = useStatistics();
  const { chartData: dailyData, isLoading: dailyLoading } =
    useChartData('daily');
  const { chartData: weeklyData, isLoading: weeklyLoading } =
    useChartData('weekly');
  const { chartData: monthlyData, isLoading: monthlyLoading } =
    useChartData('monthly');

  const dailyChartConfig = {
    data: dailyData as Array<{ date: string; profit: number; orders: number }>,
    xField: 'date',
    yField: 'profit',
    height: 400,
    point: {
      size: 5,
      shape: 'diamond',
    },
    label: {
      style: {
        fill: '#aaa',
      },
    },
  };

  const weeklyChartConfig = {
    data: weeklyData as Array<{ week: string; profit: number; orders: number }>,
    xField: 'week',
    yField: 'profit',
    height: 400,
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      week: {
        alias: '周期',
      },
      profit: {
        alias: '利润',
      },
    },
  };

  const monthlyChartConfig = {
    data: monthlyData as Array<{
      month: string;
      profit: number;
      orders: number;
    }>,
    xField: 'month',
    yField: 'profit',
    height: 400,
    label: {
      style: {
        fill: '#FFFFFF',
        opacity: 0.8,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: false,
      },
    },
    meta: {
      month: {
        alias: '月份',
      },
      profit: {
        alias: '利润',
      },
    },
  };

  const tabItems = [
    {
      key: 'daily',
      label: '日报表',
      children: (
        <Card title="近7天利润趋势">
          {dailyLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="large" />
            </div>
          ) : dailyData.length > 0 ? (
            <Line {...dailyChartConfig} />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500">暂无数据</p>
            </div>
          )}
        </Card>
      ),
    },
    {
      key: 'weekly',
      label: '周报表',
      children: (
        <Card title="近8周利润对比">
          {weeklyLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="large" />
            </div>
          ) : weeklyData.length > 0 ? (
            <Column {...weeklyChartConfig} />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500">暂无数据</p>
            </div>
          )}
        </Card>
      ),
    },
    {
      key: 'monthly',
      label: '月报表',
      children: (
        <Card title="近12个月利润对比">
          {monthlyLoading ? (
            <div className="flex justify-center items-center h-96">
              <Spin size="large" />
            </div>
          ) : monthlyData.length > 0 ? (
            <Column {...monthlyChartConfig} />
          ) : (
            <div className="h-96 flex items-center justify-center">
              <p className="text-gray-500">暂无数据</p>
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
                    ¥{formatCurrency(statistics?.yearlyProfit || 0)}
                  </div>
                  <div className="text-gray-500 mt-1">年度利润</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    ¥{formatCurrency(statistics?.monthlyProfit || 0)}
                  </div>
                  <div className="text-gray-500 mt-1">月度利润</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    ¥{formatCurrency(statistics?.weeklyProfit || 0)}
                  </div>
                  <div className="text-gray-500 mt-1">周度利润</div>
                </div>
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    ¥{formatCurrency(statistics?.dailyProfit || 0)}
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
