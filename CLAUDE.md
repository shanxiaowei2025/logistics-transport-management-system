# AI 助手核心规则

Always respond in Chinese.

## 三阶段工作流

### 阶段一：分析问题

**声明格式**：`【分析问题】`

**必须做的事**：

- 深入理解需求本质
- 搜索所有相关代码
- 识别问题根因
- 发现架构问题
- 如果有不清楚的，请向我收集必要的信息
- 提供1~3个解决方案（如果方案与用户想达成的目标有冲突，则不应该成为一个方案）
- 评估每个方案的优劣

**融入的原则**：

- 系统性思维：看到具体问题时，思考整个系统
- 第一性原则：从功能本质出发，而不是现有代码
- DRY原则：发现重复代码必须指出
- 长远考虑：评估技术债务和维护成本

**绝对禁止**：

- ❌ 修改任何代码
- ❌ 急于给出解决方案
- ❌ 跳过搜索和理解步骤
- ❌ 不分析就推荐方案

### 阶段二：细化方案

**声明格式**：`【细化方案】`

**前置条件**：

- 用户明确选择了方案（如："用方案1"、"实现这个"）

**必须做的事**：

- 列出变更（新增、修改、删除）的文件，简要描述每个文件的变化

### 阶段三：执行方案

**声明格式**：`【执行方案】`

**必须做的事**：

- 严格按照选定方案实现
- 修改后运行代码格式化（pnpm format）、类型检查（pnpm type-check）

**绝对禁止**：

- ❌ 提交代码（除非用户明确要求）
- 启动开发服务器

## 🚨 阶段切换规则

1. **默认阶段**：收到新问题时，始终从【分析问题】开始
2. **切换条件**：只有用户明确指示时才能切换阶段
3. **禁止行为**：不允许在一次回复中同时进行两个阶段

## ⚠️ 每次回复前的强制检查

```
□ 我在回复开头声明了阶段吗？
□ 我的行为符合当前阶段吗？
□ 如果要切换阶段，用户同意了吗？
```

---

# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a Logistics Transport Management System built with React 19, TypeScript, and Vite. The project is designed for logistics companies to manage transport orders, track financial data, and analyze profit metrics. It uses a modern tech stack with TailwindCSS for styling, Ant Design for UI components, and Zustand for state management.

## Development Commands

### Package Management

- Uses **pnpm** as the package manager (specified in package.json)
- Install dependencies: `pnpm install`
- Add dependencies: `pnpm add <package>`
- Add dev dependencies: `pnpm add -D <package>`

### Core Development Commands

- **Development server**: `pnpm dev` - Starts Vite dev server with HMR
- **Build**: `pnpm build` - TypeScript compilation followed by Vite production build
- **Lint**: `pnpm lint` - Run ESLint on the entire codebase
- **Preview**: `pnpm preview` - Preview production build locally

### Code Quality

- **Format code**: Use Prettier (configured in `.prettierrc`)
- **Type checking**: TypeScript is configured with strict mode
- No test runner is currently configured

## Architecture Overview

### State Management Architecture

The application uses **Zustand with Immer middleware** for state management, organized into domain-specific stores:

- **authStore** (`src/stores/authStore.ts`): User authentication, login/logout, session persistence via localStorage
- **orderStore** (`src/stores/orderStore.ts`): Order CRUD operations, pagination, filtering, and order management
- **statisticsStore** (`src/stores/statisticsStore.ts`): Dashboard statistics, chart data for daily/weekly/monthly reports

Each store follows the pattern:

- State interfaces separate from action interfaces
- Immer middleware for immutable updates
- Async actions with loading/error states
- localStorage persistence where needed

### Mock Data System

The project includes a comprehensive mock data system in `src/mocks/`:

- **data.ts**: Generates 100 realistic orders with Chinese business logic (categories, cities, payment methods)
- **api.ts**: Complete mock API with delay simulation, pagination, filtering, and CRUD operations
- Mock API supports all business operations: authentication, order management, statistics, chart data

### Type System

Centralized TypeScript definitions in `src/types/index.ts`:

- **OrderInfo**: Core business entity with financial calculations (profit = revenue - expenses)
- **UserInfo**: User authentication with role-based access (admin/operator)
- **StatisticsData**: Dashboard metrics (daily/weekly/monthly/yearly profits)
- **API types**: Generic ApiResponse, PaginatedResponse, filtering interfaces

### Business Domain Logic

The system models Chinese logistics operations:

- **Order Management**: Categories (电子产品, 服装鞋帽, etc.), Chinese cities, vehicle plate numbers
- **Financial Tracking**: Driver wages, loading fees, expected vs actual expenses, profit calculations
- **Payment Status Flow**: pending → verified → collected
- **Multi-role System**: Admin and operator roles with different permissions

### Styling Architecture

- **TailwindCSS v4.x** with Vite plugin integration
- **Ant Design v5** for UI components with React 19 compatibility patch
- TailwindCSS configured in `vite.config.ts`, imported in `src/index.css`

### Development Patterns

**Store Usage Pattern**:

```typescript
const { orders, isLoading, fetchOrders } = useOrderStore();
// Actions return boolean success for UI feedback
const success = await createOrder(orderData);
```

**Mock API Pattern**:

```typescript
// All mock APIs return ApiResponse<T> with success/error handling
const response = await mockApi.getOrders(pagination, filters);
if (response.success) {
  /* handle data */
}
```

**Constants Usage**:

```typescript
// Use constants for business logic, not magic strings
import { PAYMENT_STATUS, CATEGORIES } from '../constants';
```

## Key Integration Points

### React 19 Compatibility

- Uses `@ant-design/v5-patch-for-react-19` for Ant Design compatibility
- React Router v7 configured for React 19 features

### Data Flow

1. Components consume Zustand stores
2. Stores call mock API functions
3. Mock API returns realistic business data
4. State updates trigger UI re-renders

### Build Configuration

- Vite with React and TailwindCSS plugins
- TypeScript with strict configuration
- ESLint with React hooks and refresh plugins

## File Structure Significance

- **src/stores/**: Domain-driven state management (auth, orders, statistics)
- **src/mocks/**: Complete mock backend with realistic Chinese business data
- **src/types/**: Centralized TypeScript definitions for the entire application
- **src/constants/**: Business constants (payment statuses, categories, cities, routes)
- **src/pages/**: Feature-based page components (Login, Dashboard, Orders, Reports)
- **src/components/**: Reusable UI components organized by type (Layout, Forms, Charts, Common)
