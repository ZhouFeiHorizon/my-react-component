// src/utils/number-formatter.ts
import {
  resolveNumberUnit,
  NumberUnitType,
  NumberUnitOptions,
} from "../number/numberUnit";
import { numberCompute } from "../number/numberCompute";

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
  // roundingMode?: RoundingMode;

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
  | Intl.NumberFormatPartTypes
  | "numberUnit"
  | "unit";

export type NumberPart = {
  type: NumberPartType;
  value: string;
};

export type NumberResult = {
  // 完整的格式化字符串
  formattedNumber: string;
  // 各部分的分段数据
  parts: NumberPart[];
};

const defaultOptions = {
  style: "decimal",
  localeCode: "zh-CN",
  useGrouping: true,
  minimumIntegerDigits: 1,
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
  empty: "-",
};

export class NumberFormatter {
  private options: NumberFormatOptions & typeof defaultOptions;

  private formatter: Intl.NumberFormat | undefined;
  private formatCache: Map<number | null | undefined, string> | undefined;

  constructor(options: NumberFormatOptions = {}) {
    const mergeOptions: NumberFormatOptions = { ...options };

    for (const prop in defaultOptions) {
      const key = prop as keyof NumberFormatOptions;
      if (options[key] === undefined) {
        // @ts-ignore
        mergeOptions[key] = defaultOptions[key];
      }
    }

    this.options = mergeOptions;
  }

  private applyTransform(number: number) {
    const { transform } = this.options;
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
    return number;
  }

  private createFormatter() {
    const {
      localeCode,
      style,
      currency,
      useGrouping,
      currencyDisplay,
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
    } = this.options;
    const formatter = new Intl.NumberFormat(localeCode, {
      style,
      currency,
      useGrouping,
      currencyDisplay,
      minimumIntegerDigits,
      minimumFractionDigits,
      maximumFractionDigits,
      notation: "standard",
    });

    return formatter;
  }

  private getFormatter() {
    return this.formatter || (this.formatter = this.createFormatter());
  }

  formatToResult(number?: number): NumberResult {
    if (number === null || number === undefined || !Number.isFinite(number)) {
      return {
        formattedNumber: this.options.empty,
        parts: [],
      };
    }

    const { numberUnit, unit: unitSymbol } = this.options;

    number = this.applyTransform(number);

    let processedNumber = number;

    const { divisor, symbol: numberUnitSymbol } = resolveNumberUnit(
      processedNumber,
      numberUnit
    );

    if (divisor !== 0) {
      processedNumber = numberCompute(number, "/", divisor);
    }

    const formatter = this.getFormatter();

    const parts: NumberPart[] = formatter.formatToParts(processedNumber);

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
      formattedNumber: parts.map((part) => part.value).join(""),
      parts,
    };
  }

  format(number?: number): string {
    let { formatCache } = this;
    if (!formatCache) {
      formatCache = this.formatCache = new Map();
    }
    if (!formatCache.has(number)) {
      formatCache.set(number, this.formatToResult(number).formattedNumber);
    }
    return formatCache.get(number) || "";
  }
}

