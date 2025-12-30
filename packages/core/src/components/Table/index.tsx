import React from "react";
import styled from "@emotion/styled";

interface Column<RecordType> {
  title?: React.ReactNode;
  dataIndex?: string;
  key?: string;
  render?: (
    val: any,
    record: RecordType,
    index: number,
    array: RecordType[]
  ) => React.ReactNode;
}

interface TableProps<RecordType> {
  dataSource?: Array<RecordType>;
  columns?: Array<Column<RecordType>>;
  className?: string;
}
function Table<RecordType extends Record<string, any>>(
  props: TableProps<RecordType>
) {
  const { columns, dataSource, className } = props;

  console.log(" props: ", props);

  return (
    <table className={className} border={1}>
      <thead>
        <tr>
          {columns?.map((column, index) => (
            <th key={column.key || column.dataIndex || index}>
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {dataSource?.map((record, rowIdx) => (
          <tr key={rowIdx}>
            {columns?.map((column, colIdx) => {
              const value = column.dataIndex
                ? record[column.dataIndex]
                : record;

              const content = column.render
                ? column.render(value, record, rowIdx, dataSource)
                : value;

              return (
                <td key={column.key || column.dataIndex || colIdx}>
                  {content}
                </td>
              );
            })}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default styled(Table)({
  width: "100%",
});
