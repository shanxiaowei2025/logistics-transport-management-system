import { useState } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Pagination,
  Modal,
  Input,
  Select,
  Row,
  Col,
  Popconfirm,
  App,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  EyeOutlined,
  DeleteOutlined,
  SearchOutlined,
} from '@ant-design/icons';
import {
  useOrders,
  useCreateOrder,
  useUpdateOrder,
  useDeleteOrder,
} from '../../hooks/useApi';
import { PAYMENT_STATUS_LABELS, CATEGORIES, CITIES } from '../../constants';
import type { OrderInfo, OrderFilters } from '../../types';
import { OrderForm } from '../../components/Forms/OrderForm';
import { formatCurrency } from '../../utils/decimal';
import dayjs from 'dayjs';

const Orders: React.FC = () => {
  const { message } = App.useApp();
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
  });
  const [filters, setFilters] = useState<OrderFilters>({});
  const [searchText, setSearchText] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>(
    'create'
  );
  const [currentOrder, setCurrentOrder] = useState<OrderInfo | null>(null);

  const {
    orders,
    pagination: paginationData,
    isLoading,
    mutate,
  } = useOrders(pagination, filters);

  const { trigger: createOrder, isMutating: isCreating } = useCreateOrder();
  const { trigger: updateOrder, isMutating: isUpdating } = useUpdateOrder();
  const { trigger: deleteOrder, isMutating: isDeleting } = useDeleteOrder();

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
      render: (price: number) => `¥${formatCurrency(price)}`,
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
          ¥{formatCurrency(profit)}
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
      width: 180,
      render: (_, record: OrderInfo) => (
        <Space size="small">
          <Button
            type="text"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => handleView(record)}
          >
            查看
          </Button>
          <Button
            type="text"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
          >
            编辑
          </Button>
          <Popconfirm
            title="确定要删除这个订单吗？"
            onConfirm={() => handleDelete(record.id)}
            okText="确定"
            cancelText="取消"
          >
            <Button type="text" icon={<DeleteOutlined />} size="small" danger>
              删除
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const handleView = (order: OrderInfo) => {
    setCurrentOrder(order);
    setModalMode('view');
    setModalVisible(true);
  };

  const handleEdit = (order: OrderInfo) => {
    setCurrentOrder(order);
    setModalMode('edit');
    setModalVisible(true);
  };

  const handleCreate = () => {
    setCurrentOrder(null);
    setModalMode('create');
    setModalVisible(true);
  };

  const handleDelete = async (orderId: string) => {
    try {
      await deleteOrder(orderId);
      message.success('订单删除成功');
      mutate(); // 刷新列表
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleModalSubmit = async (
    values: Omit<OrderInfo, 'id' | 'createdAt' | 'updatedAt'>
  ) => {
    try {
      if (modalMode === 'create') {
        await createOrder(values);
        message.success('订单创建成功');
      } else if (modalMode === 'edit' && currentOrder) {
        await updateOrder({ id: currentOrder.id, data: values });
        message.success('订单更新成功');
      }
      setModalVisible(false);
      mutate(); // 刷新列表
    } catch (error) {
      message.error(modalMode === 'create' ? '创建失败' : '更新失败');
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setCurrentOrder(null);
  };

  const handleSearch = () => {
    if (searchText.trim()) {
      // 模拟搜索：通过订单编号、司机、车牌号搜索
      const searchFilters: OrderFilters = {
        search: searchText.trim(),
      };
      setFilters(searchFilters);
    } else {
      setFilters({});
    }
    setPagination({ page: 1, pageSize: pagination.pageSize });
  };

  const handleClearSearch = () => {
    setSearchText('');
    setFilters({});
    setPagination({ page: 1, pageSize: pagination.pageSize });
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

      {/* 搜索栏 */}
      <div className="mb-4">
        <Row gutter={16} align="middle">
          <Col flex="1">
            <Input
              placeholder="搜索订单编号、司机姓名或车牌号"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              onPressEnter={handleSearch}
              allowClear
              suffix={
                <Button
                  type="text"
                  icon={<SearchOutlined />}
                  onClick={handleSearch}
                />
              }
            />
          </Col>
          <Col>
            <Space>
              <Button onClick={handleSearch} icon={<SearchOutlined />}>
                搜索
              </Button>
              <Button onClick={handleClearSearch}>重置</Button>
            </Space>
          </Col>
        </Row>
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

      {/* 订单表单弹窗 */}
      <Modal
        title={
          modalMode === 'create'
            ? '新建订单'
            : modalMode === 'edit'
              ? '编辑订单'
              : '查看订单'
        }
        open={modalVisible}
        onCancel={handleModalCancel}
        footer={null}
        width={800}
        destroyOnHidden
      >
        <OrderForm
          mode={modalMode}
          initialValues={currentOrder || undefined}
          onSubmit={handleModalSubmit}
          onCancel={handleModalCancel}
          loading={modalMode === 'create' ? isCreating : isUpdating}
        />
      </Modal>
    </div>
  );
};

export default Orders;
