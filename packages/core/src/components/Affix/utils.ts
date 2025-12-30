export type BindElement = HTMLElement | Window | null | undefined;

export function getTargetRect(target: BindElement): DOMRect {
  return target !== window ?
    (target as HTMLElement).getBoundingClientRect() :
    ({ top: 0, bottom: window.innerHeight } as DOMRect);
}

export function getFixedTop(placeholderRect: DOMRect, targetRect: DOMRect, offsetTop?: number, alwayFixed?: boolean) {
  if (offsetTop !== undefined && (targetRect.top > placeholderRect.top - offsetTop || alwayFixed)) {
    return offsetTop + targetRect.top;
  }
  return undefined;
}

export function getFixedBottom(
  placeholderRect: DOMRect,
  targetRect: DOMRect,
  offsetBottom?: number,
  alwayFixed?: boolean
) {
  if (offsetBottom !== undefined && (targetRect.bottom < placeholderRect.bottom + offsetBottom || alwayFixed)) {
    const targetBottomOffset = window.innerHeight - targetRect.bottom;
    return offsetBottom + targetBottomOffset;
  }
  return undefined;
}

export const TRIGGER_EVENTS = ['resize', 'scroll', 'touchstart', 'touchmove', 'touchend', 'pageshow', 'load'];
