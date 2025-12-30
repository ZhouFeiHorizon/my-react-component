import { describe, it, expect } from "vitest";
import { formatNumber, formatNumberResult } from "..";

describe("formatNumber 测试套件", () => {
  // 测试辅助函数（保持原有逻辑）
  function testCase(description: string, actual: any, expected: any) {
    const passed = JSON.stringify(actual) === JSON.stringify(expected);
    return { passed, description, actual, expected };
  }

  // 1. 基础功能测试
  describe("=== 基础功能测试 ===", () => {
    it("整数格式化", () => {
      const result = testCase("整数 1234", formatNumber(1234), "1,234");
      expect(result.passed).toBe(true);
    });

    it("关闭千分位", () => {
      const result = testCase(
        "关闭千分位",
        formatNumber(1234, { useGrouping: false }),
        "1234"
      );
      expect(result.passed).toBe(true);
    });

    it("小数格式化", () => {
      const result = testCase(
        "小数 1234.567",
        formatNumber(1234.567),
        "1,234.57"
      );
      expect(result.passed).toBe(true);
    });

    it("更多小数位", () => {
      const result = testCase(
        "3位小数",
        formatNumber(1234.5678, { maximumFractionDigits: 3 }),
        "1,234.568"
      );
      expect(result.passed).toBe(true);
    });

    it("负数", () => {
      const result = testCase(
        "负数 -1234.56",
        formatNumber(-1234.56),
        "-1,234.56"
      );
      expect(result.passed).toBe(true);
    });

    it("零", () => {
      const result = testCase("零 0", formatNumber(0), "0");
      expect(result.passed).toBe(true);
    });
  });

  // 2. 小数位数控制测试
  describe("=== 小数位数控制测试 ===", () => {
    it("最大小数位数", () => {
      const result = testCase(
        "限制2位小数",
        formatNumber(1234.5678, { maximumFractionDigits: 2 }),
        "1,234.57"
      );
      expect(result.passed).toBe(true);
    });

    it("最小小数位数", () => {
      const result = testCase(
        "最小2位小数",
        formatNumber(1234.5, { minimumFractionDigits: 2 }),
        "1,234.50"
      );
      expect(result.passed).toBe(true);
    });

    it("固定小数位数", () => {
      const result = testCase(
        "固定3位小数",
        formatNumber(1234.5, {
          minimumFractionDigits: 3,
          maximumFractionDigits: 3,
        }),
        "1,234.500"
      );
      expect(result.passed).toBe(true);
    });
  });

  // 3. 舍入模式测试
  describe("=== 舍入模式测试 ===", () => {
    it("四舍五入", () => {
      const result = testCase(
        "四舍五入 1.235",
        formatNumber(1.235, {
          maximumFractionDigits: 2,
          roundingMode: "round",
        }),
        "1.24"
      );
      expect(result.passed).toBe(true);
    });

    it("截断模式", () => {
      const result = testCase(
        "截断 1.239",
        formatNumber(1.239, {
          maximumFractionDigits: 2,
          roundingMode: "trunc",
        }),
        "1.23"
      );
      expect(result.passed).toBe(true);
    });

    it("向下舍入", () => {
      const result = testCase(
        "向下舍入 1.239",
        formatNumber(1.239, {
          maximumFractionDigits: 2,
          roundingMode: "floor",
        }),
        "1.23"
      );
      expect(result.passed).toBe(true);
    });

    it("向上舍入", () => {
      const result = testCase(
        "向上舍入 1.231",
        formatNumber(1.231, {
          maximumFractionDigits: 2,
          roundingMode: "ceil",
        }),
        "1.24"
      );
      expect(result.passed).toBe(true);
    });

    it("银行家舍入 2.5", () => {
      const result = testCase(
        "银行家舍入 2.5",
        formatNumber(2.5, {
          maximumFractionDigits: 0,
          roundingMode: "half-even",
        }),
        "2"
      );
      expect(result.passed).toBe(true);
    });

    it("银行家舍入 3.5", () => {
      const result = testCase(
        "银行家舍入 3.5",
        formatNumber(3.5, {
          maximumFractionDigits: 0,
          roundingMode: "half-even",
        }),
        "4"
      );
      expect(result.passed).toBe(true);
    });
  });

  // 4. trimZero 测试
  describe("=== trimZero 测试 ===", () => {
    it("去除末尾零 1", () => {
      const result = testCase(
        "去除 12.50 的零",
        formatNumber(12.5, {
          maximumFractionDigits: 2,
          trimZero: true,
        }),
        "12.5"
      );
      expect(result.passed).toBe(true);
    });

    it("去除末尾零 2", () => {
      const result = testCase(
        "去除 12.00 的零",
        formatNumber(12.0, {
          maximumFractionDigits: 2,
          trimZero: true,
        }),
        "12"
      );
      expect(result.passed).toBe(true);
    });

    it("保留末尾零", () => {
      const result = testCase(
        "保留 12.00 的零",
        formatNumber(12.0, {
          minimumFractionDigits: 2,
          trimZero: false,
        }),
        "12.00"
      );
      expect(result.passed).toBe(true);
    });
  });

  // 5. trimZero 与 minimumFractionDigits 冲突测试
  describe("=== trimZero 与 minimumFractionDigits 冲突测试 ===", () => {
    it("冲突测试 1", () => {
      const result = testCase(
        "冲突: min 2位但 trimZero",
        formatNumber(12.5, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          trimZero: true,
        }),
        "12.5"
      );
      expect(result.passed).toBe(true);
    });

    it("冲突测试 2", () => {
      const result = testCase(
        "冲突: min 2位不 trimZero",
        formatNumber(12.5, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          trimZero: false,
        }),
        "12.50"
      );
      expect(result.passed).toBe(true);
    });

    it("冲突测试 3", () => {
      const result = testCase(
        "冲突: 整数 + min 2位 + trimZero",
        formatNumber(12, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
          trimZero: true,
        }),
        "12"
      );
      expect(result.passed).toBe(true);
    });
  });

  // 6. 单位转换测试
  describe("=== 单位转换测试 ===", () => {
    it("自动单位转换 万", () => {
      const result = testCase(
        "123456 -> 万",
        formatNumber(123456, {
          numberUnit: "auto",
          maximumFractionDigits: 2,
        }),
        "12.35万"
      );
      expect(result.passed).toBe(true);
    });

    it("自动单位转换 亿", () => {
      const result = testCase(
        "123456789 -> 亿",
        formatNumber(123456789, {
          numberUnit: "auto",
          maximumFractionDigits: 2,
        }),
        "1.23亿"
      );
      expect(result.passed).toBe(true);
    });

    it("自动单位转换 万亿", () => {
      const result = testCase(
        "1234567890123 -> 万亿",
        formatNumber(1234567890123, {
          numberUnit: "auto",
          maximumFractionDigits: 2,
        }),
        "1.23万亿"
      );
      expect(result.passed).toBe(true);
    });

    it("指定单位 万", () => {
      const result = testCase(
        "指定万单位",
        formatNumber(123456, {
          numberUnit: "万",
          maximumFractionDigits: 1,
        }),
        "12.3万"
      );
      expect(result.passed).toBe(true);
    });
  });

  // 7. 货币格式化测试
  describe("=== 货币格式化测试 ===", () => {
    it("人民币", () => {
      const result = testCase(
        "人民币格式",
        formatNumber(1234.56, {
          type: "currency",
          currency: "CNY",
          maximumFractionDigits: 2,
        }),
        "¥1,234.56"
      );
      expect(result.passed).toBe(true);
    });

    it("美元", () => {
      expect(
        formatNumber(1234.56, {
          type: "currency",
          // localeCode: "en-US",
          currency: "USD",
          currencyDisplay: "symbol",
          maximumFractionDigits: 2,
        })
      ).toBe("$1,234.56");
    });

    it("货币代码显示", () => {
      const result = testCase(
        "货币代码",
        formatNumber(1234.56, {
          type: "currency",
          currency: "USD",
          currencyDisplay: "code",
          maximumFractionDigits: 2,
        }),
        "1,234.56 USD"
      );
      expect(result.passed).toBe(true);
    });
  });

  // 8. 百分比格式化测试
  describe("=== 百分比格式化测试 ===", () => {
    it("百分比 0.156", () => {
      const result = testCase(
        "0.156 -> 百分比",
        formatNumber(0.156, {
          type: "percent",
          maximumFractionDigits: 1,
        }),
        "15.6%"
      );
      expect(result.passed).toBe(true);
    });

    it("百分比 0.1567", () => {
      const result = testCase(
        "0.1567 -> 百分比",
        formatNumber(0.1567, {
          type: "percent",
          maximumFractionDigits: 2,
        }),
        "15.67%"
      );
      expect(result.passed).toBe(true);
    });
  });

  // 9. formatNumberResult 结构化数据测试
  describe("=== formatNumberResult 结构化数据测试 ===", () => {
    it("结构化数据 1", () => {
      const result = formatNumberResult(1234.56, { maximumFractionDigits: 2 });
      const testResult = testCase(
        "结构化数据检查",
        `${result.integerPart}.${result.fractionalPart}`,
        "1234.56"
      );
      expect(testResult.passed).toBe(true);
    });

    it("结构化数据 2", () => {
      const result = formatNumberResult(-1234.56, { maximumFractionDigits: 2 });
      const passed = result.isNegative === true && result.signSymbol === "-";
      expect(passed).toBe(true);
    });

    it("单位数据", () => {
      const result = formatNumberResult(123456, {
        numberUnit: "auto",
        maximumFractionDigits: 2,
      });
      console.log("result", result);
      const passed =
        result.scaleUnitSymbol === "万" &&
        result.formattedNumber.includes("万");
      expect(passed).toBe(true);
    });
  });

  // 10. 特殊值和边界测试
  describe("=== 特殊值和边界测试 ===", () => {
    it("NaN 处理", () => {
      const result = testCase("NaN 返回默认值", formatNumber(NaN), "-");
      expect(result.passed).toBe(true);
    });

    it("Infinity 处理", () => {
      const result = testCase(
        "Infinity 返回默认值",
        formatNumber(Infinity),
        "-"
      );
      expect(result.passed).toBe(true);
    });

    it("null 处理", () => {
      const result = testCase("null 返回默认值", formatNumber(null), "-");
      expect(result.passed).toBe(true);
    });

    it("undefined 处理", () => {
      const result = testCase(
        "undefined 返回默认值",
        formatNumber(undefined),
        "-"
      );
      expect(result.passed).toBe(true);
    });

    it("极小数字", () => {
      const result = testCase(
        "极小数字 0.0001",
        formatNumber(0.0001, {
          maximumFractionDigits: 4,
        }),
        "0.0001"
      );
      expect(result.passed).toBe(true);
    });

    it("极大数字 999999999.999", () => {
      expect(
        formatNumber(999999999.999, {
          maximumFractionDigits: 2,
          roundingMode: "trunc",
        })
      ).toBe("999,999,999.99");
    });
  });

  // 11. 综合场景测试
  describe("=== 综合场景测试 ===", () => {
    it("电商价格场景", () => {
      const price1 = formatNumber(12, {
        type: "currency",
        currency: "CNY",
        trimZero: true,
        maximumFractionDigits: 2,
      });
      const price2 = formatNumber(12.5, {
        type: "currency",
        currency: "CNY",
        trimZero: true,
        maximumFractionDigits: 2,
      });
      const passed = price1 === "¥12" && price2 === "¥12.5";
      expect(passed).toBe(true);
    });

    it("数据报表场景", () => {
      const rate1 = formatNumber(0.125, {
        type: "percent",
        maximumFractionDigits: 1,
        trimZero: true,
      });
      const rate2 = formatNumber(0.1, {
        type: "percent",
        maximumFractionDigits: 1,
        trimZero: true,
      });
      const passed = rate1 === "12.5%" && rate2 === "10%";
      expect(passed).toBe(true);
    });

    it("金融数据场景", () => {
      const stock1 = formatNumber(12.3456, {
        maximumFractionDigits: 3,
        trimZero: true,
      });
      const stock2 = formatNumber(12, {
        maximumFractionDigits: 2,
        trimZero: true,
      });
      const passed = stock1 === "12.346" && stock2 === "12";
      expect(passed).toBe(true);
    });
  });

  // 12. 浮点数精度问题测试
  describe("=== 浮点数精度问题测试 ===", () => {
    it("经典 0.1+0.2", () => {
      const result = testCase(
        "0.1+0.2 精度处理",
        formatNumber(0.1 + 0.2, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        }),
        "0.30"
      );
      expect(result.passed).toBe(true);
    });

    it("1.005 四舍五入到2位 ", () => {
      expect(
        formatNumber(1.005, {
          maximumFractionDigits: 2,
          roundingMode: "round",
        })
      ).toBe("1.01");
    });

    it("2.675 精度问题", () => {
      const result = testCase(
        "2.675 四舍五入到2位",
        formatNumber(2.675, {
          maximumFractionDigits: 2,
        }),
        "2.68"
      );
      expect(result.passed).toBe(true);
    });
  });
});
