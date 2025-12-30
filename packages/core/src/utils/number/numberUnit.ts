
// 单位换算

// 缩放单位支持类型
//  数字大小： 'K' | 'W' | 'M' | '万' | '亿' | '万亿'
//  文件大小： 'KB' | 'MB' | 'GB' | 'TB' | 'kb' | 'mb' | 'gb' | 'tb'
//  ...以后再扩展

// 定义一个函数，传递
// number => 数字: 数字大小， 文件类型： 字节
// options?.[xxx] => 告知是数字还是文件
// options?.scale => 缩放：对应的缩放单位支持类型 | 'auto'  | 'default'
// options?.symbol => 符号： 就是用于显示指定缩放的符号，比如 scale 指定了 '万',必须要指定了 scale 才用
// options?.[xxx] => 自定义阶段：
//     Array<缩放单位支持类型 | { divisor?: number; xxx:  缩放单位支持类型 | string  symbol?: string    } >
//     默认值： 缩放单位支持类型 === 文件大小 ? ['KB', 'MB', 'GB', 'TB'] : 缩放单位支持类型 === 数字大小 ? ['万', '亿', '万亿']

// 函数返回值
// {
//  divisor:  number // 除数
//  symbol: string // 符号，用于显示的符号
// }

// fn(1800, { scale: 'K' }) => ({ divisor: 1000, symbol: 'K' }) // 1.8K
// fn(1800, { scale: 'auto' }) => ({ divisor: 1, symbol: '' }) 
// fn(18000, { scale: 'K' }) => ({ divisor: 1000, symbol: 'K' }) // 18K
// fn(12000, { scale: 'W' }) => ({ divisor: 10000, symbol: 'W' })
// fn(12000, { scale: 'W', symbol: '万'  }) => ({ divisor: 10000, symbol: '万' })
// fn(12000, { scale: 'auto'  }) => ({ divisor: 10000, symbol: '万' })
// fn(12000, { scale: 'default'  }) => ({ divisor: 1, symbol: '' })

// fn(2000, { scale: 'auto', [?.xx]: '文件大小' }) => ({ divisor: 1024, symbol: 'KB'  })
// fn(2000, { scale: 'MB', [?.xx]: '文件大小' }) => ({ divisor: 1024 * 1024, symbol: 'MB'  })
// fn(2000, { scale: 'M', [自定义阶段]: ['K', 'M'] }) => ({ divisor: 1e6,  symbol: 'M'  }) // 百万
// fn(2000, { scale: 'M', [自定义阶段]: ['K', { type: 'M', symbol: '百万' }] }) => ({ divisor: 1e6,  symbol: '百万'  })


const getAutoNumberUnit = (value: number) => {};

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
