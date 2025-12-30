import {
  getColumn,
  type CustomColumnMap,
  type CustomColumType,
} from "../column-custom";
import type { DefaultCustomColumnMap } from "../column-default";

type MyCustomColumMap<RecordType extends Record<string, any> = any> =
  DefaultCustomColumnMap<RecordType> &
    CustomColumnMap<
      {
        myNumber: {
          test: number;
        };
      },
      RecordType
    >;

const columns: CustomColumType<
  MyCustomColumMap<{
    startTime: number;
    endTime: number;
  }>
>[] = [
  {
    type: "myNumber",
    renderProps: {
      test: 0,
    },
  },
  {
    type: "dateRange",
    renderProps: {
      isUnix: true,
    },
    dataProp: {
      startTime: "startTime",
      endTime: "endTime",
    },
  },
  {
    type: "percent",
    dataIndex: "percent",
    renderProps: {
      type: "percent",
    },
  },
  {
    type: "action",
    renderProps: {
      actions: [
        {
          label: "详情",
        },
      ],
    },
  },
];

const column: CustomColumType = {
  type: "dateRange",
  renderProps: {
    isUnix: true,
  },
};

getColumn(
  {
    type: "number",
    renderProps: {
      format: "decimal",
    },
  },
  {
    myNumber: {
      renderProps: {
        format: "decimal",
      },
    },
  }
);
