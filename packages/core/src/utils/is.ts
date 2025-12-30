const toString = Object.prototype.toString;

export const isEmpty = (value: any) => {
  // 考虑最常用的情况，一般传递的都是字符串或者数字这些简单类型
  if (value === null || value === undefined) {
    return true;
  }
  const type = typeof value;
  if (type === "number") {
    return false;
  }
  if (type === "string") {
    return value === "";
  }
  if (Array.isArray(value)) {
    return value.length === 0;
  }

  if (isPlainObject(value)) {
    return Object.keys(value).length === 0;
  }
  return false;
};

export const isPlainObject = (value: unknown) => {
  return toString.call(value) === "[object Object]";
};
