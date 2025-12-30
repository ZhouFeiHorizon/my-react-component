type DecimalScaleUnit = "k" | "K" | "W" | "w" | "万" | "M" | "亿" | "万亿";
type FileScaleUnit = "B" | "KB" | "K" | "MB" | "M" | "GB" | "G" | "TB" | "T";

type NumberScaleUnit = DecimalScaleUnit | FileScaleUnit | (string & {});

type ScaleType = "decimal" | "filesize";

export type NumberScaleMode = "auto" | "default" | NumberScaleUnit;

interface UnitStage {
  unit: NumberScaleUnit;
  divisor?: number;
  symbol?: string;
}

type FilesizeDisplay = "short" | "long";

export interface NumberScaleOptions {
  type?: ScaleType;
  /** 缩放策略 */
  mode?: NumberScaleMode;

  /** auto 模式候选单位 */
  stages?: Array<NumberScaleUnit | UnitStage>;

  /** 自定义展示符号 */
  symbol?: string;

  /** auto 模式下是否必须返回单位 */
  requireUnit?: boolean;
  filesizeDisplay?: FilesizeDisplay;
}

interface ScaleResult {
  divisor: number;
  symbol: string;
}

/** 内置单位表 */
const NUMBER_UNIT_MAP: Record<DecimalScaleUnit, number> = {
  K: 1e3,
  k: 1e3,
  W: 1e4,
  w: 1e4,
  M: 1e6,
  万: 1e4,
  亿: 1e8,
  万亿: 1e12,
};

const Byte = 1;
const KB = Byte * 1024;
const MB = KB * 1024;
const GB = MB * 1024;
const TB = GB * 1024;

const FILE_UNIT_MAP: Record<FileScaleUnit, number> = {
  B: Byte,
  KB,
  K: KB,
  MB,
  M: MB,
  GB,
  G: GB,
  TB,
  T: TB,
};

/** 默认阶段 */
const DECIMAL_DEFAULT_STAGES = ["万", "亿", "万亿"];

const FILE_DEFAULT_STAGES = {
  short: ["B", "K", "M", "G", "T"],
  long: ["B", "KB", "MB", "GB", "TB"],
};

const normalizeStage = (
  type: ScaleType,
  stages?: Array<NumberScaleUnit | UnitStage>,
  filesizeDisplay: FilesizeDisplay = "long"
): Required<UnitStage>[] => {
  const getStages = () => {
    if (stages) {
      return stages;
    }
    if (type === "filesize") {
      return FILE_DEFAULT_STAGES[filesizeDisplay];
    }
    return DECIMAL_DEFAULT_STAGES;
  };

  const unitMap = type === "filesize" ? FILE_UNIT_MAP : NUMBER_UNIT_MAP;
  return (getStages() || []).map((item) => {
    const obj: UnitStage =
      typeof item === "string"
        ? {
            unit: item,
          }
        : { ...item };

    if (obj.divisor === undefined) {
      obj.divisor = (unitMap as Record<string, number>)[obj.unit] ?? 1;
    }
    if (obj.symbol === undefined) {
      obj.symbol = obj.unit;
    }
    return obj as Required<UnitStage>;
  });
};

/** 核心函数 */
export function numberScale(
  val: number,
  options: NumberScaleOptions = {}
): ScaleResult {
  const {
    type = "decimal",
    mode = type === "filesize" ? "auto" : "default",
    symbol,
    stages: rawStages,
    requireUnit = type === "filesize",
    filesizeDisplay,
  } = options;

  /** default：不缩放 */
  if (mode === "default") {
    return { divisor: 1, symbol: "" };
  }

  const getScaleResult = (stage?: Required<UnitStage>) => {
    if (stage) {
      return {
        divisor: stage.divisor,
        symbol: symbol ?? stage.symbol,
      };
    }
    return {
      divisor: 1,
      symbol: "",
    };
  };

  /** 指定单位, 直接返回指定的单位 */
  if (mode !== "auto") {
    const useStage =
      rawStages && rawStages.length
        ? rawStages.find((item) => {
            return typeof item === "string"
              ? item === mode
              : item.unit === mode;
          }) || mode
        : mode;

    const stages = normalizeStage(type, [useStage], filesizeDisplay);
    return getScaleResult(stages[0]);
  }

  /** auto 模式 */
  let selected: Required<UnitStage> | undefined = undefined;

  const absNumber = Math.abs(val);
  const stages = normalizeStage(type, rawStages, filesizeDisplay);
  for (const stage of stages) {
    if (absNumber >= stage.divisor) {
      selected = stage;
    } else {
      break;
    }
  }

  if (!selected) {
    // 必须返回单位
    if (requireUnit) {
      return getScaleResult(stages[0]);
    }
    return { divisor: 1, symbol: "" };
  }

  return getScaleResult(selected);
}
