import React from 'react';
import { SWRConfig } from 'swr';
import { mockApi } from '../mocks/api';
import { message } from 'antd';

// SWR fetcher 函数
export const fetcher = async (key: string) => {
  try {
    // 解析key，调用对应的mock API
    const [endpoint, ...params] = key.split('|');

    switch (endpoint) {
      case 'orders': {
        const [pagination, filters] = params;
        return await mockApi.getOrders(
          pagination ? JSON.parse(pagination) : { page: 1, pageSize: 10 },
          filters ? JSON.parse(filters) : undefined
        );
      }

      case 'order': {
        const [orderId] = params;
        return await mockApi.getOrder(orderId);
      }

      case 'statistics':
        return await mockApi.getStatistics();

      case 'chartData': {
        const [chartType] = params;
        return await mockApi.getChartData(chartType);
      }

      case 'userInfo': {
        const [userId] = params;
        return await mockApi.getUserInfo(userId);
      }

      default:
        throw new Error(`未知的API端点: ${endpoint}`);
    }
  } catch (error) {
    console.error('API请求错误:', error);
    message.error('数据加载失败，请重试');
    throw error;
  }
};

// SWR 全局配置
export const swrConfig = {
  fetcher,
  revalidateOnFocus: false,
  revalidateOnReconnect: true,
  shouldRetryOnError: true,
  errorRetryCount: 3,
  errorRetryInterval: 1000,
  onError: (error: unknown) => {
    console.error('SWR错误:', error);
    if (
      (error as { response?: { status: number } })?.response?.status === 401
    ) {
      // 处理认证错误
      message.error('登录已过期，请重新登录');
      // 这里可以触发登出逻辑
    }
  },
};

// SWR Provider 组件
interface SWRProviderProps {
  children: React.ReactNode;
}

export const SWRProvider: React.FC<SWRProviderProps> = ({ children }) => {
  return React.createElement(SWRConfig, { value: swrConfig }, children);
};
