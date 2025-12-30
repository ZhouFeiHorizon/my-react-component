import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { generateSearchQuery, getUrlParamsFromUrl, objectMap, objectFilter } from '../index';

interface Props<T extends Record<string, unknown>> {
  transformUrlQuery?: (query: any) => T;
  disabled?: boolean;
}

const isNumberString = (str: string) => str.length <= 4 && /^\d+$/.test(str);

export default function useStateQuery<T extends Record<string, unknown>>({
  transformUrlQuery: transformUrlParams = v => v,
  disabled
}: Props<T> = {}) {
  const history = useHistory();
  const getQuery = () => {
    const params: any = getUrlParamsFromUrl();
    const newParams = objectMap(params, val => (isNumberString(val) ? Number(val) : val));
    return transformUrlParams(newParams);
  };

  const getPagesAndFormValue = (query: any) => {
    const currentPage = Number(query.currentPage);
    const pageSize = Number(query.pageSize);
    // 不接受异常的currentPage和pageSize
    const pages = {
      currentPage: currentPage > 0 ? currentPage : undefined,
      pageSize: pageSize > 0 ? pageSize : undefined
    };
    const pageKeys = Object.keys(pages);
    const formValue = objectFilter(query, (_val, key: string) => !pageKeys.includes(key));

    return {
      pages,
      formValue
    };
  };

  const [{ pages, formValue }] = useState(() => {
    if (disabled) {
      return {
        pages: { currentPage: undefined, pageSize: undefined },
        formValue: {}
      };
    }
    const query = getQuery();
    return getPagesAndFormValue(query);
  });

  const location = (() => {
    try {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      return useLocation();
    } catch {
      return { pathname: '', search: '' };
    }
  })();

  const replaceQuery = (state: Record<string, any>) => {
    if (disabled) {
      return;
    }
    history.replace({
      pathname: location.pathname,
      search: generateSearchQuery(state, {}),
      hash: window.location.hash
    });
  };

  return {
    initPages: pages,
    initFormValue: formValue,
    replaceQuery
  };
}
