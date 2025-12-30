// 单位换算
const Byte = 1;
const KB = 1024 * Byte;
const MB = 1024 * KB;
const GB = 1024 * MB;
const TB = 1024 * GB;

/** 数值单位类型 */
export type NumberUnitType =
  | "千"
  | "万"
  | "亿"
  | "万亿"
  | "k"
  | "w"
  | "W"
  | "m"
  | "b"
  | "t"
  | "auto"
  | "default";

/** 单位配置参数 */
export type NumberUnitOptions = {
  type?: NumberUnitType;
  symbol?: string;
};

/** 单位解析结果 */
export type NumberUnitResult = {
  /** 用于缩放的除数 */
  divisor: number;
  /** 展示单位符号 */
  symbol: string;
};

/**
 * 数值单位与基数映射
 * 作为单一数据源，新增单位只需改这里
 */
export const numberUnitMap: Record<
  Exclude<NumberUnitType, "auto" | "default">,
  number
> = {
  千: 1e3,
  万: 1e4,
  亿: 1e8,
  万亿: 1e12,

  k: 1e3,
  w: 1e4,
  W: 1e4,
  m: 1e6,
  b: 1e9,
  t: 1e12,
};

/** auto 模式下的单位优先级（从大到小） */
const AUTO_UNIT_PRIORITY: Array<keyof typeof numberUnitMap> = [
  "万亿",
  "亿",
  "万",
];

/**
 * 根据数值自动判断最合适的单位
 */
function autoDetectUnit(value: number): NumberUnitType {
  for (const unit of AUTO_UNIT_PRIORITY) {
    if (value >= numberUnitMap[unit]) {
      return unit;
    }
  }
  return "default";
}

/**
 * 根据数值解析使用的单位
 *
 * @example
 * resolveNumberUnit(123456, "auto")
 * resolveNumberUnit(123456, { type: "万", symbol: "w" })
 */
export function resolveNumberUnit(
  value?: number,
  options?: NumberUnitType | NumberUnitOptions
): NumberUnitResult {
  const { type = "default", symbol } =
    typeof options === "string" ? { type: options } : options ?? {};

  const absValue = Math.abs(value ?? 0);

  const resolvedType = type === "auto" ? autoDetectUnit(absValue) : type;

  // default 就不要 symbol
  if (resolvedType === "default") {
    return {
      divisor: 1,
      symbol: "",
    };
  }

  return {
    divisor:
      numberUnitMap[
        resolvedType as Exclude<NumberUnitType, "auto" | "default">
      ] ?? 1,
    symbol: symbol ?? resolvedType,
  };
}

const ByteUnitMap = {
  B: Byte,
  KB: KB,
  K: KB,
  MB: MB,
  M: MB,
  GB: GB,
  G: GB,
  TB: TB,
  T: TB,
};

const resolveNumberUnitByte = (
  byte: number,
  byteOptions?: {
    type?: keyof typeof ByteUnitMap | "auto" | "default";
    phaseList?: Array<keyof typeof ByteUnitMap>;
  }
) => {
  const { phaseList = ["TB", "GB", "KB", "B"], type = "auto" } =
    byteOptions || {};

  let targetUnit = type;
  if (type === "auto") {
    for (const unit of phaseList) {
      if (byte >= ByteUnitMap[unit]) {
        targetUnit = unit;
        break;
      }
    }
  }

  if (targetUnit === 'default' || targetUnit === 'auto') {
    return {
      divisor: Byte,
      symbol: "B",
    };
  }

  return {
    divisor: ByteUnitMap[targetUnit],
    symbol: targetUnit,
  };
};


// const formatSize = (byte: number) => {
//   const { divisor, symbol } = resolveNumberUnitByte(byte);
//   return `${(byte / divisor).toFixed(2)}${symbol}`;
// }