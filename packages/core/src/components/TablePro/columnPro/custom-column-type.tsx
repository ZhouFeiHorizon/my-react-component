import TableAction, { type TableActionProps } from "../itemRender/TableAction";

import { type DateRenderProps } from "../itemRender/date";
import DateRangeRender, {
  type DateRangeRenderProps,
} from "../itemRender/dateRange";
import {
  FormattedNumber,
  type FormattedNumberProps,
} from "../itemRender/number";
import { ColumnRenderExtra } from "./column-render";

import type { CustomColumnMap } from "./column-custom";
import type { ColumnProps as SemiColumnProps } from "@douyinfe/semi-ui/lib/es/table/interface";
import { merge } from "lodash-es";
import { Avatar } from "@douyinfe/semi-ui";
import type { AvatarProps } from "@douyinfe/semi-ui/lib/es/avatar/interface";
import React from "react";

type DefaultRenderProps = {
  date: DateRenderProps;
  dateRange: DateRangeRenderProps;
  number: FormattedNumberProps;
  currency: FormattedNumberProps;
  percent: FormattedNumberProps;
  action: TableActionProps;
};

type RenderPropsMapGenCustomColumnType<
  RecordType extends Record<string, any> = any,
  RenderPropsMap extends Record<string, any> = any,
> = {
  [K in keyof RenderPropsMap]: SemiColumnProps<RecordType> &
    ColumnRenderExtra<RenderPropsMap[K], RecordType> & {
      type: K;
    };
}[keyof RenderPropsMap];

type RenderPropsMapGenCustomColumnMap<
  RecordType extends Record<string, any> = any,
  RenderPropsMap extends Record<string, any> = any,
> = Partial<{
  [K in keyof RenderPropsMap]: Partial<
    SemiColumnProps<RecordType> &
      ColumnRenderExtra<RenderPropsMap[K], RecordType>
  >;
}>;

type ColumnColumnType<
  RecordType extends Record<string, any> = any,
  OtherRenderPropsMap extends Record<string, any> = DefaultRenderProps,
> = RenderPropsMapGenCustomColumnType<
  RecordType,
  OtherRenderPropsMap & DefaultRenderProps
>;

type ColumnColumnMap<
  RecordType extends Record<string, any> = any,
  OtherRenderPropsMap extends Record<string, any> = any,
> = RenderPropsMapGenCustomColumnMap<
  RecordType,
  OtherRenderPropsMap & DefaultRenderProps
>;

// ok
const customColumn: ColumnColumnType = {
  type: "currency",
  renderProps: {
    x: "",
  },
  render: (val: string, record) => record.taskEndTime,
};

// type NoInfer<T> = T & { readonly __noinfer?: unique symbol }

type NoInfer<T> = [T][T extends any ? 0 : never];

interface TableProV1Props<
  RecordType extends Record<string, any> = any,
  OtherRenderPropsMap extends Record<string, any> = {},
> {
  customMap?: ColumnColumnMap<
    RecordType,
    OtherRenderPropsMap & tableProV1CustomMapRenderProps
  >;
  columns: ColumnColumnType<
    RecordType,
    NoInfer<OtherRenderPropsMap & tableProV1CustomMapRenderProps>
  >[];
}

function TableProV1<
  RecordType extends Record<string, any> = any,
  OtherRenderPropsMap extends Record<string, any> = {},
>(props: TableProV1Props<RecordType, OtherRenderPropsMap>) {
  const { customMap, columns } = props;
  const customMapMerged = mergeCustomColumnMap(tableProV1CustomMap, customMap);

  // 实现
  return React.createElement("div", {});
}

type tableProV1CustomMapRenderProps = {
  customType: {
    type: "short" | "long";
  };
};

const tableProV1CustomMap: ColumnColumnMap<
  any,
  tableProV1CustomMapRenderProps
> = {
  customType: {
    customRender: (props) => {
      return props.type === "short" ? "短" : "长";
    },
  },
};

function assignDefined<T>(base: T, override?: Partial<T>): T | undefined {
  if (!override || !override) {
    return base || override;
  }

  const result = { ...base } as any;

  Object.keys(override).forEach((key) => {
    const value = (override as any)[key];
    if (value !== undefined) {
      result[key] = value;
    }
  });

  return result;
}

// 合并自定义列映射、后面的自定义列映射会覆盖前面的
function mergeCustomColumnMap(
  baseColumMap?: ColumnColumnMap,
  overrideColumMap?: ColumnColumnMap
) {
  if (!baseColumMap || !overrideColumMap) {
    return baseColumMap || overrideColumMap;
  }
  const result: ColumnColumnMap = { ...baseColumMap };
  Object.keys(overrideColumMap).forEach((key) => {
    const baseItem = baseColumMap[key];
    const overrideItem = overrideColumMap[key];

    if (!baseItem) {
      result[key] = overrideItem;
      return;
    }
    if (!overrideItem) {
      return;
    }
    result[key] = {
      ...assignDefined(baseItem, overrideItem),
      renderProps: assignDefined(
        baseItem.renderProps,
        overrideItem.renderProps
      ),
    };
  });

  return result;
}

TableProV1<any, tableProV1CustomMapRenderProps>({
  customMap: {
    customType: {
      renderProps: {
        type: "short",
      },
    },
    number: {
      renderProps: {
        type: "percent",
      },
    },
  },
  columns: [
    {
      type: "number",
      renderProps: {
        value: 123456.789,
        suffix: "元",
      },
    },
    {
      type: "customType",
      renderProps: {},
    },
  ],
});

// ================== TableProV2 ==================
interface TableProV2CustomMapRenderProps {
  myTime: {
    type: "date" | "dateRange";
  };
}

const tableProV2CustomMap: ColumnColumnMap<
  any,
  TableProV2CustomMapRenderProps
> = {
  myTime: {
    customRender: (props) => {
      return props.type === "date" ? "日期" : "日期范围";
    },
  },
};

export interface TableProV2Props<
  RecordType extends Record<string, any> = any,
  OtherRenderPropsMap extends Record<string, any> = {},
> extends TableProV1Props<
    RecordType,
    OtherRenderPropsMap & TableProV2CustomMapRenderProps
  > {}

function TableProV2<
  RecordType extends Record<string, any>,
  OtherRenderPropsMap extends Record<string, any> = {},
>(props: TableProV2Props<RecordType, OtherRenderPropsMap>) {
  const { customMap, columns } = props;
  const customMapMerged = mergeCustomColumnMap(tableProV2CustomMap, customMap);
  return TableProV1({
    columns,
    customMap: customMapMerged as any,
  });
}

const columns: TableProV2Props<any>["columns"] = [
  {
    type: "myTime",
    renderProps: {
      type: "dateRange",
    },
  },
];

// ===== Demo =====

type ColumnColumnRenderPropsMap = {
  demo: {
    value: string;
    prefix?: string;
  };
  avatar: AvatarProps;
  number: {
    value?: number;
    fractionDigits?: number;
  };
};

const customColumnMap: ColumnColumnMap<any, ColumnColumnRenderPropsMap> = {
  demo: {
    customRender: (props) => {
      return props.value + "demo";
    },
  },
  avatar: {
    renderProps: {
      style: {
        width: 40,
        height: 40,
      },
    },
    customRender: (props) => {
      const { value, ...rest } = props;
      const avatarProps = rest as AvatarProps;
      const node = React.createElement(Avatar, {
        src: value,
        ...avatarProps,
      });

      return node;
    },
  },
  number: {
    customRender: ({ value, fractionDigits = 2 }) => {
      return value?.toFixed(fractionDigits);
    },
  },
};

const DemoColumns: TableProV2Props<any, ColumnColumnRenderPropsMap>["columns"] =
  [
    {
      type: "myTime",
      renderProps: {
        type: "dateRange",
      },
    },
    {
      type: "demo",
      renderProps: {},
    },
    {
      type: "avatar",
      dataIndex: "avatar",
      renderProps: {
        shape: "square",
      },
    },
    {
      type: "number",
      renderProps: {
        fractionDigits: 3,
      },
    },
  ];

React.createElement(TableProV2, {
  columns: DemoColumns,
  customMap: customColumnMap,
});

<TableProV2 columns={DemoColumns} customMap={customColumnMap} />;

<TableProV2
  customMap={customColumnMap}
  columns={[
    {
      type: "avatar",
    },
  ]}
/>;

const test = () => {
  const { run: runSearchTopics, loading: topicLoading } = useRequest(
    (query: string) => {
      const Searcher =
        query ||
        formState.values?.ReviewConfig?.ChallengeGroupList?.[0]?.label ||
        formState.values?.ReviewConfig?.ChallengeGroupList?.[0]?.[0]
          ?.ChallengeText ||
        "";
      if (!Searcher) {
        return;
      }

      return getChallengeInfo(
        {
          Searcher,
        },
        { isOrigin: true }
      ).then((res) => {
        const newTopics = res?.Info
          ? [
              {
                ...res.Info,
                value: res.Info.ChallengeID,
                label: res.Info.ChallengeText,
              },
            ]
          : [];
        setTopicOptions(newTopics as any);
        return newTopics;
      });
    },
    {
      auto: !!taskId || !!formState.values?.useCache,
      debounceInterval: 300,
    }
  );
};
