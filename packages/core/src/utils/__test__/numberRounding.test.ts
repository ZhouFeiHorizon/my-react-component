// roundNumber.test.ts
import { describe, it, expect } from "vitest";
import { numberRounding as roundNumber } from "../number/numberRounding";

describe("roundNumber", () => {
  describe("基础功能", () => {
    it("应该正确处理非数字值", () => {
      expect(roundNumber(Infinity)).toBe(Infinity);
      expect(roundNumber(-Infinity)).toBe(-Infinity);
      expect(roundNumber(NaN)).toBe(NaN);
    });

    it("应该支持数字参数指定精度", () => {
      expect(roundNumber(1.23456, 2)).toBe(1.23);
      expect(roundNumber(1.23556, 2)).toBe(1.24);
      expect(roundNumber(1.23456, 4)).toBe(1.2346);
    });

    it("应该正确处理 options 对象", () => {
      expect(roundNumber(1.23456, { precision: 2 })).toBe(1.23);
      expect(roundNumber(1.23556, { precision: 3 })).toBe(1.236);
    });

    it("应该显示指定 precision 为 0", () => {
      expect(roundNumber(1.49, { precision: 0, mode: "round" })).toBe(1);
      expect(roundNumber(1.5, { precision: 0, mode: "round" })).toBe(2);
      expect(roundNumber(1.51, { precision: 0, mode: "round" })).toBe(2);
    });
  });

  describe('舍入模式: "round" (四舍五入)', () => {
    it("应该正确四舍五入到指定精度", () => {
      expect(roundNumber(1.005, { precision: 2, mode: "round" })).toBe(1.01);
      expect(roundNumber(1.006, { precision: 2, mode: "round" })).toBe(1.01);
      expect(roundNumber(1.004, { precision: 2, mode: "round" })).toBe(1.0);
      expect(roundNumber(1.234, { precision: 2, mode: "round" })).toBe(1.23);
      expect(roundNumber(1.235, { precision: 2, mode: "round" })).toBe(1.24);
      expect(roundNumber(1.236, { precision: 2, mode: "round" })).toBe(1.24);
    });

    it("应该处理 precision 为 1 的情况", () => {
      expect(roundNumber(1.24, { precision: 1, mode: "round" })).toBe(1.2);
      expect(roundNumber(1.25, { precision: 1, mode: "round" })).toBe(1.3);
      expect(roundNumber(1.26, { precision: 1, mode: "round" })).toBe(1.3);
    });

    it("应该处理负数的四舍五入", () => {
      expect(roundNumber(-1.234, { precision: 2, mode: "round" })).toBe(-1.23);
      expect(roundNumber(-1.235, { precision: 2, mode: "round" })).toBe(-1.24);
      expect(roundNumber(-1.236, { precision: 2, mode: "round" })).toBe(-1.24);
    });

    it("应该处理 precision 较大的情况", () => {
      expect(roundNumber(1.23456789, { precision: 5, mode: "round" })).toBe(
        1.23457
      );
      expect(roundNumber(1.23456489, { precision: 5, mode: "round" })).toBe(
        1.23456
      );
    });
  });

  describe('舍入模式: "floor" (向下取整)', () => {
    it("应该总是向下舍入到指定精度", () => {
      expect(roundNumber(1.239, { precision: 2, mode: "floor" })).toBe(1.23);
      expect(roundNumber(1.231, { precision: 2, mode: "floor" })).toBe(1.23);
      expect(roundNumber(1.2, { precision: 2, mode: "floor" })).toBe(1.2);
    });

    it("应该处理 precision 为 0 的向下取整", () => {
      expect(roundNumber(1.9, { precision: 0, mode: "floor" })).toBe(1);
      expect(roundNumber(1.1, { precision: 0, mode: "floor" })).toBe(1);
      expect(roundNumber(1.999, { precision: 0, mode: "floor" })).toBe(1);
    });

    it("应该处理负数的向下取整", () => {
      expect(roundNumber(-1.239, { precision: 2, mode: "floor" })).toBe(-1.24);
      expect(roundNumber(-1.231, { precision: 2, mode: "floor" })).toBe(-1.24);
      expect(roundNumber(-1.2, { precision: 2, mode: "floor" })).toBe(-1.2);
    });
  });

  describe('舍入模式: "ceil" (向上取整)', () => {
    it("应该总是向上舍入到指定精度", () => {
      expect(roundNumber(1.231, { precision: 2, mode: "ceil" })).toBe(1.24);
      expect(roundNumber(1.239, { precision: 2, mode: "ceil" })).toBe(1.24);
      expect(roundNumber(1.2, { precision: 2, mode: "ceil" })).toBe(1.2);
    });

    it("应该处理 precision 为 0 的向上取整", () => {
      expect(roundNumber(1.1, { precision: 0, mode: "ceil" })).toBe(2);
      expect(roundNumber(1.001, { precision: 0, mode: "ceil" })).toBe(2);
      expect(roundNumber(1.0, { precision: 0, mode: "ceil" })).toBe(1);
    });

    it("应该处理负数的向上取整", () => {
      expect(roundNumber(-1.231, { precision: 2, mode: "ceil" })).toBe(-1.23);
      expect(roundNumber(-1.239, { precision: 2, mode: "ceil" })).toBe(-1.23);
      expect(roundNumber(-1.2, { precision: 2, mode: "ceil" })).toBe(-1.2);
    });
  });

  describe('舍入模式: "trunc" (截断)', () => {
    it("应该直接截断到指定精度", () => {
      expect(roundNumber(1.239, { precision: 2, mode: "trunc" })).toBe(1.23);
      expect(roundNumber(1.231, { precision: 2, mode: "trunc" })).toBe(1.23);
      expect(roundNumber(1.2, { precision: 2, mode: "trunc" })).toBe(1.2);
    });

    it("应该处理 precision 为 0 的截断", () => {
      expect(roundNumber(1.9, { precision: 0, mode: "trunc" })).toBe(1);
      expect(roundNumber(1.1, { precision: 0, mode: "trunc" })).toBe(1);
      expect(roundNumber(1.0, { precision: 0, mode: "trunc" })).toBe(1);
    });

    it("应该处理负数的截断", () => {
      expect(roundNumber(-1.239, { precision: 2, mode: "trunc" })).toBe(-1.23);
      expect(roundNumber(-1.231, { precision: 2, mode: "trunc" })).toBe(-1.23);
      expect(roundNumber(-1.2, { precision: 2, mode: "trunc" })).toBe(-1.2);
    });
  });

  describe('舍入模式: "half-even" (银行家舍入)', () => {
    describe("precision 为 0 的情况", () => {
      it("应该正确处理中间值 5 的舍入", () => {
        expect(roundNumber(2.5, { precision: 0, mode: "half-even" })).toBe(2); // 偶舍
        expect(roundNumber(3.5, { precision: 0, mode: "half-even" })).toBe(4); // 奇进
        expect(roundNumber(4.5, { precision: 0, mode: "half-even" })).toBe(4); // 偶舍
        expect(roundNumber(5.5, { precision: 0, mode: "half-even" })).toBe(6); // 奇进
        expect(roundNumber(6.5, { precision: 0, mode: "half-even" })).toBe(6); // 偶舍
        expect(roundNumber(7.5, { precision: 0, mode: "half-even" })).toBe(8); // 奇进
      });

      it("应该处理非 5 的情况", () => {
        expect(roundNumber(2.4, { precision: 0, mode: "half-even" })).toBe(2); // 四舍
        expect(roundNumber(2.6, { precision: 0, mode: "half-even" })).toBe(3); // 六入
        expect(roundNumber(3.4, { precision: 0, mode: "half-even" })).toBe(3);
        expect(roundNumber(3.6, { precision: 0, mode: "half-even" })).toBe(4);
      });
    });

    describe("precision 为 2 的情况", () => {
      it("应该正确处理中间值 5 的舍入", () => {
        expect(roundNumber(1.225, { precision: 2, mode: "half-even" })).toBe(
          1.22
        ); // 2偶舍
        expect(roundNumber(1.235, { precision: 2, mode: "half-even" })).toBe(
          1.24
        ); // 3奇进
        expect(roundNumber(1.245, { precision: 2, mode: "half-even" })).toBe(
          1.24
        ); // 4偶舍
        expect(roundNumber(1.255, { precision: 2, mode: "half-even" })).toBe(
          1.26
        ); // 5奇进
        expect(roundNumber(1.265, { precision: 2, mode: "half-even" })).toBe(
          1.26
        ); // 6偶舍
        expect(roundNumber(1.275, { precision: 2, mode: "half-even" })).toBe(
          1.28
        ); // 7奇进
      });

      it("应该处理 5 后有非零数字的情况", () => {
        // 5 后有数字，按大于 5 处理，直接进位
        expect(roundNumber(1.2251, { precision: 2, mode: "half-even" })).toBe(
          1.23
        );
        expect(roundNumber(1.2351, { precision: 2, mode: "half-even" })).toBe(
          1.24
        );
        expect(roundNumber(1.245001, { precision: 2, mode: "half-even" })).toBe(
          1.25
        );
        expect(
          roundNumber(1.2550001, { precision: 2, mode: "half-even" })
        ).toBe(1.26);
      });

      it("应该处理四舍六入的情况", () => {
        expect(roundNumber(1.224, { precision: 2, mode: "half-even" })).toBe(
          1.22
        ); // 四舍
        expect(roundNumber(1.226, { precision: 2, mode: "half-even" })).toBe(
          1.23
        ); // 六入
        expect(roundNumber(1.234, { precision: 2, mode: "half-even" })).toBe(
          1.23
        ); // 四舍
        expect(roundNumber(1.236, { precision: 2, mode: "half-even" })).toBe(
          1.24
        ); // 六入
      });
    });

    describe("precision 为 1 的情况", () => {
      it("应该正确处理中间值 5 的舍入", () => {
        expect(roundNumber(1.25, { precision: 1, mode: "half-even" })).toBe(
          1.2
        ); // 2偶舍
        expect(roundNumber(1.35, { precision: 1, mode: "half-even" })).toBe(
          1.4
        ); // 3奇进
        expect(roundNumber(1.45, { precision: 1, mode: "half-even" })).toBe(
          1.4
        ); // 4偶舍
        expect(roundNumber(1.55, { precision: 1, mode: "half-even" })).toBe(
          1.6
        ); // 5奇进
      });

      it("应该处理其他情况", () => {
        expect(roundNumber(1.24, { precision: 1, mode: "half-even" })).toBe(
          1.2
        ); // 四舍
        expect(roundNumber(1.26, { precision: 1, mode: "half-even" })).toBe(
          1.3
        ); // 六入
      });
    });

    describe("负数银行家舍入", () => {
      it("应该正确处理负数的中间值 5", () => {
        expect(roundNumber(-2.5, { precision: 0, mode: "half-even" })).toBe(-2); // 偶舍
        expect(roundNumber(-3.5, { precision: 0, mode: "half-even" })).toBe(-4); // 奇进
        expect(roundNumber(-1.225, { precision: 2, mode: "half-even" })).toBe(
          -1.22
        ); // 2偶舍
        expect(roundNumber(-1.235, { precision: 2, mode: "half-even" })).toBe(
          -1.24
        ); // 3奇进
      });

      it("应该处理负数的四舍六入", () => {
        expect(roundNumber(-1.224, { precision: 2, mode: "half-even" })).toBe(
          -1.22
        ); // 四舍
        expect(roundNumber(-1.226, { precision: 2, mode: "half-even" })).toBe(
          -1.23
        ); // 六入
        expect(roundNumber(-1.234, { precision: 2, mode: "half-even" })).toBe(
          -1.23
        ); // 四舍
        expect(roundNumber(-1.236, { precision: 2, mode: "half-even" })).toBe(
          -1.24
        ); // 六入
      });
    });

    describe("precision 为 3 及以上的情况", () => {
      it("应该处理 precision 为 3", () => {
        expect(roundNumber(1.2345, { precision: 3, mode: "half-even" })).toBe(
          1.234
        ); // 四舍
        expect(roundNumber(1.2345, { precision: 3, mode: "round" })).toBe(
          1.235
        ); // 对比：四舍五入
        expect(roundNumber(1.2355, { precision: 3, mode: "half-even" })).toBe(
          1.236
        ); // 六入
      });

      it("应该处理 precision 为 4", () => {
        expect(roundNumber(1.23455, { precision: 4, mode: "half-even" })).toBe(
          1.2346
        ); // 5后有数，进位
        expect(roundNumber(1.23465, { precision: 4, mode: "half-even" })).toBe(
          1.2346
        ); // 6偶舍
      });
    });

    describe("边缘情况", () => {
      it("应该处理刚好是 .5 的情况", () => {
        expect(roundNumber(0.5, { precision: 0, mode: "half-even" })).toBe(0);
        expect(roundNumber(1.5, { precision: 0, mode: "half-even" })).toBe(2);
        expect(roundNumber(10.5, { precision: 0, mode: "half-even" })).toBe(10); // 0是偶数
        expect(roundNumber(11.5, { precision: 0, mode: "half-even" })).toBe(12);
      });

      it("应该处理浮点数精度问题", () => {
        // 测试浮点数精度可能带来的问题
        expect(roundNumber(1.005, { precision: 2, mode: "half-even" })).toBe(
          1.0
        ); // 5后有数吗？实际上 1.005 * 100 = 100.49999999999999
        // 这取决于实现，我们的实现应该能正确处理
        expect(roundNumber(1.015, { precision: 2, mode: "half-even" })).toBe(
          1.02
        ); // 1奇进
      });
    });
  });

  describe("对比测试", () => {
    it("不同模式对同一值的处理应该不同", () => {
      const value = 1.235;
      expect(roundNumber(value, { precision: 2, mode: "round" })).toBe(1.24);
      expect(roundNumber(value, { precision: 2, mode: "floor" })).toBe(1.23);
      expect(roundNumber(value, { precision: 2, mode: "ceil" })).toBe(1.24);
      expect(roundNumber(value, { precision: 2, mode: "trunc" })).toBe(1.23);
      expect(roundNumber(value, { precision: 2, mode: "half-even" })).toBe(
        1.24
      );
    });

    it("负数不同模式的对比 22", () => {
      const value = -1.235;
      expect(roundNumber(value, { precision: 2, mode: "round" })).toBe(-1.24);
      expect(roundNumber(value, { precision: 2, mode: "floor" })).toBe(-1.24);
      expect(roundNumber(value, { precision: 2, mode: "ceil" })).toBe(-1.23);
      expect(roundNumber(value, { precision: 2, mode: "trunc" })).toBe(-1.23);
      expect(roundNumber(value, { precision: 2, mode: "half-even" })).toBe(
        -1.24
      );
    });
  });
});
