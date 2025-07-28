import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { UserInfo, LoginCredentials } from '../types';
import { mockApi } from '../mocks/api';

interface AuthState {
  user: UserInfo | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

interface AuthActions {
  login: (credentials: LoginCredentials) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>()(
  immer((set) => ({
    // State
    user: null,
    isAuthenticated: false,
    isLoading: false,
    error: null,

    // Actions
    login: async (credentials: LoginCredentials) => {
      set((state) => {
        state.isLoading = true;
        state.error = null;
      });

      try {
        const response = await mockApi.login(credentials);

        if (response.success) {
          set((state) => {
            state.user = response.data;
            state.isAuthenticated = true;
            state.isLoading = false;
          });

          // 存储到localStorage
          localStorage.setItem('user', JSON.stringify(response.data));
          localStorage.setItem('isAuthenticated', 'true');

          return true;
        } else {
          set((state) => {
            state.error = response.error || '登录失败';
            state.isLoading = false;
          });
          return false;
        }
      } catch {
        set((state) => {
          state.error = '网络错误，请稍后重试';
          state.isLoading = false;
        });
        return false;
      }
    },

    logout: () => {
      set((state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      });

      // 清除localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    },

    getCurrentUser: async () => {
      // 从localStorage恢复状态
      const savedUser = localStorage.getItem('user');
      const savedAuth = localStorage.getItem('isAuthenticated');

      if (savedUser && savedAuth === 'true') {
        try {
          const user = JSON.parse(savedUser);
          set((state) => {
            state.user = user;
            state.isAuthenticated = true;
          });
        } catch {
          // localStorage数据损坏，清除
          localStorage.removeItem('user');
          localStorage.removeItem('isAuthenticated');
        }
      }
    },

    clearError: () => {
      set((state) => {
        state.error = null;
      });
    },
  }))
);
