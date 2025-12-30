interface BaseColumn<RecordType extends Record<string, any> = any> {
  title?: string;
  dataIndex?: string;
  render?: (val: any, record: RecordType) => any;
}

// 自定义渲染，配置默认列
interface CustomColumn<RecordType extends Record<string, any> = any>
  extends BaseColumn {
  // 使用默认列的配置key
  type?: string;
}

const columns: CustomColumn[] = [
  {
    title: "序号",
    dataIndex: "index",
    type: "index",
  },
  {
    title: "标题",
    type: "text",
  },
];
