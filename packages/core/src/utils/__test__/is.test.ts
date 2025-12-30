import { isEmpty, isPlainObject } from '../utils/is';
import { describe, it, expect } from "vitest";

describe('is', () => {
  it('isEmpty', () => {
    expect(isEmpty(null)).toBe(true);
    expect(isEmpty(undefined)).toBe(true);
    expect(isEmpty('')).toBe(true);
    expect(isEmpty('  ')).toBe(true);
    expect(isEmpty([])).toBe(true);
    expect(isEmpty({})).toBe(true);
    expect(isEmpty(0)).toBe(false);
    expect(isEmpty(123)).toBe(false);
    expect(isEmpty('hello')).toBe(false);
    expect(isEmpty([1, 2])).toBe(false);
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty(new Date())).toBe(false)
    expect(isEmpty(new String(' '))).toBe(false);
    expect(isEmpty({
      length: 0,
    })).toBe(false);
  });

  it('isPlainObject', () => {
    expect(isPlainObject({})).toBe(true);
    expect(isPlainObject({ a: 1 })).toBe(true);
    expect(isPlainObject(new Object())).toBe(true);
    expect(isPlainObject(null)).toBe(false);
    expect(isPlainObject(undefined)).toBe(false);
    expect(isPlainObject([])).toBe(false);
    expect(isPlainObject(new Error())).toBe(false);
  });
});