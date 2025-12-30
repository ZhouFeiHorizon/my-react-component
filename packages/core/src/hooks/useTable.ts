/* eslint-disable @typescript-eslint/ban-types */
import type { TableProps, ChangeInfo } from "@douyinfe/semi-ui/lib/es/table";
import { useEffect, useRef, useState, useMemo, useCallback } from "react";
import {
  debounce,
  throttle,
  cloneDeep,
  merge,
  isObject,
  isPlainObject,
} from "lodash-es";
import { DEFAULT_TABLE_PAGE_SIZE } from "../constants/table";
import useStateQuery from "./useStateQuery";
import { isDef, isEmpty, objectFilter } from "../index";
import {
  usePersistCallback,
  useDebounceFn,
  useForceUpdate,
} from "@byted/hooks";
import { useDelayPromise } from "./useDelayPromise";
import { FormApi } from "@douyinfe/semi-ui/lib/es/form/interface";
type Int64 = number | string;

interface Pages {
  PageNum: number;
  PageSize: number;
}

// ChangeInfo<any> ❓ ChangeInfo<RecordType> 会导致 类型推断失败
export type UseTableRequestPagination = Pages &
  Pick<ChangeInfo<any>, "filters" | "sorter" | "extra">;

export type UseTableRequest<RecordType, FormParams> = (
  /** 表格&页信息 */
  tableInfo: UseTableRequestPagination,
  /** 参数，用户筛选项的参数信息 */
  params: FormParams,
  extra: {
    /** 前端分页-start */
    start: number;
    /** 前端分页-end */
    end: number;
  }
) => Promise<{
  /** 列表数据 */
  list: RecordType[] | undefined;
  /** 总页数 */
  total: Int64 | undefined;
}>;

export interface UseTableOpts<
  // 表格Record类型
  RecordType extends object = object,
  // 表单参数类型
  FormParams extends object = object,
> {
  /** 默认参数, 会绑定到initValues上 */
  defaultParams?: Partial<FormParams>;
  /** 请求函数 */
  request: UseTableRequest<RecordType, FormParams>;
  /** 默认分页大小 */
  pageSize?: number;
  /** 初始/默认 当前页 */
  currentPage?: number;
  /**
   * 是否立即请求（当挂载成功之后就执行请求）
   * @default true
   */
  immediate?: boolean;
  transformUrlQuery?: (val: any) => any;
  /** 启用参数拼接在url search 上 */
  enableParamsSaveUrl?: boolean;
  /** 调用重置之前 */
  onResetBefore?: () => void;
  /** searchForm值改变时请求的延时时间 */
  formChangeRequestDelay?: number;
  /** 表单更新是否需要重新请求 */
  forceFetch?: boolean;
}

interface Pagination {
  currentPage: number;
  pageSize: number;
  total: number;
  showSizeChanger: boolean;
  onChange: (currentPage: number, pageSize: number) => void;
}

interface FormProps<FormParams extends object> {
  initValues: FormParams;
  onValueChange: (val: any) => void;
  getFormApi: (api: FormApi<FormParams>) => void;
}

export interface UseTableState<RecordType, FormParams extends object> {
  tableProps: any;
  /** 列表是否加载中 */
  loading: boolean;
  paginationRef: React.MutableRefObject<Pagination>;
  pagination: Pagination;
  dataSource: RecordType[];
  /** 列表数据 dataSource */
  list: RecordType[];
  // method
  fetch: (...args: any) => void;
  /** 获取列表 */
  getList: (...args: any) => void;
  /** 刷新 */
  refresh: () => void;
  refreshAsync: () => Promise<any>;
  /** 搜索、页面会重置为1 */
  search: () => void;
  /** 重置 */
  reset: () => void;
  changeData: (data: {
    list: RecordType[];
    /** 总页数 */
    total?: Int64;
  }) => void;
  /** 表单 pops  */
  formApi: React.MutableRefObject<FormApi<FormParams> | undefined>;
  formProps: FormProps<any>;
  /** 表单数据 ref */
  formValueRef: React.MutableRefObject<FormParams>;
  /** 表单数据 */
  formValue: FormParams;
  /** 表单的 onValueChange */
  onFormValueChange: (val: any) => void;

  error?: Error;
}

export const useTable = <
  RecordType extends object = object,
  FormParams extends object = object,
>(
  opts: UseTableOpts<RecordType, FormParams>
): UseTableState<RecordType, FormParams> => {
  const {
    request,
    defaultParams = {} as FormParams,
    immediate = true,
    transformUrlQuery,
    enableParamsSaveUrl,
    formChangeRequestDelay = 500,
    forceFetch = true,
    pageSize: defaultPageSize = DEFAULT_TABLE_PAGE_SIZE,
    currentPage: defaultCurrentPage = 1,
  } = opts;

  const { initPages, initFormValue, replaceQuery } = useStateQuery({
    transformUrlQuery,
    disabled: !enableParamsSaveUrl,
  });

  const triggerRouterChange = () => {
    const values = {
      ...formValueRef.current,
      ...formApi.current?.getValues(),
    };
    const query = {
      ...objectFilter(
        values as any,
        (value) => !isObject(value) && !isEmpty(value)
      ),
      // 分页没有改变就不添加
      pageSize:
        (defaultPageSize || DEFAULT_TABLE_PAGE_SIZE) !==
        pageRef.current.pageSize
          ? pageRef.current.pageSize
          : undefined,
      currentPage: pageRef.current.currentPage,
    };
    replaceQuery(query);
  };

  /**
   * 表单数据
   */
  const formValueRef = useRef<FormParams>(
    merge(cloneDeep(defaultParams), initFormValue)
  );
  const formApi = useRef<FormApi<FormParams>>();
  // 列表是否加载中...
  const [loading, setLoading] = useState(immediate);
  const [error, setError] = useState<Error>();
  // 列表数据
  const [list, setList] = useState<RecordType[]>([]);

  const requestRef = useRef(request);
  requestRef.current = request;

  const forceUpdate = useForceUpdate();
  // 处理成Promise，解决刷新，重新请求知道是否完成，失败等
  const { run: __requestRel } = useDelayPromise(
    debounce,
    async function requestFn(...params: any[]) {
      enableParamsSaveUrl && triggerRouterChange();
      const pages = pageRef.current;
      setLoading(true);
      // 两个都写，避免formApi没有作用上
      const formValues = {
        ...formValueRef.current,
        ...formApi.current?.getValues(), // 用最新的去请求
      };

      const filterData = objectFilter(formValues, (val) => !isEmpty(val));

      const start = (pages.currentPage - 1) * pages.pageSize;
      const func = requestRef.current;
      if (typeof func !== "function") {
        return { total: 0, list: [] };
      }
      try {
        const changeInfo = changeInfoRef.current || {};
        const p1 = isPlainObject(params[0]) ? params[0] : {}; // 避免是事件的情况，导致报错
        const res = await func(
          {
            PageNum: pages.currentPage,
            PageSize: pages.pageSize,
            extra: changeInfo.extra,
            filters: changeInfo.filters,
            sorter: changeInfo.sorter,
          },
          { ...filterData, ...p1 },
          { start, end: start + pages.pageSize }
        );

        setError(undefined);
        setList(res.list || []);
        const total = Number(res.total) || 0;
        pageRef.current.total = total;
        setLoading(false);

        // 返回的数据为空
        // 处理最后一页只有一条数据被删除的情况
        if (!res.list?.length && total) {
          const totalPage = Math.ceil(total / pages.pageSize);
          // 当前页大于总页数
          if (pages.currentPage > totalPage) {
            pages.currentPage = totalPage;
            fetch();
          }
        }
        return res;
      } catch (err: any) {
        setList([]);
        pageRef.current.total = 0;
        setLoading(false);
        setError(err || new Error("未知错误"));
        return Promise.reject(err);
      } finally {
        forceUpdate();
      }
    },
    300,
    {
      leading: true, // 控制函数是否在周期立即执行
      trailing: false, // 控制函数是否在周期结束后执行
    }
  );
  // 10ms 防抖、避免页面快速切换导致请求多次
  const { run: __request } = useDelayPromise(debounce, __requestRel, 10);

  const fetch = usePersistCallback((...args) => {
    __request(...args).catch((err: any) => {
      if (err instanceof Error) {
        console.error(err);
      } else {
        console.log(err);
      }
    });
  });

  const asyncRequest = usePersistCallback(() => {
    return __request();
  });

  const pageRef = useRef<Pagination>({
    currentPage: Number(initPages.currentPage) || defaultCurrentPage,
    pageSize:
      Number(initPages.pageSize) || opts.pageSize || DEFAULT_TABLE_PAGE_SIZE,
    total: 0,
    showSizeChanger: true,
    // 注意：pagination.onChange 设置后，Table onChange 不再响应分页器变化。
    onChange: usePersistCallback((currentPage: number, pageSize: number) => {
      pageRef.current.pageSize = pageSize;
      pageRef.current.currentPage = currentPage;
      getList();
    }),
  });

  /**
   * 获取列表数据
   * @description 比如刷新当前页用
   */
  const getList = usePersistCallback((...args) => {
    return fetch(...args);
  });

  const refresh = usePersistCallback(() => {
    return getList();
  });

  const refreshAsync = usePersistCallback(() => {
    return asyncRequest();
  });

  /**
   * 搜索
   * @description 点击搜索按钮的时候，页码会重置为1
   */
  // const { run: search } = useThrottleFn(
  const { run: search } = useDelayPromise(
    throttle,
    () => {
      pageRef.current.currentPage = 1;
      return fetch();
    },
    1
    // []
    // 有onResetBefore 不立即调用、onResetBefore里可能会有一些重新设置其他值
    // { leading: !opts.onResetBefore, trailing: false }
  );

  /**
   * 重置表单-并进行搜索
   * @description 表单数据会还原到默认参数
   */
  const reset = usePersistCallback(() => {
    opts.onResetBefore?.();
    formValueRef.current = cloneDeep(defaultParams) as any;
    formApi.current?.reset();
    return search();
  });

  const { run: onFormValueChange } = useDebounceFn((values: any) => {
    formValueRef.current = { ...values };

    if (forceFetch) {
      setTimeout(() => {
        search();
      });
    }
  }, formChangeRequestDelay);

  useEffect(() => {
    immediate && getList();
  }, []);

  const pageInfo = pageRef.current;
  const pagination = useMemo(() => {
    return { ...pageRef.current };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageInfo.currentPage, pageInfo.pageSize, pageInfo.total]); // ref 方式 pagination 地址没有被更新

  const changeInfoRef = useRef<ChangeInfo<RecordType>>();
  const tableProps: TableProps<RecordType> = {
    loading,
    pagination,
    dataSource: list,
    // 分页、排序、筛选变化时触发、pagination.onChange设置之后，分页改变就不会触发这个
    onChange: usePersistCallback((changeInfo: ChangeInfo<RecordType>) => {
      const { pagination: tablePagination } = changeInfo;
      changeInfoRef.current = changeInfo;
      if (tablePagination) {
        if (isDef(tablePagination.currentPage)) {
          pageRef.current.currentPage = tablePagination.currentPage;
        }
        if (isDef(tablePagination.pageSize)) {
          pageRef.current.pageSize = tablePagination.pageSize;
        }
      }
      getList();
    }),
  };

  const formProps: FormProps<FormParams> = {
    getFormApi: usePersistCallback((api) => (formApi.current = api)),
    initValues: formValueRef.current,
    onValueChange: onFormValueChange,
  };

  return {
    tableProps,
    /** 列表是否加载中 */
    loading,
    paginationRef: pageRef,
    pagination,
    dataSource: list,
    /** 列表数据 dataSource */
    list,
    // method
    fetch,
    /** 获取列表 */
    getList,
    /** 刷新 */
    refresh,
    refreshAsync,
    /** 搜索 */
    search,
    /** 重置 */
    reset,
    changeData: (data: {
      list: RecordType[];
      /** 总页数 */
      total?: Int64;
    }) => {
      setList(data.list);
      if (isDef(data.total)) {
        pageRef.current.total = Number(data.total);
      }
    },

    // form
    /** 表单 pops  */
    formApi,
    formProps,
    /** 表单数据 ref */
    formValueRef,
    /** 表单数据 */
    formValue: formValueRef.current,
    /** 表单的 onValueChange */
    onFormValueChange,
    error,
  };
};

export default useTable;
