import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import {
  OrderInfo,
  StatisticsData,
  PaginationParams,
  OrderFilters,
  ApiResponse,
  PaginatedResponse,
} from '../types';
import { mockApi } from '../mocks/api';

// 订单列表Hook
export const useOrders = (
  pagination?: PaginationParams,
  filters?: OrderFilters
) => {
  const key = `orders|${JSON.stringify(pagination)}|${JSON.stringify(filters)}`;

  const { data, error, isLoading, mutate } = useSWR<
    ApiResponse<PaginatedResponse<OrderInfo>>
  >(key, null, {
    revalidateOnMount: true,
  });

  return {
    orders: data?.success ? data.data.data : [],
    pagination: data?.success
      ? {
          page: data.data.page,
          pageSize: data.data.pageSize,
          total: data.data.total,
          totalPages: data.data.totalPages,
        }
      : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null),
    mutate,
  };
};

// 单个订单Hook
export const useOrder = (orderId?: string) => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<OrderInfo>>(
    orderId ? `order|${orderId}` : null
  );

  return {
    order: data?.success ? data.data : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null),
    mutate,
  };
};

// 统计数据Hook
export const useStatistics = () => {
  const { data, error, isLoading, mutate } =
    useSWR<ApiResponse<StatisticsData>>('statistics');

  return {
    statistics: data?.success ? data.data : null,
    isLoading,
    error: error || (!data?.success ? data?.error : null),
    mutate,
  };
};

// 图表数据Hook
export const useChartData = (type: 'daily' | 'weekly' | 'monthly') => {
  const { data, error, isLoading, mutate } = useSWR<ApiResponse<unknown[]>>(
    `chartData|${type}`
  );

  return {
    chartData: data?.success ? data.data : [],
    isLoading,
    error: error || (!data?.success ? data?.error : null),
    mutate,
  };
};

// 创建订单Mutation Hook
export const useCreateOrder = () => {
  return useSWRMutation(
    'orders',
    async (
      key,
      { arg }: { arg: Omit<OrderInfo, 'id' | 'createdAt' | 'updatedAt'> }
    ) => {
      return await mockApi.createOrder(arg);
    }
  );
};

// 更新订单Mutation Hook
export const useUpdateOrder = () => {
  return useSWRMutation(
    'orders',
    async (key, { arg }: { arg: { id: string; data: Partial<OrderInfo> } }) => {
      return await mockApi.updateOrder(arg.id, arg.data);
    }
  );
};

// 删除订单Mutation Hook
export const useDeleteOrder = () => {
  return useSWRMutation('orders', async (key, { arg }: { arg: string }) => {
    return await mockApi.deleteOrder(arg);
  });
};
