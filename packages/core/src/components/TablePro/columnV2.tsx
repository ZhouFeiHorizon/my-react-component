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

const dateRange: RegisterColumn<DateRangeRenderProps> = {
  columnConfig: (renderProps) => ({
    width: renderProps.layout === "horizontal" ? 340 : 220,
    align: "left",
  }),
  renderProps: {},
  customRender: (props) => {
    return <DateRangeRender {...props} />;
  },
};

type GetCustomColumnMap<
  RecordType extends Record<string, any>,
  T extends Record<string, any>,
> = {
  [key in keyof T]: RegisterColumn<T[key], RecordType>;
};

type DefaultCustomColumnMap<RecordType extends Record<string, any> = any> =
  GetCustomColumnMap<
    RecordType,
    {
      date: DateRenderProps;
      dateRange: DateRangeRenderProps;
      number: FormattedNumberProps;
      currency: FormattedNumberProps;
      percent: FormattedNumberProps;
      action: TableActionProps;
    }
  >;

const defaultCustomColumnMap: DefaultCustomColumnMap = {
  dateRange: {
    columnConfig: (renderProps) => ({
      width: renderProps.layout === "horizontal" ? 340 : 220,
      align: "left",
    }),
    renderProps: {},
    component: DateRangeRender,
  },
  number: {
    columnConfig: { width: 120, align: "right" },
    renderProps: {
      type: "decimal",
    },
    component: FormattedNumber,
  },
  percent: {
    columnConfig: { width: 120, align: "right" },
    renderProps: {
      type: "percent",
    },
    component: FormattedNumber,
  },
  currency: {
    columnConfig: { width: 120, align: "right" },
    renderProps: {
      type: "currency",
    },
    component: FormattedNumber,
  },
  action: {
    columnConfig: {},
    renderProps: {},
    component: TableAction,
  },
};

const ColumnItemRender = {
  action: TableAction,
  number: FormattedNumber,
  date: DateRender,
  dateRange: DateRangeRender,
  currency: FormattedNumber,
  percent: FormattedNumber,
};

function getColumn(column: ColumnNew, customColumn: RegisterColumn<any>) {
  const obj = {
    ...customColumn,
    ...column,
  };

  if (obj.render) {
    return obj;
  }

  const {
    component,
    customRender,
    renderProps: staticRenderProps,
    dataProp,
    getRenderProps,
  } = obj;

  if (customRender || component) {
    const columnConfig =
      typeof customColumn.columnConfig === "function"
        ? customColumn.columnConfig(staticRenderProps || {})
        : customColumn.columnConfig;

    Object.assign(obj, columnConfig);

    obj.render = (value, record, index) => {
      const props = {
        ...staticRenderProps,
      };

      if (dataProp) {
        Object.entries(dataProp).forEach(([key, dataIndex]) => {
          props[key] = get(record, dataIndex);
        });
      }

      // 动态props
      if (getRenderProps) {
        const dynamicProps = getRenderProps(value, record, index);
        Object.assign(props, dynamicProps);
      }

      if (customRender) {
        return customRender(props, {
          value,
          record,
          index,
        });
      }
      if (component) {
        return React.createElement(component, props);
      }
      return value;
    };
  }

  return obj;
}

type CustomColumnMapType<RecordType extends Record<string, any> = any> = Record<
  string,
  RegisterColumn<any, RecordType>
>;

export const useTableProColumn = <
  RecordType extends Record<string, any>,
  CustomColumnMapType extends Record<string, RegisterColumn<any, RecordType>>,
>(
  columns: ColumnNew<
    RecordType,
    CustomColumnMapType & DefaultCustomColumnMap<RecordType>
  >[],
  customColumnMap?: CustomColumnMapType
): ColumnProps<RecordType>[] => {
  const memoizedColumns = useMemo(() => {
    const result = [] as ColumnProps<RecordType>[];
    columns.forEach((column) => {
      const show = column.show ?? true;
      if (!show) {
        return;
      }

      const customColumn =
        (column.itemRender && customColumnMap?.[column.itemRender]) ||
        defaultCustomColumnMap[column.itemRender];

      const newColumn = getColumn(column, customColumn);

      result.push(newColumn);
    });
    return result;
  }, [columns, customColumnMap]);

  return memoizedColumns;
};

type Column = ColumnProps;

type RegisterColumn<Props, RecordType extends Record<string, any> = any> = {
  /**
   * 渲染组件的 props 配置，这部分不依赖于数据
   */
  renderProps?: Partial<Props>;

  /**
   * 默认列配置，不依赖于数据的配置
   */
  columnConfig?: Column | ((staticRenderProps: Partial<Props>) => Column);

  /**
   * 数据属性映射
   * 用于映射数据属性到渲染组件的 props 上
   * { propKey: dataIndex }
   *
   * 例如：{ startTime: 'taskStartTime', endTime: 'taskEndTime' }
   */
  dataProp?: Partial<Record<keyof Props, keyof RecordType>>;

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

  component?: React.ComponentType<Props>;
  customRender?: (
    dynamicRenderProps: Props,
    options: {
      value: any;
      record: RecordType;
      index: number;
    }
  ) => React.ReactNode;
};

type ColumnNew<
  RecordType extends Record<string, any> = any,
  T extends Record<
    string,
    RegisterColumn<any, RecordType>
  > = DefaultCustomColumnMap<RecordType>,
> = {
  itemRender?: keyof T;
} & T[keyof T] &
  Column;

const columnConfig: ColumnNew<{
  startTime: string;
  endTime: string;
}>[] = [
  {
    title: "时间范围",
    itemRender: "date",
    dataProp: {
      startTime: "startTime",
      endTime: "endTime",
    },
    renderProps: {
      layout: "horizontal",
      format: "YYYY-MM-DD HH:mm:ss",
    },
  },
  {
    title: "number",
    itemRender: "number",
  },
  {
    title: "action",
    itemRender: "action",
    getRenderProps: (val, record, index) => ({
      maxShowCount: 2,
      actions: [
        {
          label: "delete",
          icon: "delete",
          onClick: () => {},
        },
      ],
    }),
  },
];
