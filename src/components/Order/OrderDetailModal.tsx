import { Modal, Descriptions, Tag, Badge, Button } from 'antd';
import {
  EditOutlined,
  PhoneOutlined,
  CarOutlined,
  EnvironmentOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  TagOutlined,
  ContainerOutlined,
  CreditCardOutlined,
  FileTextOutlined,
} from '@ant-design/icons';
import type { OrderInfo } from '../../types';
import { PAYMENT_STATUS_LABELS, PAYMENT_METHODS } from '../../constants';
import { formatCurrency } from '../../utils/decimal';
import dayjs from 'dayjs';

interface OrderDetailModalProps {
  open: boolean;
  order: OrderInfo | null;
  onClose: () => void;
  onEdit?: (order: OrderInfo) => void;
}

export const OrderDetailModal: React.FC<OrderDetailModalProps> = ({
  open,
  order,
  onClose,
  onEdit,
}) => {
  if (!order) return null;

  const getPaymentStatusColor = (status: OrderInfo['paymentStatus']) => {
    const colors = {
      pending: 'orange',
      verified: 'blue',
      collected: 'green',
    };
    return colors[status];
  };

  const getProfitColor = (profit: number) => {
    return profit >= 0 ? '#52c41a' : '#ff4d4f';
  };

  const getPaymentMethodLabel = (paymentMethod: string | { value: string; label: string }) => {
    if (typeof paymentMethod === 'string') {
      const method = PAYMENT_METHODS.find(m => m.value === paymentMethod);
      return method ? method.label : paymentMethod;
    }
    return paymentMethod.label;
  };

  return (
    <Modal
      title={
        <div className="flex items-center justify-between">
          <span className="flex items-center">
            <FileTextOutlined className="mr-2" />
            订单详情
          </span>
          <div className="text-sm text-gray-500">订单编号: {order.id}</div>
        </div>
      }
      open={open}
      onCancel={onClose}
      width={800}
      footer={
        <div className="flex justify-between">
          <div className="text-xs text-gray-500">
            创建时间: {dayjs(order.createdAt).format('YYYY-MM-DD HH:mm:ss')}
          </div>
          <div>
            <Button onClick={onClose}>关闭</Button>
            {onEdit && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => onEdit(order)}
                className="ml-2"
              >
                编辑订单
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="space-y-6">
        {/* 基本信息 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <TagOutlined className="mr-2 text-blue-500" />
            基本信息
          </h3>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <TagOutlined className="mr-1" />
                  品类
                </span>
              }
            >
              <Tag color="blue">{order.category}</Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <ContainerOutlined className="mr-1" />
                  重量
                </span>
              }
            >
              <span className="font-semibold">
                {order.weight.toLocaleString()}
              </span>{' '}
              斤
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <DollarOutlined className="mr-1" />
                  单价
                </span>
              }
            >
              <span className="font-semibold text-green-600">
                ¥{formatCurrency(order.unitPrice)}
              </span>{' '}
              /斤
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <DollarOutlined className="mr-1" />
                  利润
                </span>
              }
            >
              <span
                className="font-bold text-lg"
                style={{ color: getProfitColor(order.dailyProfit) }}
              >
                ¥{formatCurrency(order.dailyProfit)}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 运输信息 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CarOutlined className="mr-2 text-green-500" />
            运输信息
          </h3>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <UserOutlined className="mr-1" />
                  司机
                </span>
              }
            >
              <span className="font-semibold">{order.driver}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <CarOutlined className="mr-1" />
                  车牌号
                </span>
              }
            >
              <Tag color="volcano">{order.plateNumber}</Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <EnvironmentOutlined className="mr-1" />
                  出发地
                </span>
              }
            >
              <Badge status="processing" text={order.origin} />
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <EnvironmentOutlined className="mr-1" />
                  目的地
                </span>
              }
            >
              <Badge status="success" text={order.destination} />
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 支付信息 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CreditCardOutlined className="mr-2 text-purple-500" />
            支付信息
          </h3>
          <Descriptions bordered column={2} size="small">
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <CreditCardOutlined className="mr-1" />
                  收款状态
                </span>
              }
            >
              <Tag color={getPaymentStatusColor(order.paymentStatus)}>
                {PAYMENT_STATUS_LABELS[order.paymentStatus]}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <CreditCardOutlined className="mr-1" />
                  付款方式
                </span>
              }
            >
              <span>{getPaymentMethodLabel(order.paymentMethod)}</span>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <PhoneOutlined className="mr-1" />
                  客户电话
                </span>
              }
              span={2}
            >
              <a href={`tel:${order.customerPhone}`} className="text-blue-600">
                {order.customerPhone}
              </a>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 时间信息 */}
        <div>
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <CalendarOutlined className="mr-2 text-orange-500" />
            时间信息
          </h3>
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <CalendarOutlined className="mr-1" />
                  创建时间
                </span>
              }
            >
              <span className="font-mono">
                {dayjs(order.createdAt).format('YYYY年MM月DD日 HH:mm:ss')}
              </span>
            </Descriptions.Item>
            <Descriptions.Item
              label={
                <span className="flex items-center">
                  <CalendarOutlined className="mr-1" />
                  更新时间
                </span>
              }
            >
              <span className="font-mono">
                {dayjs(order.updatedAt).format('YYYY年MM月DD日 HH:mm:ss')}
              </span>
            </Descriptions.Item>
          </Descriptions>
        </div>

        {/* 备注信息 */}
        {order.remarks && (
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center">
              <FileTextOutlined className="mr-2 text-gray-500" />
              备注信息
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <p className="text-gray-700 whitespace-pre-wrap">
                {order.remarks}
              </p>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};
