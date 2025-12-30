import dayjs from "dayjs";
import { isEmpty } from "../is"

export interface FormatDateOptions {
  format?: string;
  empty?: React.ReactNode;
  /**
   * 是否自动判断是否是 Unix 时间戳、如果是则自动转换为普通时间格式
   */
  autoUnix?: boolean;
}

export const formatDate = (
  date: dayjs.ConfigType,
  options?: FormatDateOptions
) => {
  const {
    format = "YYYY-MM-DD HH:mm:ss",
    empty = "-",
    autoUnix = false,
  } = options || {};

  if (isEmpty(date)) {
    return empty;
  }

  let dateValue = date;

  // 如果开启了自动判断 Unix 时间戳，且传递的是数字类型，则自动转换为 Unix 时间戳
  if (autoUnix && typeof date === "number" && date.toString().length === 10) {
    dateValue = dayjs.unix(date).toDate();
  }

  return dayjs(dateValue).format(format);
};
