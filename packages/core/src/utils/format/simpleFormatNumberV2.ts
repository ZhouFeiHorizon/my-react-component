// src/utils/number-formatter.ts
import {
  resolveNumberUnit,
  NumberUnitType,
  NumberUnitOptions,
} from "../number/numberUnit";
import { numberCompute } from "../number/numberCompute";
import { RoundingMode, numberRounding } from "../number/numberRounding";

import { Decimal } from 'decimal.js'

type CurrencyDisplayType = "symbol" | "code" | "name";

export interface NumberFormatOptions {
  /**
   * 格式化样式，默认是 decimal
   */
  style?: "decimal" | "currency" | "percent" | undefined;

  // ========= 货币 =========
  /**
   * 指定国家地区代码
   * zh-CN, en-US, en-GB, ja-JP
   */
  localeCode?: string;
  /**
   * 货币代码，当 type 为 'currency' 时必需
   * 支持的货币代码：CNY, USD
   */
  currency?: string | undefined;
  /**
   * 货币显示方式
   */
  currencyDisplay?: CurrencyDisplayType | undefined;

  /**
   * 是否使用分组分隔符，例如 1,000,000
   */
  useGrouping?: boolean | undefined;

  // ========= 小数 =========
  /**
   * 整数部分的最小位数，不够的话会在前面补 0
   */
  minimumIntegerDigits?: number | undefined;

  /**
   * 小数部分的最小位数，不够的话会在后面补 0
   */
  minimumFractionDigits?: number | undefined;

  /**
   * 小数部分的最大位数，超过的话会进行四舍五入
   */
  maximumFractionDigits?: number | undefined;

  // ========= 单位 =========
  /**
   * 数字单位
   * 数字展示的单位，比如"万"、"亿"等
   */
  numberUnit?: NumberUnitOptions | NumberUnitType;
  /**
   * 自定义单位
   * 附加在数值后的单位（如："h"表示小时，"km"表示千米）
   */
  unit?: string;

  /**
   * 舍入模式
   */
  roundingMode?: RoundingMode;

  /**
   * 空值占位符
   */
  empty?: string;

  /**
   * 数值转换函数
   * 用于在格式化前对数值进行自定义转换
   * 例如：将后端返回的分转换为元
   * @param val 原始数值
   * @returns 转换后的数值
   *
   * @example
   * // 分->元
   * transform: ["divide", 1000],
   * // 元->分
   * transform: ["multiply", 1000],
   */
  transform?:
    | ((val: number) => number)
    | ["multiply", number]
    | ["divide", number];
}

export type NumberPartType =
  | keyof Intl.NumberFormatPartTypeRegistry
  | "numberUnit"
  | "unit";

export type NumberPart = {
  type: NumberPartType;
  value: string;
};

export type NumberResult = {
  /** 完整的格式化字符串 */
  formattedNumber: string;
  /** 各部分的分段数据 */
  parts: NumberPart[];
  /**
   * 原始数值, 注意，通过 transform 转换后的数值
   */
  number: number | null | undefined;
  isEmpty: boolean;
};

export const formatNumber = (
  number: number | null | undefined,
  options?: NumberFormatOptions
): string => {
  return formatNumberResult(number, options).formattedNumber;
};

const defaultLocale = {
  CNY: "zh-CN",
  USD: "en-US",
};

/**
 * 格式化数字并返回详细结果
 */
export function formatNumberResult(
  number?: number | null | undefined,
  options?: NumberFormatOptions
): NumberResult {
  const { empty = "-" } = options || {};
  // 处理空值
  if (
    number === null ||
    number === undefined ||
    isNaN(number) ||
    !Number.isFinite(number)
  ) {
    return {
      formattedNumber: empty,
      number: number,
      isEmpty: true,
      parts: [],
    };
  }

  const {
    style: style = "decimal",
    currency = "CNY",
    localeCode = defaultLocale[currency],
    currencyDisplay = "symbol",
    useGrouping = true,
    minimumIntegerDigits = 1,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    roundingMode = 'halfExpand',
    numberUnit,
    unit: unitSymbol,
    transform,
  } = options || {};

  let transformValue: number | Decimal = number;
  // 转换数值
  if (typeof transform === "function") {
    transformValue = transform(number);
  } else if (Array.isArray(transform)) {
    const [operation, value] = transform;

    if (value) {
      if (operation === "multiply") {
        transformValue = new Decimal(number).mul(value)
      } else if (operation === "divide") {
        transformValue = new Decimal(number).div(value);
      }
    }
  }

  let decimal: Decimal = new Decimal(transformValue);

  const { divisor, symbol: numberUnitSymbol } = resolveNumberUnit(
    number,
    numberUnit
  );

  if (divisor !== 0) {
    decimal = decimal.mul(divisor);
  }
  const formatter = new Intl.NumberFormat(localeCode, {
    style,
    currency,
    useGrouping,
    currencyDisplay,
    minimumIntegerDigits,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: "standard",
    // roundingMode: roundingMode, 避免不兼容
  });

  const formatValue = decimal.toDecimalPlaces(maximumFractionDigits, roundingMode)

  const parts: NumberPart[] = formatter.formatToParts(formatValue);
  if (numberUnitSymbol) {
    parts.push({
      type: "numberUnit",
      value: numberUnitSymbol,
    });
  }

  if (unitSymbol) {
    parts.push({
      type: "unit",
      value: unitSymbol,
    });
  }

  return {
    isEmpty: false,
    number: Number(transformValue),
    formattedNumber: parts.map((part) => part.value).join(""),
    parts,
  };
}

