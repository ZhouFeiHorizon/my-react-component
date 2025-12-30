import { Table } from "@douyinfe/semi-ui";
import type { TableProps } from "@douyinfe/semi-ui/lib/es/table";
import {
  useTableProColumn,
  type ConfigColumn,
  type ItemRenderMap,
} from "./column";
import { EmptyProvider } from "./context";

interface TableProProps<RecordType extends Record<string, any>>
  extends TableProps<RecordType> {
  columnConfig?: any;

  columns?: ConfigColumn<RecordType>[];
  defaultRenderProps?: Partial<ItemRenderMap>;
  columnEmpty?: string;
  customColumnRender?: Record<
    string,
    (props: { value: any; [key: string]: any }) => React.ReactNode
  >;
}

const TablePro = <RecordType extends Record<string, any>>(
  props: TableProProps<RecordType>
) => {
  const {
    columns,
    columnConfig,
    defaultRenderProps,
    columnEmpty = "-",
    customColumnRender,
    ...restProps
  } = props;
  const newColumns = useTableProColumn<RecordType>(
    columns || [],
    defaultRenderProps,
    customColumnRender
  );
  return (
    <EmptyProvider value={{ empty: columnEmpty }}>
      <Table {...restProps} columns={newColumns} />
    </EmptyProvider>
  );
};

export default TablePro;
