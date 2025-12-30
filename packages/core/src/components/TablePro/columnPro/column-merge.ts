// 列自定义信息合并

export function mergeColumn<
  Key extends string,
  Column extends {
    itemRender: keyof Key;
  },
>(customColumn: Column, defaultColumnMap?: Record<Key, Column>): Column {
  const defaultCustomColumn =
    customColumn.itemRender &&
    defaultColumnMap &&
    defaultColumnMap[customColumn.itemRender as Key];

  const column = {
    // 把默认的合并进来
    ...defaultCustomColumn,
    ...customColumn,
  };

  return column;
}

export function mergeColumnV2<Column>(
  column: Column,
  defaultColumn?: Partial<Column>
): Column {
  const result = {
    // 把默认的合并进来
    ...defaultColumn,
    ...column,
  };

  return result;
}
