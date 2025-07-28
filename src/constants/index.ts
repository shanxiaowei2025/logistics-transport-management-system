export const PAYMENT_STATUS = {
  PENDING: 'pending' as const,
  VERIFIED: 'verified' as const,
  COLLECTED: 'collected' as const,
};

export const PAYMENT_STATUS_LABELS = {
  [PAYMENT_STATUS.PENDING]: '待付款',
  [PAYMENT_STATUS.VERIFIED]: '已核实',
  [PAYMENT_STATUS.COLLECTED]: '已收款',
};

export const PAYMENT_STATUS_OPTIONS = [
  { value: 'pending', label: '待付款' },
  { value: 'verified', label: '已核实' },
  { value: 'collected', label: '已收款' },
];

export const USER_ROLES = {
  ADMIN: 'admin' as const,
  OPERATOR: 'operator' as const,
};

export const USER_ROLE_LABELS = {
  [USER_ROLES.ADMIN]: '管理员',
  [USER_ROLES.OPERATOR]: '操作员',
};

export const CATEGORIES = [
  '电子产品',
  '服装鞋帽',
  '食品饮料',
  '家具建材',
  '化工产品',
  '机械设备',
  '汽车配件',
  '医药保健',
  '图书文具',
  '其他货物',
];

export const PAYMENT_METHODS = [
  { value: 'cash', label: '现金' },
  { value: 'wechat', label: '微信支付' },
  { value: 'alipay', label: '支付宝' },
  { value: 'bank_transfer', label: '银行转账' },
  { value: 'bank_card', label: '银行卡' },
  { value: 'check', label: '支票' },
];

export const CITIES = [
  '北京',
  '上海',
  '广州',
  '深圳',
  '杭州',
  '南京',
  '武汉',
  '重庆',
  '成都',
  '西安',
  '天津',
  '青岛',
  '苏州',
  '长沙',
  '郑州',
  '大连',
  '宁波',
  '福州',
  '厦门',
  '昆明',
];

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/',
  ORDERS: '/orders',
  REPORTS: '/reports',
} as const;

export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  LOGOUT: '/api/auth/logout',
  ORDERS: '/api/orders',
  STATISTICS: '/api/statistics',
  USER_INFO: '/api/user/info',
} as const;

export const DEFAULT_PAGE_SIZE = 10;
export const MAX_PAGE_SIZE = 100;
