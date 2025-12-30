import { describe, it, expect } from "vitest";
import { formatDate } from "../format/formatDate";

describe("formatDate", () => {
  it("应使用默认格式格式化有效日期", () => {
    const date = new Date("2023-01-01 12:00:00");
    expect(formatDate(date)).toBe("2023-01-01 12:00:00");
  });

  it("对于空日期，应返回自定义空节点", () => {
    expect(formatDate(null, { empty: "N/A" })).toBe("N/A");
  });

  it("对于空日期，应返回默认空节点", () => {
    expect(formatDate(undefined)).toBe("-");
  });

  it("应使用自定义格式格式化有效日期", () => {
    const date = new Date("2023-01-01 12:00:00");
    expect(formatDate(date, { format: "YYYY-MM-DD" })).toBe("2023-01-01");
  });

  it("当 autoUnix 为 true 时，应格式化 Unix 时间戳", () => {
    const timestamp = 1672531200; // 2023-01-01 00:00:00
    expect(formatDate(timestamp, { autoUnix: true, format: "YYYY-MM-DD" })).toBe(
      "2023-01-01"
    );
  });

  it("当 autoUnix 为 true 时，不应格式化非 Unix 时间戳数字", () => {
    const notATimestamp = 123;
    expect(formatDate(notATimestamp, { autoUnix: true })).not.toBe(
      "1970-01-01 08:02:03"
    );
  });

  it("应处理无效的日期字符串", () => {
    const invalidDate = "invalid-date";
    // dayjs will return "Invalid Date" for invalid inputs
    expect(formatDate(invalidDate)).toBe("Invalid Date");
  });
});