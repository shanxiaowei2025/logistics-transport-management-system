import Decimal from 'decimal.js';

// 配置 Decimal.js
Decimal.config({
  precision: 10, // 精度为10位
  rounding: Decimal.ROUND_HALF_UP, // 四舍五入
  toExpNeg: -7, // 负指数阈值
  toExpPos: 21, // 正指数阈值
});

/**
 * 加法运算
 */
export const add = (a: number | string, b: number | string): number => {
  return new Decimal(a).add(new Decimal(b)).toNumber();
};

/**
 * 减法运算
 */
export const subtract = (a: number | string, b: number | string): number => {
  return new Decimal(a).sub(new Decimal(b)).toNumber();
};

/**
 * 乘法运算
 */
export const multiply = (a: number | string, b: number | string): number => {
  return new Decimal(a).mul(new Decimal(b)).toNumber();
};

/**
 * 除法运算
 */
export const divide = (a: number | string, b: number | string): number => {
  return new Decimal(a).div(new Decimal(b)).toNumber();
};

/**
 * 格式化为货币显示
 */
export const formatCurrency = (
  amount: number | string,
  precision: number = 2
): string => {
  return new Decimal(amount).toFixed(precision);
};

/**
 * 计算数组总和
 */
export const sum = (numbers: (number | string)[]): number => {
  return numbers.reduce((acc, num) => add(acc, num), 0);
};

/**
 * 计算数组平均值
 */
export const average = (numbers: (number | string)[]): number => {
  if (numbers.length === 0) return 0;
  return divide(sum(numbers), numbers.length);
};

/**
 * 计算利润
 */
export const calculateProfit = (
  weight: number | string,
  unitPrice: number | string,
  expenses: number | string = 0
): number => {
  const revenue = multiply(weight, unitPrice);
  return subtract(revenue, expenses);
};

export default {
  add,
  subtract,
  multiply,
  divide,
  formatCurrency,
  sum,
  average,
  calculateProfit,
};
