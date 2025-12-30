import { describe, it, expect } from "vitest";
import { resolveNumberUnit } from "../number/numberUnit";

describe("resolveNumberUnit 测试", () => {
  it("默认单位", () => {
    expect(resolveNumberUnit(undefined)).toEqual({
      divisor: 1,
      symbol: "",
    });
    expect(resolveNumberUnit(123456)).toEqual({
      divisor: 1,
      symbol: "",
    });
    expect(resolveNumberUnit(1234567890)).toEqual({
      divisor: 1,
      symbol: "",
    });
    expect(resolveNumberUnit(1234567890, "default")).toEqual({
      divisor: 1,
      symbol: "",
    });
  });

  it("自动单位", () => {
    expect(resolveNumberUnit(undefined, { type: "auto" })).toEqual({
      divisor: 1,
      symbol: "",
    });
    expect(resolveNumberUnit(0, { type: "auto" })).toEqual({
      divisor: 1,
      symbol: "",
    });

    expect(resolveNumberUnit(0, "auto")).toEqual({
      divisor: 1,
      symbol: "",
    });

    expect(
      resolveNumberUnit(123456, {
        type: "auto",
      })
    ).toEqual({ divisor: 1e4, symbol: "万" });

    expect(resolveNumberUnit(1e8, { type: "auto" })).toEqual({
      divisor: 1e8,
      symbol: "亿",
    });
  });

  it("自定义单位", () => {
    expect(resolveNumberUnit(123456, { type: "k" })).toEqual({
      divisor: 1e3,
      symbol: "k",
    });

    expect(resolveNumberUnit(123456, "k")).toEqual({
      divisor: 1e3,
      symbol: "k",
    });
  });

  it("0 ", () => {
    const result = resolveNumberUnit(0, { type: "万" });
    expect(result).toEqual({ divisor: 1e4, symbol: "万" });
  });

  it("空值", () => {
    const result = resolveNumberUnit(100, { type: "万" });
    expect(result).toEqual({ divisor: 1e4, symbol: "万" });
  });

  it("default", () => {
    expect(resolveNumberUnit(10, 'default')).toEqual({
      divisor: 1,
      symbol: "",
    });
  });
});
