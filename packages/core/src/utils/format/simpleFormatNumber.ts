import {
  NumberScaleMode,
  NumberScaleOptions,
  numberScale,
} from "../number/numberScale";
import { numberCompute } from "../number/numberCompute";
import { RoundingMode } from "../number/numberRounding";

type CurrencyDisplayType = "symbol" | "code" | "name";

export interface NumberFormatOptions {
  /**
   * 格式化样式，默认是 decimal
   */
  style?: "decimal" | "currency" | "percent" | "filesize" | undefined;

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
  currency?: "CNY" | "USD" | (string & {});
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

  /**
   * 数字缩放
   * 比如缩放为 万、亿、万亿
   */
  numberScale?: NumberScaleMode | NumberScaleOptions;
  /**
   * 自定义单位
   * 附加在数值后的单位（如：元、小时、分钟）
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

export type NumberPartType = Intl.NumberFormatPartTypes | "scale" | "unit";

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
  /**
   * 数字缩放单位 (如："万", "亿")
   */
  scaleSymbol: string;
};

export const formatNumber = (
  number: string | number | null | undefined,
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
  val?: number | string | null | undefined,
  options: NumberFormatOptions = {}
): NumberResult {
  let number = Number(val);
  const isNumberEmpty = val === null || val === undefined || val === "";
  const isNotFinite = !Number.isFinite(number);

  if (isNumberEmpty || isNotFinite) {
    // 开发环境，不是正常的数字给暴露出来，方便调试
    const empty =
      process.env.NODE_ENV !== "production" && !isNumberEmpty
        ? number.toString()
        : options.empty;

    return {
      formattedNumber: empty ?? "-",
      number: number,
      isEmpty: true,
      scaleSymbol: "",
      parts: [],
    };
  }

  const {
    style: style = "decimal",
    currency = "CNY",
    localeCode = defaultLocale[currency as keyof typeof defaultLocale],
    currencyDisplay = "symbol",
    useGrouping = true,
    minimumIntegerDigits,
    minimumFractionDigits,
    maximumFractionDigits = 2,
    roundingMode = "halfExpand",
    numberScale: numberScaleOptions,
    unit: unitSymbol,
    transform,
  } = options;

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

  let processedNumber: number = number;

  const { divisor, symbol: scaleSymbol } = numberScale(processedNumber, {
    type: style === "filesize" ? "filesize" : "decimal",
    ...(typeof numberScaleOptions === "string"
      ? {
          mode: numberScaleOptions,
        }
      : numberScaleOptions),
  });

  if (divisor !== 0) {
    processedNumber = numberCompute(processedNumber, "/", divisor);
  }

  const formatter = new Intl.NumberFormat(localeCode, {
    style: style === "filesize" ? "decimal" : style,
    currency,
    useGrouping,
    currencyDisplay,
    minimumIntegerDigits,
    minimumFractionDigits,
    maximumFractionDigits,
    notation: "standard",
    // @ts-ignore
    roundingMode: roundingMode,
  });

  //  /react-server-dom-webpack@19.0.0(react-dom@18.2.0)(react@18.2.0):
  // react-server-dom-webpack: 19.0.0(react-dom@18.2.0)(react@18.2.0)

  // @edenx/runtime

  // /@modern-js/render@2.65.1(react-dom@18.2.0)(react@18.2.0):
  // '@modern-js/render': 2.65.1(react-dom@18.2.0)(react@18.2.0)
  // '@modern-js/render': 2.65.1(react-dom@18.2.0)(react@18.2.0)
  // /@edenx/runtime@1.65.1(@types/react-dom@18.2.25)(@types/react@18.2.79)(react-dom@18.2.0)(react@18.2.0)(typescript@5.0.4):
  // @edenx/runtime: 1.65.1(@types/react-dom@18.2.25)(@types/react@18.2.79)(react-dom@18.2.0)(react@18.2.0)(typescript@5.0.4)

  const parts: NumberPart[] = formatter.formatToParts(processedNumber);
  if (scaleSymbol) {
    parts.push({
      type: "scale",
      value: scaleSymbol,
    });
  }

  if (unitSymbol) {
    parts.push({
      type: "unit",
      value: unitSymbol,
    });
  }

  return {
    scaleSymbol: scaleSymbol,
    isEmpty: false,
    number: number,
    formattedNumber: parts.map((part) => part.value).join(""),
    parts,
  };
}
