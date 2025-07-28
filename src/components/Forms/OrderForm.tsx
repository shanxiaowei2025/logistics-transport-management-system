import {
  Form,
  Input,
  Select,
  InputNumber,
  DatePicker,
  Button,
  Row,
  Col,
} from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import type { OrderInfo } from '../../types';
import {
  CATEGORIES,
  CITIES,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_METHODS,
} from '../../constants';
import dayjs from 'dayjs';

interface OrderFormProps {
  onSubmit: (values: Omit<OrderInfo, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
  loading?: boolean;
  initialValues?: Partial<OrderInfo>;
  mode?: 'create' | 'edit' | 'view';
}

export const OrderForm: React.FC<OrderFormProps> = ({
  onSubmit,
  onCancel,
  loading = false,
  initialValues,
  mode = 'create',
}) => {
  const [form] = Form.useForm();
  const isReadonly = mode === 'view';

  const handleSubmit = (values: any) => {
    onSubmit({
      ...values,
      createdTime: values.createdTime?.toDate() || new Date(),
    });
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        ...initialValues,
        createdTime: initialValues?.createdAt
          ? dayjs(initialValues.createdAt)
          : undefined,
      }}
      disabled={isReadonly}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="category"
            label="品类"
            rules={[{ required: true, message: '请选择品类' }]}
          >
            <Select placeholder="请选择品类">
              {CATEGORIES.map((category) => (
                <Select.Option key={category} value={category}>
                  {category}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="weight"
            label="重量(斤)"
            rules={[{ required: true, message: '请输入重量' }]}
          >
            <InputNumber
              placeholder="请输入重量"
              min={1}
              precision={0}
              className="w-full"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="unitPrice"
            label="单价"
            rules={[{ required: true, message: '请输入单价' }]}
          >
            <InputNumber
              placeholder="请输入单价"
              min={0}
              precision={2}
              addonBefore="¥"
              className="w-full"
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="dailyProfit"
            label="利润"
            rules={[{ required: true, message: '请输入利润' }]}
          >
            <InputNumber
              placeholder="请输入利润"
              precision={2}
              addonBefore="¥"
              className="w-full"
            />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="driver"
            label="司机"
            rules={[{ required: true, message: '请输入司机姓名' }]}
          >
            <Input placeholder="请输入司机姓名" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="plateNumber"
            label="车牌号"
            rules={[{ required: true, message: '请输入车牌号' }]}
          >
            <Input placeholder="请输入车牌号" />
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="origin"
            label="出发地"
            rules={[{ required: true, message: '请选择出发地' }]}
          >
            <Select placeholder="请选择出发地">
              {CITIES.map((city) => (
                <Select.Option key={city} value={city}>
                  {city}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="destination"
            label="目的地"
            rules={[{ required: true, message: '请选择目的地' }]}
          >
            <Select placeholder="请选择目的地">
              {CITIES.map((city) => (
                <Select.Option key={city} value={city}>
                  {city}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="paymentStatus"
            label="收款状态"
            rules={[{ required: true, message: '请选择收款状态' }]}
          >
            <Select placeholder="请选择收款状态">
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <Select.Option key={status.value} value={status.value}>
                  {status.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="paymentMethod"
            label="付款方式"
            rules={[{ required: true, message: '请选择付款方式' }]}
          >
            <Select placeholder="请选择付款方式">
              {PAYMENT_METHODS.map((method) => (
                <Select.Option key={method.value} value={method.value}>
                  {method.label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            name="customerPhone"
            label="客户电话"
            rules={[
              { required: true, message: '请输入客户电话' },
              { pattern: /^1[3-9]\d{9}$/, message: '请输入正确的手机号' },
            ]}
          >
            <Input placeholder="请输入客户电话" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            name="createdTime"
            label="创建时间"
            rules={[{ required: true, message: '请选择创建时间' }]}
          >
            <DatePicker
              placeholder="请选择创建时间"
              className="w-full"
              showTime
            />
          </Form.Item>
        </Col>
      </Row>

      <Form.Item name="remarks" label="备注">
        <Input.TextArea placeholder="请输入备注信息" rows={3} />
      </Form.Item>

      <div className="flex justify-end space-x-2">
        <Button onClick={onCancel}>{mode === 'view' ? '关闭' : '取消'}</Button>
        {!isReadonly && (
          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            icon={<SaveOutlined />}
          >
            {mode === 'create' ? '创建订单' : '保存修改'}
          </Button>
        )}
      </div>
    </Form>
  );
};
