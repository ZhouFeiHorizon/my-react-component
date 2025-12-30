import React from "react";
import { Button, TAg } from "@douyinfe/semi-ui";
import type { ColumnProps } from "@douyinfe/semi-ui/lib/es/table/interface";
import type { TagProps } from "@douyinfe/semi-ui/lib/es/tag/index";
import type { ButtonProps } from "@douyinfe/semi-ui/lib/es/button/index";

import { getColumnRender, type ColumnRenderExtra } from "../column-render";

const columns: Array<
  ColumnProps & (ColumnRenderExtra<TagProps> | ColumnRenderExtra<ButtonProps>)
> = [
  {
    title: "title",
    dataIndex: "value",
    renderProps: {
      disabled: true,
    } as ButtonProps,
    customRender: (props, options) => {
      return React.createElement(Button, props);
    },
  }
];

const obj = {
  title: "title",
  dataIndex: "value",
  renderProps: {
    disabled: true,
  },
  customRender: (props, options) => {
    return React.createElement(Button, props);
  },
} as ColumnProps & ColumnRenderExtra<ButtonProps>;
