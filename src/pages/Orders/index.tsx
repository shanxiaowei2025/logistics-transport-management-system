import { useState } from 'react';
import { Table, Button, Space, Tag, Pagination } from 'antd';
import { PlusOutlined, EditOutlined, EyeOutlined } from '@ant-design/icons';
import { useOrders } from '../../hooks/useApi';
import { PAYMENT_STATUS_LABELS } from '../../constants';
import { OrderInfo } from '../../types';
import dayjs from 'dayjs';

const Orders: React.FC = () => {
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });

  const {
    orders,
    pagination: paginationData,
    isLoading,
  } = useOrders(pagination);

  const columns = [
    {
      title: '订单编号',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: '品类',
      dataIndex: 'category',
      key: 'category',
      width: 100,
    },
    {
      title: '重量(斤)',
      dataIndex: 'weight',
      key: 'weight',
      width: 100,
      render: (weight: number) => weight.toLocaleString(),
    },
    {
      title: '单价',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      width: 80,
      render: (price: number) => `¥${price.toFixed(2)}`,
    },
    {
      title: '司机',
      dataIndex: 'driver',
      key: 'driver',
      width: 100,
    },
    {
      title: '车牌号',
      dataIndex: 'plateNumber',
      key: 'plateNumber',
      width: 100,
    },
    {
      title: '出发地',
      dataIndex: 'origin',
      key: 'origin',
      width: 80,
    },
    {
      title: '目的地',
      dataIndex: 'destination',
      key: 'destination',
      width: 80,
    },
    {
      title: '收款状态',
      dataIndex: 'paymentStatus',
      key: 'paymentStatus',
      width: 100,
      render: (status: OrderInfo['paymentStatus']) => {
        const colors = {
          pending: 'orange',
          verified: 'blue',
          collected: 'green',
        };
        return (
          <Tag color={colors[status]}>{PAYMENT_STATUS_LABELS[status]}</Tag>
        );
      },
    },
    {
      title: '利润',
      dataIndex: 'dailyProfit',
      key: 'dailyProfit',
      width: 100,
      render: (profit: number) => (
        <span className={profit >= 0 ? 'text-green-600' : 'text-red-600'}>
          ¥{profit.toFixed(2)}
        </span>
      ),
    },
    {
      title: '创建时间',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date: Date) => dayjs(date).format('YYYY-MM-DD'),
    },
    {
      title: '操作',
      key: 'action',
      width: 150,
      render: (_, record: OrderInfo) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record.id)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record.id)}
          >
            编辑
          </Button>
        </Space>
      ),
    },
  ];

  const handleView = (orderId: string) => {
    console.log('查看订单:', orderId);
  };

  const handleEdit = (orderId: string) => {
    console.log('编辑订单:', orderId);
  };

  const handleCreate = () => {
    console.log('创建新订单');
  };

  const handlePageChange = (page: number, pageSize: number) => {
    setPagination({ page, pageSize });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">订单管理</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
          新建订单
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        rowKey="id"
        loading={isLoading}
        pagination={false}
        scroll={{ x: 1200 }}
        size="small"
      />

      {paginationData && (
        <div className="flex justify-end mt-4">
          <Pagination
            current={paginationData.page}
            pageSize={paginationData.pageSize}
            total={paginationData.total}
            showSizeChanger
            showQuickJumper
            showTotal={(total, range) =>
              `第 ${range[0]}-${range[1]} 条，共 ${total} 条`
            }
            onChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Orders;
