import Decimal from "decimal.js";

/**
 * Intl.NumberFormat 支持的舍入模式类型
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat#roundingmode
 */
export type RoundingMode =
  | "ceil" // 类似 Math.ceil 向正无穷方向舍入 (1.2 → 2, -1.2 → -1)
  | "floor" // 类似 Math.floor 向负无穷方向舍入 (1.8 → 1, -1.8 → -2)
  | "expand" // 远离零方向舍入，正数向上，负数向下 (1.2 → 2, -1.2 → -2)
  | "trunc" // 向 0 截断（直接砍掉） (1.8 → 1, -1.8 → -1)
  // 【half】类：遇到 0.5 才分情况
  | "halfCeil" // 四舍五入，.5 时向正无穷方向舍入 (1.5 → 2, -1.5 → -1)
  | "halfFloor" // 四舍五入，.5 时向负无穷方向舍入 (1.5 → 1, -1.5 → -2)
  | "halfExpand" // 四舍五入，.5 时远离零方向舍入 (1.5 → 2, -1.5 → -2)
  | "halfTrunc" // 四舍五入，.5 时向零方向舍入 (1.5 → 1, -1.5 → -1)
  | "halfEven"; // 四舍六入五成双（银行家舍入法）(.5 时向最近的偶数舍入)

/**
 * Intl.NumberFormat 舍入模式到 Decimal.js 舍入模式的映射
 * 每种模式都有详细的中文说明和示例
 */
export const ROUNDING_MODE_MAP: Record<RoundingMode, Decimal.Rounding> = {
  ceil: Decimal.ROUND_CEIL, // +∞
  floor: Decimal.ROUND_FLOOR, // -∞
  expand: Decimal.ROUND_UP, // 远离 0
  trunc: Decimal.ROUND_DOWN, // 向 0

  halfExpand: Decimal.ROUND_HALF_UP, // 四舍五入
  halfTrunc: Decimal.ROUND_HALF_DOWN, // 0.5 向 0
  halfCeil: Decimal.ROUND_HALF_CEIL, // 0.5 → +∞
  halfFloor: Decimal.ROUND_HALF_FLOOR, // 0.5 → -∞
  halfEven: Decimal.ROUND_HALF_EVEN, // 银行家
};

/**
 * 简化版舍入函数（跳过参数验证，性能更高）
 * @param value - 要舍入的数字
 * @param precision - 小数位数，默认为 2
 * @param roundingMode - 舍入模式，默认为 'halfEven'
 * @returns 舍入后的数字
 */
export function roundNumber(
  value: number | string | Decimal,
  precision: number = 2,
  roundingMode: RoundingMode = "halfEven"
): number {
  // const decimalRoundingMode =
  //   ROUNDING_MODE_MAP[roundingMode] || Decimal.ROUND_HALF_EVEN;

  // return new Decimal(value)
  //   .toDecimalPlaces(precision, decimalRoundingMode)
  //   .toNumber();

  const mode = ROUNDING_MODE_MAP[roundingMode];
  const factor = new Decimal(10).pow(precision);

  // === Intl quantize + round 模型 ===
  return new Decimal(value)
    .mul(factor) // ① scale
    .toNearest(1, mode) // ② 整数舍入（⚠️ 关键）
    .div(factor) // ③ unscale
    .toNumber();
}

export { roundNumber as numberRounding };
