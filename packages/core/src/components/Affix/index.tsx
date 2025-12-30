// Affix 固钉 组件

import React, { useState, useRef, useEffect } from 'react';
import { useScrollingContainer } from '@webcast_game_open/utils';
import { getTargetRect, getFixedTop, getFixedBottom, TRIGGER_EVENTS } from './utils';
import { useThrottleFn, useUpdateEffect } from '@byted/hooks';
import classNames from 'classnames';
import ResizeObserver from 'rc-resize-observer';
import './index.scss';
import { AffixAlwayFixed } from './AffixAlwayFixed';
export { AffixPreviewCard } from './AffixPreviewCard';

export interface AffixProps {
  /** 距离窗口底部达到指定偏移量后触发 */
  offsetBottom?: number;
  /** 距离窗口顶部达到指定偏移量后触发 */
  offsetTop?: number;
  /**
   * 设置 Affix 需要监听其滚动事件的元素，值为一个返回对应 DOM 元素的函数
   * @default () => window
   */
  target?: () => HTMLElement | Window;
  /**
   * 使用父级滚动元素-如果设置为true的话，没有target的情况，target就会取默认的父级滚动元素
   * @default true
   */
  useParentScrolling?: boolean;
  className?: string;
  /**
   * 一直固定，这样就可以不用根据页面条件来判断
   * 比如一直固定在底部
   */
  alwayFixed?: boolean;
  style?: React.CSSProperties;
  onChange?: (fixed: boolean) => void;
}

enum AffixStatus {
  None,
  Prepare
}

// 1.1 支持 水平方向移动 滚动条的移动
const Affix: React.FC<AffixProps> = ({
  offsetTop: _offsetTop,
  offsetBottom,
  target: _target,
  children,
  className,
  useParentScrolling: isParentScrolling = true,
  alwayFixed,
  onChange,
  style
}) => {
  const offsetTop = offsetBottom === undefined && _offsetTop === undefined ? 0 : _offsetTop;
  const placeholderRef = useRef<HTMLDivElement>(null);
  const fixedRef = useRef<HTMLDivElement>(null);
  const [affixStyle, setAffixStyle] = useState<React.CSSProperties | undefined>();
  const [placeholderStyle, setPlaceholderStyle] = useState<React.CSSProperties | undefined>();
  const [status, setStatus] = useState<AffixStatus>(AffixStatus.None);
  const { scrollContainer } = useScrollingContainer(placeholderRef);

  const getTargetFunc = () => {
    if (_target) {
      return _target;
    }
    if (isParentScrolling) {
      return () => scrollContainer || window;
    }
    return () => window;
  };

  const measure = () => {
    const targetFunc = getTargetFunc();

    if (status !== AffixStatus.Prepare || !placeholderRef.current || !targetFunc || !fixedRef.current) {
      return;
    }

    const targetNode = targetFunc();
    if (!targetNode) {
      return;
    }

    const targetRect = getTargetRect(targetNode);
    const placeholderRect = getTargetRect(placeholderRef.current);
    const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop, alwayFixed);
    const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom, alwayFixed);

    if (
      placeholderRect.top === 0 &&
      placeholderRect.left === 0 &&
      placeholderRect.width === 0 &&
      placeholderRect.height === 0
    ) {
      return;
    }

    if (fixedTop !== undefined) {
      setAffixStyle({
        position: 'fixed',
        top: fixedTop,
        left: placeholderRect.left,
        width: placeholderRect.width,
        height: placeholderRect.height
      });
      setPlaceholderStyle({
        width: placeholderRect.width,
        height: placeholderRect.height
      });
    } else if (fixedBottom !== undefined) {
      setAffixStyle({
        position: 'fixed',
        bottom: fixedBottom,
        left: placeholderRect.left,
        width: placeholderRect.width,
        height: placeholderRect.height
      });
      setPlaceholderStyle({
        width: placeholderRect.width,
        height: placeholderRect.height
      });
    } else {
      setAffixStyle(undefined);
      setPlaceholderStyle(undefined);
    }
    setStatus(AffixStatus.None);
  };

  // 运行之前要清先把样式去掉，好重新知道dom 窗口视图，在更新的时候再去从新计算
  const prepareMeasure = () => {
    setAffixStyle(undefined);
    setPlaceholderStyle(undefined);
    setStatus(AffixStatus.Prepare);
  };

  const { run: updatePosition } = useThrottleFn(prepareMeasure, 16);
  const { run: lazyUpdatePosition } = useThrottleFn(() => {
    const targetFunc = getTargetFunc();
    if (targetFunc && affixStyle) {
      const targetNode = targetFunc();
      if (targetNode && placeholderRef.current) {
        const targetRect = getTargetRect(targetNode);
        const placeholderRect = getTargetRect(placeholderRef.current);
        const fixedTop = getFixedTop(placeholderRect, targetRect, offsetTop);
        const fixedBottom = getFixedBottom(placeholderRect, targetRect, offsetBottom);

        const horizontalMove = affixStyle.left !== placeholderRect.left;
        if (
          (fixedTop !== undefined && affixStyle.top === fixedTop) ||
          (fixedBottom !== undefined && affixStyle.bottom === fixedBottom)
        ) {
          if (horizontalMove) {
            setAffixStyle(n => ({
              ...n,
              left: placeholderRect.left
            }));
          }
          return;
        }
      }
    }
    prepareMeasure();
  }, 10);

  useEffect(() => {
    updatePosition();
  }, [offsetTop, offsetBottom, alwayFixed]);

  const target = getTargetFunc()();

  // listener
  useEffect(() => {
    const handleResize = () => {
      updatePosition();
    };
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const targetNode = getTargetFunc()();
    if (!targetNode) {
      return () => {};
    }
    TRIGGER_EVENTS.forEach(event => {
      targetNode.addEventListener(event, lazyUpdatePosition);
    });
    updatePosition();
    return () => {
      TRIGGER_EVENTS.forEach(event => {
        targetNode.removeEventListener(event, lazyUpdatePosition);
      });
    };
  }, [target, alwayFixed]);

  useUpdateEffect(() => {
    measure();
  });

  const fixed = !!affixStyle;
  useUpdateEffect(() => {
    onChange?.(fixed);
  }, [fixed]);

  return (
    <ResizeObserver onResize={updatePosition}>
      <div ref={placeholderRef} style={style}>
        {affixStyle && <div style={placeholderStyle} aria-hidden="true" />}
        <div
          ref={fixedRef}
          className={classNames(className, {
            'game-affix': true,
            'game-affix--fixed': affixStyle
          })}
          style={affixStyle}
        >
          <ResizeObserver onResize={updatePosition}>{children}</ResizeObserver>
        </div>
      </div>
    </ResizeObserver>
  );
};

export default Affix;
// const AffixWrap: React.FC<AffixProps> = props => {
//   const { alwayFixed, offsetBottom, offsetTop, ...args } = props;
//   if (alwayFixed) {
//     return <AffixAlwayFixed {...args} bottom={offsetBottom} top={offsetTop} />;
//   } else {
//     return <Affix {...props} />;
//   }
// };
// export default AffixWrap;

export { AffixAlwayFixed };
