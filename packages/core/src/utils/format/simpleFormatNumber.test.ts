import { describe, it, expect } from "vitest";
import { formatNumber } from "./simpleFormatNumber";

describe("formatNumber", () => {
  it("should format number with default options", () => {
    expect(formatNumber(undefined)).toBe("-");
    expect(formatNumber(null)).toBe("-");
    expect(formatNumber(NaN)).toBe("NaN");
    expect(formatNumber(Infinity)).toBe("Infinity");
    expect(formatNumber(-Infinity)).toBe("-Infinity");

    expect(formatNumber(1234)).toBe("1,234");
    expect(
      formatNumber(123456.789, {
        maximumFractionDigits: 2,
      })
    ).toBe("123,456.79");

    expect(
      formatNumber(1.005, {
        maximumFractionDigits: 2,
      })
    ).toBe("1.01");
  });

  it("格式化金额", () => {
    expect(
      formatNumber(12, {
        style: "currency",
      })
    ).toBe("¥12.00");
    expect(
      formatNumber(123456.789, {
        style: "currency",
      })
    ).toBe("¥123,456.79");

    expect(
      formatNumber(123456.789, {
        localeCode: "en-US",
        style: "currency",
        currency: "USD",
        currencyDisplay: "symbol",
      })
    ).toBe("$123,456.79");

    expect(
      formatNumber(123456.789, {
        style: "currency",
        numberScale: "万",
      })
    ).toBe("¥12.35万");

    expect(
      formatNumber(1232335, {
        style: "currency",
        numberScale: "W",
      })
    ).toBe("¥123.23W");

    expect(
      formatNumber(123456.789, {
        style: "currency",
        numberScale: "万",
        unit: "元",
      })
    ).toBe("¥12.35万元");

    expect(
      formatNumber(123456.789, {
        style: "currency",
        maximumFractionDigits: 0,
        numberScale: "万",
      })
    ).toBe("¥12万");

    expect(
      formatNumber(123456.789, {
        style: "currency",
        maximumFractionDigits: 0,
        numberScale: "万",
        unit: "元",
      })
    ).toBe("¥12万元");
  });

  it("格式化百分比", () => {
    expect(
      formatNumber(0.123456789, {
        style: "percent",
      })
    ).toBe("12.35%");
  });

  it("单位", () => {
    expect(formatNumber(60, { unit: "元" })).toBe("60元");
    expect(formatNumber(60, { unit: "分钟" })).toBe("60分钟");
    expect(formatNumber(60, { unit: "小时", transform: ["divide", 60] })).toBe(
      "1小时"
    );
    expect(formatNumber(0, { unit: "小时", transform: ["divide", 60] })).toBe(
      "0小时"
    );
    expect(
      formatNumber(undefined, { unit: "小时", transform: ["divide", 60] })
    ).toBe("-");

    expect(formatNumber(undefined, { unit: "km/h" })).toBe("-");
    expect(formatNumber(120, { unit: "km/h" })).toBe("120km/h");
  });

  it("文件", () => {
    expect(formatNumber(1024, { style: "filesize" })).toBe("1KB");
    expect(formatNumber(1024 * 20, { style: "filesize" })).toBe("20KB");
    expect(formatNumber(1024 * 1024 * 1024, { style: "filesize" })).toBe("1GB");
    expect(
      formatNumber(1024 * 1024 * 1024, {
        style: "filesize",
      })
    ).toBe("1GB");
    expect(
      formatNumber(1024 * 1024 * 1024, {
        style: "filesize",
        numberScale: {
          stages: ["B", "K", "G", "T"],
        },
      })
    ).toBe("1G");
    expect(
      formatNumber(1024 * 1024 * 1024, {
        style: "filesize",
        numberScale: {
          filesizeDisplay: "long",
        },
      })
    ).toBe("1GB");
    expect(
      formatNumber(1024 * 1024 * 1024, {
        style: "filesize",
        numberScale: {
          filesizeDisplay: "short",
        },
      })
    ).toBe("1G");
  });
});

describe("数值单位", () => {
  it("auto", () => {
    expect(
      formatNumber(123, {
        numberScale: "auto",
        maximumFractionDigits: 2,
      })
    ).toBe("123");
    expect(
      formatNumber(1234, {
        numberScale: "auto",
        maximumFractionDigits: 2,
      })
    ).toBe("1,234");
    expect(
      formatNumber(1234, {
        numberScale: "auto",
        useGrouping: false,
        maximumFractionDigits: 2,
      })
    ).toBe("1234");

    expect(
      formatNumber(12345, {
        numberScale: "auto",
        useGrouping: false,
        maximumFractionDigits: 2,
      })
    ).toBe("1.23万");

    expect(
      formatNumber(12345789, {
        numberScale: "auto",
        useGrouping: false,
        maximumFractionDigits: 2,
      })
    ).toBe("1234.58万");

    expect(
      formatNumber(123456.789, {
        numberScale: "auto",
        maximumFractionDigits: 2,
      })
    ).toBe("12.35万");
  });

  it("万", () => {
    expect(
      formatNumber(123456.789, {
        numberScale: "万",
        maximumFractionDigits: 2,
      })
    ).toBe("12.35万");

    expect(
      formatNumber(123456.789, {
        numberScale: "W",
        maximumFractionDigits: 2,
      })
    ).toBe("12.35W");

    expect(
      formatNumber(123456.789, {
        numberScale: "k",
        maximumFractionDigits: 2,
      })
    ).toBe("123.46k");

    const byte = 1024;
    expect(
      formatNumber(byte * 2, {
        transform: ["divide", byte],
        maximumFractionDigits: 2,
        unit: "KB",
      })
    ).toBe("2KB");
  });
});
