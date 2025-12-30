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
import type { ColumnProps as SemiColumnProps } from "@douyinfe/semi-ui/lib/es/table/interface";

// 基础渲染属性映射
type DefaultRenderProps = {
  date: DateRenderProps;
  dateRange: DateRangeRenderProps;
  number: FormattedNumberProps;
  currency: FormattedNumberProps;
  percent: FormattedNumberProps;
  action: TableActionProps;
};

// 核心改进：使用条件类型来分发 renderProps 的类型
type ColumnRenderProps<
  K extends string,
  RenderPropsMap extends Record<string, any>
> = K extends keyof RenderPropsMap ? RenderPropsMap[K] : never;

// 使用映射类型替代复杂的交叉类型
type ColumnType<
  RecordType extends Record<string, any> = any,
  RenderPropsMap extends Record<string, any> = DefaultRenderProps,
  K extends keyof RenderPropsMap = keyof RenderPropsMap
> = (K extends any ? {
  type: K;
  renderProps?: ColumnRenderProps<K, RenderPropsMap>;
} & Omit<SemiColumnProps<RecordType>, 'type'> 
  & Omit<ColumnRenderExtra<ColumnRenderProps<K, RenderPropsMap>, RecordType>, 'type'>
 : never);

// 改进的 ColumnMap 类型
type ColumnMap<
  RecordType extends Record<string, any> = any,
  RenderPropsMap extends Record<string, any> = DefaultRenderProps
> = Partial<{
  [K in keyof RenderPropsMap]: Partial<
    Omit<SemiColumnProps<RecordType>, 'type'> 
    & Omit<ColumnRenderExtra<RenderPropsMap[K], RecordType>, 'type'>
  >;
}>;

// 改进的 TablePro 函数 - 使用更好的泛型约束
function TablePro<
  RecordType extends Record<string, any> = any,
  OtherRenderPropsMap extends Record<string, any> = {}
>(props: {
  columns: Array<
    // 基础类型
    | (keyof DefaultRenderProps extends infer T 
        ? T extends keyof DefaultRenderProps 
          ? {
              type: T;
              renderProps?: DefaultRenderProps[T];
            } & Omit<SemiColumnProps<RecordType>, 'type'>
            & Omit<ColumnRenderExtra<DefaultRenderProps[T], RecordType>, 'type'>
          : never
        : never)
    // 扩展类型
    | (keyof OtherRenderPropsMap extends infer T 
        ? T extends keyof OtherRenderPropsMap 
          ? {
              type: T;
              renderProps?: OtherRenderPropsMap[T];
            } & Omit<SemiColumnProps<RecordType>, 'type'>
            & Omit<ColumnRenderExtra<OtherRenderPropsMap[T], RecordType>, 'type'>
          : never
        : never)
  >;
  customMap?: ColumnMap<RecordType, DefaultRenderProps & OtherRenderPropsMap>;
}) {
  // 实现...
}

// 使用示例 - 应该能获得完整的类型提示
TablePro({
  columns: [
    {
      type: "number", // ✅ 有类型提示：date | dateRange | number | currency | percent | action
      renderProps: { // ✅ 自动提示 FormattedNumberProps 的属性
        value: 123456.789,
        precision: 2,
        numberUnit: "auto",
        // 其他 FormattedNumberProps 的属性都会自动提示
      },
      // SemiColumnProps 和 ColumnRenderExtra 的其他属性也会提示
      title: "金额",
      dataIndex: "amount",
    },
  ],
});

// 带自定义类型的使用
TablePro({
  columns: [
    {
      type: "number",
      renderProps: {
        value: 123456.789,
        precision: 2,
      },
    },
    {
      type: "customType", // ✅ 自定义类型也会提示
      renderProps: { // ✅ 自定义类型的 renderProps 提示
        format: 'short',
        showUnit: true,
      },
    },
  ],
  customMap: {
    customType: {
      title: "自定义列",
      width: 200,
      renderProps: {

      } as {
        auto?: boolean;
      }
    },
  },
});