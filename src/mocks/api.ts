import type {
  OrderInfo,
  UserInfo,
  StatisticsData,
  LoginCredentials,
  ApiResponse,
  PaginatedResponse,
  OrderFilters,
  PaginationParams,
} from '../types';
import { mockOrders, mockUsers, mockStatistics } from './data';
import { sum } from '../utils/decimal';

// 模拟API延迟
const delay = (ms: number = 500) =>
  new Promise((resolve) => setTimeout(resolve, ms));

// 模拟分页
const paginate = <T>(
  data: T[],
  params: PaginationParams
): PaginatedResponse<T> => {
  const { page, pageSize } = params;
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedData = data.slice(startIndex, endIndex);

  return {
    data: paginatedData,
    total: data.length,
    page,
    pageSize,
    totalPages: Math.ceil(data.length / pageSize),
  };
};

// 过滤订单
const filterOrders = (
  orders: OrderInfo[],
  filters: OrderFilters
): OrderInfo[] => {
  return orders.filter((order) => {
    if (filters.category && order.category !== filters.category) {
      return false;
    }

    if (
      filters.paymentStatus &&
      order.paymentStatus !== filters.paymentStatus
    ) {
      return false;
    }

    if (filters.origin && order.origin !== filters.origin) {
      return false;
    }

    if (filters.destination && order.destination !== filters.destination) {
      return false;
    }

    // 搜索功能：搜索订单编号、司机姓名、车牌号
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      const matchesId = order.id.toLowerCase().includes(searchTerm);
      const matchesDriver = order.driver.toLowerCase().includes(searchTerm);
      const matchesPlate = order.plateNumber.toLowerCase().includes(searchTerm);

      if (!matchesId && !matchesDriver && !matchesPlate) {
        return false;
      }
    }

    if (filters.dateRange) {
      const orderDate = new Date(order.createdAt);
      if (
        orderDate < filters.dateRange.start ||
        orderDate > filters.dateRange.end
      ) {
        return false;
      }
    }

    return true;
  });
};

// Mock API 函数
export const mockApi = {
  // 用户登录
  async login(credentials: LoginCredentials): Promise<ApiResponse<UserInfo>> {
    await delay();

    const user = mockUsers.find((u) => u.username === credentials.username);

    if (user && credentials.password === 'password') {
      return {
        success: true,
        data: user,
        message: '登录成功',
      };
    }

    return {
      success: false,
      data: {} as UserInfo,
      error: '用户名或密码错误',
    };
  },

  // 获取用户信息
  async getUserInfo(userId: string): Promise<ApiResponse<UserInfo>> {
    await delay(200);

    const user = mockUsers.find((u) => u.id === userId);

    if (user) {
      return {
        success: true,
        data: user,
      };
    }

    return {
      success: false,
      data: {} as UserInfo,
      error: '用户不存在',
    };
  },

  // 获取订单列表
  async getOrders(
    params: PaginationParams,
    filters?: OrderFilters
  ): Promise<ApiResponse<PaginatedResponse<OrderInfo>>> {
    await delay();

    const filteredOrders = filters
      ? filterOrders(mockOrders, filters)
      : mockOrders;
    const paginatedData = paginate(filteredOrders, params);

    return {
      success: true,
      data: paginatedData,
    };
  },

  // 获取单个订单
  async getOrder(id: string): Promise<ApiResponse<OrderInfo>> {
    await delay(200);

    const order = mockOrders.find((o) => o.id === id);

    if (order) {
      return {
        success: true,
        data: order,
      };
    }

    return {
      success: false,
      data: {} as OrderInfo,
      error: '订单不存在',
    };
  },

  // 创建订单
  async createOrder(
    orderData: Omit<OrderInfo, 'id' | 'createdAt' | 'updatedAt'>
  ): Promise<ApiResponse<OrderInfo>> {
    await delay();

    const newOrder: OrderInfo = {
      ...orderData,
      id: `ORDER_${String(mockOrders.length + 1).padStart(4, '0')}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    mockOrders.unshift(newOrder);

    return {
      success: true,
      data: newOrder,
      message: '订单创建成功',
    };
  },

  // 更新订单
  async updateOrder(
    id: string,
    orderData: Partial<OrderInfo>
  ): Promise<ApiResponse<OrderInfo>> {
    await delay();

    const orderIndex = mockOrders.findIndex((o) => o.id === id);

    if (orderIndex !== -1) {
      mockOrders[orderIndex] = {
        ...mockOrders[orderIndex],
        ...orderData,
        updatedAt: new Date(),
      };

      return {
        success: true,
        data: mockOrders[orderIndex],
        message: '订单更新成功',
      };
    }

    return {
      success: false,
      data: {} as OrderInfo,
      error: '订单不存在',
    };
  },

  // 删除订单
  async deleteOrder(id: string): Promise<ApiResponse<boolean>> {
    await delay();

    const orderIndex = mockOrders.findIndex((o) => o.id === id);

    if (orderIndex !== -1) {
      mockOrders.splice(orderIndex, 1);

      return {
        success: true,
        data: true,
        message: '订单删除成功',
      };
    }

    return {
      success: false,
      data: false,
      error: '订单不存在',
    };
  },

  // 获取统计数据
  async getStatistics(): Promise<ApiResponse<StatisticsData>> {
    await delay(300);

    return {
      success: true,
      data: mockStatistics,
    };
  },

  // 获取图表数据
  async getChartData(
    type: 'daily' | 'weekly' | 'monthly'
  ): Promise<ApiResponse<unknown[]>> {
    await delay(400);

    const now = new Date();
    const data = [];

    switch (type) {
      case 'daily':
        // 最近7天的数据
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
          const dayOrders = mockOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate.toDateString() === date.toDateString();
          });

          data.push({
            date: date.toISOString().split('T')[0],
            profit: sum(dayOrders.map((order) => order.dailyProfit)),
            orders: dayOrders.length,
          });
        }
        break;

      case 'weekly':
        // 最近8周的数据
        for (let i = 7; i >= 0; i--) {
          const weekStart = new Date(
            now.getTime() - i * 7 * 24 * 60 * 60 * 1000
          );
          const weekEnd = new Date(
            weekStart.getTime() + 7 * 24 * 60 * 60 * 1000
          );
          const weekOrders = mockOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= weekStart && orderDate < weekEnd;
          });

          data.push({
            week: `第${8 - i}周`,
            profit: sum(weekOrders.map((order) => order.dailyProfit)),
            orders: weekOrders.length,
          });
        }
        break;

      case 'monthly':
        // 最近12个月的数据
        for (let i = 11; i >= 0; i--) {
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const nextMonth = new Date(
            now.getFullYear(),
            now.getMonth() - i + 1,
            1
          );
          const monthOrders = mockOrders.filter((order) => {
            const orderDate = new Date(order.createdAt);
            return orderDate >= month && orderDate < nextMonth;
          });

          data.push({
            month: `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}`,
            profit: sum(monthOrders.map((order) => order.dailyProfit)),
            orders: monthOrders.length,
          });
        }
        break;
    }

    return {
      success: true,
      data,
    };
  },
};
