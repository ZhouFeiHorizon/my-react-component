import React, { useMemo } from "react";
import type {
  ColumnProps,
  ColumnRender,
  RenderOptions,
} from "@douyinfe/semi-ui/lib/es/table/interface";
import TableAction, {
  type TableActionProps,
  type ActionConfig,
} from "./itemRender/TableAction";
import { get } from "lodash-es";

import DateRender, { type DateRenderProps } from "./itemRender/date";
import DateRangeRender, {
  type DateRangeRenderProps,
} from "./itemRender/dateRange";
import {
  FormattedNumber,
  type FormattedNumberProps,
} from "./itemRender/number";

export interface ItemRenderMap {
  action: Partial<TableActionProps>;
  number: Partial<FormattedNumberProps>;
  date: Partial<DateRenderProps>;
  dateRange: Partial<DateRangeRenderProps>;
  currency: Partial<FormattedNumberProps>;
  percent: Partial<FormattedNumberProps>;
}

type GetItemRender<T extends Record<string, any>> = {
  [K in keyof T]: {
    itemRender?: K;
    renderProps?: T[K];
  };
}[keyof ItemRenderMap];

type ItemRender = GetItemRender<ItemRenderMap>;

export type ConfigColumn<RecordType extends Record<string, any> = any> =
  ColumnProps<RecordType> &
    ItemRender & {
      /** 是否显示 */
      show?: boolean;

      /**
       * 数据属性映射
       * 用于映射数据属性到渲染组件的 props 上
       * { propKey: dataIndex }
       *
       * 例如：{ startTime: 'taskStartTime', endTime: 'taskEndTime' }
       */
      dataProp?: Record<string, string>;

      // Tooltip 信息
      info?: any;

      actions?: (
        val: any,
        record: any,
        index: number,
        options?: RenderOptions
      ) => ActionConfig[];
    };

const ColumnItemRender = {
  action: TableAction,
  number: FormattedNumber,
  date: DateRender,
  dateRange: DateRangeRender,
  currency: FormattedNumber,
  percent: FormattedNumber,
};

export const useTableProColumn = <RecordType extends Record<string, any>>(
  columns: ConfigColumn<RecordType>[],
  defaultRenderProps?: Partial<ItemRenderMap>,
  customColumnRender?: Record<
    string,
    (props: { value: any; [key: string]: any }) => React.ReactNode
  >
): ColumnProps<RecordType>[] => {
  const memoizedColumns = useMemo(() => {
    const result = [] as ColumnProps<RecordType>[];
    columns.forEach((column) => {
      const show = column.show ?? true;
      if (!show) {
        return;
      }

      const renderProps = {
        ...(column.itemRender && defaultRenderProps?.[column.itemRender]),
        ...column.renderProps,
      };

      const renderColumn = (text, record, index, options) => {
        const dataProps: Record<string, any> = {};
        if (column.dataProp) {
          for (const key in column.dataProp) {
            const dataIndex = column.dataProp[key];
            dataProps[key] = get(record, dataIndex);
          }
        }
        const customRender = customColumnRender?.[column.itemRender!];
        if (customRender) {
          return customRender({ value: text, ...dataProps, ...renderProps });
        }
        const Component = ColumnItemRender[column.itemRender!];
        return Component ? (
          <Component value={text} {...dataProps} {...renderProps} />
        ) : (
          text
        );
      };

      const getRender = (): ColumnRender<RecordType> | undefined => {
        if (column.render) {
          return column.render;
        }
        if (column.itemRender) {
          switch (column.itemRender) {
            case "action":
              return (text, record, index, options) => {
                const actions =
                  column.actions?.(text, record, index, options) ?? [];
                return <TableAction {...renderProps} actions={actions} />;
              };

            default:
              return (text, record, index, options) =>
                renderColumn(text, record, index, options);
          }
        }
        return undefined;
      };

      const getDefaultWidth = () => {
        switch (column.itemRender) {
          case "action":
            return 120;
          case "number":
          case "currency":
          case "percent":
            return 120;
          case "date":
            return 180;
          case "dateRange":
            if ((renderProps as DateRangeRenderProps).layout === "horizontal") {
              return 340;
            }
            return 220;
          default:
            return undefined;
        }
      };

      const getDefaultAlgin = () => {
        switch (column.itemRender) {
          case "action":
            return "center";

          case "number":
          case "currency":
          case "percent":
            return "right";

          case "date":
          case "dateRange":
            return "left";

          default:
            return "left";
        }
      };

      const newColumn = {
        ...column,
        ...column.renderProps,
        render: getRender(),
        width: column.width ?? getDefaultWidth(),
        align: column.align ?? getDefaultAlgin(),
      };

      result.push(newColumn);
    });
    return result;
  }, [columns, defaultRenderProps, customColumnRender]);

  return memoizedColumns;
};
