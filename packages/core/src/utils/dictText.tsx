import React, { ReactElement } from 'react';
import { isEmpty } from './is';
import { isPlainObject } from 'lodash-es';

const { hasOwnProperty } = Object.prototype;
export const hasOwn = (val: Record<any, any>, key: any): key is keyof typeof val => hasOwnProperty.call(val, key);

type ValueOf<T> = T[keyof T];

type ObjectKeys<T> = T extends Record<any, any> ? (T extends ReactElement<any> ? never : keyof T) : never;

export type DictTextCommonOptions<T, Val, ItemVal, LabelKey> = {
  /**
   * 自定义渲染item
   */
  renderItem?: (itemValue: ItemVal, val: Val, dict: T) => React.ReactNode;
  /**
   * 转换文本
   * 老版本的，现在用renderItem
   * @deprecated
   */
  convert?: (itemValue: ItemVal, val: Val) => React.ReactNode;

  /**
   * 当 value 为空(undefined|null|''|[]) 时返回的值
   * @default ''
   */
  empty?: React.ReactNode;
  /**
   * 分隔符
   * @default ' / '
   */
  separator?: React.ReactNode;
  /**
   * 值在字典中没有找到该怎么渲染
   * 比如字典中的值有[1,2,3]，但传递的value是[1,5,7], 那么5,和7就需要指定怎么渲染
   * @default () => ''
   */
  noMatchRender?: (val: Val) => React.ReactNode;

  /**
   * 当没有传递 render 是，渲染文字的key
   * @default 'label'
   */
  labelKey?: LabelKey;

  /**
   * 是否严格匹配相等
   * - true 全等判断 ===
   * - false 会存在隐式转换 ==
   * @default false
   */
  strictEqual?: boolean;
};

export type DictTextObjectOptions<T, V> = DictTextCommonOptions<
  T,
  V,
  T[keyof T],
  ValueOf<{
    [Key in keyof T]: ObjectKeys<T[Key]>;
  }>
>;

export type DictTextArrayOptions<
  T,
  ValueKey extends keyof T = 'value' extends keyof T ? 'value' : never,
  LabelKey extends keyof T = 'label' extends keyof T ? 'label' : never
> = DictTextCommonOptions<T[], T[ValueKey], T, LabelKey> & {
  /**
   * 数组时，匹配的value的key
   * @default 'value'
   */
  valueKey?: ValueKey;
};

// array
/**
 *
 * @param dict 数组或者对象
 * @param value
 * @param options
 *
 * @example
 *
 * const obj = {
    1: '苹果',
    2: '香蕉',
    4: { label: '草莓', describe: '🍓很不错' },
    5: { label: '白菜', tips: '这是水果' },
    6: <span>自定义React节点</span>,
  } as const

  getDictText(obj, 2)
  // => 香蕉

  getDictText(obj,[1, 5, 6], {
    separator: ' & ',
  });
  // => 苹果 & 香蕉 & <span>自定义React节点</span>

  const arr = [
    { label: '待审核', value: 1, color: 'grey' },
    { label: '已通过', value: 2, color: 'green' },
    { label: '已拒绝', value: 3, color: 'red' },
  ] as const

  getDictText(arr, 2)
  // => 已通过

  getDictText(arr, 3, {
    renderItem: option => <Tag color={option.color}>{option.label}</Tag>
  })
  // => <Tag color="red">已拒绝</Tag>

 */
export function getDictText<
  T extends Readonly<Record<any, any>>, // Readonly 解决 数组 as const的时候推断不了的问题
  ValueKey extends keyof T = 'value' extends keyof T ? 'value' : never,
  LabelKey extends keyof T = 'label' extends keyof T ? 'label' : never,
  V = T[ValueKey]
>(
  dict: Readonly<Array<T>>,
  value: T[V] | Array<T[V]> | undefined,
  options?: DictTextArrayOptions<T, ValueKey, LabelKey>
): React.ReactNode;

// object
/**
 * @see getDictText
 */
export function getDictText<T extends Record<string | number, any>, V extends string | number>(
  dict: T,
  value: V | Array<V> | undefined,
  options?: DictTextObjectOptions<T, V>
): React.ReactNode;

// 实现
export function getDictText<
  T extends Record<any, any>,
  V extends string | number,
  ValueKey extends keyof T = 'value' extends keyof T ? 'value' : never,
  LabelKey extends keyof T = 'label' extends keyof T ? 'label' : never
>(
  dict: T | T[],
  value: any | any[] | undefined,
  options: DictTextObjectOptions<T, V> | DictTextArrayOptions<T, ValueKey, LabelKey> = {}
) {
  const { empty = '', strictEqual } = options;
  if (isEmpty(value)) {
    return empty;
  }

  const labelKey = options.labelKey || 'label';
  const renderItem = options.renderItem || options.convert;
  const separator = options.separator ?? (renderItem ? undefined : ' / ');

  function createItemRender<F extends (itemValue: any, val: any, dict: any) => any>(customRender: F | undefined) {
    return (isMatched: boolean, itemValue: Parameters<F>['0'] | undefined, val: Parameters<F>['1']) => {
      if (!isMatched) {
        // 没有匹配 传递的有错误、没有在 dict 里面
        if (options.noMatchRender) {
          return options.noMatchRender(val);
        }
        return '';
      }
      if (customRender) {
        return customRender(itemValue, val, dict);
      }
      // default render
      if (React.isValidElement(itemValue)) {
        return itemValue;
      }
      if (isPlainObject(itemValue)) {
        return itemValue![labelKey];
      }
      return itemValue;
    };
  }

  const render = createItemRender(renderItem);

  const isEqual = (a: unknown, b: unknown): boolean => {
    if (strictEqual) {
      return a === b;
    }

    // eslint-disable-next-line eqeqeq
    return a == b;
  };

  const getItemState = Array.isArray(dict)
    ? (val: T[ValueKey]) => {
      const index = dict.findIndex(item =>
        isEqual(item[(options as DictTextArrayOptions<T, ValueKey, LabelKey>).valueKey || 'value'], val)
      );
      const isMatch = index !== -1;
      const itemValue = dict[index];
      return [isMatch, itemValue] as const;
    }
    : (val: V) => {
      // 返回的是undefined、避免是undefined，这样属于匹配到的
      return [hasOwn(dict, val), dict[val]] as const;
    };

  const getItemLabel = (val: any) => {
    const [isMatched, itemValue] = getItemState(val);
    return render(isMatched, itemValue, val);
  };

  if (Array.isArray(value)) {
    const textArray = value.map((val, index) => (
      <React.Fragment key={index}>
        {index !== 0 && separator}
        {getItemLabel(val)}
      </React.Fragment>
    ));
    return <React.Fragment>{textArray}</React.Fragment>;
  }
  return getItemLabel(value);
}

export const getOptionsText = getDictText;
