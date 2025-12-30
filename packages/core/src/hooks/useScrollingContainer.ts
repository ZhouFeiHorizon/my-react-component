import React, { useState, useMemo, useEffect, RefObject, useRef } from 'react';
import { getScrollingContainer } from '../utils/dom';

/**
 * 找到最近的滚动元素
 * @param elementRef
 * @returns
 */
export const useScrollingContainer = <T extends HTMLElement>(elementRef: RefObject<T>) => {
  const [scrollContainer, setScrollContainer] = useState<HTMLElement | null | Window>(null);

  useEffect(() => {
    setScrollContainer(getScrollingContainer(elementRef.current));
  }, [elementRef.current]);

  return { scrollContainer };
};
