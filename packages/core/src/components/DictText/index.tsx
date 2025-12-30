import React from 'react';
import { isEqual } from 'lodash-es';
import {
  getDictText,
  DictTextArrayOptions as ArrayOptions,
  DictTextObjectOptions as ObjectOptions,
} from '../../utils/dictText';

// 当dict是数组时
function DictText<
  T extends Readonly<Record<any, any>>,
  ValueKey extends keyof T = 'value' extends keyof T ? 'value' : never,
  LabelKey extends keyof T = 'label' extends keyof T ? 'label' : never,
  V = T[ValueKey],
>(
  props: ArrayOptions<T, ValueKey, LabelKey> & { dict: Array<T>; value: V | Array<V> | undefined },
): JSX.Element;

// 当dict是对象时
function DictText<T extends Record<string | number, any>, V extends string | number>(
  props: ObjectOptions<T, V> & { dict: T; value: V | Array<V> | undefined },
): JSX.Element;

// 实现组件
function DictText({ dict, value, empty = '-', ...options }: any): JSX.Element {
  const content = getDictText(dict, value, { ...(options || {}), empty });
  return <>{content}</>;
}

/**
 * @see getDictText
 * @note 这个的 empty 默认值为 '-'
 */
export default React.memo(DictText, function propsAreEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}) as unknown as typeof DictText; // as 解决 React.memo 之后函数重载类型推断失效的问题
