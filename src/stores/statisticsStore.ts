import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { StatisticsData } from '../types';
import { mockApi } from '../mocks/api';

interface StatisticsState {
  statistics: StatisticsData | null;
  chartData: {
    daily: unknown[];
    weekly: unknown[];
    monthly: unknown[];
  };
  isLoading: boolean;
  isLoadingChart: boolean;
  error: string | null;
}

interface StatisticsActions {
  fetchStatistics: () => Promise<void>;
  fetchChartData: (type: 'daily' | 'weekly' | 'monthly') => Promise<void>;
  fetchAllChartData: () => Promise<void>;
  clearError: () => void;
}

export const useStatisticsStore = create<StatisticsState & StatisticsActions>()(
  immer((set) => ({
    // State
    statistics: null,
    chartData: {
      daily: [],
      weekly: [],
      monthly: [],
    },
    isLoading: false,
    isLoadingChart: false,
    error: null,

    // Actions
    fetchStatistics: async () => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await mockApi.getStatistics();

        if (response.success) {
          set((state) => {
            state.statistics = response.data;
            state.isLoading = false;
          });
        } else {
          set((state) => {
            state.error = response.error || '获取统计数据失败';
            state.isLoading = false;
          });
        }
      } catch {
        set((state) => {
          state.error = '网络错误，请稍后重试';
          state.isLoading = false;
        });
      }
    },

    fetchChartData: async (type: 'daily' | 'weekly' | 'monthly') => {
      set((state) => {
        state.isLoadingChart = true;
        state.error = null;
      });

      try {
        const response = await mockApi.getChartData(type);

        if (response.success) {
          set((state) => {
            state.chartData[type] = response.data;
            state.isLoadingChart = false;
          });
        } else {
          set((state) => {
            state.error = response.error || '获取图表数据失败';
            state.isLoadingChart = false;
          });
        }
      } catch {
        set((state) => {
          state.error = '网络错误，请稍后重试';
          state.isLoadingChart = false;
        });
      }
    },

    fetchAllChartData: async () => {
      set((state) => {
        state.isLoadingChart = true;
        state.error = null;
      });

      try {
        const [dailyResponse, weeklyResponse, monthlyResponse] =
          await Promise.all([
            mockApi.getChartData('daily'),
            mockApi.getChartData('weekly'),
            mockApi.getChartData('monthly'),
          ]);

        if (
          dailyResponse.success &&
          weeklyResponse.success &&
          monthlyResponse.success
        ) {
          set((state) => {
            state.chartData.daily = dailyResponse.data;
            state.chartData.weekly = weeklyResponse.data;
            state.chartData.monthly = monthlyResponse.data;
            state.isLoadingChart = false;
          });
        } else {
          set((state) => {
            state.error = '获取图表数据失败';
            state.isLoadingChart = false;
          });
        }
      } catch {
        set((state) => {
          state.error = '网络错误，请稍后重试';
          state.isLoadingChart = false;
        });
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);
