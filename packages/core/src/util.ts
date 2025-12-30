// 防抖函数
/**
 * 创建一个防抖函数，该函数会延迟函数执行，直到自上次调用后经过指定的等待时间
 * 如果在等待期间再次调用，则重置等待时间
 * @param {Function} fn - 需要防抖的函数
 * @param {number} wait - 等待时间（毫秒）
 * @param {Object} [options={}] - 配置选项
 * @param {boolean} [options.leading=false] - 是否在延迟开始前立即执行
 * @param {boolean} [options.trailing=true] - 是否在延迟结束后执行
 * @param {number} [options.maxWait=0] - 最大等待时间（毫秒），超过此时间将强制执行
 * @returns {Function} 防抖后的函数，包含cancel和flush方法
 * @returns {Function} returns.cancel - 取消防抖函数的执行
 * @returns {Function} returns.flush - 立即执行防抖函数并清除定时器
 */
type DebouncedFunction<T extends (...args: any[]) => any> = (
  ...args: Parameters<T>
) => ReturnType<T> | undefined;

interface DebounceOptions {
  trailing?: boolean;
  leading?: boolean;
  maxWait?: number;
}

function debounce<T extends (...args: any[]) => any>(
  fn: T,
  wait: number,
  options: DebounceOptions = {}
): DebouncedFunction<T> & {
  cancel: () => void;
  flush: () => ReturnType<T> | undefined;
} {
  if (typeof fn !== "function") {
    throw new TypeError("Expected a function");
  }

  if (typeof wait !== "number" || wait < 0) {
    throw new TypeError("Expected wait time to be a non-negative number");
  }

  const { leading = false, trailing = true, maxWait = 0 } = options;
  if (maxWait < 0) {
    throw new TypeError("Expected maxWait to be a non-negative number");
  }

  let timer: number | null = null;
  let lastInvokeTime = 0;
  let lastArgs: Parameters<T> | null = null;
  let result: ReturnType<T> | undefined;

  // 确保maxWait至少等于wait，避免逻辑冲突
  const effectiveMaxWait = maxWait > 0 ? Math.max(wait, maxWait) : 0;

  const invokeFunction = function (
    this: any,
    ...innerArgs: Parameters<T>
  ): ReturnType<T> {
    lastInvokeTime = Date.now();
    lastArgs = null;

    // 绑定debounced函数的上下文
    const debounced = function (
      this: any,
      ...args: Parameters<T>
    ): ReturnType<T> | undefined {
      const now = Date.now();
      const isInvoking = shouldInvoke(now);

      lastArgs = args;

      if (isInvoking) {
        if (!timer && leading) {
          return leadingEdge.call(this, now, args);
        }

        if (timer) {
          clearTimeout(timer);
        }
        timer = setTimeout(() => trailingEdge.call(this), remainingWait(now));
        return result as ReturnType<T> | undefined;
      }

      if (!timer) {
        timer = setTimeout(() => trailingEdge.call(this), wait);
      }
      return undefined;
    };

    const leadingEdge = function (
      this: any,
      timestamp: number,
      args: Parameters<T>
    ): ReturnType<T> | undefined {
      lastInvokeTime = timestamp;
      timer = setTimeout(trailingEdge, wait);
      return leading ? invokeFunction(...args) : undefined;
    };

    const remainingWait = (timestamp: number): number => {
      const elapsed = timestamp - lastInvokeTime;
      return Math.max(
        0,
        (effectiveMaxWait ? Math.min(wait, effectiveMaxWait - elapsed) : wait) -
          elapsed
      );
    };

    const shouldInvoke = (timestamp: number): boolean => {
      const elapsed = timestamp - lastInvokeTime;
      return (
        elapsed >= wait ||
        (effectiveMaxWait > 0 && elapsed >= effectiveMaxWait) ||
        !timer
      );
    };

    const trailingEdge = function (this: any): ReturnType<T> | undefined {
      timer = null;
      if (trailing && lastArgs) {
        return invokeFunction(...lastArgs);
      }
      lastArgs = null;
      return result;
    };

    debounced.cancel = function () {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
      lastInvokeTime = 0;
      lastArgs = null;
    };

    debounced.flush = function () {
      if (timer) {
        clearTimeout(timer);
        timer = null;
        return trailingEdge();
      }
      return lastArgs ? invokeFunction(...lastArgs) : result;
    };

    return debounced;
  };
}
