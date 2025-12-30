import { describe, it, expect } from "vitest";
import { numberRounding } from "../numberRounding";

describe("numberRounding – full precision coverage (ordered)", () => {
  /**
   * ceil: +∞
   */
  describe("ceil (+∞)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(123456789.001, 0, "ceil")).toBe(123456790);
      expect(numberRounding(123.401, 1, "ceil")).toBe(123.5);
      expect(numberRounding(123.4501, 2, "ceil")).toBe(123.46);
      expect(numberRounding(1.23451, 3, "ceil")).toBe(1.235);

      expect(numberRounding(-123456789.001, 0, "ceil")).toBe(-123456789);
      expect(numberRounding(-123.401, 1, "ceil")).toBe(-123.4);
      expect(numberRounding(-1.23451, 3, "ceil")).toBe(-1.234);
    });
  });

  /**
   * floor: -∞
   */
  describe("floor (-∞)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(987654321.999, 0, "floor")).toBe(987654321);
      expect(numberRounding(123.499, 1, "floor")).toBe(123.4);
      expect(numberRounding(123.459, 2, "floor")).toBe(123.45);
      expect(numberRounding(9.87654, 3, "floor")).toBe(9.876);

      expect(numberRounding(-987654321.001, 0, "floor")).toBe(-987654322);
      expect(numberRounding(-123.401, 1, "floor")).toBe(-123.5);
      expect(numberRounding(-9.87654, 3, "floor")).toBe(-9.877);
    });
  });

  /**
   * expand: 远离 0
   */
  describe("expand (away from zero)", () => {
    // format = new Intl.NumberFormat(undefined, {
    //    maximumFractionDigits: 0,
    //     roundingMode: 'expand'
    //  })
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(99999999.001, 0, "expand")).toBe(100000000);
      expect(numberRounding(99999999.12, 1, "expand")).toBe(99999999.2);
      expect(numberRounding(12.301, 1, "expand")).toBe(12.4);
      expect(numberRounding(12.3001, 2, "expand")).toBe(12.31);
      expect(numberRounding(1.2341, 3, "expand")).toBe(1.235);

      expect(numberRounding(-99999999.001, 0, "expand")).toBe(-100000000);
      expect(numberRounding(-12.301, 1, "expand")).toBe(-12.4);
      expect(numberRounding(-1.2341, 3, "expand")).toBe(-1.235);
    });
  });

  /**
   * trunc: 向 0
   */
  describe("trunc (toward zero)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(99999999.999, 0, "trunc")).toBe(99999999);
      expect(numberRounding(12.399, 1, "trunc")).toBe(12.3);
      expect(numberRounding(12.399, 2, "trunc")).toBe(12.39);
      expect(numberRounding(1.2349, 3, "trunc")).toBe(1.234);

      expect(numberRounding(-99999999.999, 0, "trunc")).toBe(-99999999);
      expect(numberRounding(-12.399, 1, "trunc")).toBe(-12.3);
      expect(numberRounding(-1.2349, 3, "trunc")).toBe(-1.234);
    });
  });

  /**
   * halfExpand: 四舍五入
   */
  describe("halfExpand (round half up)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(123456.5, 0, "halfExpand")).toBe(123457);
      expect(numberRounding(12.35, 1, "halfExpand")).toBe(12.4);
      expect(numberRounding(12.345, 2, "halfExpand")).toBe(12.35);
      expect(numberRounding(1.2345, 3, "halfExpand")).toBe(1.235);

      expect(numberRounding(-123456.5, 0, "halfExpand")).toBe(-123457);
      expect(numberRounding(-12.35, 1, "halfExpand")).toBe(-12.4);
      expect(numberRounding(-1.2345, 3, "halfExpand")).toBe(-1.235);
    });
  });

  /**
   * halfTrunc: 0.5 向 0
   */
  describe("halfTrunc (round half toward zero)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(123456.5, 0, "halfTrunc")).toBe(123456);
      expect(numberRounding(12.35, 1, "halfTrunc")).toBe(12.3);
      expect(numberRounding(12.345, 2, "halfTrunc")).toBe(12.34);
      expect(numberRounding(1.2345, 3, "halfTrunc")).toBe(1.234);

      expect(numberRounding(-123456.5, 0, "halfTrunc")).toBe(-123456);
      expect(numberRounding(-12.35, 1, "halfTrunc")).toBe(-12.3);
      expect(numberRounding(-1.2345, 3, "halfTrunc")).toBe(-1.234);
    });
  });

  /**
   * halfCeil: 0.5 → +∞
   */
  describe("halfCeil (round half toward +∞)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(123456.5, 0, "halfCeil")).toBe(123457);
      expect(numberRounding(12.35, 1, "halfCeil")).toBe(12.4);
      expect(numberRounding(12.345, 2, "halfCeil")).toBe(12.35);
      expect(numberRounding(1.2345, 3, "halfCeil")).toBe(1.235);

      expect(numberRounding(-123456.5, 0, "halfCeil")).toBe(-123456);
      expect(numberRounding(-12.35, 1, "halfCeil")).toBe(-12.3);
      expect(numberRounding(-1.2345, 3, "halfCeil")).toBe(-1.234);
    });
  });

  /**
   * halfFloor: 0.5 → -∞
   */
  describe("halfFloor (round half toward -∞)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(123456.5, 0, "halfFloor")).toBe(123456);
      expect(numberRounding(12.35, 1, "halfFloor")).toBe(12.3);
      expect(numberRounding(12.345, 2, "halfFloor")).toBe(12.34);
      expect(numberRounding(1.2345, 3, "halfFloor")).toBe(1.234);

      expect(numberRounding(-123456.5, 0, "halfFloor")).toBe(-123457);
      expect(numberRounding(-12.35, 1, "halfFloor")).toBe(-12.4);
      expect(numberRounding(-1.2345, 3, "halfFloor")).toBe(-1.235);
    });
  });

  /**
   * halfEven: 银行家舍入
   */
  describe("halfEven (banker's rounding)", () => {
    it("precision 0 / 1 / 2 / 3", () => {
      expect(numberRounding(123456.5, 0, "halfEven")).toBe(123456);
      expect(numberRounding(123457.5, 0, "halfEven")).toBe(123458);

      expect(numberRounding(12.25, 1, "halfEven")).toBe(12.2);
      expect(numberRounding(12.35, 1, "halfEven")).toBe(12.4);

      expect(numberRounding(12.345, 2, "halfEven")).toBe(12.34);
      expect(numberRounding(12.355, 2, "halfEven")).toBe(12.36);

      expect(numberRounding(1.2345, 3, "halfEven")).toBe(1.234);
      expect(numberRounding(1.2355, 3, "halfEven")).toBe(1.236);

      expect(numberRounding(-12.25, 1, "halfEven")).toBe(-12.2);
      expect(numberRounding(-12.35, 1, "halfEven")).toBe(-12.4);
    });
  });
});
