// src/utils/__tests__/numberScale.test.ts
import { describe, it, expect } from "vitest";
import { numberScale } from "../numberScale";

describe("numberScale - 数字单位22", () => {
  it("指定 K", () => {
    expect(numberScale(1800, { mode: "K" })).toEqual({
      divisor: 1000,
      symbol: "K",
    });
  });

  it("auto 不包含 K（小于万）", () => {
    expect(numberScale(1800, { mode: "auto" })).toEqual({
      divisor: 1,
      symbol: "",
    });
  });

  it("K 强制缩放", () => {
    expect(numberScale(18000, { mode: "K" })).toEqual({
      divisor: 1000,
      symbol: "K",
    });
  });

  it("W（万）", () => {
    expect(numberScale(12000, { mode: "W" })).toEqual({
      divisor: 10000,
      symbol: "W",
    });
  });

  it("W 自定义 symbol", () => {
    expect(numberScale(12000, { mode: "W", symbol: "万" })).toEqual({
      divisor: 10000,
      symbol: "万",
    });
  });

  it("auto 自动到 万", () => {
    expect(numberScale(12000, { mode: "auto" })).toEqual({
      divisor: 10000,
      symbol: "万",
    });
  });

  it("default 不缩放", () => {
    expect(numberScale(12000, { mode: "default" })).toEqual({
      divisor: 1,
      symbol: "",
    });
  });
});

describe("numberScale - 文件大小", () => {
  it("auto -> B", () => {
    expect(numberScale(1, { mode: "auto", type: "filesize" })).toEqual({
      divisor: 1,
      symbol: "B",
    });
  });

  it("auto -> KB", () => {
    expect(numberScale(1024 + 2, { mode: "auto", type: "filesize" })).toEqual({
      divisor: 1024,
      symbol: "KB",
    });
  });

  it("强制 MB", () => {
    expect(numberScale(2000, { mode: "MB", type: "filesize" })).toEqual({
      divisor: 1024 * 1024,
      symbol: "MB",
    });
  });
});

describe("numberScale - 自定义阶段", () => {
  it("自定义 M（百万）", () => {
    expect(
      numberScale(2_000_000, {
        mode: "M",
        stages: ["K", "M"],
      })
    ).toEqual({
      divisor: 1e6,
      symbol: "M",
    });
    expect(
      numberScale(1024 * 1024, {
        mode: "auto",
        type: "filesize",
        stages: ["B", "K", "M", "G", "T"],
      })
    ).toEqual({
      divisor: 1024 * 1024,
      symbol: "M",
    });
  });

  it("自定义 symbol：百万", () => {
    expect(
      numberScale(2_000_000, {
        mode: "M",
        stages: ["K", { unit: "M", symbol: "百万" }],
      })
    ).toEqual({
      divisor: 1e6,
      symbol: "百万",
    });
  });

  it("自定义 值", () => {
    expect(
      numberScale(60 * 60, {
        mode: "auto",
        stages: [
          {
            unit: "min",
            symbol: "分",
            divisor: 60,
          },
          {
            unit: "hour",
            symbol: "小时",
            divisor: 60 * 60,
          },
        ],
      })
    ).toEqual({
      divisor: 60 * 60,
      symbol: "小时",
    });
    expect(
      numberScale(60 * 60, {
        mode: "min",
        stages: [
          {
            unit: "min",
            symbol: "分",
            divisor: 60,
          },
          {
            unit: "hour",
            symbol: "小时",
            divisor: 60 * 60,
          },
        ],
      })
    ).toEqual({
      divisor: 60,
      symbol: "分",
    });
    expect(
      numberScale(123456.789, {
        mode: "K",
      })
    ).toEqual({
      divisor: 1000,
      symbol: "K",
    });

    expect(
      numberScale(123456.78, {
        mode: "K",
        stages: [
          {
            unit: "K",
            divisor: 2,
          },
        ],
      })
    ).toEqual({
      divisor: 2,
      symbol: "K",
    });

    expect(
      numberScale(1024 * 1024, {
        mode: "auto",
        type: "filesize",
        stages: [
          {
            unit: "K",
            divisor: 2,
          },
          {
            unit: "M",
          },
        ],
      })
    ).toEqual({
      divisor: 1024 * 1024,
      symbol: "M",
    });

    expect(
      numberScale(0.1, {
        mode: "auto",
        type: "filesize",
        requireUnit: true,
        stages: ["KB", "GB"],
      })
    ).toEqual({
      divisor: 1024,
      symbol: "KB",
    });
  });
});
