import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { OrderInfo, OrderFilters, PaginationParams } from '../types';
import { mockApi } from '../mocks/api';
import { DEFAULT_PAGE_SIZE } from '../constants';

interface OrderState {
  orders: OrderInfo[];
  currentOrder: OrderInfo | null;
  pagination: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
  filters: OrderFilters;
  isLoading: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  error: string | null;
}

interface OrderActions {
  fetchOrders: (params?: Partial<PaginationParams>) => Promise<void>;
  fetchOrder: (id: string) => Promise<void>;
  createOrder: (
    orderData: Omit<OrderInfo, 'id' | 'createdAt' | 'updatedAt'>
  ) => Promise<boolean>;
  updateOrder: (id: string, orderData: Partial<OrderInfo>) => Promise<boolean>;
  deleteOrder: (id: string) => Promise<boolean>;
  setFilters: (filters: Partial<OrderFilters>) => void;
  clearFilters: () => void;
  setCurrentOrder: (order: OrderInfo | null) => void;
  clearError: () => void;
}

export const useOrderStore = create<OrderState & OrderActions>()(
  immer((set, get) => ({
    // State
    orders: [],
    currentOrder: null,
    pagination: {
      page: 1,
      pageSize: DEFAULT_PAGE_SIZE,
      total: 0,
      totalPages: 0,
    },
    filters: {},
    isLoading: false,
    isCreating: false,
    isUpdating: false,
    error: null,

    // Actions
    fetchOrders: async (params) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
        if (params?.page) state.pagination.page = params.page;
        if (params?.pageSize) state.pagination.pageSize = params.pageSize;
      });

      try {
        const { pagination, filters } = get();
        const response = await mockApi.getOrders(
          {
            page: params?.page || pagination.page,
            pageSize: params?.pageSize || pagination.pageSize,
          },
          Object.keys(filters).length > 0 ? filters : undefined
        );

        if (response.success) {
          set((state) => {
            state.orders = response.data.data;
            state.pagination = {
              page: response.data.page,
              pageSize: response.data.pageSize,
              total: response.data.total,
              totalPages: response.data.totalPages,
            };
            state.isLoading = false;
          });
        } else {
          set((state) => {
            state.error = response.error || '获取订单列表失败';
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

    fetchOrder: async (id: string) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await mockApi.getOrder(id);

        if (response.success) {
          set((state) => {
            state.currentOrder = response.data;
            state.isLoading = false;
          });
        } else {
          set((state) => {
            state.error = response.error || '获取订单详情失败';
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

    createOrder: async (orderData) => {
      set((state) => {
        state.isCreating = true;
        state.error = null;
      });

      try {
        const response = await mockApi.createOrder(orderData);

        if (response.success) {
          set((state) => {
            state.orders.unshift(response.data);
            state.pagination.total += 1;
            state.isCreating = false;
          });
          return true;
        } else {
          set((state) => {
            state.error = response.error || '创建订单失败';
            state.isCreating = false;
          });
          return false;
        }
      } catch {
        set((state) => {
          state.error = '网络错误，请稍后重试';
          state.isCreating = false;
        });
        return false;
      }
    },

    updateOrder: async (id: string, orderData) => {
      set((state) => {
        state.isUpdating = true;
        state.error = null;
      });

      try {
        const response = await mockApi.updateOrder(id, orderData);

        if (response.success) {
          set((state) => {
            const index = state.orders.findIndex((order) => order.id === id);
            if (index !== -1) {
              state.orders[index] = response.data;
            }
            if (state.currentOrder?.id === id) {
              state.currentOrder = response.data;
            }
            state.isUpdating = false;
          });
          return true;
        } else {
          set((state) => {
            state.error = response.error || '更新订单失败';
            state.isUpdating = false;
          });
          return false;
        }
      } catch {
        set((state) => {
          state.error = '网络错误，请稍后重试';
          state.isUpdating = false;
        });
        return false;
      }
    },

    deleteOrder: async (id: string) => {
      set((state) => {
        state.error = null;
      });

      try {
        const response = await mockApi.deleteOrder(id);

        if (response.success) {
          set((state) => {
            state.orders = state.orders.filter((order) => order.id !== id);
            state.pagination.total = Math.max(0, state.pagination.total - 1);
            if (state.currentOrder?.id === id) {
              state.currentOrder = null;
            }
          });
          return true;
        } else {
          set((state) => {
            state.error = response.error || '删除订单失败';
          });
          return false;
        }
      } catch {
        set((state) => {
          state.error = '网络错误，请稍后重试';
        });
        return false;
      }
    },

    setFilters: (newFilters) => {
      set((state) => {
        state.filters = { ...state.filters, ...newFilters };
        state.pagination.page = 1; // 重置到第一页
      });
    },

    clearFilters: () => {
      set((state) => {
        state.filters = {};
        state.pagination.page = 1;
      });
    },

    setCurrentOrder: (order) => {
      set((state) => {
        state.currentOrder = order;
      });
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);
