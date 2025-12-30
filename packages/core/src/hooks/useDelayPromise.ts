/* eslint-disable @typescript-eslint/ban-types */
import { useRef } from 'react';
import { debounce, throttle } from 'lodash-es';
import { useDeepEffect, usePersistCallback } from '@byted/hooks';

/**
 * 解决 debounce、throttle 返回的不是一个 Promise 的问题
 */
export function useDelayPromise<DelayFn extends typeof debounce | typeof throttle, Params extends any[], Res>(
  delayFn: DelayFn,
  execFn: (...args: Params) => Res | Promise<Res>,
  ...opts: [Parameters<DelayFn>[1]?, Parameters<DelayFn>[2]?]
) {
  const debouncedRef = useRef(
    delayFn((callback: any) => {
      callback();
    }, ...opts)
  );

  const execFnPersist = usePersistCallback(execFn);
  const execFnRef = useRef(execFnPersist);
  execFnRef.current = execFnPersist;

  const runAsync = usePersistCallback(async (...args: Params): Promise<Res> => {
    return new Promise((resolve, reject) => {
      debouncedRef.current?.(async () => {
        try {
          const res = await execFnRef.current.call(execFnRef, ...args);
          resolve(res);
        } catch (err) {
          reject(err);
        }
      });
    });
  });

  useDeepEffect(() => {
    debouncedRef.current = delayFn((callback: any) => {
      callback();
    }, ...opts);
    return () => debouncedRef.current?.cancel();
  }, [opts]);

  return {
    runAsync,
    run: runAsync,
    cancel: debouncedRef.current.cancel
  };
}
