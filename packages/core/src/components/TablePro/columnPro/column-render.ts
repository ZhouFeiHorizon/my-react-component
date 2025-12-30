/** 扩展列render */

import React from "react";
import type { ColumnRender as SemiColumnRender } from "@douyinfe/semi-ui/lib/es/table/interface";
import { get } from "lodash-es";

export interface ColumnRenderExtra<Props, RecordType = any> {
  /**
   * 渲染组件的 props 配置，这部分不依赖于数据
   */ 
  renderProps?: Partial<Props>;
  /**
   * 数据属性映射
   * 用于映射数据属性到渲染组件的 props 上
   * { propKey: dataIndex }
   *
   * 例如：{ startTime: 'taskStartTime', endTime: 'taskEndTime' }
   */
  dataProp?: Partial<Record<keyof Props, string>>;

  /**
   * 渲染组件的 props 配置
   *
   * 为什么要单独抽离出来？
   * 因为有的场景下，渲染组件的 props 配置需要根据数据动态变化，
   */
  getRenderProps?: (
    val: any,
    recordType: RecordType,
    index: number
  ) => Partial<Props>;

  render?: SemiColumnRender<RecordType>;

  customRender?: (
    dynamicRenderProps: Props & {
      value: any;
    },
    options: {
      value: any;
      record: RecordType;
      index: number;
    }
  ) => React.ReactNode;

  component?: React.ComponentType<Props & { value: any }>;
}

export function getColumnRender<Props extends Record<string, any>, RecordType>(
  column: ColumnRenderExtra<Props, RecordType>
): SemiColumnRender<RecordType> | undefined {
  const { renderProps, dataProp, getRenderProps, component, customRender } =
    column;

  if (column.render) {
    return column.render;
  }

  if (customRender || component) {
    return (val: any, record: RecordType, index: number) => {
      type DynamicRenderProps = Props & { value: any };
      const props = {
        ...renderProps,
        value: val,
      } as unknown as DynamicRenderProps;

      if (dataProp) {
        Object.keys(dataProp).forEach((prop) => {
          const dataIndex = dataProp[prop] as keyof RecordType;
          if (prop && dataIndex) {
            props[prop as keyof Props] = get(record, dataIndex);
          }
        });
      }

      if (getRenderProps) {
        Object.assign(props, getRenderProps(val, record, index));
      }

      if (customRender) {
        return customRender(props, {
          value: val,
          record,
          index,
        });
      }
      if (component) {
        return React.createElement(component, props);
      }
      return val;
    };
  }

  return column.render;
}

