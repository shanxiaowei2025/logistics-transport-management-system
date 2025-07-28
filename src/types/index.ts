export interface OrderInfo {
  id: string;
  category: string; // 品类
  weight: number; // 重量（斤）
  unitPrice: number; // 单价（斤）
  plateNumber: string; // 车牌号
  driver: string; // 驾驶员
  phone?: string; // 电话（可选）
  customerPhone?: string; // 客户电话
  paymentTime?: Date | null; // 何时付款
  origin: string; // 出发地
  destination: string; // 目的地
  paymentStatus: 'pending' | 'verified' | 'collected'; // 收款情况
  paymentMethod: string; // 收款方式
  driverWage?: number; // 人员工资
  loadingFee?: number; // 装卸费
  expectedExpense?: number; // 应支出
  actualExpense?: number; // 实际支出
  dailyProfit: number; // 当天利润
  remarks?: string; // 备注
  createdAt: Date;
  updatedAt: Date;
}

export interface UserInfo {
  id: string;
  username: string;
  email: string;
  role: 'admin' | 'operator';
  createdAt: Date;
}

export interface StatisticsData {
  dailyProfit: number;
  weeklyProfit: number;
  monthlyProfit: number;
  yearlyProfit: number;
  totalOrders: number;
  completedOrders: number;
  pendingOrders: number;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface OrderFilters {
  category?: string;
  paymentStatus?: OrderInfo['paymentStatus'];
  dateRange?: {
    start: Date;
    end: Date;
  };
  origin?: string;
  destination?: string;
  search?: string; // 搜索关键词
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
