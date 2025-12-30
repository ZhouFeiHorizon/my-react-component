import dayjs from "dayjs";
import { isEmpty } from "../../../utils/is";
import { Tag } from "@douyinfe/semi-ui";
import { DateRender } from "./date";
import { useEmpty } from "../context";
import "./style.scss";

export interface DateRangeRenderProps {
  format?: string;
  isUnix?: boolean;
  empty?: React.ReactNode;

  startTime?: dayjs.ConfigType;
  endTime?: dayjs.ConfigType;

  separate?: React.ReactNode;

  layout?: "vertical" | "horizontal";
}

const preCls = "webcast-item-render-dateRange";

export const DateRangeRender = (props: DateRangeRenderProps) => {
  const {
    startTime,
    endTime,
    format = "YYYY-MM-DD HH:mm:ss",
    isUnix,
    empty,
    separate = " - ",
    layout = "horizontal",
  } = props;

  const emptyContext = useEmpty(empty);

  if (isEmpty(startTime) && isEmpty(endTime)) {
    return emptyContext;
  }

  if (layout === "horizontal") {
    return (
      <span className={`${preCls} ${preCls}-${layout}`}>
        <DateRender
          value={startTime}
          format={format}
          isUnix={isUnix}
          empty={empty}
        />
        <span className={`${preCls}-separate`}>{separate}</span>
        <DateRender
          value={endTime}
          format={format}
          isUnix={isUnix}
          empty={empty}
        />
      </span>
    );
  }

  return (
    <span className={`${preCls} ${preCls}-${layout}`}>
      <div className={`${preCls}-item`}>
        <Tag className="tag">开始</Tag>
        <DateRender
          value={startTime}
          format={format}
          isUnix={isUnix}
          empty={empty}
        />
      </div>
      <div className={`${preCls}-item`}>
        <Tag className="tag">结束</Tag>
        <DateRender
          value={endTime}
          format={format}
          isUnix={isUnix}
          empty={empty}
        />
      </div>
    </span>
  );
};

export default DateRangeRender;
