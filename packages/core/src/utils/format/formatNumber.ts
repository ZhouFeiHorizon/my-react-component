// src/utils/number-formatter.ts
import {
  NumberScaleMode,
  NumberScaleOptions,
  numberScale,
} from "../number/numberScale";
import { roundNumber, RoundingMode } from "../number/numberRounding";
import { numberCompute } from "../number/numberCompute";

type CurrencyDisplayType = "symbol" | "code" | "name";

export interface NumberFormatOptions {
  /**
   * 格式化样式，默认是 decimal
   */
  type?: "decimal" | "currency" | "percent" | undefined;

  // ========= 货币 =========
  /**
   * 指定国家地区代码
   * zh-CN, en-US, en-GB, ja-JP
   */
  localeCode?: string;
  /**
   * 货币代码，当 type 为 'currency' 时必需
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
  numberUnit?: NumberScaleMode | NumberScaleOptions;
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
   * 是否去除末尾的 0
   */
  trimZero?: boolean;

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

enum PartType {
  Sign = "sign", // 正负号（+/-）
  Currency = "currency", // 货币符号
  Integer = "integer", // 整数部分
  Fraction = "fraction", // 小数部分
  Separator = "separator", // 分组分隔符（如千分位逗号），逗号
  NumberUnit = "numberUnit", // 数值单位
  Unit = "unit", // 单位部分
}

export type NumberPartType = `${PartType}`;

export type NumberPart = {
  type: NumberPartType;
  value: string;
};

export type NumberResult = {
  // 完整的格式化字符串
  formattedNumber: string;
  // 各部分的分段数据
  parts: NumberPart[];
  // 是否为负数
  isNegative: boolean;
  // 原始值
  rawValue: number | null | undefined;
  // 是否为空值
  isEmpty: boolean;
  //  ====== 各部分快速访问 ======
  /** 正负号（+/-） */
  signSymbol: string;
  /** 货币符号（如"¥"、"$"等） */
  currencySymbol: string;
  /** 整数部分 */
  integerPart: string;
  // 小数部分
  fractionalPart: string;
  // 单位符号，如"h"、"km/h"等
  unitSymbol: string;
  /** 缩放单位符号（如"万"、"亿"等） */
  scaleUnitSymbol: string;
  // 分组信息（如果有千分位分隔符）
  groupedIntegerParts: string[];
};

export const formatNumber = (
  number: number | null | undefined,
  options?: NumberFormatOptions
): string => {
  return formatNumberResult(number, options).formattedNumber;
};

export function formatNumberResult(
  number?: number | null | undefined,
  options?: NumberFormatOptions
): NumberResult;

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
      parts: [],
      isNegative: false,
      rawValue: number,
      isEmpty: true,
      integerPart: "",
      fractionalPart: "",
      unitSymbol: "",
      currencySymbol: "",
      signSymbol: "",
      groupedIntegerParts: [],
      scaleUnitSymbol: "",
    };
  }

  const {
    type: style = "decimal",
    localeCode,
    currency = "CNY",
    currencyDisplay = "symbol",
    useGrouping = true,
    minimumIntegerDigits = 1,
    minimumFractionDigits = 0,
    maximumFractionDigits = 2,
    roundingMode = "halfExpand",
    numberUnit: numberScaleOptions,
    unit: unitSymbol = style === "percent" ? "%" : "",
    trimZero = false,
    transform = style === "percent" ? ["multiply", 100] : undefined,
  } = options || {};

  // 转换数值
  if (typeof transform === "function") {
    number = transform(number);
  } else if (Array.isArray(transform)) {
    const [operation, value] = transform;

    if (value) {
      if (operation === "multiply") {
        number = numberCompute(number, "*", value);
      } else if (operation === "divide") {
        number = numberCompute(number, "/", value);
      }
    }
  }

  const isNegative = number < 0;
  const absNumber = Math.abs(number);

  let processedNumber = absNumber;

  const { divisor, symbol: numberUnitSymbol } = numberScale(
    absNumber,
    typeof numberScaleOptions === "string"
      ? {
          mode: numberScaleOptions,
        }
      : numberScaleOptions
  );

  if (divisor !== 0) {
    processedNumber = numberCompute(absNumber, "/", divisor);
  }

  // 应用舍入
  const roundedNumber = roundNumber(
    processedNumber,
    maximumFractionDigits,
    roundingMode
  );

  // 转换为字符串并分割整数和小数部分
  let [integerStr, fractionStr = ""] = roundedNumber.toString().split(".");

  // 确保最小整数位数
  if (integerStr.length < minimumIntegerDigits) {
    integerStr =
      "0".repeat(minimumIntegerDigits - integerStr.length) + integerStr;
  }

  // 确保最小小数位数
  if (fractionStr.length < minimumFractionDigits) {
    fractionStr =
      fractionStr + "0".repeat(minimumFractionDigits - fractionStr.length);
  }

  // 去除末尾的0
  if (trimZero) {
    fractionStr = fractionStr.replace(/0+$/, "");
    if (fractionStr === "") {
      // 如果小数部分全是0，删除小数点
      fractionStr = "";
    }
  }

  // 应用千分位分隔符
  let formattedInteger = integerStr;
  const groupedParts: string[] = [];
  if (useGrouping && integerStr.length > 3) {
    const groups = [];
    let remaining = integerStr;
    while (remaining.length > 3) {
      groups.unshift(remaining.slice(-3));
      remaining = remaining.slice(0, -3);
    }
    if (remaining.length > 0) {
      groups.unshift(remaining);
    }
    formattedInteger = groups.join(",");
    groupedParts.push(...groups);
  } else {
    groupedParts.push(integerStr);
  }

  // 构建完整字符串
  const parts: NumberPart[] = [];

  // 负号
  if (isNegative) {
    parts.push({
      type: PartType.Sign,
      value: "-",
    });
  }

  // 货币符号
  let currencySymbol = "";
  if (style === "currency" && currency) {
    currencySymbol = getCurrencySymbol(localeCode, currency, currencyDisplay);
    if (
      currencyDisplay === "symbol" &&
      ["¥", "$", "€", "£"].includes(currencySymbol)
    ) {
      parts.push({
        type: PartType.Currency,
        value: currencySymbol,
      });
    }
  }

  // 整数部分（带千分位）
  if (useGrouping && formattedInteger.includes(",")) {
    // 处理带千分位的整数部分
    formattedInteger.split(",").forEach((str, index) => {
      if (index !== 0) {
        parts.push({
          type: PartType.Separator,
          value: ",",
        });
      }
      parts.push({
        type: PartType.Integer,
        value: str,
      });
    });
  } else {
    // 无千分位的整数部分
    parts.push({
      type: PartType.Integer,
      value: formattedInteger,
    });
  }

  // 小数点和小数部分
  if (fractionStr) {
    parts.push({
      type: PartType.Separator,
      value: ".",
    });

    parts.push({
      type: PartType.Fraction,
      value: fractionStr,
    });
  }

  // 货币符号在后
  if (style === "currency" && currency) {
    if (
      currencyDisplay === "code" ||
      currencyDisplay === "name" ||
      !["¥", "$", "€", "£"].includes(currencySymbol)
    ) {
      parts.push({
        type: "separator",
        value: " ",
      });
      parts.push({
        type: "currency",
        value: currencySymbol,
      });
    }
  }

  if (numberUnitSymbol) {
    parts.push({
      type: PartType.NumberUnit,
      value: numberUnitSymbol,
    });
  }

  if (unitSymbol) {
    parts.push({
      type: PartType.Unit,
      value: unitSymbol,
    });
  }

  return {
    formattedNumber: parts.map((part) => part.value).join(""),
    parts,
    isNegative,
    rawValue: number,
    isEmpty: false,
    integerPart: integerStr,
    fractionalPart: fractionStr,
    unitSymbol,
    currencySymbol,
    signSymbol: isNegative ? "-" : "",
    groupedIntegerParts: groupedParts,
    scaleUnitSymbol: numberUnitSymbol,
  };
}

/**
 * 获取货币符号
 */
function getCurrencySymbol(
  localeCode: string | undefined = undefined,
  currency: string = "CNY",
  currencyDisplay: CurrencyDisplayType = "symbol"
): string {
  const parts = new Intl.NumberFormat(localeCode, {
    style: "currency",
    currency: currency,
    currencyDisplay: currencyDisplay,
  }).formatToParts(1234.5);

  for (const part of parts) {
    if (part.type === "currency") {
      return part.value;
    }
  }
  return "";
}
