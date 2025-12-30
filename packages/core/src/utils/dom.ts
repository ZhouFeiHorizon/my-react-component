/**
 * 获取给定元素最近的滚动父容器。
 *
 * @param element - 待检查的HTML元素。
 * @returns 如果找到滚动容器则返回该容器，否则返回null。
 */
export function getScrollingContainer(element: HTMLElement | null): HTMLElement | Window | null {
  let node = element;

  while (node) {
    if ([window, document, document.documentElement].includes(node)) {
      return window;
    }

    const { overflowY } = window.getComputedStyle(node);
    const isScrollable = overflowY !== 'visible' && overflowY !== 'hidden';

    if (isScrollable && node.scrollHeight > node.clientHeight) {
      return node;
    }

    node = node.parentElement;
  }

  return null;
}
