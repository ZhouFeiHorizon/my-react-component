import { DownloadOptions, fetchFunc, triggerDownload } from './core';
import { parseFilenameFromHeader, getDownloadName, getFileExtension, normalizeFilename } from './filename';
import { getMimeFromExtension } from './mime';
import { blobSave } from './blob';
import { loadImage } from '../image';

/**
 * 下载图片
 * @description 优先使用 fetch 下载，失败则使用 canvas 下载，让文件的类型尽量的正确，避免用户才上传的图片，下载后变成了其他类型
 */
export function downloadImage(options: DownloadOptions): Promise<any>;
export function downloadImage(url: string, options?: Omit<DownloadOptions, 'url'>): Promise<any>;
export async function downloadImage(urlOrOpts: any, opts?: any) {
  let options: DownloadOptions;
  if (typeof urlOrOpts === 'string') {
    options = { url: urlOrOpts, ...opts };
  } else {
    options = urlOrOpts;
  }

  try {
    // 优先尝试直接下载
    const res = await fetchFunc(options.url);
    const blob = await res.blob();
    const contentDisposition = res.headers.get('Content-Disposition') || '';
    const responseFilename = parseFilenameFromHeader(contentDisposition);

    return blobSave(blob, { ...options, responseFilename });
  } catch (err) {
    return await downloadImageByCanvas(options).catch(() => {
      const downloadName = getDownloadName(options);
      // 最后尝试下载原始链接
      return triggerDownload(options.url, downloadName);
    });
  }
}

/**
 * 下载图片（通过 canvas）
 */
export async function downloadImageByCanvas(options: DownloadOptions): Promise<boolean> {
  const img = await loadImage(options.url, 'anonymous');

  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  ctx?.drawImage(img, 0, 0);

  const downloadName = getDownloadName(options);
  const possibleExt = getFileExtension(downloadName);

  const mimeTypeMap: { [key: string]: string } = {
    png: 'image/png',
    svg: 'image/png',
  };
  const mimeType = (possibleExt && mimeTypeMap[possibleExt]) || 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(async (blob) => {
      try {
        if (!blob) {
          // 转换失败
          const dataUrl = canvas.toDataURL(mimeType);
          const ext = getMimeFromExtension(mimeType);
          const filename = normalizeFilename(downloadName, ext);
          return await triggerDownload(dataUrl, filename);
        } else {
          await blobSave(blob, options);
        }
        resolve(true);
      } catch (err) {
        reject(err);
      }
    }, mimeType);
  });
}
