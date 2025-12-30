import { FileNamingOptions } from './filename';

export interface DownloadOptions extends FileNamingOptions {
  /** 下载资源的URL */
  url: string;
}

export function triggerDownload(href: string, filename: string): void {
  const a = document.createElement('a');
  a.href = href;
  a.download = filename;
  a.target = '_blank';
  a.rel = 'noopener noreferrer';
  a.style.display = 'none';
  document.body.appendChild(a);
  // a.click();
  // 下面这个写法兼容火狐
  a.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true, view: window }));

  document.body.removeChild(a);
}

export const fetchFunc: typeof fetch = async (input, init) => {
  const res = await fetch(input, init);
  if (!res.ok) {
    throw new Error(`HTTP error ${res.status}`);
  }
  return res;
};
