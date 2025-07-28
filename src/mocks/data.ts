import { OrderInfo, UserInfo, StatisticsData } from '../types';
import {
  CATEGORIES,
  CITIES,
  PAYMENT_METHODS,
  PAYMENT_STATUS,
} from '../constants';

// 生成随机数字
const randomInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

// 生成随机数组元素
const randomFromArray = <T>(arr: T[]): T =>
  arr[Math.floor(Math.random() * arr.length)];

// 生成随机日期
const randomDate = (start: Date, end: Date) =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));

// 生成随机手机号
const randomPhone = () =>
  `1${randomInt(3, 9)}${randomInt(100000000, 999999999)}`;

// 生成随机车牌号
const randomPlateNumber = () => {
  const provinces = [
    '京',
    '沪',
    '粤',
    '苏',
    '浙',
    '鲁',
    '豫',
    '川',
    '湘',
    '鄂',
  ];
  const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const province = randomFromArray(provinces);
  const letter = randomFromArray(letters.split(''));
  const numbers = randomInt(10000, 99999);
  return `${province}${letter}${numbers}`;
};

// 生成随机姓名
const randomName = () => {
  const surnames = [
    '张',
    '王',
    '李',
    '赵',
    '刘',
    '陈',
    '杨',
    '黄',
    '周',
    '吴',
    '徐',
    '孙',
    '马',
    '朱',
    '胡',
    '林',
    '郭',
    '何',
    '高',
    '罗',
  ];
  const names = [
    '伟',
    '芳',
    '娜',
    '敏',
    '静',
    '丽',
    '强',
    '磊',
    '军',
    '洋',
    '勇',
    '艳',
    '杰',
    '娟',
    '涛',
    '明',
    '超',
    '秀英',
    '霞',
    '平',
    '刚',
    '桂英',
  ];
  return randomFromArray(surnames) + randomFromArray(names);
};

// 生成订单Mock数据
export const generateMockOrders = (count: number = 100): OrderInfo[] => {
  const orders: OrderInfo[] = [];
  const now = new Date();
  const oneYearAgo = new Date(
    now.getFullYear() - 1,
    now.getMonth(),
    now.getDate()
  );

  for (let i = 1; i <= count; i++) {
    const weight = randomInt(100, 5000);
    const unitPrice = Number((Math.random() * 10 + 1).toFixed(2));
    const totalRevenue = weight * unitPrice;
    const driverWage = randomInt(300, 1500);
    const loadingFee = randomInt(100, 800);
    const expectedExpense = driverWage + loadingFee + randomInt(200, 1000);
    const actualExpense = expectedExpense + randomInt(-200, 300);
    const dailyProfit = totalRevenue - actualExpense;

    const createdAt = randomDate(oneYearAgo, now);
    const paymentTime = Math.random() > 0.3 ? randomDate(createdAt, now) : null;

    orders.push({
      id: `ORDER_${String(i).padStart(4, '0')}`,
      category: randomFromArray(CATEGORIES),
      weight,
      unitPrice,
      plateNumber: randomPlateNumber(),
      driver: randomName(),
      phone: randomPhone(),
      paymentTime,
      origin: randomFromArray(CITIES),
      destination: randomFromArray(
        CITIES.filter(
          (city, index, arr) => index !== arr.indexOf(randomFromArray(CITIES))
        )
      ),
      paymentStatus: paymentTime
        ? randomFromArray([PAYMENT_STATUS.VERIFIED, PAYMENT_STATUS.COLLECTED])
        : PAYMENT_STATUS.PENDING,
      paymentMethod: randomFromArray(PAYMENT_METHODS),
      driverWage,
      loadingFee,
      expectedExpense,
      actualExpense,
      dailyProfit,
      createdAt,
      updatedAt: randomDate(createdAt, now),
    });
  }

  return orders.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// 生成用户Mock数据
export const generateMockUsers = (): UserInfo[] => {
  return [
    {
      id: 'USER_001',
      username: 'admin',
      email: 'admin@logistics.com',
      role: 'admin',
      createdAt: new Date('2023-01-01'),
    },
    {
      id: 'USER_002',
      username: 'operator1',
      email: 'operator1@logistics.com',
      role: 'operator',
      createdAt: new Date('2023-02-15'),
    },
    {
      id: 'USER_003',
      username: 'operator2',
      email: 'operator2@logistics.com',
      role: 'operator',
      createdAt: new Date('2023-03-10'),
    },
  ];
};

// 计算统计数据
export const calculateStatistics = (orders: OrderInfo[]): StatisticsData => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const weekStart = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const yearStart = new Date(now.getFullYear(), 0, 1);

  const dailyOrders = orders.filter((order) => order.createdAt >= today);
  const weeklyOrders = orders.filter((order) => order.createdAt >= weekStart);
  const monthlyOrders = orders.filter((order) => order.createdAt >= monthStart);
  const yearlyOrders = orders.filter((order) => order.createdAt >= yearStart);

  const completedOrders = orders.filter(
    (order) => order.paymentStatus === PAYMENT_STATUS.COLLECTED
  );
  const pendingOrders = orders.filter(
    (order) => order.paymentStatus === PAYMENT_STATUS.PENDING
  );

  return {
    dailyProfit: dailyOrders.reduce((sum, order) => sum + order.dailyProfit, 0),
    weeklyProfit: weeklyOrders.reduce(
      (sum, order) => sum + order.dailyProfit,
      0
    ),
    monthlyProfit: monthlyOrders.reduce(
      (sum, order) => sum + order.dailyProfit,
      0
    ),
    yearlyProfit: yearlyOrders.reduce(
      (sum, order) => sum + order.dailyProfit,
      0
    ),
    totalOrders: orders.length,
    completedOrders: completedOrders.length,
    pendingOrders: pendingOrders.length,
  };
};

// 初始化Mock数据
export const mockOrders = generateMockOrders(100);
export const mockUsers = generateMockUsers();
export const mockStatistics = calculateStatistics(mockOrders);
