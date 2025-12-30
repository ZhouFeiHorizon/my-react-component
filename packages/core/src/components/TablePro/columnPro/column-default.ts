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

type CustomColumnDate<RecordType extends Record<string, any> = any> =
  SemiColumnProps<RecordType> & {
    type?: "date";
  } & ColumnRenderExtra<DateRenderProps, RecordType>;


type CustomColumnType<RecordType extends Record<string, any> = any> = {
  
}

const dateColum: CustomColumnDate = {
  type: "date",
  renderProps: {
    format: "YYYY-MM-DD",
  },
};

export type DefaultCustomColumnMap<
  RecordType extends Record<string, any> = any,
> = CustomColumnMap<
  {
    date: DateRenderProps;
    dateRange: DateRangeRenderProps;
    number: FormattedNumberProps;
    currency: FormattedNumberProps;
    percent: FormattedNumberProps;
    action: TableActionProps;
    index: {};
  },
  RecordType
>;

export const defaultCustomColumnMap: DefaultCustomColumnMap = {
  index: {
    customRender: (_, { index }) => index + 1,
  },
  date: {
    renderProps: {
      format: "YYYY-MM-DD",
    },
  },
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
      useGrouping: true,
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
