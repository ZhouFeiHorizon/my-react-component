// 列自定义信息适配
import React from "react";
import { getColumnRender, type ColumnRenderExtra } from "./column-render";
import type { ColumnProps } from "@douyinfe/semi-ui/lib/es/table/interface";
import {
  type DefaultCustomColumnMap,
  defaultCustomColumnMap,
} from "./column-default";

export type CustomColumn<
  Props = any,
  RecordType extends Record<string, any> = any,
  Type extends string = string,
> = ColumnProps<RecordType> &
  ColumnRenderExtra<Props, RecordType> & {
    //  默认列配置，不依赖于数据的配置, 但可以依赖于 renderProps 的静态数据
    columnConfig?:
      | ColumnProps<RecordType>
      | ((renderProps: Props) => ColumnProps<RecordType>);

    // 自定义注入类型
    type?: Type;
  };

export type CustomColumnMap<
  PropsMap extends Record<string, any> = Record<string, any>,
  RecordType extends Record<string, Record<string, any>> = any,
> = {
  [K in keyof PropsMap]: CustomColumn<PropsMap[K], RecordType, K>;
};

export type CustomColumType<
  Map extends CustomColumnMap = DefaultCustomColumnMap,
> = {
  [K in keyof Map]: Partial<Map[K]> & { type?: K };
}[keyof Map];

export const getColumn = <
  RecordType extends Record<string, any> = any,
  CuPropsMap extends Record<string, CustomColumn> = any,
>(
  customColumn: CustomColumType<
    CuPropsMap & DefaultCustomColumnMap<RecordType>
  >,
  customColumnMap?: CuPropsMap
) => {
  const map = {
    ...defaultCustomColumnMap,
    ...customColumnMap,
  };

  const defaultColumn = (customColumn.type && map[customColumn.type]) || {};

  const staticRenderProps = {
    ...defaultColumn.renderProps,
    ...customColumn.renderProps,
  };

  const getColumnConfig = (config: any | ((renderProps: any) => any)) => {
    return typeof config === "function"
      ? config(staticRenderProps)
      : config || {};
  };

  // 合并 columnConfig
  let columnConfig = {};
  if (defaultColumn.columnConfig) {
    columnConfig = getColumnConfig(defaultColumn.columnConfig);
  }
  if (customColumn.columnConfig) {
    columnConfig = {
      ...columnConfig,
      ...getColumnConfig(customColumn.columnConfig),
    };
  }

  const mergeColumn = {
    ...defaultColumn,
    ...customColumn,
    renderProps: staticRenderProps,
  };

  delete mergeColumn.type;
  delete mergeColumn.columnConfig;

  const render = getColumnRender(mergeColumn);

  return {
    ...mergeColumn,
    render,
  };
};

// 定义一个工具类型来检测参数
export type GetColumnsParams<RecordType, CuPropsMap> =
  CuPropsMap extends undefined
    ? [columns: Array<CustomColumType<DefaultCustomColumnMap<RecordType>>>]
    : [
        columns: Array<
          CustomColumType<DefaultCustomColumnMap<RecordType> & CuPropsMap>
        >,
        customColumnMap: CuPropsMap,
      ];

export const getColumns = <
  RecordType extends Record<string, any> = any,
  // 使用条件类型：如果第二个参数是 undefined，则 CuPropsMap 是 never
  CuPropsMap extends Record<string, CustomColumn> | undefined = undefined,
>(
  // columns: CuPropsMap extends undefined
  //   ? Array<CustomColumType<DefaultCustomColumnMap<RecordType>>> // 没有自定义映射时的列类型
  //   : Array<
  //       CustomColumType<
  //         DefaultCustomColumnMap<RecordType> & NonNullable<CuPropsMap>
  //       >
  //     >, // 有自定义映射时的列类型
  // customColumnMap?: CuPropsMap // 保持为 undefined 类型
  ...args: GetColumnsParams<RecordType, CuPropsMap>
) => {
  const [columns, customColumnMap] = args;
  console.log("columns", columns);
  const result: any[] = [];

  columns.forEach((item) => {
    if (item.hidden || item.show === false) {
      return;
    }
    result.push(getColumn(item, customColumnMap));
  });

  return result;
};

const myCustomColumMap: CustomColumnMap<{
  myNumber: {
    suffix?: string;
  };
  index: {
    style?: React.CSSProperties;
  };
}> = {
  myNumber: {
    renderProps: {
      suffix: "",
    },
  },
  index: {
    title: "序号",
    customRender: ({ style }, { index }) =>
      React.createElement(
        "span",
        {
          style: style,
        },
        index + 1
      ),
  },
};

type DataSource = {
  startTime: number;
  endTime: number;
};

// const defaultColumn: CustomColumType<DataSource> = {
//   type: "number",
// };

getColumns(
  [
    {
      title: "自定义列",
      type: "number",
      renderProps: {
        type: "currency",
      },
      render: (val, record) => record.startTime + val,
    },
    {
      title: "自定义列2",
      type: "number",
      renderProps: {
        suffix: "元",
      },
    },
    {
      type: "index",
      renderProps: {
        style: {
          color: "red",
        },
      },
    },
    {
      type: "myNumber",
      title: "自定义列3",
      renderProps: {
        suffix: "元",
      },
    },
  ],
  {
    myNumber: {
      renderProps: {
        suffix: "元",
      },
    },
  }
);

// getColumn(
//   {
//     type: "myNumber",
//     renderProps: {
//       suffix: "元",
//     },
//   },
//   myCustomColumMap
// );

function createCustomColumnMap<RecordType extends Record<string, any> = any>() {
  return {
    ...defaultCustomColumnMap,
    myNumber: {
      renderProps: {
        test: 0,
      },
    },
  };
}
