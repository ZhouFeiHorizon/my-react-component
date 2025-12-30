import React, { useRef, useState, useEffect } from 'react';
import { useScrollingContainer } from '@webcast_game_open/utils';
import { useEventListener, usePersistCallback } from '@byted/hooks';
import ResizeObserver from 'rc-resize-observer';
import { isEqual } from 'lodash-es';

interface AffixAlwayFixedProps {
  /**
   * @default 10
   */
  zIndex?: number;
  affixStyle?: React.CSSProperties;

  /**
   * 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
   * @default () => window
   */
  target?: () => HTMLElement | Window;

  /**
   * 使用父级滚动元素-如果设置为true的话，没有target的情况，target就会取默认的父级滚动元素
   * @default false
   */
  useParentScrolling?: boolean;
  // fixedPosition?: 'top' | 'bottom';
  // offset?: number;
  top?: number;
  bottom?: number;
}
/**
 * 总是固定
 * 和 affix 不同的是，这个组件总是固定
 * 解决 左右滚动条 滚动是的问题
 */
export const AffixAlwayFixed: React.FC<AffixAlwayFixedProps> = ({
  children,
  zIndex = 10,
  affixStyle: style,
  target: _target,
  useParentScrolling,
  top,
  bottom
}) => {
  const placeholder = useRef<HTMLDivElement>(null);
  const { scrollContainer } = useScrollingContainer(placeholder);

  const [affixStyle, setAffixStyle] = useState<React.CSSProperties>();

  const adjustFixe = usePersistCallback(() => {
    if (placeholder.current) {
      const client = placeholder.current.getBoundingClientRect();
      const newAffixStyle = {
        width: client.width,
        left: client.left
      };
      if (!isEqual(newAffixStyle, affixStyle)) {
        setAffixStyle(newAffixStyle);
      }
    }
  });

  const getTargetFunc = () => {
    if (_target) {
      return _target();
    }
    if (useParentScrolling) {
      return scrollContainer || window;
    }
    return window;
  };
  useEventListener('scroll', adjustFixe, {
    target: getTargetFunc
  });
  useEventListener('resize', adjustFixe, {
    target: getTargetFunc
  });

  const affixRef = useRef<HTMLDivElement>(null);

  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties>();
  const adjustPlaceholder = () => {
    if (affixRef.current) {
      const client = affixRef.current.getBoundingClientRect();
      setPlaceholderStyle({ height: client.height });
    }
  };

  useEffect(() => {
    adjustFixe();
    adjustPlaceholder();
    setTimeout(adjustFixe, 300);
    setTimeout(adjustFixe, 600);
  }, []);

  return (
    <>
      <ResizeObserver onResize={adjustFixe}>
        <div ref={placeholder} style={placeholderStyle}></div>
      </ResizeObserver>
      <div
        style={{
          zIndex,
          position: 'fixed',
          top,
          bottom,
          ...style,
          ...affixStyle
        }}
        ref={affixRef}
      >
        <ResizeObserver onResize={adjustPlaceholder}>{children}</ResizeObserver>
      </div>
    </>
  );
};

export default AffixAlwayFixed;
