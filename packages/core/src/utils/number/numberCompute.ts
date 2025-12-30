/**
 * js 数字精度问题
 */

// bug: 69.9 * 100 = 6990.000000000001
// bug: 19.9 * 100 = 1989.9999999999998

import Decimal from "decimal.js";

type ComputeType = "+" | "-" | "*" | "/";

/**
 * 数字运算（主要用于小数点精度问题）
 * @param {number} a 前面的值
 * @param {"+"|"-"|"*"|"/"} type 计算方式
 * @param {number} b 后面的值
 * @example
 */
export function numberCompute(a: number, type: ComputeType, b: number) {
  let decimal: Decimal;
  switch (type) {
    case "+":
      decimal = new Decimal(a).add(b);
      break;
    case "-":
      decimal = new Decimal(a).sub(b);
      break;
    case "*":
      decimal = new Decimal(a).mul(b);
      break;
    case "/":
      decimal = new Decimal(a).div(b);
      break;
    default:
      decimal = new Decimal(a);
      break;
  }
  return decimal.toNumber();
}

/**
 * 加
 */
export const add = (a: number, b: number): number => {
  return numberCompute(a, "+", b);
};
/**
 * 减
 */
export const subtract = (a: number, b: number): number => {
  return numberCompute(a, "-", b);
};
/**
 * 乘
 */
export const multiply = (a: number, b: number): number => {
  return numberCompute(a, "*", b);
};

/** 除 */
export const divided = (a: number, b: number): number => {
  return numberCompute(a, "/", b);
};
