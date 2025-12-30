import dayjs from "dayjs";
import { useEmpty } from "../context";
import { formatDate } from "../../../utils/format";

export interface DateRenderProps {
  value: dayjs.ConfigType;
  format?: string;
  isUnix?: boolean;
  empty?: React.ReactNode;
}

export const DateRender = (props: DateRenderProps) => {
  const empty = useEmpty(props.empty);
  // 这边处理默认值
  return formatDate(props.value, { ...props, empty });
};

export default DateRender;
