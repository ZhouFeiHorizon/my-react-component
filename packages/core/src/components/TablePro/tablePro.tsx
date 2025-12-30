import { Table } from "@douyinfe/semi-ui";
import type { TableProps } from "@douyinfe/semi-ui/lib/es/table";
import {
  useTableProColumn,
  type ConfigColumn,
  type ItemRenderMap,
} from "./column";
import { EmptyProvider } from "./context";
import {
  getColumns,
  type CustomColumType,
  type CustomColumn,
  type CustomColumnMap,
  GetColumnsParams,
} from "./columnPro/column-custom";
import { type DefaultCustomColumnMap } from "./columnPro/column-default";

export { getColumns };



export interface TableProProps<
  RecordType extends Record<string, any> = any,
  ColumnMap extends Record<string, CustomColumn> | undefined = undefined,
> extends Omit<TableProps<RecordType>, "columns"> {
  columns?: ColumnMap extends Record<string, CustomColumn>
    ? Array<
        | CustomColumType<ColumnMap>
        | CustomColumType<DefaultCustomColumnMap<RecordType>>
      >
    : Array<CustomColumType<DefaultCustomColumnMap<RecordType>>>;
  customColumnMap?: ColumnMap;
}


function TablePro<
  RecordType extends Record<string, any> = any,
  // 使用条件类型：如果第二个参数是 undefined，则 CuPropsMap 是 never
  ColumnMap extends Record<
    string,
    CustomColumn
  > = DefaultCustomColumnMap<RecordType>,
>(props: TableProProps<RecordType, ColumnMap>) {
  const { columns, customColumnMap, ...restProps } = props;
  const newColumns = getColumns<RecordType, ColumnMap>(
    columns || [],
    customColumnMap
  );
  console.log(" newColumns: ", newColumns);
  return (
    <EmptyProvider value={{ empty: "" }}>
      <Table {...restProps} columns={newColumns} />
    </EmptyProvider>
  );
}

export default TablePro;
